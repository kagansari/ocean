import { Vessel } from "../API";
import { Card, Table } from "antd";
import React from "react";
import moment from "moment";

const intlInt = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0
});

const VesselTable = ({
  vessels,
  onClick
}: {
  vessels: Vessel[];
  onClick: Function;
}) => {
  return (
    <Card className={"p-0"} style={{ fontSize: "10px important!" }}>
      <Table
        style={{ fontSize: "10px important!" }}
        onRow={(record: Vessel) => {
          return {
            onClick: () => {
              onClick(record);
            }
          };
        }}
        dataSource={vessels}
        // loading={loading}
        rowKey={"id"}
        size={"small"}
        // pagination={false}
        columns={[
          {
            title: "Name",
            dataIndex: "name",
            width: 100,
            ellipsis: true,
            render: v => <small>{v}</small>
          },
          {
            title: "ETA/Dest",
            dataIndex: "eta",
            ellipsis: true,
            render: (eta, record) => {
              const etaStr = record?.etaDate
                ? moment(record?.etaDate).format("MM-DD HH:ss")
                : "IDLE";
              const destStr = record?.dest || "IDLE";
              return (
                <small>
                  {etaStr} / {destStr}
                </small>
              );
            }
          },
          {
            title: "KM",
            width: 50,
            dataIndex: "distance",
            ellipsis: true,
            render: d => <small>{intlInt.format(d)}</small>
          }
        ]}
      />
    </Card>
  );
};

export default VesselTable;
