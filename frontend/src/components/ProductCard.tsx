import React, { memo, useCallback, useState } from "react";
import { Card, Col } from "react-bootstrap";

import CloseIcon from "@mui/icons-material/Close";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  styled,
} from "@mui/material";
import Alert from "./Alert";
import { useLocation, useNavigate } from "react-router-dom";
import CountControl from "./Calculate/CountControl";
import CalculateTotal from "./Calculate/CalculateTotal";

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

//

interface DialogBuyProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  quantity: number;
  incrementCount: () => void;
  decrementCount: () => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const DialogBuy = memo(
  ({
    open,
    onClose,
    product,
    quantity,
    incrementCount,
    decrementCount,
  }: DialogBuyProps) => {
    const handleTakeToCart = () => {
      const token = sessionStorage.getItem("token");

      const cartItem = {
        productId: product.id,
        quantity: quantity,
      };
      fetch("http://localhost:8080/cart/user/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cartItem),
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
        .catch((error) => console.error(error.message))
        .finally(() => {
          onClose();
        });
    };

    return (
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {product.name}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          dividers
          style={{
            alignItems: "center",
            justifyItems: "center",
            justifyContent: "center",
            alignContent: "center",
            textAlign: "center",
          }}
        >
          <Card.Img
            variant="top"
            src={`data:image/jpeg;base64,${product.image}`}
          />
          <Typography gutterBottom>購買數量</Typography>
          <CountControl
            quantity={quantity}
            increment={incrementCount}
            decrement={decrementCount}
          />
          <Typography>{product.price}$ / 斤</Typography>
          <CalculateTotal price={product.price} quantity={quantity} />
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleTakeToCart}
          >
            加入購物車
          </button>
        </DialogContent>
      </BootstrapDialog>
    );
  }
);

const ProductCard = (props: { product: Product }) => {
  const location = useLocation();

  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quantity, setCount] = useState(1);

  const handleClickOpen = useCallback(() => {
    const token = sessionStorage.getItem("token");
    if (location.pathname === "/product") {
      if (token === null) {
        alert("請先登入會員");
        navigate("/login");
      } else {
        navigate("/user/shop");
      }
      return;
    }

    setIsDialogOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const incrementCount = useCallback(() => {
    setCount((prevCount) => prevCount + 1);
  }, []);

  const decrementCount = useCallback(() => {
    setCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
  }, []);

  return (
    <>
      <DialogBuy
        open={isDialogOpen}
        onClose={handleClose}
        product={props.product}
        quantity={quantity}
        incrementCount={incrementCount}
        decrementCount={decrementCount}
      />
      <div style={{ margin: "10px 10px 10px 10px" }} key={props.product.id}>
        <Col lg="12" xs="12" className="mt-4">
          <Card style={{ boxShadow: "10px 10px 10px rgba(0,0,0,0.5)" }}>
            <Card.Img
              variant="top"
              src={`data:image/jpeg;base64,${props.product.image}`}
            />
            <Card.Body style={{ textAlign: "center" }}>
              <Card.Title>{props.product.name}</Card.Title>
              <Card.Text>{props.product.price}$ / 斤</Card.Text>
              <Card.Text>剩餘數量: {props.product.quantity} 斤</Card.Text>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClickOpen}
              >
                {location.pathname === "/product" ? "前往購物頁面" : "購買"}
              </button>
            </Card.Body>
          </Card>
        </Col>
      </div>
    </>
  );
};

export default ProductCard;
