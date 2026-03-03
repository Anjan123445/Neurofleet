import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MapIcon from "@mui/icons-material/Map";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { useState } from "react";

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const roleMenus = {
    customer: [
      { text: "Dashboard", icon: <DashboardIcon />, path: "/customer" }
    ],
    driver: [
      { text: "Trips", icon: <MapIcon />, path: "/driver" }
    ],
    fleet_manager: [
      { text: "Fleet", icon: <DirectionsCarIcon />, path: "/fleet" }
    ]
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* 🔵 Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : 70,
          flexShrink: 0,
          transition: "0.3s",
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 70,
            transition: "0.3s",
            background:
              "linear-gradient(180deg,#0f172a,#1e293b)",
            color: "white",
            overflowX: "hidden",
            borderRight: "1px solid #1e293b"
          }
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <IconButton
            onClick={() => setOpen(!open)}
            sx={{ color: "#f97316" }}
          >
            <MenuIcon />
          </IconButton>

          {open && (
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#f97316" }}
            >
              FleetFlow
            </Typography>
          )}
        </Toolbar>

        <Divider sx={{ backgroundColor: "#334155" }} />

        <List>
          {roleMenus[profile?.role]?.map((item) => {
            const active =
              location.pathname === item.path;

            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                sx={{
                  backgroundColor: active
                    ? "rgba(249,115,22,0.15)"
                    : "transparent",
                  "&:hover": {
                    backgroundColor:
                      "rgba(249,115,22,0.25)"
                  },
                  transition: "0.2s"
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active
                      ? "#f97316"
                      : "#cbd5e1"
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {open && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      color: active
                        ? "#f97316"
                        : "#e2e8f0"
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>

        <Divider
          sx={{ backgroundColor: "#334155", mt: "auto" }}
        />

        <List>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              "&:hover": {
                backgroundColor:
                  "rgba(249,115,22,0.25)"
              }
            }}
          >
            <ListItemIcon sx={{ color: "#f97316" }}>
              <LogoutIcon />
            </ListItemIcon>

            {open && (
              <ListItemText
                primary="Logout"
                sx={{ color: "#f97316" }}
              />
            )}
          </ListItemButton>
        </List>
      </Drawer>

      {/* 🔵 Main Content Area */}
      <Box
        sx={{
          flexGrow: 1,
          background:
            "linear-gradient(135deg,#0b1120,#0f172a)"
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: "#111827",
            borderBottom:
              "2px solid rgba(249,115,22,0.4)"
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{ color: "#f97316" }}
            >
              {profile?.role?.toUpperCase()} PANEL
            </Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: 4 }}>{children}</Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;