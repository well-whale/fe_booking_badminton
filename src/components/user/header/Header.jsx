import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "../header/Header.css";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink } from "react-router-dom";
import logo from "../../../img/Remove-bg.ai_1716950971549.png";
import UpdateProfile from '../../../pages/update/UpdateProfile'; // Adjust the import path

const Header = () => {
    // Uncomment the following line to use actual user data from Redux
    // const user = useSelector(selectUser);
    
    // Fake user data for testing
    const user = {
        id: 1, // Add an ID for testing
        userName: 'johndoe', // Add a username for testing
        role: 'user', // or null for guest user
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        email: 'john.doe@example.com'
    };

    const [showDropdown, setShowDropdown] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                                {(!user || !user.role) ? (
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
                                            <NavLink className="logout-button" to="/">LogOut</NavLink>
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
