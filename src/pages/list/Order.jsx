import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box,Autocomplete, Button, styled, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UpdateIcon from "@mui/icons-material/Update";
import "./Customer.css";
import UserDetail from "../single/UserDetail";
import NewUser from "../new/NewUser";
import UpdateUser from "../update/UpdateUser";
import { getAllBookingsOfCourt, getAllCourtOfOwner } from "../../services/UserServices";
import Sidebar from "../../components/courtowner/sidebar/Sidebar";
import SearchIcon from '@mui/icons-material/Search';
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import BookedDetail from "../single/BookedDetail";
const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .no-rows-primary': {
    fill: theme.palette.mode === 'light' ? '#AEB8C2' : '#3D4751',
  },
  '& .no-rows-secondary': {
    fill: theme.palette.mode === 'light' ? '#E8EAED' : '#1D2126',
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
const ListOrder = () => {
  const [data, setData] = useState([]);
  const [court, setCourt] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedBooked, setSelectedBooked] = useState(null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const user = useSelector(selectUser).user;

  const fetchData = async (courtID) => {
    if (courtID) {
      try {
        const response = await getAllBookingsOfCourt(courtID);
        console.log(response.data)
        setData(response.data);  // Ensure this is an array
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    } else {
      try {
        // Fetch all bookings if no court is selected
        const allBookings = [];
        const response = await getAllCourtOfOwner(user.userID);
        const courts = response.data;  // Ensure this is an array
        for (const court of courts) {
          const courtBookings = await getAllBookingsOfCourt(court.courtID);
          allBookings.push(...courtBookings.data);
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
    const firstLetter = option.courtName ? option.courtName[0].toUpperCase() : "";
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
            // startIcon={<VisibilityIcon />}
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
        {court.length > 0 && (
          <Autocomplete
            id="grouped-demo"
            options={options.sort(
              (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
            )}
            groupBy={(option) => option.firstLetter}
            getOptionLabel={(option) => option.courtName}
            isOptionEqualToValue={(option, value) => option.courtID === value.courtID}
            // sx={{ width: 300 }}
            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
              sx={{ '--DataGrid-overlayHeight': '300px' ,width: 300}}
            onChange={handleCourtChange}
            renderInput={(params) => (
              <TextField {...params} label="CourtName" />
            )}
          />
        )}
        <div className="datatable">
          <DataGrid
                      autoHeight

            className="datagrid"
            rows={Array.isArray(data) ? data : []}
            columns={bookingColumns.concat(actionColumn)}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.bookingId} // Assuming bookingDate and customerPhone combination is unique
          />
        </div>
      </div>
      {dialogType === "view" && selectedBooked && (
        <BookedDetail open={open} onClose={handleClose} booking={selectedBooked} />
      )}
      
     
    </div>
  );
};

export default ListOrder;
