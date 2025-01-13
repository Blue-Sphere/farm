import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";

import ChecklistOutlinedIcon from "@mui/icons-material/ChecklistOutlined";
import InventoryIcon from "@mui/icons-material/Inventory";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import MenuIcon from "@mui/icons-material/Menu";
import PaidIcon from "@mui/icons-material/Paid";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import Typography from "@mui/material/Typography";
import { Link, Outlet, useNavigate } from "react-router-dom";

import { useState } from "react";
import useFetch from "../components/useFetch";
import { BasicUserProps } from "../pages/user/Setting";
import BackGround from "/src/assets/img/background/UserLayOut.jpg";

const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function AdminLayOut(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

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

  const menu = [
    {
      label: "財務管理",
      value: "assets_management",
      icon: <PaidIcon />,
    },
    {
      label: "物品管理",
      value: "supplies_management",
      icon: <PlumbingIcon />,
    },
    {
      label: "商品管理",
      value: "product_management",
      icon: <InventoryIcon />,
    },
    {
      label: "訂單管理",
      value: "order_management",
      icon: <ChecklistOutlinedIcon />,
    },
    {
      label: "使用者管理",
      value: "user_management",
      icon: <PeopleAltIcon />,
    },
  ];
  const drawer = (isAdmin: boolean) => {
    return (
      <>
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
              <ListItem
                disablePadding
                onClick={() => {
                  navigate("/user/shop");
                }}
              >
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
                  <ListItemText primary={"切換為使用者模式"} />
                </ListItemButton>
              </ListItem>
            </List>
          )}
        </div>
      </>
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
          {drawer(result.data !== null)}
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
          {drawer(result.data !== null)}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          height: "100vh",
          overflow: "auto",
        }}
      >
        <Typography paragraph sx={{ marginTop: { xs: 5, sm: 0 } }}>
          <Outlet />
        </Typography>
      </Box>
    </Box>
  );
}
