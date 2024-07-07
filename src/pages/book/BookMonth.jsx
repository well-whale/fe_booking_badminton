import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TodayIcon from "@mui/icons-material/Today";
import { PiCourtBasketball } from "react-icons/pi";

import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import dayjs from "dayjs";
import { getCourtByIdCourt, checkSubCourt } from "../../services/UserServices";
import CourtPrice from "../single/CourtPrice";

const generateTimeSlots = (startTime, endTime, interval, selectedDate) => {
  const timeSlots = [];
  const now = dayjs();
  const isToday = selectedDate.isSame(now, "day");
  let currentTime = startTime;

  while (currentTime <= endTime) {
    const hours = String(Math.floor(currentTime / 60)).padStart(2, "0");
    const minutes = String(currentTime % 60).padStart(2, "0");
    const timeString = `${hours}:${minutes}`;
    const timeSlotMoment = selectedDate
      .hour(Math.floor(currentTime / 60))
      .minute(currentTime % 60);
    const isPast = isToday && timeSlotMoment.isBefore(now);

    timeSlots.push({ timeString, id: currentTime, isPast });
    currentTime += interval;
  }

  return timeSlots;
};

const disablePastDates = (date) => {
  return date.isBefore(dayjs(), "day");
};

const generateAreas = (numCourts) => {
  return Array.from({ length: numCourts }, (_, i) => ({
    name: `Sân ${i + 1}`,
    id: i + 1,
  }));
};

