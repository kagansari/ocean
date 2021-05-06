import React, { useEffect, useRef, useState } from "react";
import API, { Port } from "../API";
import { Select } from "antd";

type PortSelectProps = {
  value: number | undefined;
  onChange: (id: number, port: Port | undefined) => void;
};

export const PortSelect = ({ value, onChange }: PortSelectProps) => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<any>();

  const handleChange = (id: number) => {
    const port = ports.find(p => p.id === id);
    onChange(id, port);
  };

  const fetchData = async (input: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      const { count, items } = await API.searchPorts(input);
      setLoading(false);
      setPorts(items);
      setCount(count);
    }, 500);
  };
  const handleSearch = async (input: string) => {
    await fetchData(input);
  };

  useEffect(() => {
    fetchData("").catch(console.error);
  }, []);

  return (
    <Select
      loading={loading}
      showSearch
      className={"w-100p"}
      // className={`block ${props.className || ""}`}
      dropdownMatchSelectWidth={false}
      dropdownRender={menu => (
        <div>
          {menu}
          <span className={"mx-10"}>
            Total: <b>{count}</b>
          </span>
        </div>
      )}
      filterOption={false}
      placeholder={"Port"}
      onSearch={handleSearch}
      value={value}
      onChange={handleChange}
    >
      {ports.map((port: Port) => (
        <Select.Option
          className={"py-10"}
          key={port.id}
          value={port.id}
          label={`${port.country} ${port.location} ${port.nameWoDiacritics}`}
        >
          {port.country} / {port.location} / {port.name}
        </Select.Option>
      ))}
    </Select>
  );
};

export default PortSelect;
