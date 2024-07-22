import React, { useState, useEffect, useMemo } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Autocomplete,
  Button,
  styled,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Sidebar from "../../components/courtowner/sidebar/Sidebar";
import {
  getAllBookingsOfCourt,
  getAllBookingsOfCourt2,
  getAllCourtOfOwner,
} from "../../services/UserServices";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import dayjs from "dayjs";
import BookedDetail from "../single/BookedDetail";
import "./Customer.css";

const StyledGridOverlay = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  "& .no-rows-primary": {
    fill: theme.palette.mode === "light" ? "#AEB8C2" : "#3D4751",
  },
  "& .no-rows-secondary": {
    fill: theme.palette.mode === "light" ? "#E8EAED" : "#1D2126",
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        width={96}
        viewBox="0 0 452 257"
        aria-hidden
        focusable="false"
      >
        {/* SVG content */}
      </svg>
      <Box sx={{ mt: 2 }}>No rows</Box>
    </StyledGridOverlay>
  );
}

const ListOrder = () => {
  const [data, setData] = useState([]);
  const [court, setCourt] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedBooked, setSelectedBooked] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingType, setBookingType] = useState("all");
  const user = useSelector(selectUser).user;

  const fetchData = async (courtID) => {
    if (courtID) {
      try {
        const response = await getAllBookingsOfCourt(courtID);
        setData(response.data); // Ensure this is an array
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    } else {
      try {
        // Fetch all bookings if no court is selected
        const allBookings = [];
        const response = await getAllCourtOfOwner(user.userID);
        const courts = response.data; // Ensure this is an array
        for (const court of courts) {
          const courtBookings = await getAllBookingsOfCourt2(court.courtID);
          console.log(courtBookings.data)
          allBookings.push(...courtBookings.data);
        }
        setData(allBookings);
        setCourt(courts);
      } catch (error) {
        console.error("Error fetching court data:", error);
      }
    }
  };
console.log(data)
  useEffect(() => {
    fetchData();
  }, []);

  const options = court.map((option) => {
    const firstLetter = option.courtName
      ? option.courtName[0].toUpperCase()
      : "";
    return {
      firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
      ...option,
    };
  });

  const handleCourtChange = (event, value) => {
    setSelectedCourt(value ? value.courtID : null);
    fetchData(value ? value.courtID : null);
  };

  const handleClickOpen = (booked, type) => {
    setSelectedBooked(booked);
    setDialogType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooked(null);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date ? dayjs(date).toDate() : null);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date ? dayjs(date).toDate() : null);
  };

  const handleResetDate = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const handleBookingTypeChange = (event) => {
    setBookingType(event.target.value);
  };

  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      const itemDate = new Date(item.bookingDate);
      const matchesDate =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      const matchesType =
        bookingType === "all" ||
        (bookingType === "day" && item.bookingId) ||
        (bookingType === "current" && item.recurringBookingID);

      return matchesDate && matchesType;
    });
  }, [data, startDate, endDate, bookingType]);

  const actionColumn = [
    {
      field: "action",
      headerName: "",
      width: 300,
      renderCell: (params) => (
        <div className="cellAction">
          <Button
            variant="outlined"
            color="info"
            onClick={() => handleClickOpen(params.row, "view")}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  const bookingColumns = [
    { field: "courtName", headerName: "Court Name", width: 200 },
    { field: "address", headerName: "Address", width: 250 },
    { field: "courtPhoneNumber", headerName: "courtPhoneNumber", width: 150 },
    { field: "customerPhone", headerName: "Customer Phone", width: 150 },
    { field: "totalPrice", headerName: "Total Price", width: 100 },
    { field: "bookingDate", headerName: "Booking Date", width: 150 },
  ];

  return (
    <div className="customer">
      <Sidebar />
      <div className="customerContainer">
        <div className="filters" style={{ display: "flex" }}>
          <div>
            {" "}
            <FormControl style={{ padding: "20px", gap: "20px" }}>
              <FormLabel id="demo-radio-buttons-group-label">
                Booking Type
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                value={bookingType}
                onChange={handleBookingTypeChange}
                name="radio-buttons-group"
              >
                <FormControlLabel value="all" control={<Radio />} label="All" />
                <FormControlLabel
                  value="day"
                  control={<Radio />}
                  label="Day Booking"
                />
                <FormControlLabel
                  value="current"
                  control={<Radio />}
                  label="Recurring Booking"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div>
            <Box
              display="grid"
              alignItems="center"
              style={{ padding: "20px", gap: "20px" }}
              component="section"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={startDate ? dayjs(startDate) : null}
                  onChange={handleStartDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="End Date"
                  value={endDate ? dayjs(endDate) : null}
                  onChange={handleEndDateChange}
                  renderInput={(params) => <TextField {...params} />}
                  style={{ marginLeft: 16 }}
                />
              </LocalizationProvider>
              <Button
                onClick={handleResetDate}
                variant="outlined"
                style={{ marginLeft: 8 }}
              >
                Reset
              </Button>
            </Box>
          </div>
          <div style={{paddingTop:"20px"}}>
            {court.length > 0 && (
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
                slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                sx={{ "--DataGrid-overlayHeight": "300px", width: 300 }}
                onChange={handleCourtChange}
                renderInput={(params) => (
                  <TextField {...params} label="CourtName" />
                )}
              />
            )}
          </div>
        </div>

        <div className="datatable">
          <DataGrid
            autoHeight
            className="datagrid"
            rows={Array.isArray(filteredItems) ? filteredItems : []}
            columns={bookingColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            getRowId={(row) => row.bookingId || row.recurringBookingID}
            components={{
              NoRowsOverlay: CustomNoRowsOverlay,
            }}
          />
        </div>
        {dialogType === "view" && selectedBooked && (
          <BookedDetail
            open={open}
            onClose={handleClose}
            booking={selectedBooked}
          />
        )}
      </div>
    </div>
  );
};

export default ListOrder;
