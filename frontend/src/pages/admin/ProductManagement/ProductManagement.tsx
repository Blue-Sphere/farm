import { ChangeEvent, memo, useCallback, useEffect, useState } from "react";
import ValueDisplayCard from "../../../components/ValueDisplayCard";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Col, Container, Row } from "react-bootstrap";
import { Box, Button } from "@mui/material";

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
import Alert from "../../../components/Alert";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import { convertToBase64 } from "../../../components/Image/ConvertImage";

const formatProductData = (data: any) => {
  const rows = data.map((row: any) => ({
    id: row.id,
    image: row.image,
    name: row.name,
    price: row.price,
    quantity: row.quantity,
  }));

  return rows;
};

export default function ProductManagement() {
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleRowsSelectedOnChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows(newSelection);
  };

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  return (
    <>
      <Container>
        <Row>
          <ValueDisplayCard
            title={"上架中商品數量"}
            value={0}
            color={"Success"}
            icon={<ShoppingCartIcon />}
          />
          <ValueDisplayCard
            title={"未上架商品數量"}
            value={0}
            color={"Secondary"}
            icon={<RemoveShoppingCartIcon />}
          />
        </Row>

        <Row style={{ marginTop: 10 }}>
          <Col xs={12}>
            <Button
              variant="contained"
              style={{ width: "100%", padding: 10 }}
              onClick={() => setDialogOpen(true)}
            >
              新增商品
            </Button>
          </Col>
        </Row>

        <FormSearch
          label={"商品總覽查詢"}
          searchUrl="http://localhost:8080/product/criteria_search"
          mutiCheckBoxOptions={{
            label: "查詢選項",
            options: [
              { name: "上架中", value: true, checked: false },
              { name: "未上架", value: false, checked: false },
            ],
          }}
          categoryUrl={"http://localhost:8080/product/inventory"}
          showMoneyComparison={true}
          searchResultColumns={[
            {
              field: "id",
              headerName: "商品編號",
              width: 150,
              editable: false,
            },
            {
              field: "image",
              headerName: "照片預覽",
              width: 150,
              editable: false,
              renderCell: (params) => (
                <img
                  src={`data:image/jpeg;base64,${params.value}`}
                  width={50}
                  height={50}
                  style={{ marginLeft: -10 }}
                />
              ),
            },
            {
              field: "name",
              headerName: "商品名稱",
              width: 150,
              editable: false,
            },
            {
              field: "price",
              headerName: "商品價格",
              width: 150,
              editable: false,
            },
            {
              field: "quantity",
              headerName: "剩餘數量",
              width: 150,
              editable: false,
            },
          ]}
          formatFunction={formatProductData}
          handleSelectedRowsOnChange={handleRowsSelectedOnChange}
        />
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
  const [isAvailable, setIsAvailable] = useState(false);

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

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [image, setImage] = useState<File | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageSrc(reader.result as string);
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

  const handleAddNewProductOnClick = () => {
    const product = JSON.stringify({
      name: productName,
      isAvailable: isAvailable,
      price: price,
      quantity: quantity,
    });
    const formData = new FormData();
    formData.append("name", productName);
    formData.append("isAvailable", String(isAvailable));
    formData.append("price", price.toString());
    formData.append("quantity", quantity.toString());
    formData.append("description", description.toString());
    if (image) formData.append("originImage", image);

    fetch("http://localhost:8080/product/admin/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("admin_token")}`,
      },
      body: formData,
    }).then(async (response) => {
      const message = await response.text();
      if (!response.ok) {
        Alert({
          title: response.status.toString(),
          text: message,
          icon: "error",
        });
        throw new Error(message);
      }
      Alert({
        title: response.status.toString(),
        text: message,
        icon: "success",
      });
    });
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
                handleRadioButtonOnChange={setIsAvailable}
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
              {imageSrc && (
                <Box sx={{ mt: 2 }}>
                  <img
                    src={imageSrc}
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

        <Row
          style={{
            margin: "20px 10px 0px 10px",
          }}
        >
          <Col xs={12}>
            <Button
              style={{
                width: "100%",
                padding: "10px 0px 10px 0px",
              }}
              variant="contained"
              color="info"
              onClick={handleAddNewProductOnClick}
            >
              確認並新增
            </Button>
          </Col>
        </Row>
      </DialogContent>
    </BootstrapDialog>
  );
});
