import CalendarMonth from "@mui/icons-material/CalendarMonth";
import TaskIcon from "@mui/icons-material/Task";
import { Col, Row } from "react-bootstrap";
import ValueDisplayCard from "../../../components/ValueDisplayCard";

import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { useState } from "react";
import FormSearch from "../../../components/FormSearch";
import LineGraph from "../../../components/LineGraph";
import useFetch from "../../../components/useFetch";

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
    type: row.type == "LOSS" ? "費損" : "收益",
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

  interface MonlyTotalProps {
    month: string;
    total: number;
  }

  const token = sessionStorage.getItem("admin_token");
  if (token === null) return <p>缺少admin_token</p>;

  const year = new Date().getFullYear();

  const total = useFetch<number>(
    `http://localhost:8080/assets/month_all_assets_sum`,
    "POST",
    token
  );

  const monthlyTotal = useFetch<number>(
    `http://localhost:8080/assets/monthly_total`,
    "POST",
    token
  );

  const currentYearsMonthlyTotal = useFetch<MonlyTotalProps[]>(
    `http://localhost:8080/assets/years_monthly_summary/${year}?splitIncomeAndExpense=false`,
    "POST",
    token
  );

  const lastYearsMonthlyTotal = useFetch<MonlyTotalProps[]>(
    `http://localhost:8080/assets/years_monthly_summary/${
      year - 1
    }?splitIncomeAndExpense=false`,
    "POST",
    token
  );

  if (
    total.isLoading ||
    monthlyTotal.isLoading ||
    currentYearsMonthlyTotal.isLoading ||
    lastYearsMonthlyTotal.isLoading
  ) {
    return <p>Loading...</p>;
  }

  if (
    total.isLoading ||
    monthlyTotal.isLoading ||
    currentYearsMonthlyTotal.error ||
    lastYearsMonthlyTotal.error
  ) {
    return (
      <p>
        Error：{currentYearsMonthlyTotal.error}, {lastYearsMonthlyTotal.error}
      </p>
    );
  }

  if (total.data == null || monthlyTotal.data == null) {
    return <p>null</p>;
  }

  const mergedData = currentYearsMonthlyTotal.data?.map((currentMonthData) => {
    const lastYearMonthData = lastYearsMonthlyTotal.data?.find(
      (lastMonth) => lastMonth.month === currentMonthData.month
    );
    return {
      name: currentMonthData.month + "月",
      lines: {
        當年: currentMonthData.total,
        去年: lastYearMonthData ? lastYearMonthData.total : 0,
      },
    };
  });

  const dataKeys = ["當年", "去年"];

  return (
    <>
      <Row>
        <ValueDisplayCard
          title="總淨值"
          value={total.data}
          color="Primary"
          icon={<TaskIcon />}
        />

        <ValueDisplayCard
          title="月淨值"
          value={monthlyTotal.data}
          color="Warning"
          icon={<CalendarMonth />}
        />
      </Row>

      {mergedData && (
        <Row>
          <Col xs={12}>
            <LineGraph
              label="當年度淨值"
              data={mergedData}
              datakeys={dataKeys}
            />
          </Col>
        </Row>
      )}

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
