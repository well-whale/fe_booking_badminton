import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  styled,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import UpdateIcon from "@mui/icons-material/Update";
import "./Customer.css";
import UserDetail from "../single/UserDetail";
import NewUser from "../new/NewUser";
import UpdateUser from "../update/UpdateUser";
import {
  deleteAccount,
  deleteByUserID,
  fetchAllUsers,
} from "../../services/UserServices";

const Alert = React.forwardRef((props, ref) => {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
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
const ListAdmin = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const fetchData = async () => {
    try {
      const response = await fetchAllUsers();
      const customers = response.data.result.filter(
        (user) => user.role.roleName === "Admin"
      );
      setData(customers);
      console.log(customers);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    setDeleteId(id);
    setDialogType("delete");
    setOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteAccount(deleteId);
      setSnackbarMessage("User deleted successfully!");
      setSnackbarSeverity("success");
      fetchData();
      handleClose();
    } catch (error) {
      setSnackbarMessage("Error deleting user!");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleClickOpen = (user, type) => {
    setSelectedUser(user);
    setDialogType(type);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setDeleteId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
            Xem
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<UpdateIcon />}
            onClick={() => handleClickOpen(params.row, "update")}
          >
            Cập nhật
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.userID)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const userColumns = [
    { field: "userID", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "Họ", width: 140 },
    { field: "lastName", headerName: "Tên", width: 140 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phone", headerName: "Số điện thoại", width: 100 },
  ];

  return (
    <div className="customer">
      <Sidebar />
      <div className="customerContainer">
        <div className="datatable">
          <div className="datatableTitle">
            <span>Admin</span>
            <Button
              variant="outlined"
              color="success"
              startIcon={<NoteAddIcon />}
              onClick={() => setDialogType("new") || setOpen(true)}
            >
              Tạo Mới
            </Button>
          </div>
          <DataGrid
            autoHeight
            className="datagrid"
            rows={data}
            columns={userColumns.concat(actionColumn)}
            pageSize={5}
            rowsPerPageOptions={[5, 10, 20]}
            getRowId={(row) => row.userID}
            slots={{ noRowsOverlay: CustomNoRowsOverlay }}
            sx={{ "--DataGrid-overlayHeight": "300px" }}
          />
        </div>
      </div>

      {dialogType === "view" && selectedUser && (
        <UserDetail open={open} onClose={handleClose} user={selectedUser} />
      )}
      {dialogType === "new" && (
        <NewUser
          open={open}
          handleClose={handleClose}
          refreshData={fetchData}
        />
      )}
      {dialogType === "update" && (
        <UpdateUser
          open={open}
          handleClose={handleClose}
          user={selectedUser}
          refreshData={fetchData}
        />
      )}
      {dialogType === "delete" && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>Bạn có chắc chắn muốn xóa? </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Hủy
            </Button>
            <Button onClick={confirmDelete} color="secondary">
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ListAdmin;
