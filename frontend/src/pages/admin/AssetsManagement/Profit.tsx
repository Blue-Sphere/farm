import CalendarMonth from "@mui/icons-material/CalendarMonth";
import TaskIcon from "@mui/icons-material/Task";
import { Col, Row } from "react-bootstrap";
import LineGraph from "../../../components/LineGraph";
import ValueDisplayCard from "../../../components/ValueDisplayCard";
import useFetch from "../../../components/useFetch";

interface AssetsProps {
  id: number;
  name: string;
  value: number;
  creationTime: Date;
}

interface SplitedMonlyTotalProps {
  month: string;
  revenue: number;
  cost: number;
}

export default function Profit() {
  const token = sessionStorage.getItem("admin_token");
  if (token === null) return <p>缺少admin_token</p>;

  const year = new Date().getFullYear();

  const totalProfit = useFetch<number>(
    `http://localhost:8080/assets/month_all_profit_sum`,
    "POST",
    token
  );

  const monthlyProfit = useFetch<number>(
    `http://localhost:8080/assets/monthly_revenue`,
    "POST",
    token
  );

  const currentYearsMonthlyRevenue = useFetch<SplitedMonlyTotalProps[]>(
    `http://localhost:8080/assets/years_monthly_summary/${year}?splitIncomeAndExpense=true`,
    "POST",
    token
  );

  const lastYearsMonthlyRevenue = useFetch<SplitedMonlyTotalProps[]>(
    `http://localhost:8080/assets/years_monthly_summary/${
      year - 1
    }?splitIncomeAndExpense=true`,
    "POST",
    token
  );

  if (
    totalProfit.isLoading ||
    monthlyProfit.isLoading ||
    currentYearsMonthlyRevenue.isLoading ||
    lastYearsMonthlyRevenue.isLoading
  ) {
    return <p>Loading...</p>;
  }

  if (
    totalProfit.isLoading ||
    monthlyProfit.isLoading ||
    currentYearsMonthlyRevenue.error ||
    lastYearsMonthlyRevenue.error
  ) {
    return (
      <p>
        Error：{currentYearsMonthlyRevenue.error},{" "}
        {lastYearsMonthlyRevenue.error}
      </p>
    );
  }

  if (totalProfit.data == null || monthlyProfit.data == null) {
    return <p>null</p>;
  }

  const mergedData = currentYearsMonthlyRevenue.data?.map(
    (currentMonthData) => {
      const lastYearMonthData = lastYearsMonthlyRevenue.data?.find(
        (lastMonth) => lastMonth.month === currentMonthData.month
      );
      return {
        name: currentMonthData.month + "月",
        lines: {
          當年: currentMonthData.revenue,
          去年: lastYearMonthData ? lastYearMonthData.revenue : 0,
        },
      };
    }
  );

  const dataKeys = ["當年", "去年"];
  return (
    <>
      <Row>
        <ValueDisplayCard
          title="總收益"
          value={totalProfit.data}
          color="Primary"
          icon={<TaskIcon />}
        />

        <ValueDisplayCard
          title="月收益"
          value={monthlyProfit.data}
          color="Warning"
          icon={<CalendarMonth />}
        />
      </Row>

      {mergedData && (
        <Row>
          <Col xs={12}>
            <LineGraph
              label="當年度收益"
              data={mergedData}
              datakeys={dataKeys}
            />
          </Col>
        </Row>
      )}
    </>
  );
}
