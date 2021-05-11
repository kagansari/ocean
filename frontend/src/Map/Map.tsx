import React, { useEffect, useMemo, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import styled from "styled-components";
import useSupercluster from "use-supercluster";
import moment from "moment";
import { Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Port, Vessel } from "../API";
import { ReactComponent as Marker } from "./marker.svg";
import { ReactComponent as PortIcon } from "./port.svg";

const intlInt = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0
});

const Icon = ({ className, ...props }: { className: string }) => {
  return (
    <Marker
      className={className}
      style={{
        // @ts-ignore
        opacity: props.$hover ? 1 : 0.75
      }}
      {...props}
    />
  );
};
const StyledIcon = styled(Icon)`
  position: absolute;
  top: -32px;
  left: -16px;
  width: 32px;
  //height: 32px;
  fill: white;
  //opacity: .75;
  transition: opacity 250ms ease;
  &.green {
    fill: lightgreen;
  }
  &.red {
    fill: #a63d40;
  }
  &.yellow {
    fill: yellow;
  }
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;
const StyledPortIcon = styled(PortIcon)`
  position: absolute;
  top: -32px;
  left: -16px;
  width: 32px;
  height: 32px;
  &.green {
    fill: lightgreen;
  }
  &.yellow {
    fill: yellow;
  }

  //opacity: .75;
  transition: opacity 250ms ease;
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

const ClusterIcon = styled("span")`
  //color: #fff;
  background: white;
  border-radius: 50%;
  font-size: 16px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.75;
  transition: opacity 250ms ease;
  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;

type VesselInfoProps = {
  vessel: Vessel | undefined;
  onClose: (e: any) => void;
  lat: any;
  lng: any;
};
const VesselInfo = ({ vessel, onClose, ...props }: VesselInfoProps) => {
  return (
    <div {...props}>
      <div className={"box"}>
        <Button
          // style={{background:"red"}}
          type={"link"}
          icon={<CloseOutlined />}
          className={"close-btn"}
          onClick={onClose}
        />
        <div>
          NAME: <b>{vessel?.name}</b>
        </div>
        <div>
          IMO: <b>{vessel?.imo}</b>
        </div>
        <div>
          TYPE: <b>{vessel?.type}</b>
        </div>
        <div>
          DEST: <b>{vessel?.dest || "IDLE"}</b>
        </div>
        <div>
          ETA:{" "}
          <b>
            {vessel?.etaDate
              ? moment(vessel?.etaDate).format("MM-DD HH:ss")
              : "IDLE"}
          </b>
        </div>
        <div>
          DIST:{" "}
          <b>
            {vessel?.distance ? `${intlInt.format(vessel.distance)} km` : "-"}
          </b>
        </div>
      </div>
      <div className={"arrow-container"}>
        <div className={"arrow"} />
      </div>
    </div>
  );
};
const StyledVesselInfo = styled(VesselInfo)`
  position: absolute;
  width: 250px;
  left: -125px;
  top: -175px;
  font-size: 14px;
  .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 10px;
  }
  .box {
    padding: 10px;
    background-color: white;
    box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.3);
  }
  .arrow-container {
    height: 20px;
    .arrow {
      margin: auto;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 30px solid white;
    }
  }
