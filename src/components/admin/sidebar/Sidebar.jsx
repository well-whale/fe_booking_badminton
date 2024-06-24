import React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Person3OutlinedIcon from "@mui/icons-material/Person3Outlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import ManageAccountsOutlinedIcon from "@mui/icons-material/ManageAccountsOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import DiamondOutlinedIcon from "@mui/icons-material/DiamondOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useDispatch } from "react-redux";
import { routes } from "../../../router/routes";
import { logout } from "../../../redux/userSlice";

const Sidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate(routes.login);
    };

    return (
        <div className="sidebar">
            <div className="top">
                <Link to="/aa" style={{ textDecoration: "none" }}>
                    <span className="logo">BadmintonHub</span>
                </Link>
            </div>
            <hr />
            <div className="bottom">
                <ul>
                    <p className="title">MAIN</p>
                    <NavLink to="/admin/home" className={({ isActive }) => isActive ? "active" : ""}>
                        <li>
                            <DashboardIcon className="icon" />
                            <span>Dashboard</span>
                        </li>
                    </NavLink>

                    <p className="title">LISTS</p>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? "active" : ""}>
                        <li>
                            <Person3OutlinedIcon className="icon" />
                            <span>Users</span>
                        </li>
                    </NavLink>

                    <NavLink to="/admin/court" className={({ isActive }) => isActive ? "active" : ""}>
                        <li>
                            <BackupTableIcon className="icon" />
                            <span>Court</span>
                        </li>
                    </NavLink>

                    <p className="title">BOOKED</p>
                    <NavLink to="/orders" className={({ isActive }) => isActive ? "active" : ""}>
                        <li>
                            <CreditCardOutlinedIcon className="icon" />
                            <span>Orders</span>
                        </li>
                    </NavLink>

                    <NavLink to="/calendar" className={({ isActive }) => isActive ? "active" : ""}>
                        <li>
                            <CalendarMonthOutlinedIcon className="icon" />
                            <span>Calendar</span>
                        </li>
                    </NavLink>

                    <p className="title">USER INTERFACE</p>
                    <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>
                        <li>
                            <ManageAccountsOutlinedIcon className="icon" />
                            <span>Profile</span>
                        </li>
                    </NavLink>

                    <NavLink to="/helper" className={({ isActive }) => isActive ? "active" : ""}>
                        <li>
                            <DiamondOutlinedIcon className="icon" />
                            <span>Helper</span>
                        </li>
                    </NavLink>

                    <li onClick={handleLogout} style={{ cursor: "pointer" }}>
                        <ExitToAppOutlinedIcon className="icon" />
                        <span>Logout</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
