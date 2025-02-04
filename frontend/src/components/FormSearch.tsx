import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid/models/colDef/gridColDef";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DemoItem } from "@mui/x-date-pickers/internals/demo/DemoContainer";
import { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Alert from "./Alert";
import DrogList from "./DrogList";
import { useRowUpdater } from "./Hooks/useGridRowUpdater";
import MuiDataGrid from "./MuiDataGrid";
import RadioGroup from "./RadioGroup";
import useFetch from "./useFetch";

interface FormSearchProps {
  label: string;
  showStartTime: boolean;
  showEndTime: boolean;
  mutiCheckBoxOptions: MutiOptionCheckBoxProps | null;
  showMoneyComparison: boolean;
  categoryUrl: string | null;
  searchUrl: string;
  searchResultColumns: readonly GridColDef<Record<string, any>>[];
  rowUpdaterPath: string;
  formatFunction: (data: any) => any;

  handleSelectedRowsOnChange: (item: any) => void;
}

interface MutiOptionProps {
  value: string;
  checked: boolean;
}

export default function FormSearch(props: FormSearchProps) {
  const [isDataGridVisible, setIsDataGridVisible] = useState(false);

  const [startTime, setStartTime] = useState<Dayjs | null>(null);

  const [endTime, setEndTime] = useState<Dayjs | null>(null);

  const [mutiOptions, setMutiOptions] = useState<string[]>([]);

  const [amountComparison, setAmountComparison] = useState<string>();

  const [amountValue, setAmountValue] = useState<number>(0);

  const [itemName, setItemName] = useState<string[]>([]);

  const [datas, setDatas] = useState<Record<string, any>>();

  useEffect(() => {
    console.log(mutiOptions);
  }, [mutiOptions]);

  const handleMutiOptionChange = (items: MutiOptionProps[]) => {
    const checkedItems = items.filter((item) => item.checked);
    const checkedSection = checkedItems.map((item) => item.value);
    setMutiOptions(checkedSection);
  };

  const handleAmountComparisonChange = (value: string) => {
    setAmountComparison(value);
  };

  const handleCriteriaSearch = () => {
    const body = {
      startTime: startTime,
      endTime: endTime,
      queryOptions: mutiOptions,
      amountCompare: amountComparison,
      amountValue: amountValue,
      itemsName: itemName,
    };
    fetch(props.searchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${sessionStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.json();
          Alert({
            title: response.status.toString(),
            text: errorMessage,
            icon: "error",
          })();
          throw new Error(errorMessage);
        }
        return response.json();
      })
      .then((data) => {
        setIsDataGridVisible(true);
        const rows = props.formatFunction(data);
        console.log(rows);
        setDatas(rows);
      });
  };

  const { updateRow } = useRowUpdater(props.rowUpdaterPath);

  const handleRowUpdate = async (newRow: any) => {
    const updatedRow = await updateRow(newRow);
    if (updatedRow) {
      // 如果更新成功，可以進一步處理資料，如更新本地狀態
      console.log("更新成功：", updatedRow);
    } else {
      console.error("更新失敗，回滾數據");
    }
    return updatedRow || newRow; // 如果失敗，返回舊數據以防 DataGrid 還原
  };

  const admin_token = sessionStorage.getItem("admin_token");

  if (admin_token === null) {
    return <p>admin_token為null</p>;
  }

  let categories;
  if (props.categoryUrl !== null) {
    categories = useFetch<{ name: string }[]>(
      props.categoryUrl,
      "POST",
      admin_token
    );

    if (categories.isLoading) {
      return <p>Loading...</p>;
    }

    if (categories.error) {
      return <p>Error {categories.error}</p>;
    }

    if (categories.data === null) {
      return <p>Error {categories.error}</p>;
    }
  }

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
                      <DatePicker
                        onChange={(newValue) => {
                          setStartTime(newValue);
                        }}
                        value={startTime}
                      />
                    </LocalizationProvider>
                  </DemoItem>
                </Col>
              )}

              {/* 截止時間 */}
              {props.showEndTime && (
                <Col xs={props.showStartTime && props.showEndTime ? 6 : 12}>
                  <DemoItem label="結束日期">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        onChange={(newValue) => {
                          setEndTime(newValue);
                        }}
                        value={endTime}
                      />
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
                    handleMutiOptionOnChange={handleMutiOptionChange}
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
                          大於: "MORE_THAN",
                          小於: "LESS_THAN",
                          等於: "EQUALS",
                        }}
                        handleRadioChange={handleAmountComparisonChange}
                      />
                      <Row>
                        <Col xs={12}>
                          <TextField
                            id="filled-basic"
                            label="金額"
                            variant="standard"
                            type="number"
                            InputProps={{ inputProps: { min: 0 } }}
                            value={amountValue}
                            onChange={(event) =>
                              setAmountValue(Number(event.target.value))
                            }
                          />
                        </Col>
                      </Row>
                    </Box>
                  </Row>
                </Col>
              )}
            </Row>

            {/* 品項 */}
            {categories && (
              <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                <Col xs={12}>
                  <DrogList
                    label="品項包含"
                    items={categories.data}
                    handleItemsNameOnChange={setItemName}
                  />
                </Col>
              </Row>
            )}

            <Row style={{ marginLeft: 10, marginRight: 10, marginTop: 10 }}>
              <Col xs={12}>
                <Button
                  variant="contained"
                  style={{ width: "100%", padding: 10 }}
                  onClick={handleCriteriaSearch}
                >
                  查詢
                </Button>
              </Col>
            </Row>
            <Col style={{ marginTop: 15 }}>
              {isDataGridVisible && (
                <MuiDataGrid
                  columns={props.searchResultColumns}
                  datas={datas}
                  handleSelectedRowsOnchange={props.handleSelectedRowsOnChange}
                  handleProcessRowUpdate={handleRowUpdate}
                />
              )}
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
    value: any;
    checked: boolean;
  }[];

  handleMutiOptionOnChange: (items: MutiOptionProps[]) => void;
}

const MutiOptionCheckBox = (props: MutiOptionCheckBoxProps) => {
  const [mutiOption, setMutiOption] = useState(props.options);

  const handleAllOptionChange = () => {
    setMutiOption((prevOptions) => {
      const allChecked = prevOptions.every((option) => option.checked);
      const updatedOptions = prevOptions.map((option) => ({
        ...option,
        checked: !allChecked,
      }));
      props.handleMutiOptionOnChange(updatedOptions);

      return updatedOptions;
    });
  };

  const handleOptionChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newMutiOption = [...mutiOption];
      newMutiOption[index].checked = event.target.checked;

      props.handleMutiOptionOnChange(newMutiOption);
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
              checked={mutiOption.some((option) => option.checked)}
              indeterminate={mutiOption.some((option) => !option.checked)}
              onChange={handleAllOptionChange}
            />
          }
        />
        <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
          {mutiOption.map((option, index) => (
            <FormControlLabel
              label={option.name}
              value={option.value}
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
