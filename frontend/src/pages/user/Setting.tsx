import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react";
import useFetch from "../../components/useFetch";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "../../components/Alert";
import RestrictedDialog from "../../components/RestrictedDialog";
import { useLocation, useNavigate } from "react-router-dom";

export interface BasicUserProps {
  id: number;
  name: string;
  email: string;
  lineId: string;
}

const ShowEmail = (props: { email: string | undefined }) => {
  const [openChangeEmail, setOpenChangeEmail] = useState(false);

  const [email, setEmail] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const originEmail = props.email;

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (props.email) {
      setEmail(props.email);
    }
  }, [props.email]);

  const changeEmail = () => {
    setIsLoading(true);

    if (email === originEmail) {
      setOpenChangeEmail(!openChangeEmail);
      setIsLoading(false);
      return;
    }

    const token = sessionStorage.getItem("token");

    if (token === null) {
      return <p>token不存在</p>;
    }

    fetch("http://localhost:8080/user/change_email", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newEmail: email,
      }),
    })
      .then(async (response) => {
        const text = await response.text();
        if (!response.ok) {
          Alert({
            title: response.status.toString(),
            text: text,
            icon: "error",
          })();
          throw new Error(text);
        }
        setIsDialogOpen(true);
      })
      .catch((error: Error) => console.error(error.message));
  };

  return (
    <>
      <Grid item xs={12}>
        <h3 className="text-white">Email</h3>
      </Grid>
      <Grid item xs={12}>
        <input
          type="email"
          value={email}
          disabled={!openChangeEmail}
          onChange={handleEmailChange}
        ></input>
        {!openChangeEmail && (
          <Button
            variant="contained"
            style={{ marginLeft: 5 }}
            onClick={() => setOpenChangeEmail(!openChangeEmail)}
            color="info"
            startIcon={<EditIcon fontSize="small" />}
          >
            編輯
          </Button>
        )}
        {openChangeEmail && (
          <Button
            variant="contained"
            style={{ marginLeft: 5 }}
            onClick={changeEmail}
            color="error"
            startIcon={<LockIcon fontSize="small" />}
            disabled={isLoading ? true : false}
          >
            {isLoading ? "變更中.." : "保存"}
          </Button>
        )}
      </Grid>
      <RestrictedDialog
        title="請輸入驗證碼"
        content="已將驗證碼傳入您的信箱中，請查閱"
        email={email}
        open={isDialogOpen}
        handleDialogClose={handleDialogClose}
        verifyUrl="http://localhost:8080/user/change_email/verify"
      />
    </>
  );
};

const Password = () => {
  const [password, setPassword] = useState<string>("");

  const [newPassword, setNewPassword] = useState<string>("");

  const [newCheckedPassword, setNewCheckedPassword] = useState<string>("");

  const handlePasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPassword(e.target.value);
    },
    []
  );
  const handleNewPasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewPassword(e.target.value);
    },
    []
  );
  const handleNewCheckedPasswordChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setNewCheckedPassword(e.target.value);
    },
    []
  );

  /*管理Dialog */
  const [open, setOpen] = useState(false);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <>
      <PasswordDialog
        open={open}
        onOpen={handleOpen}
        onClose={handleClose}
        password={password}
        newPassword={newPassword}
        newCheckedPassword={newCheckedPassword}
        handlePasswordChange={handlePasswordChange}
        handleNewPasswordChange={handleNewPasswordChange}
        handleNewCheckedPasswordChange={handleNewCheckedPasswordChange}
      />
      <Grid item xs={12} style={{ marginTop: "20px" }}>
        <h3 className="text-white">密碼</h3>
      </Grid>
      <Grid item xs={12} style={{ marginTop: "5px" }}>
        <Button variant="contained" color="error" onClick={handleOpen}>
          變更密碼
        </Button>
      </Grid>
    </>
  );
};

