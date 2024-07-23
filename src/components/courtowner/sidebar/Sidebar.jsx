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
  IconButton,
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
  ExpandMore,
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
import logo from "../../../img/Remove-bg.ai_1716950971549.png";
import { ImProfile } from "react-icons/im";
import { IoIosLogOut } from "react-icons/io";

import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { IoPeopleOutline } from "react-icons/io5";

import "./Sidebar.css";
import NewUser from "../../../pages/new/NewUser";
import NewStaff from "../../../pages/new/NewStaff";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser).user;
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
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
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setDeleteId(null);
  };
  return (
    <Box className="sidebar" sx={{ width: 250 }}>
      <img src={logo} sx={{ width: 250 }} alt="BadmintonHub Logo" />

      <Box className="top" sx={{ p: 2, textAlign: "center" }}>
        <Link
          to="/ownerCourt/home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography variant="h6">BadmintonHub</Typography>
          <Typography variant="subtitle1">
            Owner
          </Typography>
        </Link>
      </Box>
      <Divider />
      <List className="bottom">
        <Typography variant="overline" display="block" gutterBottom>
          Main
        </Typography>
        <Link
          to="/ownerCourt/home"
          style={{ textDecoration: "none", color: "inherit" }}
        >
        <ListItem button>
          <ListItemIcon>
            <LuHome />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        </Link>
        <Typography variant="overline" display="block" gutterBottom>
          Court
        </Typography>
        
        <NavLink
          // to="/admin/listStaff"
          onClick={() => setDialogType("new") || setOpen(true)}

          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <IoPeopleOutline />
            </ListItemIcon>
            <ListItemText primary="New Staff" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/ownerCourt/newCourt"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <MdCreateNewFolder />
            </ListItemIcon>
            <ListItemText primary="New Court" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/ownerCourt/listCourtActive"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <PiCourtBasketballBold />
            </ListItemIcon>
            <ListItemText primary="Court Open" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/ownerCourt/listCourtPending"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <PiCourtBasketballBold />
            </ListItemIcon>
            <ListItemText primary="Court Pending" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/ownerCourt/listCourtPause"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <PiCourtBasketballBold />
            </ListItemIcon>
            <ListItemText primary="Court Close" />
          </ListItem>
        </NavLink>

        <Typography variant="overline" display="block" gutterBottom>
          Booked
        </Typography>
        <NavLink
          to="/ownerCourt/listOrderDay"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <MdOutlinePayment />
            </ListItemIcon>
            <ListItemText primary="Orders Day" />
          </ListItem>
        </NavLink>
        <NavLink
          to="/ownerCourt/listOrderRecurring"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <MdOutlinePayment />
            </ListItemIcon>
            <ListItemText primary="Orders Recurring" />
          </ListItem>
        </NavLink>
        {/* <NavLink
          to="/calendar"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <IoCalendarOutline />
            </ListItemIcon>
            <ListItemText primary="Calendar" />
          </ListItem>
        </NavLink> */}

        <Typography variant="overline" display="block" gutterBottom>
          User Interface
        </Typography>
        <NavLink
          to="/ownerCourt/Profile"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <ListItem button>
            <ListItemIcon>
              <ImProfile />
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
            <IoIosLogOut />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
      {dialogType === "new" && (
        <NewStaff
          open={open}
          handleClose={handleClose}
          // refreshData={fetchData}
        />
      )}
    </Box>
    
  );
};

export default Sidebar;
