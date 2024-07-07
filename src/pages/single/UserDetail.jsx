import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  CardContent,
  Typography,
  CardMedia,
} from "@mui/material";
import "../single/UserDetail.css";

const UserDetail = ({ open, onClose, user }) => {
  return (
    <Dialog
      fullScreen={false}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        {/* <div className="single">
          <div className="singleContainer">
            <div className="top">
              <div className="left">
                <h1 className="title">Information Customer</h1>
                
                <div className="item">
                  
                  <div className="details">
                    <h1 className="itemTitle">{user.firstName} {user.lastName}</h1>
                    <div className="detailItem">
                      <span className="itemKey">Email: </span>
                      <span className="itemValue">{user.email}</span>
                    </div>
                  
                    <div className="detailItem">
                      <span className="itemKey">Phone: </span>
                      <span className="itemValue">{user.phone}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Role: </span>
                      <span className="itemValue">{user.role.roleName}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        {/* <CardMedia
          // sx={{ height: 350 }}
          component="img"
          // height="140"
          image="https://i.pinimg.com/564x/79/1b/3a/791b3a33b2ce3320ca1817310ad9ae58.jpg"
        /> */}
        <CardContent >
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {user.role.roleName === "Admin"
              ? "Admin Profile"
              : user.role.roleName === "Customer"
              ? "Customer Profile"
              : user.role.roleName === "Court Owner"
              ? "Court Owner Profile"
              : ""}
          </Typography>

          <Typography variant="h5" component="div">
            {user.firstName} {user.lastName}{" "}
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {user.email}
          </Typography>
          <Typography variant="body2">
            {user.phone}
            <br />
          </Typography>
        </CardContent>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserDetail;
