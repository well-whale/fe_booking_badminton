import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  Slide,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import "./NewUser.css";
import { newUser, register } from "../../services/UserServices";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const NewUser = ({ open, handleClose, refreshData }) => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    roleName: "Court Owner",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: !value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required.";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setApiError(""); // Reset API error message before submitting
    setSuccessMessage("");
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
    try {
      const response = await register(formData);
      setFormData(initialFormData);
      setSuccessMessage("User successfully added!");
      handleClose();
      refreshData();
    } catch (error) {
      
       console.log(error.response.data.messages)
        setApiError(`${error.response.data.messages}`);
      
    } finally {
      setSubmitting(false);
    };
  }
    else {
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form?")) {
      setFormData(initialFormData);
      setErrors({});
      setApiError("");
      setSuccessMessage("");
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className="new">
        <div className="newContainer">
          <div className="header">
            <h3>
              <PersonAddAlt1Icon style={{ fontSize: "70px" }} /> Add User Form
            </h3>
            <IconButton
              aria-label="close"
              onClick={handleClose}
              color="error"
              className="close-button"
            >
              <CloseIcon />
            </IconButton>
          </div>
          <form onSubmit={handleSubmit}>
            {apiError && (
              <div className="api-error" style={{ color: "red" }}>
                {apiError}
              </div>
            )}
            {successMessage && (
              <div className="success-message" style={{ color: "green" }}>
                {successMessage}
              </div>
            )}
            <div className="form-row">
              <div className="form-column">
                <TextField
                  id="firstName"
                  label="First Name*"
                  variant="outlined"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  id="lastName"
                  label="Last Name*"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  id="email"
                  label="Email*"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  margin="normal"
                />
              </div>
              <div className="form-column">
                <TextField
                  id="password"
                  label="Password*"
                  variant="outlined"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  id="phone"
                  label="Phone*"
                  variant="outlined"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  type="tel"
                  error={!!errors.phone}
                  helperText={errors.phone}
                  fullWidth
                  margin="normal"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel id="role-label">Role</InputLabel>
                  <Select
                    labelId="role-label"
                    id="roleName"
                    name="roleName"
                    label="Role*"
                    value={formData.roleName}
                    onChange={handleInputChange}
                    error={!!errors.roleName}
                  >
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"Court Owner"}>Court Owner</MenuItem>
                  </Select>
                </FormControl>
                <div className="form-buttons">
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    className="form-button"
                    disabled={submitting}
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    className="form-button"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default NewUser;
