import MarkEmailUnreadTwoToneIcon from "@mui/icons-material/MarkEmailUnreadTwoTone";
import HourglassBottomTwoToneIcon from "@mui/icons-material/HourglassBottomTwoTone";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { ChangeEvent, memo, useCallback, useState } from "react";
import ValueDisplayCard from "../../../components/ValueDisplayCard";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Col, Container, Row } from "react-bootstrap";
import { Box, Button, Grid } from "@mui/material";

import {
  Autocomplete,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  styled,
} from "@mui/material";

import FormSearch from "../../../components/FormSearch";
import CloseIcon from "@mui/icons-material/Close";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CountControl from "../../../components/Calculate/CountControl";
import CalculateTotal from "../../../components/Calculate/CalculateTotal";
import RadioGroup from "../../../components/RadioGroup";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import useFetch from "../../../components/useFetch";
import { formatDate } from "../../../components/Date/FormatDate";
import Alert from "../../../components/Alert";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import DrogList from "../../../components/DrogList";

export interface Order {
  id: number;
  name: string;
  status: string;
  orderItems: {
    name: string;
    price: number;
  }[];
  total: number;
}

const formateOrderData = (data: any) => {
  const rows = data.map((row: any) => ({
    id: row.id,
    email: row.boughtByUser.email,
    creationTime: formatDate(row.creationTime),
    items: row.orderItems
      .map((item: any) => `${item.product.name} x${item.quantity}`)
      .join(", "),
    total: row.total,
  }));

  return rows;
};

