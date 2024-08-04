import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { redirect, useNavigate } from "react-router-dom";
import Alert from "./Alert";

export default function RestrictedDialog(props: {
  open: boolean;
  handleDialogClose: () => void;
  title: string;
  content: string;
  email: string;
  verifyUrl: string;
}) {
  const [verificationCode, setVerificationCode] = useState<String>("");

  const [errorMessage, setErrorMessage] = useState<String>("");

  const navigate = useNavigate();

  const validateUsersVerificationCode = () => {
    const data = props.verifyUrl.includes("register")
      ? {
          // 新加入會員Email用
          email: props.email,
          verificationCode: verificationCode,
        }
      : {
          // 更改Email用
          newEmail: props.email,
          verificationCode: verificationCode,
        };

    fetch(props.verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.text();
          setErrorMessage(errorMessage);
          throw new Error(errorMessage);
        }
        props.handleDialogClose();
        alert("成功！重新登入");
        navigate("/login");
        return response;
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => console.error(error.message));
  };

  const handleVerificationCodeOnChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setVerificationCode(event.target.value);
  };

  return (
    <Dialog
      open={props.open}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {props.content}
        </DialogContentText>
        {errorMessage && (
          <p style={{ color: "red", marginTop: "15px" }}>{errorMessage}</p>
        )}
        <TextField
          inputProps={{ maxLength: 4 }}
          style={{ marginTop: 10 }}
          id="standard-basic"
          label="輸入驗證碼"
          variant="standard"
          onChange={handleVerificationCodeOnChange}
        />
      </DialogContent>
      <DialogActions>
        <Button
          disabled={verificationCode.length === 4 ? false : true}
          autoFocus
          onClick={validateUsersVerificationCode}
        >
          驗證
        </Button>
      </DialogActions>
    </Dialog>
  );
}
