import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import "../header/Header.css"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink } from "react-router-dom";
import logo from "../../../img/Remove-bg.ai_1716950971549.png";

const Header = () => {
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
                        <span className="nav-link dropdown-toggle" role="button"><AccountCircleIcon/>  My account</span>
                        <ul className="dropdown-menu">
                            <li className="link"><NavLink to="/login">LogIn</NavLink></li>
                            <li className="link"><NavLink to="/">LogOut</NavLink></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Header;
