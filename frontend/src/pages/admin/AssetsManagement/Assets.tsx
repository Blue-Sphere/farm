import { Card, Col, Container, Row } from "react-bootstrap";
import ValueDisplayCard from "../../../components/ValueDisplayCard";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonth from "@mui/icons-material/CalendarMonth";

import LineGraph from "../../../components/LineGraph";
import FormSearch from "../../../components/FormSearch";
import useFetch from "../../../components/useFetch";
import { formatDate } from "../../../components/Date/FormatDate";
import { useState } from "react";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";

interface AssetsProps {
  id: number;
  name: string;
  value: number;
  creationTime: Date;
}

const formatAssetsData = (data: any) => {
  const rows = data.map((row: any) => ({
    id: row.id,
    relationId:
      row.relationOrder == null
        ? row.relationSupplies.id
        : row.relationOrder.id,
    type: row.type,
    creationTime:
      row.relationOrder === null
        ? row.relationSupplies.purchaseTime
        : row.relationOrder.creationTime,
    total:
      row.relationOrder === null
        ? row.relationSupplies.total
        : row.relationOrder.total,
  }));

  return rows;
};

export default function Assets() {
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleRowsSelectedOnChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows(newSelection);
  };

  const data = [
    {
      name: "Page A",
      lines: { uv: 4000, pv: 2400, amt: 2400 },
    },
    {
      name: "Page B",
      lines: { uv: 3000, pv: 1398, amt: 2210 },
    },
    {
      name: "Page C",
      lines: {
        uv: 2000,
        pv: 9800,
        amt: 2290,
      },
    },
    {
      name: "Page D",
      lines: { uv: 2780, pv: 3908, amt: 2000 },
    },
    {
      name: "Page E",
      lines: {
        uv: 1890,
        pv: 4800,
        amt: 2181,
      },
    },
    {
      name: "Page F",
      lines: {
        uv: 2390,
        pv: 3800,
        amt: 2500,
      },
    },
    {
      name: "Page G",
      lines: {
        uv: 3490,
        pv: 4300,
        amt: 2100,
      },
    },
  ];

  const dataKeys = ["pv", "uv"];

  return (
    <>
      <Row>
        <ValueDisplayCard
          title="總淨值"
          value={1231423}
          color="Primary"
          icon={<TaskIcon />}
        />

        <ValueDisplayCard
          title="月淨值"
          value={1231423}
          color="Warning"
          icon={<CalendarMonth />}
        />
      </Row>

      <Row>
        <Col xs={12}>
          <LineGraph label="當年度淨值" data={data} datakeys={dataKeys} />
        </Col>
      </Row>

      <FormSearch
        label={"收支總覽查詢"}
        searchUrl="http://localhost:8080/assets/criteria_search"
        showStartTime={true}
        showEndTime={true}
        categoryUrl={null}
        mutiCheckBoxOptions={{
          label: "查詢選項",
          options: [
            { name: "收益", value: "PROFIT", checked: false },
            { name: "費損", value: "LOSS", checked: false },
          ],
        }}
        showMoneyComparison={true}
        searchResultColumns={[
          {
            field: "id",
            headerName: "收支編號",
            width: 75,
            editable: false,
          },
          {
            field: "relationId",
            headerName: "關聯編號",
            width: 75,
            editable: false,
          },
          {
            field: "type",
            headerName: "類別",
            width: 150,
            editable: false,
          },
          {
            field: "creationTime",
            headerName: "建立日期",
            width: 150,
            editable: false,
          },
          {
            field: "total",
            headerName: "總計",
            width: 150,
            editable: false,
          },
        ]}
        formatFunction={formatAssetsData}
        handleSelectedRowsOnChange={handleRowsSelectedOnChange}
      />
    </>
  );
}
