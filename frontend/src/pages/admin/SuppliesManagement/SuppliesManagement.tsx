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

import FormSerch from "../../../components/FormSerch";
import CloseIcon from "@mui/icons-material/Close";
import { DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CountControl from "../../../components/Calculate/CountControl";
import CalculateTotal from "../../../components/Calculate/CalculateTotal";
import RadioGroup from "../../../components/RadioGroup";

export default function SuppliesManagement() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
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

        <FormSerch
          label={"物品總覽查詢"}
          showStartTime={true}
          showEndTime={true}
          mutiCheckBoxOptions={{
            label: "查詢選項",
            options: [
              { name: "工具", checked: false },
              { name: "消耗品", checked: false },
            ],
          }}
          category={{ key1: 123, key2: 456, key3: 789 }}
          showMoneyComparison={true}
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
  const [price, setPrice] = useState<number>(0);

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(Number(event.target.value));
  };

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
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
                <DatePicker maxDate={dayjs()} label="購入時間" />
              </LocalizationProvider>
            </DemoItem>
          </Col>
        </Row>

        <Row style={{ margin: "20px 10px 0px 10px" }}>
          <Col xs={12}>
            <Autocomplete
              style={{ width: "100%" }}
              disablePortal
              options={props.suppliesName}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="物品名稱" />
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
                items={{ 消耗品: "supplies", 工具: "tools" }}
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
            >
              確認並新增
            </Button>
          </Col>
        </Row>
      </DialogContent>
    </BootstrapDialog>
  );
});
