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

export default function Profit() {
  const data = [
    {
      name: "一月",
      lines: { 去年: 4000, 當年: 2400, amt: 2400 },
    },
    {
      name: "二月",
      lines: { 去年: 3000, 當年: 1398, amt: 2210 },
    },
    {
      name: "三月",
      lines: {
        去年: 2000,
        當年: 9800,
        amt: 2290,
      },
    },
    {
      name: "四月",
      lines: { 去年: 2780, 當年: 3908, amt: 2000 },
    },
    {
      name: "五月",
      lines: {
        去年: 1890,
        當年: 4800,
        amt: 2181,
      },
    },
    {
      name: "六月",
      lines: {
        去年: 2390,
        當年: 3800,
        amt: 2500,
      },
    },
    {
      name: "七月",
      lines: {
        去年: 3490,
        當年: 4300,
        amt: 2100,
      },
    },
    {
      name: "八月",
      lines: {
        去年: 3490,
        當年: 4300,
        amt: 2100,
      },
    },
    {
      name: "九月",
      lines: {
        去年: 3490,
        當年: 4300,
        amt: 2100,
      },
    },
    {
      name: "十月",
      lines: {
        去年: 3490,
        當年: 4300,
        amt: 2100,
      },
    },
    {
      name: "十一月",
      lines: {
        去年: 3490,
        當年: 4300,
        amt: 2100,
      },
    },
    {
      name: "十二月",
      lines: {
        去年: 3490,
        當年: 4300,
        amt: 2100,
      },
    },
  ];

  const dataKeys = ["當年", "去年"];

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
          title="總收益"
          value={1231423}
          color="Primary"
          icon={<TaskIcon />}
        />

        <ValueDisplayCard
          title="月收益"
          value={1231423}
          color="Warning"
          icon={<CalendarMonth />}
        />
      </Row>

      <Row>
        <Col xs={12}>
          <LineGraph label="當年度收益" data={data} datakeys={dataKeys} />
        </Col>
      </Row>
    </>
  );
}
