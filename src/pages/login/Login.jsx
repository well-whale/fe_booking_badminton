import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignupForm from "../signup/Signup";
import "../login/Login.css";
import GoogleOAuth from "./Google_OAuth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loginUser, verifyToken } from "../../services/UserServices";
import { loginFailure, loginSuccess } from "../../redux/userSlice";
import axios from "axios";
import { routes } from "../../router/routes";
import Header from "../../components/user/header/Header";
import { Box, TextField } from "@mui/material";

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
      console.log(verifyResponse.data);
      const user = response.data.result.response;
      const token = response.data.result.token;
      dispatch(loginSuccess({ user, token }));
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      if (user.role.roleID === 1) {
        navigate(routes.home);
      } else if (user.role.roleID === 2) {
        navigate(routes.adminHome);
      } else if (user.role.roleID === 3) {
        navigate(routes.ownerHome);
      } else if (user.role.roleID === 4) {
        navigate(routes.staffHome);
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleLogin}>
        <h1>Đăng nhập</h1>
        <Box mb={2}>
          <TextField
            fullWidth
            id="Username"
            name="Username"
            label="User Name*"
            value={userName}
            onChange={(e) => setUsername(e.target.value)}
            // error={Boolean(errors.userName)}
          />
        </Box>
        <div className="input-pass">
        <Box mb={2}>
          <TextField
            fullWidth
            id="Password"
            name="Password"
            label="Password*"
            value={password}
            type={isShowPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            // error={Boolean(errors.userName)}
          />
        </Box>
          <i
            className={
              isShowPassword
                ? "fa-solid fa-eye"
                : "fa-sharp fa-solid fa-eye-slash"
            }
            onClick={() => setIsShowPassword(!isShowPassword)}
          />
        </div>
        <a href="#">Forgot your password?</a>
        <button className="submit" type="submit">
          Login
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

function LoginAndSignupForm() {
  const [type, setType] = useState("signIn");

  const handleOnClick = (text) => {
    if (text !== type) {
      setType(text);
    }
  };

  const containerClass = `container ${
    type === "signUp" ? "right-panel-active" : ""
  }`;

  return (
    <div>
      <Header />

      <div className="App">
        <div className={containerClass} id="container">
          <SignupForm />
          <LoginForm />
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Chào mừng trở lại!</h1>
                <p>
                  Để duy trì kết nối với chúng tôi vui lòng đăng nhập bằng thông
                  tin cá nhân của bạn
                </p>
                <button
                  className="ghost"
                  id="signIn"
                  onClick={() => handleOnClick("signIn")}
                >
                  Đăng Nhập
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Xin chào!</h1>
                <p>
                  Nhập thông tin cá nhân của bạn và bắt đầu cuộc hành trình của
                  bạn với chúng tôi
                </p>
                <button
                  className="ghost"
                  id="signUp"
                  onClick={() => handleOnClick("signUp")}
                >
                  Đăng Kí
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginAndSignupForm;
