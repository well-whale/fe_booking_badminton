import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
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
        <div className="single">
          <div className="singleContainer">
            <div className="top">
              <div className="left">
                <h1 className="title">Information Customer</h1>
                
                <div className="item">
                  <img
                    src="https://i.pinimg.com/564x/99/6c/08/996c082e009ab441b7ce60224b4a6194.jpg"
                    alt=""
                    className="itemImg"
                  />
                  <div className="details">
                    <h1 className="itemTitle">{user.firstName} {user.lastName}</h1>
                    <div className="detailItem">
                      <span className="itemKey">Email: </span>
                      <span className="itemValue">{user.email}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Password: </span>
                      <span className="itemValue">{user.password}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Phone: </span>
                      <span className="itemValue">{user.phone}</span>
                    </div>
                    <div className="detailItem">
                      <span className="itemKey">Role: </span>
                      <span className="itemValue">{user.role ? "Admin" : "User"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
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
