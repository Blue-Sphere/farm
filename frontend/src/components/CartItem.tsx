import React, { memo, useCallback, useEffect, useState } from "react";
import Alert from "./Alert";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import AddCircleTwoToneIcon from "@mui/icons-material/AddCircleTwoTone";
import RemoveCircleTwoToneIcon from "@mui/icons-material/RemoveCircleTwoTone";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  Avatar,
  Box,
  Checkbox,
  Divider,
  List,
  ListItemAvatar,
  ListItemIcon,
  Typography,
} from "@mui/material";

interface CartItemProps {
  id: number;
  productId: number;
  count: number;
  index: number;
  onCheckedChange: (item: Item) => void;
  removeItem: (id: number) => void;
}

export interface Item {
  isChecked: boolean;
  id: number;
  productId: number;
  name: string;
  quantity: number;
  price: number;
}

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

function CartItem(props: CartItemProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [count, setCount] = useState(props.count);
  const [itemChecked, setItemchecked] = useState(false);

  const incrementCount = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  }, []);

  const handleDeleteCartItem = () => {
    const token = sessionStorage.getItem("token");

    fetch(`http://localhost:8080/cart/user/delete/${props.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
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
        props.removeItem(props.id);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    fetch(`http://localhost:8080/product/${props.productId}`, { method: "GET" })
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
        setProduct(data);
      })
      .catch((error) => console.log(error.message));
  }, [props.id]);

  useEffect(() => {
    if (product) {
      const item: Item = {
        isChecked: itemChecked,
        id: props.id,
        productId: product.id,
        name: product.name,
        quantity: count,
        price: product.price,
      };
      props.onCheckedChange(item);
    }
  }, [itemChecked, count]);

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <ListItem alignItems="center" sx={{ height: "100px" }}>
        <ListItemIcon>
          <Checkbox
            checked={itemChecked}
            onClick={() => setItemchecked(!itemChecked)}
          />
        </ListItemIcon>
        <ListItemAvatar>
          <Avatar
            alt="Product Image"
            src={`data:image/jpeg;base64,${product?.image}`}
          />
        </ListItemAvatar>
        <Box alignItems="flex-end" width="100%">
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={3}>
              <Box display="flex" flexDirection="column">
                <ListItemText
                  primary={product?.name}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        單價
                      </Typography>
                      <Typography>{product?.price} 新台幣 / 斤</Typography>
                    </>
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box display="flex" flexDirection="column">
                <ListItemText
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        數量
                      </Typography>
                      <Typography>
                        <Box display="flex" alignItems="center">
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{ marginRight: "5px", cursor: "pointer" }}
                              onClick={decrementCount}
                            >
                              <RemoveCircleTwoToneIcon color="inherit" />
                            </div>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={count}
                              readOnly
                              style={{ marginRight: "5px", width: 30 }}
                            />
                            <div
                              onClick={incrementCount}
                              style={{ cursor: "pointer" }}
                            >
                              <AddCircleTwoToneIcon color="inherit" />
                            </div>
                          </div>
                        </Box>
                      </Typography>
                    </>
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box flexDirection="column" alignItems="flex-end">
                <ListItemText
                  sx={{ marginLeft: 3 }}
                  style={{ display: "flex", alignItems: "flex-end" }}
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        總計
                      </Typography>
                      <Typography>{product?.price * count} 元</Typography>
                    </>
                  }
                />
              </Box>
            </Grid>
            <Grid item xs={3}>
              <Box display="flex" flexDirection="column">
                <ListItemText
                  sx={{ marginLeft: 1 }}
                  onClick={handleDeleteCartItem}
                  style={{ cursor: "pointer" }}
                >
                  <DeleteOutlineIcon color="inherit" />
                </ListItemText>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ListItem>
      <Divider
        variant="middle"
        style={{ borderWidth: "1px", borderColor: "gray" }}
      />
    </List>
  );
}

export default memo(CartItem);
