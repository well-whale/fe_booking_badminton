import React, { useEffect, useState } from "react";
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
import { getInfoUser } from "../../../services/UserServices";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser).user;
  const [userInfor, setUserInfor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchUserInfo = async () => {
    if (user && user.userID) {
      try {
        const res = await getInfoUser(user.userID);
        if (res.status === 200) {
          setUserInfor(res.data.result);
        } else {
          setError("Failed to fetch user information");
        }
      } catch (err) {
        setError("An error occurred while fetching user information");
      } finally {
        setLoading(false);
      }
    }
  };
  
  useEffect(() => {
    fetchUserInfo();
  }, [user?.userID]);
  console.log(userInfor)
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
            Admin 
          </Typography>
        </Link>
      </Box>
      <Divider />
      <List className="bottom">
        <Typography variant="overline" display="block" gutterBottom>
          Trang Chủ
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
          Tài Khoản
        </Typography>
   
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
            <ListItemText primary="Chủ Sân" />
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
            <ListItemText primary="Nhân Viên" />
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
            <ListItemText primary="Khách Hàng" />
          </ListItem>
        </NavLink>
     
        <Typography variant="overline" display="block" gutterBottom>
          Sân 
        </Typography>

   
        <NavLink
          to="/admin/listCourtActive"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button sx={{ pl: 4 }}>
            <ListItemIcon>
              <CreditScoreSharpIcon />
            </ListItemIcon>
            <ListItemText primary="Sân Hoạt Động" />
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
            <ListItemText primary="Sân Chờ Duyệt" />
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
            <ListItemText primary="Sân Tạm Ngưng" />
          </ListItem>
        </NavLink>
       

        <Typography variant="overline" display="block" gutterBottom>
          Thông Tin
        </Typography>
        <NavLink
          to="/admin/Profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <ManageAccountsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Hồ Sơ" />
          </ListItem>
        </NavLink>
       
        <ListItem button onClick={handleLogout}>
          <ListItemIcon>
            <ExitToAppOutlinedIcon />
          </ListItemIcon>
          <ListItemText primary="Đăng Xuất" />
        </ListItem>
      </List>
    </Box>
  );
};

export default Sidebar;
