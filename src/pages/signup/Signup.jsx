import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "../signup/Signup.css";
import { register } from "../../services/UserServices";

function SignupForm() {
  const [state, setState] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "Customer",
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  const handleChange = (evt) => {
    const { name, value } = evt.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!state.userName) newErrors.userName = true;
    if (!state.password) newErrors.password = true;
    if (!state.firstName) newErrors.firstName = true;
    if (!state.lastName) newErrors.lastName = true;
    if (!state.email) {
      newErrors.email = true;
    } else if (!/\S+@\S+\.\S+/.test(state.email)) {
      newErrors.email = true;
    }
    if (!state.phone) newErrors.phone = true;

    return newErrors;
  };

  const handleOnSubmit = async (evt) => {
    evt.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await register(state);
        if (response.status === 200) {
          setSnackbarSeverity("success");
          setSnackbarMessage("Registration successful!");
          setSnackbarOpen(true);
          // Reset state to clear the form
          setState({
            userName: "",
            password: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            // role:"Customer"
          });
          navigate("/login");
        } else {
          setSnackbarSeverity("error");
          setSnackbarMessage("Registration failed. Please try again.");
          setSnackbarOpen(true);
        }
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Registration failed. Please try again.");
        setSnackbarOpen(true);
        console.error("There was an error registering the user!", error);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container className="form-container sign-up-container">
      <ToastContainer />
      <form onSubmit={handleOnSubmit}>
        <h1 style={{ paddingBottom: "20px" }}>Đăng kí</h1>
        <div style={{ display: "flex", gap: "10px" }}>
          <div>
            {/* <Box mb={2}>
              <TextField
                fullWidth
                id="userName"
                name="userName"
                label="User Name*"
                value={state.userName}
                onChange={handleChange}
                error={Boolean(errors.userName)}
              />
            </Box> */}
            <Box mb={2}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email*"
                value={state.email}
                onChange={handleChange}
                error={Boolean(errors.email)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Mật khẩu*"
                type="password"
                value={state.password}
                onChange={handleChange}
                error={Boolean(errors.password)}
              />
            </Box>
            
            <Box mb={2}>
              <FormControl fullWidth mb={2}>
                <InputLabel id="role-label">Vai trò</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  label="Vai trò*"
                  value={state.role}
                  onChange={handleChange}
                >
                  <MenuItem value={"Customer"}>Customer</MenuItem>
                  <MenuItem value={"Court Owner"}>Court Owner</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>
          <div>
            <Box mb={2}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="Tên*"
                value={state.firstName}
                onChange={handleChange}
                error={Boolean(errors.firstName)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Họ*"
                value={state.lastName}
                onChange={handleChange}
                error={Boolean(errors.lastName)}
              />
            </Box>

            <Box mb={2}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Điện thoại*"
                value={state.phone}
                onChange={handleChange}
                error={Boolean(errors.phone)}
              />
            </Box>
          </div>
        </div>

        <button className="submit" type="submit">
          Tạo tài khoản
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

export default SignupForm;
