import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import "./tailwindcss-colors.css";
import "./Payment.css";
import { getCourtByIdCourt, getSubCourtByIdCourt, payment } from "../../services/UserServices";
import VNPAGE from "../../img/VNPAGE.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import VND from "../../components/price/PriceFormat";

const PaymentMonthPage = () => {
  const user = useSelector(selectUser)?.user;
  const [loadingUser, setLoadingUser] = useState(true);
  const [orderDetail, setOrderDetail] = useState({
    firstname: "",
    lastName: "",
    email: "",
    phone: "",
    customerId: 1,
    bookingType: "1",
    bookingDetails: [],
    selectedCourts: [],
    paymentMethod: "method-1", // Default payment method
    totalPrice: "", // Update this with your logic
  });

  useEffect(() => {
    if (user) {
      setOrderDetail((prevState) => ({
        ...prevState,
        firstname: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        customerId: user.userID,
      }));
      setLoadingUser(false);
    }
  }, [user]);

  useEffect(() => {
    const storedDetails = localStorage.getItem("bookingDetails");
    if (storedDetails) {
      const parsedDetails = JSON.parse(storedDetails);
      setOrderDetail((prevState) => ({
        ...prevState,
        ...parsedDetails,
        selectedCourts: parsedDetails.selectedCourts || [],
        endTime: parsedDetails.selectedCourts?.[0]?.endTime || "",
        courtId: parsedDetails.courtId || "",
        listDayOfWeek: parsedDetails.dayOfWeek || [],
        startTime: parsedDetails.selectedCourts?.[0]?.startTime || "",
      }));
    }
  }, []);

  const [court, setCourt] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  const getDetailCourt = async () => {
    try {
      const res = await getCourtByIdCourt(orderDetail.courtId);
      if (res.status === 200) {
        setCourt(res.data);
      } else {
        setError("Failed to fetch court details");
      }
    } catch (err) {
      setError("An error occurred while fetching court details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderDetail.courtId) {
      getDetailCourt();
    }
  }, [orderDetail.courtId]);

  const [subCourtNames, setSubCourtNames] = useState([]);

  const fetchSubCourtNames = async () => {
    setLoading(true);
    try {
      const subCourtPromises = orderDetail.selectedCourts.map(async (court) => {
        const res = await getSubCourtByIdCourt(court.subCourtID);
        if (res.status === 200) {
          return res.data.subCourtName;
        } else {
          throw new Error("Failed to fetch sub-court details");
        }
      });

      const names = await Promise.all(subCourtPromises);
      setSubCourtNames(names);
    } catch (err) {
      setError("An error occurred while fetching sub-court details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderDetail.selectedCourts.length > 0) {
      fetchSubCourtNames();
    }
  }, [orderDetail.selectedCourts]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setOrderDetail({ ...orderDetail, [id]: value });
  };

  const handlePaymentMethodChange = (e) => {
    setOrderDetail({ ...orderDetail, paymentMethod: e.target.value });
  };

  const dataToPrice = {
    courtId: orderDetail.courtId,
    endDate: orderDetail.endDate,
    startDate: orderDetail.startDate,
    startTime: orderDetail.startTime,
    endTime: orderDetail.endTime,
    listDayOfWeek: orderDetail.listDayOfWeek,
    listSubCourt: orderDetail.selectedCourts.map((court) => court.subCourtID),
  };

  const fetchTotalPrice = async () => {
    try {
      const response = await axios.post("http://localhost:8080/recure-booking/totalPrice", dataToPrice);
      if (response.status === 200 || response.status === 201) {
        setOrderDetail((prevState) => ({
          ...prevState,
          totalPrice: response.data,
        }));
      } else {
        console.error("Failed to fetch total price:", response.data);
      }
    } catch (error) {
      console.error("Error fetching total price:", error);
    }
  };

  useEffect(() => {
    fetchTotalPrice();
  }, [dataToPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSubmit = {
      courtId: orderDetail.courtId,
      userId: orderDetail.customerId,
      endDate: orderDetail.endDate,
      startDate: orderDetail.startDate,
      startTime: orderDetail.startTime,
      endTime: orderDetail.endTime,
      listDayOfWeek: orderDetail.listDayOfWeek,
      listSubCourt: orderDetail.selectedCourts.map((court) => court.subCourtID),
      firstName: orderDetail.firstname,
      lastName: orderDetail.lastName,
      email: orderDetail.email,
      phone: orderDetail.phone,
    };
    localStorage.setItem("bookingData", JSON.stringify(dataToSubmit));

    try {
      const res = await payment(orderDetail.totalPrice , orderDetail.customerId);
      window.location.href = res.data;
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate(`/booking/${orderDetail.courtID}`);
  };

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="container">
      <Box className="payment-wrapper">
        <Box className="payment-left">
          <Box className="payment-header">
          <div className="payment-header-type">
              <h1 className="payment-header-title">Chi tiết đặt chỗ</h1>
              <Box
              padding={"2px"}
                className="payment-header-icon"
                component="section"
                
                sx={{ p: 1, border: "2px dashed white" }}
              >
                <i className="payment-plan-info-name"> Đặt sân cố định</i>
              </Box>
            </div>
            <Box className="payment-plan-info">
              <h5 className="payment-plan-info-name">
                Tên khách hàng: {orderDetail.firstname} {orderDetail.lastName}
              </h5>
              <h5 className="payment-plan-info-email">
                Email: {orderDetail.email}
              </h5>
              <h5 className="payment-plan-info-phone">
                Điện thoại: {orderDetail.phone}
              </h5>
            </Box>
          </Box>
          <Box className="payment-content">
            <Box className="payment-body">
              <Box className="payment-plan">
                <Typography variant="h6" className="payment-plan-type">
                  {orderDetail.bookingType === "1" ? "" : "Standard"}
                </Typography>
                {court && (
                  <Box className="payment-plan-info">
                    <h5 className="payment-plan-info payment-plan-info-court-title">
                      {court.courtName}
                    </h5>
                    <h5 className="payment-plan-info">{court.courtAddress}</h5>
                    <h6 className="payment-plan-info">
                      {orderDetail.selectedDate}
                    </h6>
                    <h5 className="payment-plan-info">
                      {orderDetail.startDate}{" "}
                      {" đến "} 
                      {orderDetail.endDate} 
                    </h5>
                    {orderDetail.dayOfWeek.map((detail, index) => (
                      <Box key={index} className="payment-summary-item">
                        <Typography className="payment-summary-name">
                          {detail}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
              <Divider className="payment-summary-divider" />

              <Box className="payment-summary">
                {orderDetail.selectedCourts.map((detail, index) => (
                  <Box key={index} className="payment-summary-item">
                    <Typography className="payment-summary-name">
                      {subCourtNames[index]}
                    </Typography>
                    <Typography className="payment-summary-time">
                      {detail.startTime} - {detail.endTime}
                    </Typography>
                  </Box>
                ))}
                <Divider className="payment-summary-divider" />
                <Box className="payment-summary-item payment-summary-total">
                  <Typography className="payment-summary-name">
                    Tổng tiền
                  </Typography>
                  <Typography className="payment-summary-price">
                    
                    {VND.format(orderDetail.totalPrice)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className="payment-right">
          <form className="payment-form" onSubmit={handleSubmit}>
            <Typography variant="h5" className="payment-title">
             Chi tiết thanh toán
            </Typography>
            <FormControl component="fieldset" className="formControl">
              <RadioGroup
                name="paymentMethod"
                value={orderDetail.paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                <FormControlLabel
                  value="method-1"
                  control={<Radio />}
                  label={
                    <img
                      className="imagePayment"
                      src={VNPAGE}
                      style={{ width: "50px" }}
                      alt="VNPAGE"
                    />
                  }
                />
              </RadioGroup>
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="firstname"
                label="Họ"
                variant="outlined"
                value={orderDetail.firstname || ""}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="lastName"
                label="Tên"
                variant="outlined"
                value={orderDetail.lastName || ""}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                value={orderDetail.email}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="phone"
                label="Số điện thoại"
                variant="outlined"
                value={orderDetail.phone}
                onChange={handleInputChange}
                required
              />
            </FormControl>
            <FormControl fullWidth className="formControl">
              <TextField
                id="totalPrice"
                label="Tổng tiền"
                variant="outlined"
                value={`${VND.format(orderDetail.totalPrice)}` || ""}
                onChange={handleInputChange}
                disabled
              />
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="payment-submit-button"
            >
              Thanh Toán
            </Button>
          </form>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Booking Successful</DialogTitle>
        <DialogContent>
          <Typography>Your booking has been successfully processed!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PaymentMonthPage;