const LineLogin = (props: { lineId: string | undefined }) => {
  function connectLineLogin() {
    const url = "https://access.line.me/oauth2/v2.1/authorize?";
    const response_type = "response_type=code";
    const client_id = "client_id=2005712969";
    const redirect_uri =
      "redirect_uri=https://b106-180-176-67-45.ngrok-free.app/user/setting";
    const state = "state=login";
    const scope = "scope=openid";
    const loginUrl =
      url +
      response_type +
      "&" +
      client_id +
      "&" +
      redirect_uri +
      "&" +
      state +
      "&" +
      scope;
    window.location.href = loginUrl;
  }
  const location = useLocation();

  const navigate = useNavigate();

  const [isLineConnecting, setIsLineConnecting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    if (code === null) {
      return;
    }
    const token = sessionStorage.getItem("token");
    if (token === null) {
      alert("token不存在");
      return;
    }

    setIsLineConnecting(true);

    fetch("http://localhost:8080/user/line/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ code: code }),
    })
      .then(async (response) => {
        const message = await response.text();
        Alert({
          title: response.status.toString(),
          text: message,
          icon: "error",
        });
        navigate("/user/setting");
        window.location.reload();
      })
      .finally(() => {
        setIsLineConnecting(false);
      });
  }, [location.search]);

  if (isLineConnecting) {
    return <p>連結Line帳號中，請稍後</p>;
  }

  return (
    <>
      <Grid item xs={12} style={{ marginTop: "20px" }}>
        <h3 className="text-white">Line帳號</h3>
      </Grid>
      <Grid item xs={12} style={{ marginTop: "5px" }}>
        <Button
          variant="contained"
          color={props.lineId === null ? "inherit" : "success"}
          onClick={connectLineLogin}
        >
          {props.lineId === null ? "連結LineId" : "已連結LineId"}
        </Button>
      </Grid>
    </>
  );
};

export default function Setting() {
  const token = sessionStorage.getItem("token");

  if (token === null) {
    return <p>token不存在</p>;
  }

  const result = useFetch<BasicUserProps>(
    "http://localhost:8080/user/get",
    "POST",
    token
  );

  if (result.isLoading) {
    return <p>Loading...</p>;
  }

  if (result.error) {
    return <p>Error: {result.error}</p>;
  }

  return (
    <>
      <div>
        <Grid container>
          <Grid item>
            <h1 className="text-white">個人資訊</h1>
            <Grid item xs={12} style={{ margin: "25px 0px 25px 0px" }}>
              <h3 className="text-white">UID：{result.data?.id}</h3>
            </Grid>

            <ShowEmail email={result.data?.email} />
            <Grid item xs={12} style={{ marginTop: 5 }}></Grid>

            <Password />
            <LineLogin lineId={result.data?.lineId} />
          </Grid>
        </Grid>
      </div>
    </>
  );
}

interface PasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
  password: string;
  newPassword: string;
  newCheckedPassword: string;
  handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNewPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleNewCheckedPasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export const PasswordDialog = memo(
  ({
    open,
    onClose,
    onOpen,
    password,
    newPassword,
    newCheckedPassword,
    handlePasswordChange,
    handleNewPasswordChange,
    handleNewCheckedPasswordChange,
  }: PasswordDialogProps) => {
    const changePassword = () => {
      onClose();
      if (newPassword != newCheckedPassword) {
        Alert({
          title: "變更失敗",
          text: "新密碼與再次輸入的新密碼必須一致",
          icon: "error",
        })();
        return;
      }

      const token = sessionStorage.getItem("token");
      if (token === null) {
        Alert({ title: "變更失敗", text: "token不存在", icon: "error" })();
        return;
      }

      fetch("http://localhost:8080/user/change_password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: password,
          newPassword: newPassword,
        }),
      }).then(async (response) => {
        const text = await response.text();
        if (!response.ok) {
          Alert({ title: "變更失敗", text: text, icon: "error" })();
          throw new Error(text);
        }
        Alert({ title: "密碼已變更成功", text: text, icon: "success" })();
      });
    };

    return (
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          密碼修改
        </DialogTitle>
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
        <DialogContent dividers>
          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="請輸入舊密碼"
              variant="outlined"
              type="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </Typography>

          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="請輸入新密碼"
              variant="outlined"
              type="password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </Typography>
          <Typography gutterBottom>
            <TextField
              id="outlined-basic"
              label="請再次輸入新密碼"
              variant="outlined"
              type="password"
              value={newCheckedPassword}
              onChange={handleNewCheckedPasswordChange}
            />
          </Typography>
          <Typography gutterBottom>
            <Button
              variant="contained"
              size="large"
              style={{
                marginTop: 10,
                width: "100%",
              }}
              onClick={changePassword}
            >
              修改密碼
            </Button>
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    );
  }
);
