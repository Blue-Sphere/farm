import { Button } from "@mui/material";
import { memo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import ValueDisplayCard from "../../../components/ValueDisplayCard";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  styled,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { GridRowSelectionModel } from "@mui/x-data-grid/models/gridRowSelectionModel";
import FormSearch from "../../../components/FormSearch";

const formatAdminData = (data: any) => {
  const rows = data.map((row: any) => ({
    id: row.id,
    email: row.email,
    name: row.name,
    isAvailable: row.isAvailable ? "白名單" : "黑名單",
  }));

  return rows;
};

export default function Admin() {
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
            title={"管理者總數"}
            value={0}
            color={"Danger"}
            icon={<PersonIcon />}
          />
        </Row>

        <Row style={{ marginTop: 10 }}>
          <Col xs={12}>
            <Button
              variant="contained"
              style={{ width: "100%", padding: 10 }}
              onClick={() => setDialogOpen(true)}
            >
              新增管理者
            </Button>
          </Col>
        </Row>

        <FormSearch
          label={"管理者查詢"}
          searchUrl="http://localhost:8080/admin/criteria_search"
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
              headerName: "管理者編號",
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
          formatFunction={formatAdminData}
          handleSelectedRowsOnChange={handleRowsSelectedOnChange}
        />
      </Container>
      <DialogAddAdmin open={dialogOpen} onClose={handleDialogClose} />
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

interface DialogAddAdminProps {
  open: boolean;
  onClose: () => void;
}

const DialogAddAdmin = memo((props: DialogAddAdminProps) => {
  const [usersEmail, setUsersEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminsPassword, setAdminsPassword] = useState("");

  const handleUsersEmailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setUsersEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleAdminsPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAdminsPassword(event.target.value);
  };

  return (
    <BootstrapDialog
      onClose={props.onClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        管理者新增
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
              label="會員Email"
              value={usersEmail}
              onChange={handleUsersEmailChange}
            />
          </Col>
        </Row>

        <Row style={{ margin: "20px 10px 0px 10px" }}>
          <Col xs={12}>
            <TextField
              sx={{ width: "100%" }}
              label="管理員密碼"
              value={password}
              onChange={handlePasswordChange}
            />
          </Col>
        </Row>

        <Row style={{ margin: "50px 10px 0px 10px" }}>
          <Col xs={12}>
            <TextField
              sx={{ width: "100%" }}
              label="確認者密碼"
              value={adminsPassword}
              onChange={handleAdminsPasswordChange}
              color="warning"
            />
          </Col>
        </Row>

        <Row
          style={{
            margin: "50px 10px 0px 10px",
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
