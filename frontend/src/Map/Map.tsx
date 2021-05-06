import React, { useMemo, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import styled from "styled-components";
import { Port, Vessel } from "../API";
import { ReactComponent as Marker } from "./marker.svg";
import { ReactComponent as PortIcon } from "./port.svg";
import useSupercluster from "use-supercluster";
import moment from "moment";

const Icon = ({
  className,
  ...props
}: {
  className: string;
}) => {
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
  fill: #ffdac1;
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
  lat: any;
  lng: any;
};
const VesselInfo = ({ vessel, ...props }: VesselInfoProps) => {
  return (
    <div {...props}>
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
    </div>
  );
};
const StyledVesselInfo = styled(VesselInfo)`
  position: absolute;
  width: 250px;
  left: -125px;
  top: -155px;
  background-color: white;
  box-shadow: 0 2px 7px 1px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  padding: 10px;
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

  const mapRef = useRef();
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
        onDragEnd={() => setSelectedVessel(undefined)}
        onGoogleApiLoaded={handleGoogleMapApi}
      >
        {port && (
          <StyledPortIcon
            // @ts-ignore
            lat={port.latitude}
            lng={port.longitude}
          />
        )}
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

          if (isCluster) {
            return (
              <ClusterIcon
                key={`cluster-${cluster.id}`}
                style={{
                  // backgroundColor: "red",
                  // width: `${10 + (pointCount / points.length) * 20}px`,
                  width: `${25 + (pointCount / points.length) * 75}px`,
                  height: `${25 + (pointCount / points.length) * 75}px`
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
                className={cluster.properties.vessel.dest ? "green" : "red"}
              />
            </div>
          );
        })}

        {selectedVessel && (
          <StyledVesselInfo
            vessel={selectedVessel}
            lat={selectedVessel.latitude}
            lng={selectedVessel.longitude}
          />
        )}
      </GoogleMapReact>
    </div>
  );
};

export default Map;