const BookMonth = () => {
  const [court, setCourt] = useState(null);
  const { idCourt } = useParams();
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [courtID, setCourtID] = useState(null);
  const [firstSelected, setFirstSelected] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateNow, setDayNow] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs().add(1, "month"));
  const [courtAvailability, setCourtAvailability] = useState([]);
  const [selectedCourts, setSelectedCourts] = useState([]);
  const [isPricingModalOpen, setPricingModalOpen] = useState(false);

  const handleBooking = () => {
    const bookingDetails = {
      courtID,
      selectedCourts,
      selectedDate: selectedDate.format("YYYY-MM-DD"),
      totalPrice,
    };
    console.log(bookingDetails);
    localStorage.setItem("bookingDetails", JSON.stringify(bookingDetails));
  };

  const getDetailCourt = async () => {
    try {
      const res = await getCourtByIdCourt(idCourt);
      if (res.status === 200) {
        setCourt(res.data);
        setCourtID(idCourt);
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
    getDetailCourt();
  }, [idCourt]);

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (court && court.startTime && court.endTime) {
      const startTime = parseTime(court.startTime);
      const endTime = parseTime(court.endTime);
      const interval = 30;

      if (startTime !== null && endTime !== null) {
        setTimeSlots(
          generateTimeSlots(startTime, endTime, interval, selectedDate)
        );
      }
    }
  }, [court, selectedDate]);

  const toggleTimeSlot = (id, isPast) => {
    if (isPast) return; // Disable past time slots

    if (firstSelected === null) {
      setFirstSelected(id);
      setSelectedTimes([id]);
      setStartTime(id);
      setEndTime(null);
    } else {
      const newSelectedTimes = [];
      const start = Math.min(firstSelected, id);
      const end = Math.max(firstSelected, id);
      for (let i = start; i <= end; i += 30) {
        newSelectedTimes.push(i);
      }
      setSelectedTimes(newSelectedTimes);
      setFirstSelected(null);
      setStartTime(start);
      setEndTime(end);
    }
  };

  useEffect(() => {
    const checkAvailability = async () => {
      if (startTime === null || endTime === null || !selectedDate) {
        return;
      }

      const formattedDate = selectedDate.format("YYYY-MM-DD");
      const startTimeStr = `${String(Math.floor(startTime / 60)).padStart(
        2,
        "0"
      )}:${String(startTime % 60).padStart(2, "0")}`;
      const endTimeStr = `${String(Math.floor(endTime / 60)).padStart(
        2,
        "0"
      )}:${String(endTime % 60).padStart(2, "0")}`;

      const requestData = {
        courtID: court.courtID,
        bookingDate: formattedDate,
        startTime: startTimeStr,
        endTime: endTimeStr,
      };

      try {
        const response = await checkSubCourt(requestData);
        setCourtAvailability(response.data.subCourt); // Assuming the server returns an array of subCourt objects
        console.log(response);
      } catch (error) {
        if (error.response) {
          console.error("Error response from server:", error.response.data);
          console.error("Status code:", error.response.status);
        } else {
          console.error("Error sending request:", error.message);
        }
      }
    };

    if (startTime !== null && endTime !== null) {
      checkAvailability();
    }
  }, [startTime, endTime, selectedDate, court]);

  const areas = generateAreas(court?.courtQuantity || 0);

  const selectedTimeRange =
    startTime !== null && endTime !== null
      ? `${String(Math.floor(startTime / 60)).padStart(2, "0")}:${String(
          startTime % 60
        ).padStart(2, "0")} - ${String(Math.floor(endTime / 60)).padStart(
          2,
          "0"
        )}:${String(endTime % 60).padStart(2, "0")}`
      : "";

  const totalPrice =
    selectedTimes.length > 0
      ? ((endTime - startTime) / 60) *
        (court?.price?.[0]?.unitPrice || 0) *
        selectedCourts.length
      : 0;

  const getButtonColor = (index) => {
    if (!courtAvailability || courtAvailability.length === 0) {
      return "warning"; // Or any default color you prefer
    }

    const subCourt = courtAvailability.find(
      (court) => court.subCourtID === index + 1
    );
    if (subCourt) {
      return subCourt.subCourtStatus ? "success" : "error";
    }
    return "warning";
  };

  const handleCourtSelection = (index) => {
    if (startTime === null || endTime === null) {
      return; // Disable court selection if startTime or endTime is not selected
    }

    const selectedSubCourt = courtAvailability.find(
      (court) => court.subCourtID === index + 1 && court.subCourtStatus
    );

    if (selectedSubCourt) {
      const newSelectedCourt = {
        subCourtID: selectedSubCourt.subCourtID,
        startTime: `${String(Math.floor(startTime / 60)).padStart(
          2,
          "0"
        )}:${String(startTime % 60).padStart(2, "0")}:00`,
        endTime: `${String(Math.floor(endTime / 60)).padStart(2, "0")}:${String(
          endTime % 60
        ).padStart(2, "0")}:00`,
      };

      setSelectedCourts((prevSelectedCourts) =>
        prevSelectedCourts.some(
          (court) => court.subCourtID === newSelectedCourt.subCourtID
        )
          ? prevSelectedCourts.filter(
              (court) => court.subCourtID !== newSelectedCourt.subCourtID
            )
          : [...prevSelectedCourts, newSelectedCourt]
      );
    }
  };

  const openPricingModal = () => {
    setPricingModalOpen(true);
  };

  const closePricingModal = () => {
    setPricingModalOpen(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!court) {
    return <div>No court details available</div>;
  }
  return (
    <div className="container">
      <div className="left-section">
        <div className="area-selection">
          <div className="input__group">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker", "DatePicker"]}>
                <DatePicker
                  disabled
                  label="Start Day"
                  value={dateNow}
                  onChange={(newValue) => setDayNow(dayjs(newValue))}
                  shouldDisableDate={disablePastDates}
                />
                <DatePicker
                  label="End Day"
                  value={selectedDate}
                  onChange={(newValue) =>
                    setSelectedDate(dayjs(newValue).add(1, "month"))
                  }
                  shouldDisableDate={disablePastDates}
                />
              </DemoContainer>
            </LocalizationProvider>
            <Button
              onClick={openPricingModal}
              variant="outlined"
              style={{ marginTop: "1rem" }}
            >
              Bảng giá
            </Button>
          </div>
        </div>
        <div id="time-slots" className="times-container">
          {timeSlots.map(({ timeString, id, isPast }) => (
            <div
              key={id}
              className={`time ${
                selectedTimes.includes(id) ? "selected" : ""
              } ${isPast ? "disabled" : ""}`}
              onClick={() => toggleTimeSlot(id, isPast)}
            >
              {timeString}
            </div>
          ))}
        </div>
        <label>Chọn Ngày:</label>
        <div>
          <FormGroup>
            <Grid container spacing={2}>
              <Grid item xs={3}>
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Thứ 2"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Thứ 3"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Thứ 4"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Thứ 5"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Thứ 6"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Thứ 7"
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={<Checkbox color="success" />}
                  label="Chủ Nhật"
                />
              </Grid>
            </Grid>
          </FormGroup>
        </div>
        <label>Chọn Sân:</label>
        <div>
          {areas.map(({ name, id }) => (
            <Button
              key={id}
              color={
                selectedCourts.some((court) => court.subCourtID === id)
                  ? "primary"
                  : getButtonColor(id - 1)
              }
              variant="contained"
              disabled={
                getButtonColor(id - 1) === "error" ||
                startTime === null ||
                endTime === null
              }
              onClick={() => handleCourtSelection(id - 1)}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>

      <div className="right-section">
        <Card sx={{ maxWidth: 345 }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="140"
              image={court.images.length > 0 ? court.images[0].image : 'default-image-url'}
              alt="green iguana"
            />

            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {court.courtName}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                <HomeIcon />
                {court.courtAddress}
              </Typography>
              <Typography variant="body2" color="ButtonText">
                <TodayIcon />
                {dayjs().format("DD/MM/YYYY")} <KeyboardDoubleArrowRightIcon />
                {selectedDate.format("DD/MM/YYYY")}
              </Typography>
              <Typography variant="body2" color="ActiveBorder">
                <AccessTimeIcon />
                {selectedTimeRange}
              </Typography>
              {selectedCourts.length > 0 && (
                <div>
                  <Typography variant="body2" color="ButtonText">
                    {selectedCourts.map((court) => (
                      <Typography
                        variant="body2"
                        color="ButtonText"
                        key={court.subCourtID}
                      >
                        {" "}
                        <PiCourtBasketball fontSize={"24px"} />
                        {` Sân ${court.subCourtID}`}
                      </Typography>
                    ))}
                  </Typography>
                </div>
              )}
            </CardContent>
          </CardActionArea>
        </Card>
        <Button
          variant="contained"
          color="primary"
          disabled={!selectedTimes.length || !selectedCourts.length}
          onClick={handleBooking}
        >
          <NavLink
            to={{
              pathname: "/payment",
            }}
            onClick={() => window.scrollTo(0, 200)}
            style={{ textDecoration: "none", color: "white" }}
          >
            Thanh toán
          </NavLink>
        </Button>
      </div>

      <Dialog open={isPricingModalOpen} onClose={closePricingModal}>
        <DialogTitle>Bảng giá</DialogTitle>
        <DialogContent>
          <CourtPrice courtID={court.courtID} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closePricingModal}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BookMonth;
