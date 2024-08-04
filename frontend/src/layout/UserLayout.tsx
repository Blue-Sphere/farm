import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import LogoutIcon from "@mui/icons-material/Logout";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";

import BackGround from "/src/assets/img/background/UserLayOut.jpg";
import useFetch from "../components/useFetch";
import { BasicUserProps } from "../pages/user/Setting";
import { memo, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  styled,
} from "@mui/material";
import { Col, Row } from "react-bootstrap";
import { JwtPayload, jwtDecode } from "jwt-decode";
import Alert from "../components/Alert";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function UserLayOut(props: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    if (token === null) {
      console.error("token不存在");
      return;
    }
    const email = jwtDecode(token).sub;

    fetch(`http://localhost:8080/admin/exists?email=${email}`, {
      method: "GET",
    }).then(async (response) => {
      const result: boolean = await response.json();

      if (result) {
        setIsAdmin(true);
      }
    });
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const checkAdminToken = () => {
    const adminToken = sessionStorage.getItem("admin_token");

    if (adminToken !== null) {
      fetch("http://localhost:8080/admin/validate_token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      }).then(async (response) => {
        if (!response.ok) {
          const message = await response.text();
          sessionStorage.removeItem("admin_token");
          setDialogOpen(true);
          throw new Error(message);
        } else {
          navigate("/admin/assets_management");
        }
      });
    } else {
      setDialogOpen(true);
    }
  };

  const menu = [
    {
      label: "商品",
      value: "shop",
      icon: <StorefrontIcon />,
    },
    {
      label: "購物車",
      value: "cart",
      icon: <LocalGroceryStoreIcon />,
    },
    {
      label: "訂單查詢",
      value: "order",
      icon: <ChecklistOutlinedIcon />,
    },
    {
      label: "個人資訊",
      value: "setting",
      icon: <ContactMailIcon />,
    },
  ];
  const drawer = (isAdmin: boolean) => {
    return (
      <div
        className="bg-dark text-light"
        style={{ height: "100%", margin: "0px", padding: "0px" }}
      >
        <Divider />
        <List style={{ marginTop: 35 }}>
          {menu.map((object) => (
            <ListItem
              key={object.label}
              disablePadding
              style={{ marginTop: 13 }}
            >
              <Link
                to={object.value}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <ListItemButton>
                  <ListItemIcon className="text-primary">
                    {object.icon}
                  </ListItemIcon>
                  <ListItemText primary={object.label} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <List>
          <ListItem
            disablePadding
            onClick={() => {
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("admin_token");
              navigate("/login");
            }}
          >
            <ListItemButton>
              <ListItemIcon>
                {
                  <LogoutIcon
                    style={{
                      color: "#53FF53",
                    }}
                  />
                }
              </ListItemIcon>
              <ListItemText primary={"登出"} />
            </ListItemButton>
          </ListItem>
        </List>

        {isAdmin && (
          <List>
            <ListItem disablePadding onClick={checkAdminToken}>
              <ListItemButton>
                <ListItemIcon>
                  {
                    <ManageAccountsIcon
                      style={{
                        color: "#29e2f3",
                      }}
                    />
                  }
                </ListItemIcon>
                <ListItemText primary={"切換為管理者模式"} />
              </ListItemButton>
            </ListItem>
          </List>
        )}
      </div>
    );
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const token = sessionStorage.getItem("token");

  if (token === null) {
    return <p>無效的token</p>;
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
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "left",
        background: `url(${BackGround})`,
        backgroundSize: "cover", // 背景图片覆盖整个容器
        backgroundPosition: "center", // 背景图片居中
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
        style={{ background: "gray" }}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            mr: 2,
            display: { sm: "none", sx: "flex" },
            alignItems: { sx: "left" },
            marginLeft: "2px",
            width: "50px",
          }}
        >
          <MenuIcon />
        </IconButton>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer(isAdmin)}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer(isAdmin)}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Typography paragraph sx={{ marginTop: { xs: 5, sm: 0 } }}>
          <Outlet />
        </Typography>
      </Box>
      <AdminLoginDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onOpen={() => setDialogOpen(true)}
      />
    </Box>
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

interface AdminLoginDiaLogProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const AdminLoginDialog = memo((props: AdminLoginDiaLogProps) => {
  const [password, setPassword] = useState("");

  const navigator = useNavigate();

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const getEmailFromToken = (token: string) => {
    try {
      const decode = jwtDecode(token);
      return decode.sub;
    } catch (error) {
      console.error("不被接受的token");
      return null;
    }
  };

  const handleAdminLogin = () => {
    const token = sessionStorage.getItem("token");

    console.log(token);

    if (token === null) {
      return "不存在的token";
    }

    fetch("http://localhost:8080/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: getEmailFromToken(token),
        password: password,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const message = await response.text();
          Alert({
            title: response.status.toString(),
            text: message,
            icon: "error",
          })();
          throw new Error(message);
        }
        return response;
      })
      .then(async (data) => {
        sessionStorage.setItem("admin_token", await data.text());
        navigator("/admin/assets_management");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        props.onClose();
      });
  };

  return (
    <BootstrapDialog
      onClose={props.onClose}
      aria-labelledby="customized-dialog-title"
      open={props.open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        管理者登入
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
        <Row style={{ margin: "10px 10px 0px 10px" }}>
          <Col xs={12}>
            <TextField
              type="password"
              sx={{ width: "100%" }}
              label="管理者密碼"
              value={password}
              onChange={handlePasswordChange}
            />
          </Col>
        </Row>

        <Row
          style={{
            margin: "10px 10px 10px 10px",
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
              onClick={handleAdminLogin}
            >
              登入
            </Button>
          </Col>
        </Row>
      </DialogContent>
    </BootstrapDialog>
  );
});
