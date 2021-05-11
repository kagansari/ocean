import axios from "axios";
import { useEffect, useState } from "react";
import { Moment } from "moment";

// noinspection HttpUrlsUsage
export const API_URL = process.env.REACT_APP_API_URL || `http://${window.location.hostname}/api`;

export type Port = {
  id: number;
  name: string;
  nameWoDiacritics: string;
  country: string;
  location: string;
  latitude: number;
  longitude: number;
};

export type Vessel = {
  cog: number;
  dest: string;
  distance: number;
  draught: number;
  eta: string;
  etaDate: string;
  id: number;
  latitude: number;
  location?: number;
  longitude?: number;
  mmsi: number;
  name: string;
  sog: number;
  time: string;
  imo: number;
  type: number;
  nearby?: boolean;
  port_latitude?: number;
  port_longitude?: number;
};

export default class API {
  static usePorts() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<Port[]>([]);

    useEffect(() => {
      axios.get(`${API_URL}/ports`).then(res => {
        setData(res.data);
        setLoading(false);
      });
    }, []);

    return { loading, data };
  }

  static async searchPorts(
    query: string
  ): Promise<{ count: number; items: Port[] }> {
    const res = await axios.get(`${API_URL}/ports?search=${query}`);
    return res.data;
  }

  static async searchVessels(
    portId: number,
    distance: number,
    interval: [Moment, Moment],
    idle: boolean,
    type: string = "tanker"
  ): Promise<Vessel[]> {
    const timeQuery = `start=${interval[0].valueOf()}&end=${interval[1].valueOf()}`;
    const query = `type=${type}&portId=${portId}&distance=${distance}&idle=${
      idle ? 1 : 0
    }`;

    const res = await axios.get(
      `${API_URL}/VesselAvailabilitySearch?${query}&${timeQuery}`
    );

    return res.data;
  }

  static async searchVesselsNearby(
    portId: number,
    distance: number,
    interval: [Moment, Moment],
    idle: boolean,
    type: string = "tanker",
  ): Promise<Vessel[]> {
    const timeQuery = `start=${interval[0].valueOf()}&end=${interval[1].valueOf()}`;
    const query = `type=${type}&portId=${portId}&distance=${distance}&idle=${
      idle ? 1 : 0
    }`;

    const res = await axios.get(
      `${API_URL}/VesselAvailabilityNearby?${query}&${timeQuery}`
    );

    return res.data;
  }

  static async uploadVessels() {
    const res = await axios.post(`${API_URL}/ProcessAIS`);
    return res.data;
  }
}
