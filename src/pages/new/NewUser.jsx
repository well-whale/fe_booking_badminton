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
  FormHelperText,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import "./NewUser.css";
import { newUser } from "../../services/UserServices";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const NewUser = ({ open, handleClose, refreshData }) => {
  const initialFormData = {
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    roleID: 1,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      roleID: e.target.value,
    });
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.userName) {
      newErrors.userName = "User Name is required";
    }
    if (!formData.firstName) {
      newErrors.firstName = "First Name is required";
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.roleID) {
      newErrors.roleID = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError(""); // Reset API error message before submitting
    try {
      console.log(formData);
      await newUser(formData);
      setFormData(initialFormData);
      handleClose();
      refreshData();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setApiError(error.response.data.message);
      } else {
        setApiError("An error occurred while adding the user.");
      }
    } finally {
      setSubmitting(false);
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
            <div className="form-row">
              <div className="form-column">
                <TextField
                  id="userName"
                  label="User Name*"
                  variant="outlined"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  error={!!errors.userName}
                  helperText={errors.userName}
                  fullWidth
                  margin="normal"
                />
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
                <FormControl fullWidth margin="normal" error={!!errors.roleID}>
                  <InputLabel id="role-select-label">Role</InputLabel>
                  <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={formData.roleID}
                    label="Role"
                    onChange={handleRoleChange}
                  >
                    <MenuItem value={2}>Admin</MenuItem>
                    <MenuItem value={3}>Owner Court</MenuItem>
                  </Select>
                  {errors.roleID && (
                    <FormHelperText>{errors.roleID}</FormHelperText>
                  )}
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
                    onClick={() => setFormData(initialFormData)}
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
