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
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import "./BookDay.css";
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

const generateAreas = (subCourts) => {
  return subCourts.map(({ subCourtID }, i) => ({
    name: `Sân ${i + 1}`,
    subCourtID: subCourtID,
  }));
};

const BookDay = () => {
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
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [courtAvailability, setCourtAvailability] = useState([]);
  const [selectedCourts, setSelectedCourts] = useState([]);
  const [isPricingModalOpen, setPricingModalOpen] = useState(false);
  const [idCourtF, setIdCourtF] = useState(null);

  const handleBooking = () => {
    const bookingDetails = {
      courtID: Number(courtID),
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
        setIdCourtF(res.data.subCourts[0].subCourtID);
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
        setTimeSlots(generateTimeSlots(startTime, endTime, interval, selectedDate));
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

  const areas = generateAreas(court?.subCourts || []);

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

  const getButtonColor = (subCourtID) => {
    const subCourt = courtAvailability.find(
      (court) => court.subCourtID === subCourtID
    );
    if (subCourt) {
      return subCourt.subCourtStatus ? "success" : "error";
    }
    return "warning";
  };

  const handleCourtSelection = (subCourtID) => {
    if (startTime === null || endTime === null) {
      return; 
    }

    const selectedSubCourt = courtAvailability.find(
      (court) => court.subCourtID === subCourtID && court.subCourtStatus
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

  const getCourtName = (subCourtID) => {
    const area = areas.find(area => area.subCourtID === subCourtID);
    return area ? area.name : `Sân ${subCourtID}`;
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
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(dayjs(newValue))}
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
              className={`time ${selectedTimes.includes(id) ? "selected" : ""} ${
                isPast ? "disabled" : ""
              }`}
              onClick={() => toggleTimeSlot(id, isPast)}
            >
              {timeString}
            </div>
          ))}
        </div>
        <label>Chọn Sân:</label>
        <div>
          {areas.map(({ name, subCourtID }) => (
            <Button
              key={subCourtID}
              color={
                selectedCourts.some((court) => court.subCourtID === subCourtID)
                  ? "primary"
                  : getButtonColor(subCourtID)
              }
              variant="contained"
              disabled={
                getButtonColor(subCourtID) === "error" ||
                startTime === null ||
                endTime === null
              }
              onClick={() => handleCourtSelection(subCourtID)}
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
              <Typography variant="body2" color="ActiveBorder" display={"flex"}>
                <HomeIcon />
                {court.courtAddress}
              </Typography>
              <Typography variant="body2" color="ButtonText">
                <TodayIcon />
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
                        {getCourtName(court.subCourtID)}
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

export default BookDay;
