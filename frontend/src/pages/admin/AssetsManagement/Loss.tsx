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

export default function Loss() {
  const token = sessionStorage.getItem("admin_token");
  if (token === null) return <p>缺少admin_token</p>;

  const year = new Date().getFullYear();

  const currentYearsMonthlyCost = useFetch<SplitedMonlyTotalProps[]>(
    `http://localhost:8080/assets/years_monthly_summary/${year}?splitIncomeAndExpense=true`,
    "POST",
    token
  );

  const lastYearsMonthlyCost = useFetch<SplitedMonlyTotalProps[]>(
    `http://localhost:8080/assets/years_monthly_summary/${
      year - 1
    }?splitIncomeAndExpense=true`,
    "POST",
    token
  );

  if (currentYearsMonthlyCost.isLoading || lastYearsMonthlyCost.isLoading) {
    return <p>Loading...</p>;
  }

  if (currentYearsMonthlyCost.error || lastYearsMonthlyCost.error) {
    return (
      <p>
        Error：{currentYearsMonthlyCost.error}, {lastYearsMonthlyCost.error}
      </p>
    );
  }

  const mergedData = currentYearsMonthlyCost.data?.map((currentMonthData) => {
    const lastYearMonthData = lastYearsMonthlyCost.data?.find(
      (lastMonth) => lastMonth.month === currentMonthData.month
    );
    return {
      name: currentMonthData.month + "月",
      lines: {
        當年: currentMonthData.cost,
        去年: lastYearMonthData ? lastYearMonthData.cost : 0,
      },
    };
  });

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

      {mergedData && (
        <Row>
          <Col xs={12}>
            <LineGraph
              label="當年度費損"
              data={mergedData}
              datakeys={dataKeys}
            />
          </Col>
        </Row>
      )}
    </>
  );
}
