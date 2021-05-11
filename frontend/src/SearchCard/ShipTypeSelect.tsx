import React from "react";
import { Select } from "antd";

type ShipTypeSelectProps = {
  value: string;
  onChange: (v: string) => void;
};
const ShipTypeSelect = ({ value, onChange }: ShipTypeSelectProps) => {
  return (
    <div>
      <Select
        className={"w-100p"}
        placeholder={"Type"}
        value={value}
        onChange={onChange}
      >
        <Select.Option value={"tanker"}>Tanker</Select.Option>
        <Select.Option value={"wig"}>Wing in ground (WIG)</Select.Option>
        <Select.Option value={"fishing"}>Fishing</Select.Option>
        <Select.Option value={"towing"}>Towing</Select.Option>
        <Select.Option value={"hsc"}>High speed craft (HSC)</Select.Option>
        <Select.Option value={"passenger"}>Passenger</Select.Option>
        <Select.Option value={"cargo"}>Cargo</Select.Option>
        <Select.Option value={"tug"}>Tug</Select.Option>
        <Select.Option value={"search"}>Search and rescue</Select.Option>
        <Select.Option value={"dredging"}>Dredging ops</Select.Option>
        <Select.Option value={"diving"}>Diving ops</Select.Option>
        <Select.Option value={"pollution"}>Anti-pollution</Select.Option>
        <Select.Option value={"law"}>Law enforcement</Select.Option>
        <Select.Option value={"other"}>Other type</Select.Option>
      </Select>
    </div>
  );
};

export default ShipTypeSelect;
