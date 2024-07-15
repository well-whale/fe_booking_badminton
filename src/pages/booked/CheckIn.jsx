import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select } from "@mui/material";
import Sidebar from "../../components/staff/sidebar/Sidebar";
import { getAllOrderStaff, UpdateStatusOrder } from "../../services/UserServices";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import BookedDetail from "../single/BookedDetail";
import "../list/Customer.css";

const CheckIn = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedBooked, setSelectedBooked] = useState(null);
  const user = useSelector(selectUser).user;

  const fetchData = async () => {
    try {
      const response = await getAllOrderStaff(user.userID);
      console.log()
      setData(response.data);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
          >
            Update
          </Button>
        </div>
      ),
    },
  ];

  const bookingColumns = [
    { field: "courtName", headerName: "Court Name", width: 200 },
    { field: "address", headerName: "Address", width: 250 },
    { field: "customerPhone", headerName: "Customer Phone", width: 150 },
    { field: "bookingDate", headerName: "Booking Date", width: 150 },
    {
      field: "status",
      headerName: "Check In Status",
      width: 150,
      renderCell: (params) => (
        params.value ? "Checked In" : "Not Checked In"
      ),
    },
  ];

  const UpdateStatusOrderDialog = ({ open, onClose, booking, fetchData }) => {
    const [status, setStatus] = useState(booking.status);

    const handleChange = (event) => {
      setStatus(event.target.value);
    };

    const handleUpdate = async () => {
      try {
        await UpdateStatusOrder( booking.bookingId);
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
        <div className="datatable">
          <DataGrid
            className="datagrid"
            rows={Array.isArray(data) ? data : []}
            columns={bookingColumns.concat(actionColumn)}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.bookingId}
          />
        </div>
      </div>
      {dialogType === "view" && selectedBooked && (
        <BookedDetail open={open} onClose={handleClose} booking={selectedBooked} />
      )}
      {dialogType === "update" && selectedBooked && (
        <UpdateStatusOrderDialog
          open={open}
          onClose={handleClose}
          booking={selectedBooked}
          fetchData={fetchData}
        />
      )}
    </div>
  );
};

export default CheckIn;
