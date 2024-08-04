import "./OrderCard.css";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { memo, useState } from "react";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import { ListChildComponentProps } from "react-window";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";

export interface OrderProps {
  id: number;
  creationTime: TimerHandler;
  orderItems: {
    id: number;
    product: {};
    quantity: number;
    price: number;
    total: number;
  }[];
  status: string;
  total: number;
}

interface OrderCardProps {
  index: number;
  style: React.CSSProperties;
  data: OrderProps;
}

function OrderCard({ index, style, data }: OrderCardProps) {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <ListItem
        style={style}
        key={index}
        className={index % 2 ? "ListItemOdd" : "ListItemEven"}
      >
        <ListItemButton onClick={handleClickOpen}>
          <ListItemText
            primary={String(data.creationTime).slice(0, 10)}
            style={{ marginLeft: "12px" }}
          />
          <ListItemText
            primary={`總價：${data.total}`}
            style={{ marginLeft: "15px" }}
          />
        </ListItemButton>
      </ListItem>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          訂單編號 {data.id}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>訂單狀態 {data.status}</Typography>
          <Typography gutterBottom>
            購買項目{" "}
            {data.orderItems.map((item) => (
              <div>
                {item.product.name} x{item.quantity}
              </div>
            ))}
          </Typography>
          <Typography gutterBottom>計價 {data.total}</Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} variant="outlined">
            確認
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </>
  );
}

export default memo(OrderCard);
