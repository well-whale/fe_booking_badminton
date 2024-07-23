import React, { useEffect, useState } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  CircularProgress,
  Box,
  TextField,
  Autocomplete,
  styled,
} from "@mui/material";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../list/Customer.css";
import CourtDetail from "../single/CourtDetail";
import { deleteCourt, fetchAllCourts, updateStatusCourt } from "../../services/UserServices";

const districtList = [
  "Quận 1",
  "Quận 2",
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
const CourtsActive = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleDistrictChange = (event, value) => {
    setSelectedDistrict(value);
    if (value) {
      setData(data.filter((court) => court.district === value));
    } else {
      fetchData();
    }
  };

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
          <AutorenewIcon
            color="secondary"
            onClick={() => handleClickOpen(params.row, "update")}
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
            renderInput={(params) => <TextField {...params} label="Khu Vực" />}
          />
        )}
        <div className="datatable">
          <div className="datatableTitle">
            <span>Sân hoạt động</span>
          </div>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <span>{error}</span>
            </Box>
          ) : (
            <DataGrid
            autoHeight

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
              slots={{ noRowsOverlay: CustomNoRowsOverlay }}
              sx={{ '--DataGrid-overlayHeight': '300px' }}
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

export default CourtsActive;
