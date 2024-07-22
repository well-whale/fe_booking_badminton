import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  Slide,
  Autocomplete,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import "./NewUser.css";
import { addStaff, getAllCourtOfOwner, newUser } from "../../services/UserServices";
import { useNavigate } from "react-router-dom";
import { routes } from "../../router/routes";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const NewStaff = ({ open, handleClose, refreshData }) => {
  const initialFormData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    courtID: null,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();
  const [court, setCourt] = useState([]);
  const user = useSelector(selectUser).user;

  useEffect(() => {
    const fetchCourtData = async () => {
      try {
        const response = await getAllCourtOfOwner(user.userID);
        setCourt(response.data);
      } catch (error) {
        console.error("Error fetching court data:", error);
      }
    };
    fetchCourtData();
  }, [user.userID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    const newErrors = {};

   
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setApiError("");
    try {
      console.log(formData)
      await addStaff(formData);
      setFormData(initialFormData);
      handleClose();
      refreshData();
      navigate(routes.adminListStaff);
    } catch (error) {
      setApiError(
        error.response?.data?.message || "An error occurred while adding the user."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const options = court.map((option) => {
    const firstLetter = option.courtName ? option.courtName[0].toUpperCase() : "";
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  const handleCourtChange = (event, value) => {
    setFormData({
      ...formData,
      courtID: value ? value.courtID : null,
    });
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
              <PersonAddAlt1Icon style={{ fontSize: "70px" }} /> Add Staff Form
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
                <Autocomplete
                  id="grouped-demo"
                  options={options.sort(
                    (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
                  )}
                  groupBy={(option) => option.firstLetter}
                  getOptionLabel={(option) => option.courtName}
                  isOptionEqualToValue={(option, value) =>
                    option.courtID === value.courtID
                  }
                  onChange={handleCourtChange}
                  renderInput={(params) => (
                    <TextField {...params} label="CourtName" />
                  )}
                />
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

export default NewStaff;
