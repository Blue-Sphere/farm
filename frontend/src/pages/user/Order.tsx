import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import {
  FixedSizeGrid,
  FixedSizeList,
  ListChildComponentProps,
} from "react-window";
import MarkEmailUnreadTwoToneIcon from "@mui/icons-material/MarkEmailUnreadTwoTone";
import HourglassBottomTwoToneIcon from "@mui/icons-material/HourglassBottomTwoTone";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import AutoSizer from "react-virtualized-auto-sizer";
import OrderCard from "../../components/OrderCard";
import { useEffect, useState } from "react";
import useFetch from "../../components/useFetch";
import { OrderProps } from "../../components/OrderCard";

interface Option {
  mode: "待確認" | "準備中" | "已完成";
}

export default function Order() {
  const [option, setOption] = useState<Option>({ mode: "待確認" });

  const [orders, setOrders] = useState<OrderProps[]>();

  const handleSetOption = (mode: Option["mode"]) => {
    setOption({ mode });
  };

  const token = sessionStorage.getItem("token");

  if (token === null) {
    return <p>token 不存在</p>;
  }

  const result = useFetch<OrderProps[]>(
    "http://localhost:8080/order/user/get",
    "POST",
    token
  );

  useEffect(() => {
    if (result.data) {
      setOrders(result.data);
    }
  }, [result.data]);

  if (result.isLoading) {
    return <p>Loading...</p>;
  }

  if (result.error) {
    return <p>Error: {result.error}</p>;
  }

  if (result.data === null) {
    return <p>購物車空空如也！</p>;
  }

  if (orders != undefined) {
    return (
      <div>
        <Grid
          container
          spacing={2}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              style={{ fontSize: "30px", fontStyle: "blod", width: "100%" }}
              onClick={() => handleSetOption("待確認")}
            >
              <MarkEmailUnreadTwoToneIcon
                style={{ fontSize: 35, marginRight: 10 }}
              />
              待確認訂單
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              style={{ fontSize: "30px", fontStyle: "blod", width: "100%" }}
              onClick={() => handleSetOption("準備中")}
            >
              <HourglassBottomTwoToneIcon
                style={{ fontSize: 35, marginRight: 10 }}
              />
              準備中訂單
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              color="error"
              size="large"
              style={{ fontSize: "30px", fontStyle: "blod", width: "100%" }}
              onClick={() => handleSetOption("已完成")}
            >
              <AssignmentTurnedInIcon
                style={{ fontSize: 35, marginRight: 10 }}
              />
              已完成訂單
            </Button>
          </Grid>
        </Grid>

        <SerchResult orders={orders} option={option} />
      </div>
    );
  }
}

const SerchResult = (props: { orders: OrderProps[]; option: Option }) => {
  const [serchResultOrders, setSerchResultOrders] = useState<OrderProps[]>();

  useEffect(() => {
    setSerchResultOrders(
      props.orders.filter((order) => order.status === props.option.mode)
    );
  }, [props.option]);

  if (serchResultOrders === undefined) {
    return null;
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <div
          style={{
            borderRadius: "10px 10px 0px 0px",
            marginTop: "12px",
            backgroundColor: "#FFA042	",
            width: "100%",
            height: "50px",
          }}
        >
          <p
            style={{
              color: "white",
              fontSize: "25px",
              fontStyle: "blod",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "3px",
            }}
          >
            查詢結果
          </p>
        </div>

        <div
          style={{
            marginTop: "-10px",
            backgroundColor: "white",
            width: "100%",
            height: "70vh",
          }}
        >
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemSize={46}
                itemCount={serchResultOrders.length}
                overscanCount={5}
                itemData={serchResultOrders}
              >
                {({ index, style }) => (
                  <OrderCard
                    index={index}
                    style={style}
                    data={serchResultOrders[index]}
                  />
                )}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      </Grid>
    </Grid>
  );
};
