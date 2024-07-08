import { Button, Typography, Container, Paper, Divider } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import UpdateProfile from "../update/UpdateProfile";
import Sidebar from "../../components/admin/sidebar/Sidebar";
import "./Profile.css";
import { getInfoUser } from "../../services/UserServices";

const ProfileAdmin = () => {
  const user = useSelector(selectUser)?.user;
  const [open, setOpen] = useState(false);
  const [userInfor, setUserInfor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserInfo = async () => {
    if (user && user.userID) {
      try {
        const res = await getInfoUser(user.userID);
        if (res.status === 200) {
          console.log(res.data.result);
          setUserInfor(res.data.result);
        } else {
          setError("Failed to fetch user information");
        }
      } catch (err) {
        setError("An error occurred while fetching user information");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [user?.userID]);

  const refreshData = () => {
    fetchUserInfo();
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="profile-page">
      <Sidebar />
      <Container maxWidth="md" className="profile-container">
        <Paper elevation={3} className="profile-paper">
          <div className="profile-header">
            <Typography variant="h4">Profile</Typography>
          </div>
          <Divider />
          <div className="profile-details">
            {userInfor ? (
              <>
                <Typography variant="h6">User Name: {userInfor.userName}</Typography>
                <Typography variant="h6">First Name: {userInfor.firstName}</Typography>
                <Typography variant="h6">Last Name: {userInfor.lastName}</Typography>
                <Typography variant="h6">Email: {userInfor.email}</Typography>
                <Typography variant="h6">Phone: {userInfor.phone}</Typography>
              </>
            ) : loading ? (
              <Typography variant="h6">Loading...</Typography>
            ) : (
              <Typography variant="h6" color="error">{error}</Typography>
            )}
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            className="update-button"
          >
            Update Profile
          </Button>
        </Paper>
      </Container>
      <UpdateProfile open={open} handleClose={handleClose} user={userInfor} refreshData={refreshData} />
    </div>
  );
};

export default ProfileAdmin;
