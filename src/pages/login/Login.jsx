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
import { Box, TextField, Snackbar, Alert } from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import "../signup/Signup.css";

import { Container } from "@mui/system";
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleLogin = async (e) => {
    e.preventDefault();

    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await loginUser(email, password);
        const verifyResponse = await verifyToken(response.data.result.token);
        console.log(response.data);
        console.log(verifyResponse.data);
        if (verifyResponse.data.result.valid === true) {
          const user = response.data.result.userResponse;
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
        } else {
          setSnackbarSeverity("error");
          setSnackbarMessage(
            "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu!"
          );
          setSnackbarOpen(true);

        }
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu!"
        );
        setSnackbarOpen(true);
        dispatch(loginFailure(error.message));
      }
    } else {
      setErrors(newErrors);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!password) newErrors.password = "Password is required.";
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
    }
    return newErrors;
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container className="form-container sign-in-container">
      <form onSubmit={handleLogin}>
        <h1 style={{ paddingBottom: "20px" }}>Đăng nhập</h1>
        <Box mb={2}>
          <TextField
            fullWidth
            id="Email"
            name="Email"
            label="Email*"
            value={email}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
        </Box>
        <div className="input-pass">
          <Box mb={2}>
            <TextField
              fullWidth
              id="Password"
              name="Mật khẩu"
              label="Mật khẩu*"
              value={password}
              type={isShowPassword ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              error={Boolean(errors.password)}
              helperText={errors.password}
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
        <a href="#">Quên mật khẩu?</a>
        <button className="submit" type="submit">
          <LoginIcon />
        </button>
        
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>  
    </Container>
    
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
