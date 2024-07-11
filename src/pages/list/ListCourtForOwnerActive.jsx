import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  Visibility as VisibilityIcon,
  Autorenew as AutorenewIcon,
  EditNote as EditNoteIcon,
  NoteAdd as NoteAddIcon,
  Update as UpdateIcon,
} from "@mui/icons-material";
import "../list/Customer.css";
import CourtDetail from "../single/CourtDetail";
import {
  deleteCourt,
  fetchAllCourts,
  getAllBookingsOfCourt,
  getAllCourtOfOwner,
  updateStatusCourt,
} from "../../services/UserServices";
import Sidebar from "../../components/courtowner/sidebar/Sidebar";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import UpdateCourt from "../update/UpdateCourt";

const districtList = [
  "Quận 1",
  "Quận 3",
  "Quận 4",
  "Quận 5",
  "Quận 6",
  "Quận 7",
  "Quận 8",
  "Quận 10",
  "Quận 11",
  "Quận 12",
  "Phú Nhuận",
  "Bình Thạnh",
  "Gò Vấp",
  "Tân Bình",
  "Bình Tân",
  "Tân Phú",
  "Thủ Đức",
  "Bình Chánh",
  "Hóc Môn",
  "Củ Chi",
  "Cần Giờ",
  "Nhà Bè",
];

const ListCourtForOwnerActive = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const user = useSelector(selectUser).user;
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllCourtOfOwner(user.userID);
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
        setData(preprocessedData.filter((court) => court.statusCourt === 1));
      } else {
        console.error("Expected an array but got:", response.data);
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Error fetching data");
      setData([]);
    } finally {
      setLoading(false);
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

  const confirmDelete = async () => {
    try {
      await deleteCourt(deleteId);
      fetchData();
      handleClose();
    } catch (error) {
      console.error("Error deleting court:", error);
    }
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

  const handleDistrictChange = (event, value) => {
    setSelectedDistrict(value);
    if (value) {
      setData(data.filter((court) => court.district === value));
    } else {
      fetchData();
    }
  };

  const actionColumn = [
    {
      field: "action",
      width: 200,
      headerName: "",
      renderCell: (params) => (
        <div className="cellAction">
          <VisibilityIcon
            color="info"
            onClick={() => handleClickOpen(params.row, "view")}
          />
          <AutorenewIcon
            color="secondary"
            onClick={() => handleClickOpen(params.row, "update")}
          />
          <EditNoteIcon
            color="warning"
            onClick={() => navigate(`/ownerCourt/court/update/${params.row.courtID}`)}
          />
        </div>
      ),
    },
  ];

  const courtColumns = [
    { field: "courtID", headerName: "Court ID", width: 70 },
    { field: "courtName", headerName: "Court Name", width: 200 },
    { field: "district", headerName: "District", width: 140 },
    { field: "courtAddress", headerName: "Court Address", width: 200 },
    { field: "courtQuantity", headerName: "Arena", width: 150 },
  ];

  const UpdateCourtStatusDialog = ({ open, onClose, court, fetchData }) => {
    const [status, setStatus] = useState(court.statusCourt);

    const handleChange = (event) => {
      setStatus(event.target.value);
    };

    const handleUpdate = async () => {
      try {
        await updateStatusCourt({
          courtID: court.courtID,
          statusCourt: status,
        });
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
        {districtList.length > 0 && (
          <Autocomplete
            sx={{ width: 300 }}
            id="district-selector"
            options={districtList}
            getOptionLabel={(option) => option}
            onChange={handleDistrictChange}
            renderInput={(params) => (
              <TextField {...params} label="District" />
            )}
          />
        )}
        <div className="datatable">
          <div className="datatableTitle">
            <span>Courts Active</span>
          </div>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100%">
              <span>{error}</span>
            </Box>
          ) : (
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
          )}
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
      {dialogType === "updateDetail" && selectedCourt && (
        <UpdateCourt
          courtId={selectedCourt.courtID}
          onClose={handleClose}
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

export default ListCourtForOwnerActive;