export default function OrderManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleRowsSelectedOnChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows(newSelection);
  };

  const handleExcutedSelectedRows = async (
    action: "check" | "complete" | "remove"
  ) => {
    const deletePromises = selectedRows.map((rowId) =>
      fetch(
        `http://localhost:8080/order/admin/${action}_order?id=${rowId.valueOf()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("admin_token")}`,
          },
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to delete row with ID: ${rowId}`);
          }
          return response.json();
        })
        .then((result) => ({ success: true, rowId }))
        .catch((error) => ({ success: false, rowId, error: error.message }))
    );

    const results = await Promise.all(deletePromises);

    const successfulDeletions = results.filter((result) => result.success);
    const failedDeletions = results.filter((result) => !result.success);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const token = sessionStorage.getItem("admin_token");

  if (token === null) {
    return <p>token不存在！</p>;
  }

  const result = useFetch<number[]>(
    "http://localhost:8080/order/admin/orders_summary_count",
    "POST",
    token
  );

  if (result.isLoading) {
    return <p>Loading..</p>;
  }

  if (result.error) {
    return <p>Error {result.error}</p>;
  }

  if (!result.data) {
    return <p>No data available</p>;
  }

  interface CriteriaSearchDataRowProps {
    id: number;
    email: string;
    items: string;
    total: number;
  }

  return (
    <>
      <Container>
        <Row>
          <ValueDisplayCard
            title={"待確認訂單數量"}
            value={result.data[0]}
            color={"Warning"}
            icon={<MarkEmailUnreadTwoToneIcon />}
            gridSize={4}
          />
          <ValueDisplayCard
            title={"準備中訂單數量"}
            value={result.data[1]}
            color={"Primary"}
            icon={<HourglassBottomTwoToneIcon />}
            gridSize={4}
          />
          <ValueDisplayCard
            title={"已完成訂單數量"}
            value={result.data[2]}
            color={"Danger"}
            icon={<AssignmentTurnedInIcon />}
            gridSize={4}
          />
        </Row>

        <FormSearch
          label={"訂單總覽查詢"}
          searchUrl="http://localhost:8080/order/admin/criteria_search"
          showStartTime={true}
          showEndTime={true}
          mutiCheckBoxOptions={{
            label: "查詢選項",
            options: [
              { name: "待確認", value: "待確認", checked: false },
              { name: "準備中", value: "準備中", checked: false },
              { name: "已完成", value: "已完成", checked: false },
            ],
          }}
          categoryUrl={"http://localhost:8080/product/get_all"}
          showMoneyComparison={true}
          searchResultColumns={[
            {
              field: "id",
              headerName: "訂單編號",
              width: 150,
              editable: false,
            },
            {
              field: "creationTime",
              headerName: "訂單日期",
              width: 150,
              editable: false,
            },
            {
              field: "email",
              headerName: "email",
              width: 150,
              editable: false,
            },
            {
              field: "items",
              headerName: "訂購商品",
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
          formatFunction={formateOrderData}
          handleSelectedRowsOnChange={handleRowsSelectedOnChange}
        />

        {selectedRows.length > 0 && (
          <Row
            style={{
              background: "#F0F0F0",
              margin: "-10px 0px 0px 0px",
              paddingBottom: "14px",
              borderRadius: "0px 0px 10px 10px",
            }}
          >
            <Col xs={4}>
              <Button
                fullWidth
                color="info"
                variant="outlined"
                onClick={() => handleExcutedSelectedRows("check")}
              >
                變更狀態為準備中
              </Button>
            </Col>

            <Col xs={4}>
              <Button
                fullWidth
                color="warning"
                variant="outlined"
                onClick={() => handleExcutedSelectedRows("complete")}
              >
                變更狀態為已完成
              </Button>
            </Col>

            <Col xs={4}>
              <Button
                fullWidth
                color="error"
                variant="outlined"
                onClick={() => handleExcutedSelectedRows("remove")}
              >
                刪除訂單
              </Button>
            </Col>
          </Row>
        )}
      </Container>
      <DialogAddSupplies
        open={dialogOpen}
        onClose={handleDialogClose}
        suppliesName={["test", "test2"]}
      />
    </>
  );
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface DialogAddSuppliesProps {
  open: boolean;
  onClose: () => void;
  suppliesName: string[];
}

const DialogAddSupplies = memo((props: DialogAddSuppliesProps) => {
  const [productName, setProductName] = useState("");

  const handleProdictNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProductName(event.target.value);
  };

  const [price, setPrice] = useState<number>(0);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(event.target.value));
  };

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const [description, setDescription] = useState("");

  const handleDescriptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDescription(event.target.value);
  };

  return (
    <BootstrapDialog
      onClose={props.onClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        商品新增
        <IconButton
          aria-label="close"
          onClick={props.onClose}
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
        <Row style={{ margin: "20px 10px 0px 10px" }}>
          <Col xs={12}>
            <TextField
              sx={{ width: "100%" }}
              label="商品名稱"
              value={productName}
              onChange={handleProdictNameChange}
            />
          </Col>
        </Row>

        <Row
          xs={12}
          style={{
            margin: "20px 10px 0px 10px",
          }}
        >
          <Col xs={6}>
            <Box
              sx={{
                paddingTop: 2,
                paddingBottom: 2,
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            >
              <RadioGroup
                label="商品狀態"
                items={{ 上架中: true, 未上架: false }}
              />
            </Box>
          </Col>
          <Col xs={6} style={{ marginTop: "-5px" }}>
            <Row style={{ margin: "10px 0px 10px 0px" }}>
              <TextField
                style={{ width: "100%" }}
                type="number"
                label="單價"
                value={price}
                onChange={handlePriceChange}
                InputProps={{
                  inputProps: { min: 0 },
                  sx: {
                    "& input[type=number]": {
                      MozAppearance: "textfiformseld",
                      appearance: "textfield",
                    },
                    "& input[type=number]::-webkit-outer-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                    "& input[type=number]::-webkit-inner-spin-button": {
                      WebkitAppearance: "none",
                      margin: 0,
                    },
                  },
                }}
              />
            </Row>

            <Row style={{ margin: "20px 0px 0px 0px" }}>
              <TextField
                style={{ width: "100%" }}
                type="number"
                label="數量"
                value={quantity}
                onChange={handleQuantityChange}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Row>
          </Col>
        </Row>

        <Row
          style={{
            margin: "20px 10px 0px 10px",
          }}
        >
          <Col xs={12}>
            <CalculateTotal price={price} quantity={quantity} />
          </Col>
        </Row>

        <Row>
          <Col>
            <Box
              sx={{ textAlign: "center", mt: 4, margin: "0px 20px 0px 20px" }}
            >
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="upload-button-file"
                type="file"
                onChange={handleImageUpload}
              />
              {image && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={image}
                    alt="Uploaded"
                    style={{
                      maxWidth: "100%",
                      borderRadius: 10,
                    }}
                  />
                </Box>
              )}
              <Row style={{ marginTop: 15 }}>
                <Col>
                  <label htmlFor="upload-button-file">
                    <Button variant="contained" component="span">
                      上傳照片
                    </Button>
                  </label>
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>

        <Row
          style={{
            margin: "20px 10px 0px 10px",
          }}
        >
          <Col>
            <TextField
              label="詳述"
              multiline
              fullWidth
              rows={5}
              value={description}
              onChange={handleDescriptionChange}
            />
          </Col>
        </Row>
      </DialogContent>
    </BootstrapDialog>
  );
});
