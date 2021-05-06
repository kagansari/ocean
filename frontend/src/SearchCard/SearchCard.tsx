import React, { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Col,
  DatePicker,
  InputNumber,
  Row,
  Spin
} from "antd";
import API, { Port, Vessel } from "../API";
import moment, { Moment } from "moment";
import VesselTable from "./VesselTable";
import PortSelect from "./PortSelect";
import VesselUpload from "./VesselUpload";

/**
 * https://gist.github.com/codeguy/6684588
 */
export const slugify = (text: string) =>
  text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

type DateRangeSelectProps = {
  value: [Moment, Moment];
  onChange: (value: [Moment, Moment]) => void;
};
const DateRangeSelect = ({ value, onChange }: DateRangeSelectProps) => {
  return (
    <DatePicker.RangePicker
      allowClear={false}
      className={"w-100p"}
      showTime={{ format: "HH:mm" }}
      format={"DD MMMM HH:mm"}
      value={value}
      // @ts-ignore
      onChange={onChange}
    />
  );
};

const defaultInterval: [Moment, Moment] = [
  moment().startOf("year"),
  moment().endOf("year")
];

type SearchCardProps = {
  vessels: Vessel[];
  setVessels: (vessels: Vessel[]) => void;
  onPortChange: (port: Port) => void;
  setSelectedVessel: (vessel: Vessel | undefined) => void;
};
const SearchCard = ({
  vessels,
  setVessels,
  onPortChange,
  setSelectedVessel
}: SearchCardProps) => {
  const [portId, setPortId] = useState<number>();
  const [interval, setInterval] = useState<[Moment, Moment]>(defaultInterval);
  const [loading, setLoading] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(1000);
  const [includeIdle, setIncludeIdle] = useState<boolean>(true);

  const handleSubmit = async () => {
    if (!portId) return console.error("No port selected!");
    setLoading(true);
    const vessels = await API.searchVessels(
      portId,
      distance,
      interval,
      includeIdle
    );
    setLoading(false);
    console.log("vessels", vessels);
    setVessels(vessels);
  };

  // @ts-ignore
  const handlePortChange = (id, port) => {
    setPortId(id);
    onPortChange(port);
  };
  return (
    <Card className={"p-0"}>
      <Spin spinning={loading}>
        <div className={"m-15"}>
          <PortSelect value={portId} onChange={handlePortChange} />
          <br />
          <br />
          <DateRangeSelect value={interval} onChange={setInterval} />
          <br />
          <br />
          <Row align={"middle"} gutter={16} justify={"space-between"}>
            <Col className={"flex"}>
              <InputNumber
                min={0}
                style={{ minWidth: 100 }}
                value={distance}
                onChange={setDistance}
                className={"left-part"}
              />
              <Card
                className={"p-0 inline p-5 right-part"}
                style={{ borderColor: "#d9d9d9", borderLeft: 0 }}
                bordered
              >
                km
              </Card>
            </Col>
            <Col>
              <Checkbox
                checked={includeIdle}
                onChange={e => setIncludeIdle(e.target.checked)}
              >
                Include Idle Vessels
              </Checkbox>
            </Col>
          </Row>
          <br />
          <Button
            type="primary"
            className={"px-25 text-upper w-100p"}
            onClick={handleSubmit}
            disabled={!portId}
          >
            <b>Search</b>
          </Button>
          <br />
          <br />
          <VesselUpload />
        </div>
      </Spin>

      <VesselTable vessels={vessels} onClick={setSelectedVessel}/>
    </Card>
  );
};

export default SearchCard;
