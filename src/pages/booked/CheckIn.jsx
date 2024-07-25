import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  styled,
} from "@mui/material";
import Sidebar from "../../components/staff/sidebar/Sidebar";
import {
  getAllOrderStaff,
  UpdateStatusOrder,
} from "../../services/UserServices";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import BookedDetail from "../single/BookedDetail";
import "../list/Customer.css";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const CheckIn = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedBooked, setSelectedBooked] = useState(null);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const user = useSelector(selectUser).user;

  const fetchData = async (date) => {
    try {
      const response = await getAllOrderStaff(user.userID);
      console.log(response)
      const filteredData = response.data.filter(
        (booking) => booking.bookingDate === date.format('YYYY-MM-DD')
      );
      setData(filteredData);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };
  console.log(data)


  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  const handleClickOpen = (booked, type) => {
    setSelectedBooked(booked);
    setDialogType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedBooked(null);
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="cellAction">
          <Button
            variant="outlined"
            color="info"
            onClick={() => handleClickOpen(params.row, "view")}
          >
            View
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleClickOpen(params.row, "update")}
            disabled={dayjs(params.row.bookingDate).isBefore(dayjs(), 'day')||dayjs(params.row.bookingDate).isAfter(dayjs(), 'day')}
          >
            Update
          </Button>
        </div>
      ),
    },
  ];

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
          <path
            className="no-rows-primary"
            d="M348 69c-46.392 0-84 37.608-84 84s37.608 84 84 84 84-37.608 84-84-37.608-84-84-84Zm-104 84c0-57.438 46.562-104 104-104s104 46.562 104 104-46.562 104-104 104-104-46.562-104-104Z"
          />
          <path
            className="no-rows-primary"
            d="M308.929 113.929c3.905-3.905 10.237-3.905 14.142 0l63.64 63.64c3.905 3.905 3.905 10.236 0 14.142-3.906 3.905-10.237 3.905-14.142 0l-63.64-63.64c-3.905-3.905-3.905-10.237 0-14.142Z"
          />
          <path
            className="no-rows-primary"
            d="M308.929 191.711c-3.905-3.906-3.905-10.237 0-14.142l63.64-63.64c3.905-3.905 10.236-3.905 14.142 0 3.905 3.905 3.905 10.237 0 14.142l-63.64 63.64c-3.905 3.905-10.237 3.905-14.142 0Z"
          />
          <path
            className="no-rows-secondary"
            d="M0 10C0 4.477 4.477 0 10 0h380c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 20 0 15.523 0 10ZM0 59c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10C4.477 69 0 64.523 0 59ZM0 106c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 153c0-5.523 4.477-10 10-10h195.5c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 200c0-5.523 4.477-10 10-10h203c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10ZM0 247c0-5.523 4.477-10 10-10h231c5.523 0 10 4.477 10 10s-4.477 10-10 10H10c-5.523 0-10-4.477-10-10Z"
          />
        </svg>
        <Box sx={{ mt: 2 }}>No rows</Box>
      </StyledGridOverlay>
    );
  }

  const transformedData = data.map((booking) => ({
    ...booking,
    bookingDetailsLength: `${booking.bookingDetails.length} Arena`,
  }));

  const bookingColumns = [
    { field: "customerName", headerName: "Customer Name", width: 200 },
    { field: "customerPhone", headerName: "Customer Phone", width: 150 },
    {
      field: "bookingDetailsLength",
      headerName: "Number of Court Order",
      width: 250,
    },
    { field: "bookingDate", headerName: "Booking Date", width: 150 },
    {
      field: "status",
      headerName: "Check In Status",
      width: 150,
      renderCell: (params) => (params.value ? "Checked In" : "Not Checked In"),
    },
  ];

  const UpdateStatusOrderDialog = ({ open, onClose, booking, fetchData }) => {
    const [status, setStatus] = useState(booking.status);

    const handleChange = (event) => {
      setStatus(event.target.value);
    };

    const handleUpdate = async () => {
      try {
        await UpdateStatusOrder(booking.bookingId);
        fetchData();
        onClose();
      } catch (error) {
        console.error("Error updating court status:", error);
      }
    };
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Update Booking Status</DialogTitle>
        <DialogContent>
          <Select value={status} onChange={handleChange} fullWidth>
            <MenuItem value={true}>Checked In</MenuItem>
            <MenuItem value={false}>Not Checked In</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdate} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <div className="customer">
      <Sidebar />
      <div className="customerContainer">
        <div className="filterContainer">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Select Date"
              value={selectedDate}
              onChange={(newValue) => {
                setSelectedDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </div>
        <div className="datatable">
          <DataGrid
            className="datagrid"
            rows={Array.isArray(transformedData) ? transformedData : []}
            columns={bookingColumns.concat(actionColumn)}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.bookingId}
            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
            sx={{ "--DataGrid-overlayHeight": "300px" }}
          />
        </div>
      </div>
      {dialogType === "view" && selectedBooked && (
        <BookedDetail
          open={open}
          onClose={handleClose}
          booking={selectedBooked}
        />
      )}
      {dialogType === "update" && selectedBooked && (
        <UpdateStatusOrderDialog
          open={open}
          onClose={handleClose}
          booking={selectedBooked}
          fetchData={() => fetchData(selectedDate)}
        />
      )}
    </div>
  );
};

export default CheckIn;
