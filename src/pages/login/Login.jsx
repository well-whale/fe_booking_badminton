import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import SignupForm from "../signup/Signup";
import "../login/Login.css";
import GoogleOAuth from "./Google_OAuth";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import {loginUser, verifyToken} from  "../../services/UserServices";
import { loginFailure, loginSuccess } from "../../redux/userSlice";
import axios from "axios";
import { routes } from "../../router/routes";


function LoginForm() {
    const [userName, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isShowPassword, setIsShowPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!userName || !password) {
            toast.error("Both username and password fields are required.");
            return;
        }

        try {
            const response = await loginUser(userName, password);
            const verifyResponse = await verifyToken(response.data.result.token);
            console.log(verifyResponse.data)
            const user = response.data.result.response;
            const token = response.data.result.token;
            dispatch(loginSuccess({ user, token }));
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);

            if (user.role.roleID === 1 ) {
                navigate(routes.home);
            } else if (user.role.roleID === 2) {
                navigate(routes.adminHome);
            }else if (user.role.roleID === 3) {
                navigate(routes.ownerHome)
            }
        } catch (error) {
            dispatch(loginFailure(error.message));
            toast.error("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                {/* <div className="social-container">
                    <GoogleOAuthProvider clientId="21328047732-02qfv7vb9ku5n0ov51v8d3k8vqb7e1ab.apps.googleusercontent.com">
                        <GoogleOAuth />
                    </GoogleOAuthProvider>
                    <NavLink to="/loginotp">
                        <button className="logphone" type="button">Sign in with phone</button>
                    </NavLink>
                </div>
                <span>or use your account</span> */}
                <input
                    type="text"
                    placeholder="Username"
                    value={userName}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <div className="input-pass">
                    <input
                        type={isShowPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <i
                        className={isShowPassword ? "fa-solid fa-eye" : "fa-sharp fa-solid fa-eye-slash"}
                        onClick={() => setIsShowPassword(!isShowPassword)}
                    />
                </div>
                <a href="#">Forgot your password?</a>
                <button className="submit" type="submit">Login</button>
            </form>
            <ToastContainer />
        </div>
    );
}

function LoginAndSignupForm() {
    const [type, setType] = useState("signIn");

    const handleOnClick = text => {
        if (text !== type) {
            setType(text);
        }
    };

    const containerClass = `container ${type === "signUp" ? "right-panel-active" : ""}`;

    return (
        <div className="App">
            <div className={containerClass} id="container">
                <SignupForm />
                <LoginForm />
                <div className="overlay-container">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button className="ghost" id="signIn" onClick={() => handleOnClick("signIn")}>
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button className="ghost" id="signUp" onClick={() => handleOnClick("signUp")}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginAndSignupForm;
