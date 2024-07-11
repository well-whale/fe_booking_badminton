import React, { useState } from "react";
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  IconButton
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  PersonOutline as PersonOutlineIcon,
  CreditCardOutlined as CreditCardOutlinedIcon,
  ManageAccountsOutlined as ManageAccountsOutlinedIcon,
  ExitToAppOutlined as ExitToAppOutlinedIcon,
  DiamondOutlined as DiamondOutlinedIcon,
  CalendarMonthOutlined as CalendarMonthOutlinedIcon,
  ExpandLess,
  ExpandMore
} from "@mui/icons-material";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { routes } from "../../../router/routes";
import { logout, selectUser } from "../../../redux/userSlice";
import { PiCourtBasketballBold } from "react-icons/pi";
import { LuHome } from "react-icons/lu";
import { GrMoney } from "react-icons/gr";
import { MdCreateNewFolder } from "react-icons/md";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SwitchAccountIcon from "@mui/icons-material/SwitchAccount";
import PeopleIcon from "@mui/icons-material/People";
import { MdOutlinePayment } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";


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
      <Box className="top" sx={{ p: 2, textAlign: "center" }}>
        <Link to="/ownerCourt/home" style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h6">BadmintonHub</Typography>
          <Typography variant="subtitle1">Owner {user.firstName} {user.lastName}</Typography>
        </Link>
      </Box>
      <Divider />
      <List className="bottom">
        <Typography variant="overline" display="block" gutterBottom>Main</Typography>
       
          <ListItem  button>
            <ListItemIcon>
              
              <LuHome/>
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
      

        <Typography variant="overline" display="block" gutterBottom>Court</Typography>
        <NavLink to="/ownerCourt/newCourt" className={({ isActive }) => (isActive ? "active" : "")}>
          <ListItem button>
            <ListItemIcon>
              <MdCreateNewFolder />
            </ListItemIcon>
            <ListItemText primary="New Court" />
          </ListItem>
        </NavLink>
        <NavLink to="/ownerCourt/listCourtActive" className={({ isActive }) => (isActive ? "active" : "")}>
          <ListItem button >
            <ListItemIcon>
              <PiCourtBasketballBold />
            </ListItemIcon>
            <ListItemText primary="Court Open" />
          </ListItem>
        </NavLink>
        <NavLink to="/ownerCourt/listCourtPending" className={({ isActive }) => (isActive ? "active" : "")}>
          <ListItem button>
            <ListItemIcon>
              <PiCourtBasketballBold />
            </ListItemIcon>
            <ListItemText primary="Court Pending" />
          </ListItem>
        </NavLink>
        <NavLink to="/ownerCourt/listCourtPause" className={({ isActive }) => (isActive ? "active" : "")}>
          <ListItem button>
            <ListItemIcon>
              <PiCourtBasketballBold />
            </ListItemIcon>
            <ListItemText primary="Court Close" />
          </ListItem>
        </NavLink>

        <Typography variant="overline" display="block" gutterBottom>Booked</Typography>
        <NavLink to="/ownerCourt/listOrder" className={({ isActive }) => (isActive ? "active" : "")}>
          <ListItem button>
            <ListItemIcon>
              <MdOutlinePayment />
            </ListItemIcon>
            <ListItemText primary="Orders" />
          </ListItem>
        </NavLink>
        <NavLink to="/calendar" className={({ isActive }) => (isActive ? "active" : "")}>
          <ListItem button>
            <ListItemIcon>
              <IoCalendarOutline />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
        </NavLink>

        <Typography variant="overline" display="block" gutterBottom>User Interface</Typography>
        <NavLink to="/ownerCourt/Profile" className={({ isActive }) => (isActive ? "active" : "")}>
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
