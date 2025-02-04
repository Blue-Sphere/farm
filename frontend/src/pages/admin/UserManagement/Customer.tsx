import MarkEmailUnreadTwoToneIcon from "@mui/icons-material/MarkEmailUnreadTwoTone";
import HourglassBottomTwoToneIcon from "@mui/icons-material/HourglassBottomTwoTone";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

import { ChangeEvent, memo, useCallback, useState } from "react";
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
import PersonIcon from "@mui/icons-material/Person";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";

const formatUserData = (data: any) => {
  const rows = data.map((row: any) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    isAvailable: row.isAvailable ? "白名單" : "黑名單",
  }));

  return rows;
};

export default function Customer() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleRowsSelectedOnChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows(newSelection);
  };
  return (
    <>
      <Container>
        <Row>
          <ValueDisplayCard
            title={"會員總數"}
            value={0}
            color={"Success"}
            icon={<PersonIcon />}
          />
          <ValueDisplayCard
            title={"黑名單會員總數"}
            value={0}
            color={"Secondary"}
            icon={<PersonOffIcon />}
          />
        </Row>

        <FormSearch
          label={"使用者查詢"}
          searchUrl="http://localhost:8080/user/criteria_search"
          showStartTime={false}
          showEndTime={false}
          categoryUrl={null}
          mutiCheckBoxOptions={{
            label: "查詢選項",
            options: [
              { name: "白名單", value: true, checked: false },
              { name: "黑名單", value: false, checked: false },
            ],
          }}
          showMoneyComparison={false}
          searchResultColumns={[
            {
              field: "id",
              headerName: "使用者編號",
              width: 150,
              editable: false,
            },
            {
              field: "email",
              headerName: "信箱",
              width: 150,
              editable: false,
            },
            {
              field: "name",
              headerName: "姓名",
              width: 150,
              editable: false,
            },
            {
              field: "isAvailable",
              headerName: "狀態",
              width: 150,
              editable: false,
            },
          ]}
          formatFunction={formatUserData}
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
            >
              確認並新增
            </Button>
          </Col>
        </Row>
      </DialogContent>
    </BootstrapDialog>
  );
});
