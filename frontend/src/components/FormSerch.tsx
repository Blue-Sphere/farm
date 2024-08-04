import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DemoItem } from "@mui/x-date-pickers/internals/demo/DemoContainer";
import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import RadioGroup from "./RadioGroup";
import DrogList from "./DrogList";
import MuiDataGrid from "./MuiDataGrid";

interface FormSerchProps {
  label: string;
  showStartTime: boolean;
  showEndTime: boolean;
  mutiCheckBoxOptions: MutiOptionCheckBoxProps | null;
  showMoneyComparison: boolean;
  category: Record<string, any> | null;
  serchUrl: string;
}

export default function FormSerch(props: FormSerchProps) {
  return (
    <>
      <Row>
        <Col xs={12}>
          <div
            style={{
              background: "#272727",
              color: "#FCFCFC",
              height: "40px",
              borderRadius: "8px 8px 0 0",
              marginTop: 30,
            }}
          >
            <p style={{ padding: "10px 10px 10px 10px", fontSize: "1.15rem" }}>
              {props.label}
            </p>
          </div>
          <div
            style={{
              width: "100%",
              background: "#F0F0F0",
              borderRadius: "0px 0px 8px 8px",
              paddingTop: 20,
              paddingBottom: 20,
            }}
          >
            <Row style={{ marginLeft: 10, marginRight: 10 }}>
              {/* 開始時間 */}
              {props.showStartTime && (
                <Col xs={props.showStartTime && props.showEndTime ? 6 : 12}>
                  <DemoItem label="起始日期">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker />
                    </LocalizationProvider>
                  </DemoItem>
                </Col>
              )}

              {/* 截止時間 */}
              {props.showEndTime && (
                <Col xs={props.showStartTime && props.showEndTime ? 6 : 12}>
                  <DemoItem label="結束日期">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker />
                    </LocalizationProvider>
                  </DemoItem>
                </Col>
              )}
            </Row>

            <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
              <Col xs={6}>
                {props.mutiCheckBoxOptions !== null && (
                  <MutiOptionCheckBox
                    label={props.mutiCheckBoxOptions.label}
                    options={props.mutiCheckBoxOptions.options}
                  />
                )}
              </Col>
              {props.showMoneyComparison && (
                <Col xs={6}>
                  <Row></Row>
                  <Row
                    style={{
                      marginLeft: 0.3,
                      marginRight: 0.3,
                      marginTop: 0.5,
                    }}
                  >
                    <Box
                      sx={{
                        paddingLeft: 3,
                        paddingTop: 2,
                        paddingBottom: 2,
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        height: "100%",
                      }}
                    >
                      <RadioGroup
                        label="金額比較"
                        items={{
                          大於: ">",
                          小於: "<",
                          等於: "=",
                        }}
                      />
                      <Row>
                        <Col xs={12}>
                          <TextField
                            id="filled-basic"
                            label="金額"
                            variant="standard"
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                          />
                        </Col>
                      </Row>
                    </Box>
                  </Row>
                </Col>
              )}
            </Row>

            {/* 品項 */}
            <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
              {props.category !== null && (
                <Col xs={12}>
                  <DrogList label="品項" items={props.category} />
                </Col>
              )}
            </Row>

            <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
              <Col xs={12}>
                <Button
                  variant="contained"
                  style={{ width: "100%", padding: 10 }}
                >
                  查詢
                </Button>
              </Col>
            </Row>
            <Col style={{ marginTop: 15 }}>
              <MuiDataGrid
                columns={[
                  { field: "id", headerName: "ID", width: 90, editable: false },
                  {
                    field: "firstName",
                    headerName: "First name",
                    width: 150,
                    editable: true,
                  },
                  {
                    field: "lastName",
                    headerName: "Last name",
                    width: 150,
                    editable: true,
                  },
                  {
                    field: "age",
                    headerName: "Age",
                    width: 110,
                    editable: true,
                  },
                ]}
                datas={[
                  { id: 1, lastName: "Snow", firstName: "Jon", age: 14 },
                  {
                    id: 2,
                    lastName: "Lannister",
                    firstName: "Cersei",
                    age: 31,
                  },
                  { id: 3, lastName: "Lannister", firstName: "Jaime", age: 31 },
                  { id: 4, lastName: "Stark", firstName: "Arya", age: 11 },
                  {
                    id: 5,
                    lastName: "Targaryen",
                    firstName: "Daenerys",
                    age: null,
                  },
                  { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
                  {
                    id: 7,
                    lastName: "Clifford",
                    firstName: "Ferrara",
                    age: 44,
                  },
                  { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
                  { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
                ]}
              />
            </Col>
          </div>
        </Col>
      </Row>
    </>
  );
}

interface MutiOptionCheckBoxProps {
  label: string;
  options: {
    name: string;
    checked: boolean;
  }[];
}
const MutiOptionCheckBox = (props: MutiOptionCheckBoxProps) => {
  const [mutiOption, setMutiOption] = useState(props.options);

  const handleAllOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    mutiOption.map((option) => {
      option.checked = event.target.checked;
    });
  };

  const handleOptionChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newMutiOption = [...mutiOption];
      console.log(newMutiOption[index]);
      console.log(event.target.checked);
      newMutiOption[index].checked = event.target.checked;
      setMutiOption(newMutiOption);
    };

  return (
    <Col xs={12}>
      <Box
        sx={{
          paddingLeft: 3,
          paddingTop: 6.5,
          paddingBottom: 6.5,
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      >
        <FormControlLabel
          label="查詢選項"
          control={
            <Checkbox
              checked={mutiOption.some((option) => !option.checked)}
              indeterminate={mutiOption.some((option) => option.checked)}
              onChange={handleAllOptionChange}
            />
          }
        />
        <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
          {mutiOption.map((option, index) => (
            <FormControlLabel
              label={option.name}
              control={
                <Checkbox
                  checked={option.checked}
                  onChange={handleOptionChange(index)}
                />
              }
            />
          ))}
        </Box>
      </Box>
    </Col>
  );
};
