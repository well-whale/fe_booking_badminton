import React, { useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import UpdateIcon from "@mui/icons-material/Update";
import "../customers/Customer.css";
import CourtDetail from "../single/CourtDetail";
import NewCourt from "../new/NewCourt";
import { datacourt } from "../.../../../datatableSource";

const Courts = () => {
  const [data, setData] = useState(datacourt);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (courtId) => {
    setDeleteId(courtId);
    setDialogType("delete");
    setOpen(true);
  };

  const confirmDelete = () => {
    setData(data.filter((item) => item.courtId !== deleteId));
    handleClose();
  };

  const handleClickOpen = (court, type) => {
    setSelectedCourt(court);
    setDialogType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourt(null);
    setDeleteId(null);
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
          <Link to={`/admin/court/update/${params.row.courtId}`}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<UpdateIcon />}
            >
              Update
            </Button>
          </Link>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.courtId)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const courtColumns = [
    { field: "courtId", headerName: "Court ID", width: 70 },
    { field: "courtName", headerName: "Court Name", width: 200 },
    { field: "district", headerName: "District", width: 140 },
    { field: "courtAddress", headerName: "Court Address", width: 200 },
    { field: "courtQuantity", headerName: "Court Quantity", width: 150 },
  ];

  return (
    <div className="customer">
      <Sidebar />
      <div className="customerContainer">
        <div className="datatable">
          <div className="datatableTitle">
            <span>Courts</span>
            <Button
              variant="outlined"
              color="success"
              startIcon={<NoteAddIcon />}
              onClick={() => setDialogType("new") || setOpen(true)}
            >
              Add New
            </Button>
            
          </div>
          <DataGrid
            rows={data}
            columns={courtColumns.concat(actionColumn)}
            pageSize={9}
            rowsPerPageOptions={[9]}
            disableSelectionOnClick
            getRowId={(row) => row.courtId}
          />
        </div>
      </div>

      {dialogType === "view" && selectedCourt && (
        <CourtDetail open={open} onClose={handleClose} court={selectedCourt} />
      )}
      {dialogType === "new" && (
        <NewCourt open={open} handleClose={handleClose} />
      )}
      {/* {dialogType === "update" && (
        <UpdateCourt open={open} handleClose={handleClose} court={selectedCourt} />
      )} */}
      {dialogType === "delete" && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this court?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default Courts;
