import React, { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "./TimeSlot.css";
import {
  getCourtByIdCourt,
  checkSubCourt,
} from "../../services/UserServices"; // Adjusted import
import { Button } from "@mui/material";
import dayjs from "dayjs";

const generateTimeSlots = (startTime, endTime, interval) => {
  const timeSlots = [];
  let currentTime = startTime;

  while (currentTime <= endTime) {
    const hours = String(Math.floor(currentTime / 60)).padStart(2, "0");
    const minutes = String(currentTime % 60).padStart(2, "0");
    const timeString = `${hours}:${minutes}`;
    timeSlots.push({ timeString, id: currentTime });
    currentTime += interval;
  }

  return timeSlots;
};
const disablePastDates = (date) => {
  return date.isBefore(dayjs(), "day");
};

const generateAreas = (numCourts) => {
  return Array.from({ length: numCourts }, (_, i) => `Sân ${i + 1}`);
};

const TimeSlots = () => {
  const [court, setCourt] = useState(null);
  const { idCourt } = useParams();
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [firstSelected, setFirstSelected] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [courtAvailability, setCourtAvailability] = useState([]);

  const getDetailCourt = async () => {
    try {
      const res = await getCourtByIdCourt(idCourt);
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
    getDetailCourt();
  }, [idCourt]);

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  useEffect(() => {
    if (court && court.startTime && court.endTime) {
      const startTime = parseTime(court.startTime);
      console.log(startTime)
      const endTime = parseTime(court.endTime);
      const interval = 30;

      if (startTime !== null && endTime !== null) {
        setTimeSlots(generateTimeSlots(startTime, endTime, interval));
      }
    }
  }, [court]);

  const toggleTimeSlot = (id) => {
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
      ? ((endTime - startTime) / 60) * (court?.price?.[0]?.unitPrice || 0)
      : 0;

  const handleCheckAvailability = async () => {
    if (startTime === null || endTime === null || !selectedDate) {
      alert("Please select a valid date and time range.");
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
      console.log(
        "Sending request to check availability with data:",
        requestData
      );

      const response = await checkSubCourt(requestData);
console.log(requestData)
      console.log("Response from server:", response.data);
      setCourtAvailability(response.data.subCourt); // Assuming the server returns an array of subCourt objects
    } catch (error) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
        console.error("Status code:", error.response.status);
      } else {
        console.error("Error sending request:", error.message);
      }
    }
  };

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
                  onChange={(newValue) => setSelectedDate(newValue)}
                  shouldDisableDate={disablePastDates} // Add this line
                />
              </DemoContainer>
            </LocalizationProvider>
          </div>
        </div>
        <div id="time-slots" className="times-container">
          {timeSlots.map(({ timeString, id }) => (
            <div
              key={id}
              className={`time ${selectedTimes.includes(id) ? "selected" : ""}`}
              onClick={() => toggleTimeSlot(id)}
            >
              {timeString}
            </div>
          ))}
        </div>
        <label>Chọn Sân:</label>
        <div>
          {areas.map((area, index) => (
            <Button
              key={area}
              color={getButtonColor(index)}
              variant="contained"
            >
              {area}
            </Button>
          ))}
        </div>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCheckAvailability}
        >
          Check Availability
        </Button>
      </div>

      <div className="right-section">
        <div className="area-info">
          {court?.images?.[0] && (
            <img src={court.images[0]} alt={court.courtName} />
          )}
          <h2>{court.courtName}</h2>
          <h5>{court.courtAddress}</h5>
          <label>{selectedTimeRange}</label>
          {selectedTimeRange && (
            <div>
              <h5>Thành tiền: {totalPrice.toLocaleString()} VND</h5>
            </div>
          )}
        </div>
        <button className="payment-button">
          <NavLink className="dropdown-item" to="/payment">
            Thanh toán
          </NavLink>
        </button>
      </div>
    </div>
  );
};

export default TimeSlots;

  // const getOpenTime = (slots) => {
  //   if (Array.isArray(slots) && slots.length > 0) {
  //     const times = slots.map((slot) =>
  //       new Date(`1970-01-01T${slot.openTime}`).getTime()
  //     );
  //     const earliestOpen = Math.min(...times);
  //     return new Date(earliestOpen).toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //   }
  //   return "Đang Cập Nhật....";
  // };

  // const getCloseTime = (slots) => {
  //   if (Array.isArray(slots) && slots.length > 0) {
  //     const times = slots.map((slot) =>
  //       new Date(`1970-01-01T${slot.closeTime}`).getTime()
  //     );
  //     const latestClose = Math.max(...times);
  //     return new Date(latestClose).toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //   }
  //   return "Đang Cập Nhật....";
  // };