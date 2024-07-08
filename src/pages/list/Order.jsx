import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Autocomplete, Button, TextField } from "@mui/material";
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
      headerName: "Action",
      width: 300,
      renderCell: (params) => (
        <div className="cellAction">
          <Button
            variant="outlined"
            color="info"
            startIcon={<VisibilityIcon />}
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
            sx={{ width: 300 }}
            onChange={handleCourtChange}
            renderInput={(params) => (
              <TextField {...params} label="CourtName" />
            )}
          />
        )}
        <SearchIcon/>
        <div className="datatable">
          <DataGrid
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
