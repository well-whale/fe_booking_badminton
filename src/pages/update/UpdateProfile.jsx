import React, { useState, useEffect } from "react";
import { TextField, Button, Dialog, Slide, Select, MenuItem, InputLabel, FormControl, IconButton,FormHelperText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import { updateByUserID } from "../../services/UserServices";
import "./UpdateUser.css";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const UpdateProfile = ({ open, handleClose, user, refreshData }) => {
  const [formData, setFormData] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        password: "",
        phone: user.phone || "",
        role: user.role || "",
      });
    }
  }, [user]);

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
      role: e.target.value,
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
    if (!formData.role) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setApiError("");
    
    try {
      await updateByUserID(user.id, formData);
      refreshData();
      handleClose();
    } catch (error) {
      setApiError(
        error.response?.data?.message || "An error occurred while updating the user."
      );
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
      <div className="update">
        <div className="updateContainer">
          <div className="header">
            <h3><EditIcon style={{ fontSize: "70px" }} /> Update Profile Form</h3>
            <IconButton aria-label="close" onClick={handleClose} color="error" className="close-button">
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
                
              </div>
              <div className="form-column">
              <TextField
                  id="email"
                  label="Email*"
                  variant="outlined"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  type="email"
                  fullWidth
                  margin="normal"
                />
                <TextField
                  id="password"
                  label="Password"
                  variant="outlined"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
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
                  error={!!errors.phone}
                  helperText={errors.phone}
                  type="tel"
                  fullWidth
                  margin="normal"
                />
                
              </div>
            </div>
            <div className="form-buttons">
              <Button
                type="submit"
                variant="contained"
                color="warning"
                className="form-button"
                disabled={submitting}
              >
                Update
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default UpdateProfile;
