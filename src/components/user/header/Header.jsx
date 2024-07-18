import React, { useEffect, useState } from 'react';
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
import { getInfoUser } from '../../../services/UserServices';

const Header = () => {
    const user = useSelector(selectUser)?.user;
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userInfor, setUserInfor] = useState(null);

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
        fetchUserInfo();
    };

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUserInfor(null); // Clear user info on logout
        refreshData();
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
                    <li className="link"><NavLink to="/">Trang chủ</NavLink></li>
                    <li className="link"><NavLink to="/search">Tìm kiếm</NavLink></li>
                    {userInfor && (
                        <>
                            {userInfor.role.roleID === 4 ? (
                                <li className="link"><NavLink to="/staff/home">Staff quản lí</NavLink></li>
                            ) : userInfor.role.roleID === 2 ? (
                                <li className="link"><NavLink to="/admin/home">Admin quản lí</NavLink></li>
                            ) : userInfor.role.roleID === 3 ? (
                                <li className="link"><NavLink to="/ownerCourt/home">Chủ sân quản lí</NavLink></li>
                            ) : (
                                <li className="link"><NavLink to="/booked">Lịch sử đặt</NavLink></li>
                            )}
                        </>
                    )}
                    <li className="nav-item dropdown">
                        <span className="nav-link dropdown-toggle" role="button" onClick={toggleDropdown}>
                            <AccountCircleIcon /> 
                        </span>
                        {showDropdown && (
                            <ul className="dropdown-menu">
                                {!userInfor ? (
                                    <li className="link">
                                        <NavLink to="/login">Đăng nhập</NavLink>
                                    </li>
                                ) : (
                                    <>
                                        <li className="dropdown-item profile-info">
                                            <strong>{userInfor.firstName} {userInfor.lastName}</strong>
                                            <br />
                                            <small>{userInfor.phone}</small>
                                            <br />
                                            <small>{userInfor.email}</small>
                                        </li>
                                        <li className="dropdown-item">
                                            <span className="edit-profile-button" onClick={handleDialogOpen} style={{ cursor: 'pointer' }}>Chỉnh sửa thông tin</span>
                                        </li>
                                        <li className="dropdown-item">
                                            <span className="logout-button" onClick={handleLogout} style={{ cursor: 'pointer' }}>Đăng xuất</span>
                                        </li>
                                    </>
                                )}
                            </ul>
                        )}
                    </li>
                </ul>
            </nav>
            <UpdateProfile open={isDialogOpen} handleClose={handleDialogClose} user={userInfor} refreshData={refreshData} />
        </div>
    );
};

export default Header;
