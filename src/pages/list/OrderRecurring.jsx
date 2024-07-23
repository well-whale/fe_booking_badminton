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
import BookedDetailRecurring from "../single/BookedDetailRecurring";

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

const ListOrderRecurring = () => {
  const [data, setData] = useState([]);
  const [court, setCourt] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedBooked, setSelectedBooked] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startPaymentDate, setStartPaymentDate] = useState(null);
  const [endPaymentDate, setEndPaymentDate] = useState(null);
  const user = useSelector(selectUser).user;

  const fetchData = async (courtID) => {
    if (courtID) {
      try {
        const response = await getAllBookingsOfCourt2(courtID);
        setData(response.data.recurringBookingResponseList.filter((booking) => booking.recurringBookingID));
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    } else {
      try {
        const allBookings = [];
        const response = await getAllCourtOfOwner(user.userID);
        const courts = response.data; // Ensure this is an array
        console.log(courts)

        for (const court of courts) {
          const courtBookings = await getAllBookingsOfCourt2(court.courtID);
          allBookings.push(
            ...courtBookings.data.recurringBookingResponseList.filter(
              (booking) => booking.recurringBookingID
            )
          );
        }
        setData(allBookings);
        setCourt(courts);
      } catch (error) {
        console.error("Error fetching court data:", error);
      }
    }
  };

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

  const handleStartPaymentDateChange = (date) => {
    setStartPaymentDate(date ? dayjs(date).toDate() : null);
  };

  const handleEndPaymentDateChange = (date) => {
    setEndPaymentDate(date ? dayjs(date).toDate() : null);
  };

  const handleResetDate = () => {
    setStartDate(null);
    setEndDate(null);
    setStartPaymentDate(null);
    setEndPaymentDate(null);
  };

  const filteredItems = useMemo(() => {
    return data.filter((item) => {
      const itemBookingDate = new Date(item.bookingDate);
      const itemPaymentDate = new Date(item.paymentResDTO.paymentDate);
      const matchesBookingDate =
        (!startDate || itemBookingDate >= startDate) &&
        (!endDate || itemBookingDate <= endDate);
      const matchesPaymentDate =
        (!startPaymentDate || itemPaymentDate >= startPaymentDate) &&
        (!endPaymentDate || itemPaymentDate <= endPaymentDate);

      return matchesBookingDate && matchesPaymentDate;
    });
  }, [data, startDate, endDate, startPaymentDate, endPaymentDate]);

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
            <Box
              display="grid"
              alignItems="center"
              style={{ padding: "20px", gap: "20px" }}
              component="section"
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Payment Date"
                  value={startPaymentDate ? dayjs(startPaymentDate) : null}
                  onChange={handleStartPaymentDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                  label="End Payment Date"
                  value={endPaymentDate ? dayjs(endPaymentDate) : null}
                  onChange={handleEndPaymentDateChange}
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
          <div style={{ paddingTop: "20px" }}>
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
                  <TextField {...params} label="Court Name" />
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
          <BookedDetailRecurring
            open={open}
            onClose={handleClose}
            booking={selectedBooked}
          />
        )}
      </div>
    </div>
  );
};

export default ListOrderRecurring;