`;

type MapProps = {
  vessels: Vessel[];
  port: Port | undefined;
  selectedVessel: Vessel | undefined;
  setSelectedVessel: (vessel: Vessel | undefined) => void;
};
const Map = ({
  vessels,
  port,
  selectedVessel,
  setSelectedVessel
}: MapProps) => {
  const points = useMemo(() => {
    return vessels.map(vessel => {
      return {
        type: "Feature",
        properties: {
          cluster: false,
          vessel
        },
        geometry: {
          type: "Point",
          coordinates: [vessel.longitude, vessel.latitude]
        }
      };
    });
  }, [vessels]);

  const mapRef = useRef<google.maps.Map | undefined>();

  useEffect(() => {
    if (!selectedVessel || !port) return;
    if (!mapRef.current) return;

    const start = {
      lat: selectedVessel.latitude || 0,
      lng: selectedVessel.longitude || 0
    };
    let end, color;
    if (selectedVessel.nearby) {
      color = "yellow"
      end = {
        lat: selectedVessel.port_latitude || 0,
        lng: selectedVessel.port_longitude || 0
      };
    } else {
      color = "lightgreen"
      end = {
        lat: port.latitude,
        lng: port.longitude
      };
    }

    const path = new google.maps.Polyline({
      path: [start, end],
      geodesic: true,
      strokeColor: color,
      strokeOpacity: 1,
      strokeWeight: 2
    });

    if (
      // @ts-ignore
      !mapRef?.current?.getBounds()?.contains?.(start) ||
      // @ts-ignore
      !mapRef?.current?.getBounds()?.contains?.(end)
    ) {
      const bounds = new google.maps.LatLngBounds();
      // @ts-ignore
      bounds.extend(start);
      // @ts-ignore
      bounds.extend(end);

      mapRef.current?.fitBounds(bounds);
    }

    path.setMap(mapRef.current);
    return () => {
      path.setMap(null);
    };
  }, [selectedVessel]);
  const [bounds, setBounds] = useState<any>(null);
  const [zoom, setZoom] = useState(10);
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, minPoints: 5 }
  });

  const handleGoogleMapApi = (google: any) => {
    mapRef.current = google.map;
  };

  useEffect(() => {
    const bounds = new google.maps.LatLngBounds();

    vessels.forEach(vessel => {
      // @ts-ignore
      bounds.extend({ lat: vessel.latitude, lng: vessel.longitude });
    });
    if (vessels.length > 0) {
      mapRef.current?.fitBounds(bounds);
    }
  }, [vessels]);

  return (
    <div
      style={{
        top: 0,
        zIndex: 0,
        left: 0,
        position: "fixed",
        height: "100vh",
        width: "100%"
      }}
    >
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyAxrnaD5zUA99KXddnNFjq_wEBd1ejAtNs" }}
        defaultCenter={{ lat: 41, lng: 29 }}
        defaultZoom={4}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ]);
        }}
        onClick={() => setSelectedVessel(undefined)}
        // onDragEnd={() => setSelectedVessel(undefined)}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleGoogleMapApi}
      >
        {selectedVessel?.nearby && (
          <StyledPortIcon
            // @ts-ignore
            lat={selectedVessel.port_latitude}
            lng={selectedVessel.port_longitude}
            className={"yellow"}
          />
        )}
        {port && (
          <StyledPortIcon
            // @ts-ignore
            lat={port.latitude}
            lng={port.longitude}
            className={"green"}
          />
        )}
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

          if (isCluster) {
            const l = 30 + (pointCount / points.length) * 50;
            return (
              <ClusterIcon
                key={`cluster-${cluster.id}`}
                style={{
                  // backgroundColor: "red",
                  // width: `${10 + (pointCount / points.length) * 20}px`,
                  position: "absolute",
                  width: l,
                  height: l,
                  top: -l,
                  left: -l / 2
                  // left:
                }}
                // @ts-ignore
                lat={latitude}
                lng={longitude}
                onClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  if (!mapRef.current) return console.error("Ref undefined");
                  // @ts-ignore
                  mapRef.current.setZoom(expansionZoom);
                  // @ts-ignore
                  mapRef.current.panTo({ lat: latitude, lng: longitude });
                }}
              >
                {pointCount}
              </ClusterIcon>
            );
          }

          let className = "red";
          if (cluster.properties.vessel.dest) className = "green";
          if (cluster.properties.vessel.nearby) className = "yellow";

          return (
            <div
              // @ts-ignore
              lat={latitude}
              // @ts-ignore
              lng={longitude}
              onClick={() => {
                setSelectedVessel(cluster.properties.vessel);
              }}
            >
              <StyledIcon
                key={cluster.id}
                // @ts-ignore
                className={className}
              />
            </div>
          );
        })}

        {selectedVessel && (
          <StyledVesselInfo
            vessel={selectedVessel}
            onClose={setSelectedVessel}
            lat={selectedVessel.latitude}
            lng={selectedVessel.longitude}
          />
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
