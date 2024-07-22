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
import ChecklistRtlIcon from '@mui/icons-material/ChecklistRtl';
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
          to=""
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="h6">BadmintonHub</Typography>
          <Typography variant="subtitle1">
            Staff
          </Typography>
        </Link>
      </Box>
      <Divider />
      <List className="bottom">
      
        <NavLink
          to="/staff/checkIn"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button >
            <ListItemIcon>
              <ChecklistRtlIcon />
            </ListItemIcon>
            <ListItemText primary="Check In" />
          </ListItem>
        </NavLink>
        
        <NavLink
          to="/staff/Profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <ManageAccountsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
        </NavLink>
       
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
