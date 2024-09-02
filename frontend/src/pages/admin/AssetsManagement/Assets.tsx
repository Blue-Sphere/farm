import { Card, Col, Container, Row } from "react-bootstrap";
import ValueDisplayCard from "../../../components/ValueDisplayCard";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonth from "@mui/icons-material/CalendarMonth";

import LineGraph from "../../../components/LineGraph";
import FormSearch from "../../../components/FormSearch";
import useFetch from "../../../components/useFetch";

interface AssetsProps {
  id: number;
  name: string;
  value: number;
  creationTime: Date;
}

const formateAssetsData = (data: any) => {
  const rows = data.map((row: any) => ({
    id: row.id,
    type: row.type,
    total:
      row.order.tosString() == null
        ? row.relationSupplies.total
        : row.relationOrder.total,
  }));

  return rows;
};

export default function Assets() {
  // const result = useFetch<AssetsProps>("http://localhost:8080/assets/");

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
        mutiCheckBoxOptions={{
          label: "查詢選項",
          options: [
            { name: "收益", checked: false },
            { name: "費損", checked: false },
          ],
        }}
        categoryUrl={"http://localhost:8080/product/inventory"}
        showMoneyComparison={true}
        searchResultColumns={[
          {
            field: "id",
            headerName: "訂單編號",
            width: 150,
            editable: false,
          },
          {
            field: "purchaseTime",
            headerName: "訂單日期",
            width: 150,
            editable: false,
          },
          {
            field: "email",
            headerName: "email",
            width: 150,
            editable: false,
          },
          {
            field: "items",
            headerName: "物品明細",
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
        formatFunction={formateAssetsData}
      />
    </>
  );
}
