import { memo, useCallback, useState } from "react";
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
import Alert from "../../../components/Alert";
import useFetch from "../../../components/useFetch";
import { formatDate } from "../../../components/Date/FormatDate";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";

const formatSuppliesData = (data: any) => {
  const rows = data.map((row: any) => ({
    id: row.id,
    purchaseTime: formatDate(row.purchaseTime),
    name: row.name,
    quantity: row.quantity,
    total: row.total,
  }));

  return rows;
};

export default function SuppliesManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const handleRowsSelectedOnChange = (newSelection: GridRowSelectionModel) => {
    setSelectedRows(newSelection);
  };

  const adminToken = sessionStorage.getItem("admin_token");

  if (adminToken === null) {
    return <p>無效的token</p>;
  }

  const result = useFetch<{}[]>(
    "http://localhost:8080/supplies/get_all",
    "POST",
    adminToken
  );

  if (result.isLoading) {
    return <p>Loading...</p>;
  }

  if (result.error) {
    return <p>Error: {result.error}</p>;
  }
  return (
    <>
      <Container>
        <Row>
          <ValueDisplayCard
            title={"工具總總數量"}
            value={0}
            color={"Secondary"}
            icon={<PlumbingIcon />}
          />
          <ValueDisplayCard
            title={"消耗品總數量"}
            value={0}
            color={"Danger"}
            icon={<Inventory2Icon />}
          />
        </Row>

        <Row style={{ marginTop: 10 }}>
          <Col xs={12}>
            <Button
              variant="contained"
              style={{ width: "100%", padding: 10 }}
              onClick={() => setDialogOpen(true)}
            >
              新增物品
            </Button>
          </Col>
        </Row>

        <FormSearch
          label={"物品總覽查詢"}
          searchUrl="http://localhost:8080/supplies/criteria_search"
          showStartTime={true}
          showEndTime={true}
          mutiCheckBoxOptions={{
            label: "查詢選項",
            options: [
              { name: "工具", value: "TOOL", checked: false },
              { name: "消耗品", value: "CONSUMABLE", checked: false },
            ],
          }}
          categoryUrl={"http://localhost:8080/supplies/get_all"}
          showMoneyComparison={true}
          searchResultColumns={[
            {
              field: "id",
              headerName: "物品編號",
              width: 150,
              editable: false,
            },
            {
              field: "purchaseTime",
              headerName: "購入日期",
              width: 150,
              editable: false,
            },
            {
              field: "name",
              headerName: "物品名稱",
              width: 150,
              editable: false,
            },
            {
              field: "quantity",
              headerName: "購入數量",
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
          formatFunction={formatSuppliesData}
          handleSelectedRowsOnChange={handleRowsSelectedOnChange}
        />
      </Container>
      <DialogAddSupplies
        open={dialogOpen}
        onClose={handleDialogClose}
        suppliesName={result.data?.map((supplies) => supplies.name)}
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
  const [purchaseTime, setPurchaseTime] = useState<Date>(new Date());

  const [type, setType] = useState<"TOOL" | "CONSUMABLE">();

  const [name, setName] = useState<string>("");

  const [price, setPrice] = useState<number>();

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(event.target.value));
  };

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const handleBuyNewSuppliesOnClick = () => {
    fetch("http://localhost:8080/supplies/buy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("admin_token")}`,
      },
      body: JSON.stringify({
        purchaseTime: purchaseTime,
        type: type,
        name: name,
        price: price,
        quantity: quantity,
      }),
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
        物品新增
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
            <DemoItem>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  maxDate={dayjs()}
                  label="購入時間"
                  value={dayjs(purchaseTime)}
                  onInit
                  onChange={(dateTimeValue) => {
                    if (dateTimeValue) {
                      setPurchaseTime(dateTimeValue.toDate());
                    }
                  }}
                />
              </LocalizationProvider>
            </DemoItem>
          </Col>
        </Row>

        <Row style={{ margin: "20px 10px 0px 10px" }}>
          <Col xs={12}>
            <Autocomplete
              freeSolo
              style={{ width: "100%" }}
              disablePortal
              options={props.suppliesName}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="物品名稱"
                  value={name}
                  onSelect={(event) => setName(event.target.value)}
                  onChange={(event) => setName(event.target.value)}
                />
              )}
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
                label="物品種類"
                items={{ 消耗品: "CONSUMABLE", 工具: "TOOL" }}
                handleRadioButtonOnChange={setType}
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
              onClick={handleBuyNewSuppliesOnClick}
            >
              確認並新增
            </Button>
          </Col>
        </Row>
      </DialogContent>
    </BootstrapDialog>
  );
});
