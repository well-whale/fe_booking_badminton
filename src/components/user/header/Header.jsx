import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "../header/Header.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../../img/Remove-bg.ai_1716950971549.png";
import UpdateProfile from '../../../pages/update/UpdateProfile'; // Adjust the import path
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, logout } from '../../../redux/userSlice';
import { routes } from '../../../router/routes';

const Header = () => {
    const user = useSelector(selectUser).user;
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleDialogOpen = () => {
        setIsDialogOpen(true);
        setShowDropdown(false); // Close the dropdown when the dialog opens
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
    };

    const refreshData = () => {
        // Refresh user data logic here
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate(routes.login);
    };

    return (
        <div className='Header'>
            <nav>
                <div className="nav__logo">
                    <img src={logo} alt="BadmintonHub Logo" />
                    <span className="nav__logo-text">BadmintonHub</span>
                </div>
                <ul className="nav__links">
                    <li className="link"><NavLink to="/">Home</NavLink></li>
                    <li className="link"><NavLink to="/search">Book</NavLink></li>
                    <li className="link"><NavLink to="/admin/home">Your Booked</NavLink></li>
                    <li className="nav-item dropdown">
                        <span className="nav-link dropdown-toggle" role="button" onClick={toggleDropdown}>
                            <AccountCircleIcon/> My account
                        </span>
                        {showDropdown && (
                            <ul className="dropdown-menu">
                                {(!user || !user.role.roleName) ? (
                                    <li className="link">
                                        <NavLink to="/login">LogIn</NavLink>
                                    </li>
                                ) : (
                                    <>
                                        <li className="dropdown-item profile-info">
                                            <strong>{user.firstName} {user.lastName}</strong>
                                            <br />
                                            <small>{user.phone}</small>
                                            <br/>
                                            <small>{user.email}</small>
                                        </li>
                                        <li className="dropdown-item">
                                            <span className="edit-profile-button" onClick={handleDialogOpen} style={{ cursor: 'pointer' }}>Edit Profile</span>
                                        </li>
                                        <li className="dropdown-item">
                                            <span className="logout-button" onClick={handleLogout} style={{ cursor: 'pointer' }}>LogOut</span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
            <UpdateProfile open={isDialogOpen} handleClose={handleDialogClose} user={user} refreshData={refreshData} />
        </div>
    );
};

export default Header;
