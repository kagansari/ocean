import React, { useState } from "react";
import { ConfigProvider, Layout } from "antd";
import { GlobalStyle } from "./theme";
import "./App.css";
import SearchCard from "./SearchCard/SearchCard";
import { Port, Vessel } from "./API";
import Map from "./Map/Map";

const App = () => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [port, setPort] = useState<Port | undefined>();
  const [selectedVessel, setSelectedVessel] = useState<Vessel | undefined>();

  return (
    <ConfigProvider>
      <GlobalStyle />
      <Map
        vessels={vessels}
        port={port}
        selectedVessel={selectedVessel}
        setSelectedVessel={setSelectedVessel}
      />
      <Layout style={{ width: 400, padding: 15 }}>
        <SearchCard
          vessels={vessels}
          setVessels={setVessels}
          setSelectedVessel={setSelectedVessel}
          onPortChange={setPort}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default App;
