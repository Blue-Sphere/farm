import React from "react";
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

interface LineGraphProps {
  label: string;
  datakeys: string[];
  data: {
    name: string;
    lines: Record<string, number>;
  }[];
}
export default function LineGraph(props: LineGraphProps) {
  let datalength: number = props.data.length;

  return (
    <>
      <div
        style={{
          background: "#272727",
          color: "#FCFCFC",
          height: "40px",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <p style={{ padding: "10px 10px 10px 10px", fontSize: "1.15rem" }}>
          {props.label}
        </p>
      </div>
      <div
        style={{
          width: "100%",
          height: "380px",
          background: "#F0F0F0",
          borderRadius: "0px 0px 8px 8px",
          paddingTop: 20,
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={props.data.map((item) => ({
              name: item.name,
              ...item.lines,
            }))}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {props.datakeys.map((key, index) => {
              return (
                <Line
                  type="monotone"
                  dataKey={key}
                  stroke={index % 2 ? "#8884d8" : "#82ca9d"}
                  activeDot={index % 2 ? { r: 8 } : {}}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
