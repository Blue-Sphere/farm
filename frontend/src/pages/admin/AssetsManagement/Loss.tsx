import React, { useState } from "react";
import useFetch from "../../../components/useFetch";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import LayOutNavBar from "../../../components/LayOutNavBar";
import { Card, Col, Container, Row } from "react-bootstrap";
import ValueDisplayCard from "../../../components/ValueDisplayCard";
import TaskIcon from "@mui/icons-material/Task";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { CheckBox } from "@mui/icons-material";
import DrogList from "../../../components/DrogList";
import RadioGroup from "../../../components/RadioGroup";
import LineGraph from "../../../components/LineGraph";
import MuiDataGrid from "../../../components/MuiDataGrid";

interface AssetsProps {
  id: number;
  name: string;
  value: number;
  creatiomTome: Date;
}

export default function Loss() {
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

  //   const adminToken = sessionStorage.getItem("admin_token");
  //   if (adminToken === null) {
  //     return <p>無效的token</p>;
  //   }
  //   const result = useFetch<AssetsProps[]>(
  //     "http://localhost:8080/admin/assets/get",
  //     "POST",
  //     adminToken
  //   );

  //   if (result.isLoading) {
  //     return <p>Loading...</p>;
  //   }

  //   if (result.error) {
  //     return <p>Error: {result.error}</p>;
  //   }
  return (
    <>
      <Row>
        <ValueDisplayCard
          title="總費損"
          value={1231423}
          color="Primary"
          icon={<TaskIcon />}
        />

        <ValueDisplayCard
          title="月費損"
          value={1231423}
          color="Warning"
          icon={<CalendarMonth />}
        />
      </Row>

      <Row>
        <Col xs={12}>
          <LineGraph label="當年度費損" data={data} datakeys={dataKeys} />
        </Col>
      </Row>
    </>
  );
}
