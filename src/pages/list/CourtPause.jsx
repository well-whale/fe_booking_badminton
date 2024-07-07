import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import UpdateIcon from "@mui/icons-material/Update";
import "../list/Customer.css";
import CourtDetail from "../single/CourtDetail";
import NewCourt from "../new/NewCourt";
import { fetchAllCourts } from "../../services/UserServices";
import { dataCOurt } from "../../datatableSource";

const CourtsPause = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const fetchData = async () => {
    try {
      const response = await fetchAllCourts();
      if (Array.isArray(response.data)) {
        const preprocessedData = response.data.map((court) => ({
          ...court,
          status:
            court.statusCourt === 1
              ? "Hoạt động"
              : court.statusCourt === -1
              ? "Tạm ngưng"
              : "Chờ duyệt",
        }));
        setData(preprocessedData.filter((court) => court.statusCourt === -1));
        console.log(data);
      } else {
        console.error("Expected an array but got:", response.data);
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (courtId) => {
    setDeleteId(courtId);
    setDialogType("delete");
    setOpen(true);
  };

  const confirmDelete = () => {
    setData(data.filter((item) => item.courtID !== deleteId));
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
      headerName: "",
      renderCell: (params) => (
        <div className="cellAction">
          <VisibilityIcon
            color="info"
            onClick={() => handleClickOpen(params.row, "view")}
          />
          <EditNoteIcon
            color="secondary"
            onClick={() => handleClickOpen(params.row, "update")}
          />
          <DeleteIcon
            color="error"
            onClick={() => handleDelete(params.row.courtID)}
          />
        </div>
      ),
    },
  ];

  const courtColumns = [
    { field: "courtID", headerName: "ID Sân", width: 70 },
    { field: "courtName", headerName: "Tên Sân", width: 200 },
    { field: "district", headerName: "Khu Vực", width: 140 },
    { field: "courtAddress", headerName: "Địa Chỉ", width: 200 },
    { field: "courtQuantity", headerName: "Quy Mô", width: 150 },
    { field: "status", headerName: "Trạng Thái", width: 150 },
  ];

  const UpdateCourtStatusDialog = ({ open, onClose, court, fetchData }) => {
    const [status, setStatus] = useState(court.statusCourt);

    const handleChange = (event) => {
      setStatus(event.target.value);
    };

    const handleUpdate = async () => {
      try {
        // await updateCourtStatus(court.courtID, status);
        fetchData();
        onClose();
      } catch (error) {
        console.error("Error updating court status:", error);
      }
    };

    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Update Court Status</DialogTitle>
        <DialogContent>
          <Select value={status} onChange={handleChange} fullWidth>
            <MenuItem value={1}>Hoạt động</MenuItem>
            <MenuItem value={-1}>Tạm ngưng</MenuItem>
            <MenuItem value={0}>Chờ duyệt</MenuItem>
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
          <div className="datatableTitle">
            <span>Courts Active</span>
          </div>
          <DataGrid
            rows={data}
            columns={courtColumns.concat(actionColumn)}
            pageSize={5}
            rowsPerPageOptions={[15]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pagination
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
            disableSelectionOnClick
            getRowId={(row) => row.courtID}
          />
        </div>
      </div>

      {dialogType === "view" && selectedCourt && (
        <CourtDetail open={open} onClose={handleClose} court={selectedCourt} />
      )}
      {dialogType === "update" && selectedCourt && (
        <UpdateCourtStatusDialog
          open={open}
          onClose={handleClose}
          court={selectedCourt}
          fetchData={fetchData}
        />
      )}
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

export default CourtsPause;
