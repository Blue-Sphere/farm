import Typography from "@mui/material/Typography/Typography";
import { memo } from "react";

interface TotalPriceProps {
  price: number;
  quantity: number;
}

export default memo(function CalculateTotal({
  price,
  quantity,
}: TotalPriceProps) {
  return <Typography>總計：{price * quantity}元 新台幣</Typography>;
});
