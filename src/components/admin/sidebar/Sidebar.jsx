import React, { useState } from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person3Outlined as Person3OutlinedIcon,
  CreditCardOutlined as CreditCardOutlinedIcon,
  ManageAccountsOutlined as ManageAccountsOutlinedIcon,
  ExitToAppOutlined as ExitToAppOutlinedIcon,
  DiamondOutlined as DiamondOutlinedIcon,
  CalendarMonthOutlined as CalendarMonthOutlinedIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  ManageAccounts as ManageAccountsIcon,
  SwitchAccount as SwitchAccountIcon,
  People as PeopleIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { PiCourtBasketballFill } from "react-icons/pi";
import TimerSharpIcon from "@mui/icons-material/TimerSharp";
import CreditScoreSharpIcon from "@mui/icons-material/CreditScoreSharp";
import CreditCardOffSharpIcon from "@mui/icons-material/CreditCardOffSharp";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../../router/routes";
import { logout, selectUser } from "../../../redux/userSlice";
import logo from "../../../img/Remove-bg.ai_1716950971549.png";
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

import "./Sidebar.css";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser).user;

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate(routes.login);
  };

  const [openAccounts, setOpenAccounts] = useState(false);
  const [openCourts, setOpenCourts] = useState(false);

  const handleAccountClick = () => {
    setOpenAccounts(!openAccounts);
  };

  const handleCourtClick = () => {
    setOpenCourts(!openCourts);
  };

  return (
    <Box className="sidebar" sx={{ width: 250 }}>
      <img src={logo} sx={{ width: 250 }} alt="BadmintonHub Logo" />

      <Box className="top" sx={{ p: 2, textAlign: "center" }}>
        <Link
          to="/admin/home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="h6">BadmintonHub</Typography>
          <Typography variant="subtitle1">
            Admin {user.firstName} {user.lastName}
          </Typography>
        </Link>
      </Box>
      <Divider />
      <List className="bottom">
        <Typography variant="overline" display="block" gutterBottom>
          Main
        </Typography>
        <NavLink
          to="/admin/home"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button sx={{ pl: 4 }}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </NavLink>
        <Typography variant="overline" display="block" gutterBottom>
          Account
        </Typography>
        {/* <ListItemButton onClick={handleAccountClick}>
          <ListItemIcon>
            <SwitchAccountIcon />
          </ListItemIcon>
          <ListItemText primary="Account" />
          {openAccounts ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openAccounts} timeout="auto" unmountOnExit>
          <List component="div" disablePadding> */}
        <NavLink
          to="/admin/listAdmin"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button sx={{ pl: 4 }}>
            <ListItemIcon>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Admin" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/admin/listOwners"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button sx={{ pl: 4 }}>
            <ListItemIcon>
              <ManageAccountsIcon />
            </ListItemIcon>
            <ListItemText primary="Court Owner" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/admin/listStaff"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button sx={{ pl: 4 }}>
            <ListItemIcon>
              <RecordVoiceOverIcon />
            </ListItemIcon>
            <ListItemText primary="Staff" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/admin/listUsers"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button sx={{ pl: 4 }}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Customer" />
          </ListItem>
        </NavLink>
        {/* </List>
        </Collapse> */}
        <Typography variant="overline" display="block" gutterBottom>
          Court
        </Typography>

        {/* <ListItemButton onClick={handleCourtClick}>
          <ListItemIcon>
            <CreditCardOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Court" />
          {openCourts ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openCourts} timeout="auto" unmountOnExit>
          <List component="div" disablePadding> */}
        <NavLink
          to="/admin/listCourtActive"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button sx={{ pl: 4 }}>
            <ListItemIcon>
              <CreditScoreSharpIcon />
            </ListItemIcon>
            <ListItemText primary="Court Active" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/admin/listCourtPending"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button sx={{ pl: 4 }}>
            <ListItemIcon>
              <TimerSharpIcon />
            </ListItemIcon>
            <ListItemText primary="Court Pendding" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/admin/listCourtPause"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button sx={{ pl: 4 }}>
            <ListItemIcon>
              <CreditCardOffSharpIcon />
            </ListItemIcon>
            <ListItemText primary="Court Close" />
          </ListItem>
        </NavLink>
        {/* </List>
        </Collapse> */}

        {/* <Typography variant="overline" display="block" gutterBottom>Booked</Typography>
        <NavLink to="/orders" className={({ isActive }) => (isActive ? "active" : "")}>
          <ListItem button>
            <ListItemIcon>
              <CreditCardOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => (isActive ? "active" : "")}>
          <ListItem button>
            <ListItemIcon>
              <CalendarMonthOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
        </NavLink> */}

        <Typography variant="overline" display="block" gutterBottom>
          User Interface
        </Typography>
        <NavLink
          to="/admin/Profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <ManageAccountsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </NavLink>
        {/* <NavLink to="/helper" className={({ isActive }) => (isActive ? "active" : "")}>
          <ListItem button>
            <ListItemIcon>
              <DiamondOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Helper" />
          </ListItem>
        </NavLink> */}
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
