import { memo, useCallback, useEffect, useState } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList as List } from "react-window";
import useFetch from "../../components/useFetch";
import CartItem from "../../components/CartItem";
import Divider from "@mui/material/Divider";
import { Item } from "../../components/CartItem";
import { Button } from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Alert from "../../components/Alert";

const handleOrderItems = (items: Item[]) => {
  const token = sessionStorage.getItem("token");

  fetch("http://localhost:8080/order/user/buy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(
      items.filter((item) => {
        return item.isChecked === true;
      })
    ),
  })
    .then(async (response) => {
      if (!response.ok) {
        const errorMessage = await response.text();
        Alert({
          title: response.status.toString(),
          text: errorMessage,
          icon: "error",
        })();
        throw new Error(errorMessage);
      }
      return response;
    })
    .then(async (data) => {
      const message = await data.text();
      Alert({
        title: data.status.toString(),
        text: message,
        icon: "success",
      })();
    })
    .catch((error) => console.error(error.message));
};

const Cart = memo(() => {
  const [items, setItems] = useState<Item[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const handleItemDelete = useCallback((id: number) => {
    setItems(items.filter((item) => item.id != id));
  }, []);

  const handleItemChange = useCallback((item_new: Item) => {
    setItems((prevItems: Item[]) => {
      // 检查项目是否已存在
      const itemExists = prevItems.some((item) => item.id === item_new.id);

      if (itemExists) {
        // 更新已存在的Item
        return prevItems.map((item) =>
          item.id === item_new.id ? { ...item_new } : item
        );
      } else {
        // 添加新Item
        return [...prevItems, item_new];
      }
    });
  }, []);

  useEffect(() => {
    const newTotalPrice = items.reduce((sum, item) => {
      return item.isChecked ? sum + item.price * item.quantity : sum;
    }, 0);
    setTotalPrice(newTotalPrice);
  }, [items]);

  const token = sessionStorage.getItem("token");

  if (token == undefined) {
    return <p>token不存在</p>;
  }

  const result = useFetch<Item[]>(
    "http://localhost:8080/cart/user/get",
    "POST",
    token,
    [items.length]
  );

  useEffect(() => {
    if (result.data) {
      setItems(result.data);
    }
  }, [result.data]);

  if (result.isLoading) {
    return <p>Loading...</p>;
  }

  if (result.error) {
    return <p>Error: {result.error}</p>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <MemoizedAutoSizer>
        {({ width, height }) => (
          <MemoizedList
            itemSize={110}
            itemCount={result.data?.length || 0}
            height={height - 150}
            width={width}
            itemData={result.data}
            handleItemChange={handleItemChange}
            handleItemDelete={handleItemDelete}
          />
        )}
      </MemoizedAutoSizer>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          backgroundColor: "white",
          textAlign: "right",
          padding: "10px 20px",
          boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{ display: "inline-block", textAlign: "right", width: "100%" }}
        >
          <p style={{ display: "inline", margin: "0" }}>
            總計: {totalPrice} 元
          </p>
          <Button
            variant="outlined"
            endIcon={<ShoppingCartOutlinedIcon />}
            style={{ marginLeft: "15px" }}
            onClick={() => handleOrderItems(items)}
          >
            送出訂單
          </Button>
        </div>
      </div>
    </div>
  );
});

const MemoizedAutoSizer = memo(AutoSizer);

interface MemoizedListProps {
  itemSize: number;
  itemCount: number;
  height: number;
  width: number;
  itemData: Item[];
  handleItemChange: (item: Item) => void;
  handleItemDelete: (id: number) => void;
}

const MemoizedList = memo(
  ({
    itemSize,
    itemCount,
    height,
    width,
    itemData,
    handleItemChange,
    handleItemDelete,
  }: MemoizedListProps) => (
    <List
      itemSize={itemSize}
      itemCount={itemCount}
      height={height}
      width={width}
      itemData={itemData}
    >
      {({ index, style, data }: { index: number; data: Item[] }) => (
        <div key={index} style={style}>
          <MemoizedCartItem
            id={data[index].id}
            productId={data[index].productId}
            count={data[index].quantity}
            index={index}
            onCheckedChange={handleItemChange}
            removeItem={handleItemDelete}
          />
          <Divider style={{ height: "2px" }} />
        </div>
      )}
    </List>
  )
);

const MemoizedCartItem = memo(CartItem);

export default Cart;
