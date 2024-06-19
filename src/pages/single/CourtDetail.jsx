import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Slide,
} from "@mui/material";
import "./CourtDetail.css";

const CourtDetail = ({ open, onClose, court }) => {
  const Transition = React.forwardRef((props, ref) => (
    <Slide direction="up" ref={ref} {...props} />
  ));

  // Example price data based on the given SQL insert statements
  const priceData = [
    { courtid: 1, opening_time: "5:00:00", close_time: "16:00:00", active_status: "TT", unit_price: 70 },
    { courtid: 1, opening_time: "16:00:00", close_time: "23:00:00", active_status: "TT", unit_price: 130 },
    { courtid: 1, opening_time: "5:00:00", close_time: "8:00:00", active_status: "CT", unit_price: 70 },
    { courtid: 1, opening_time: "8:00:00", close_time: "23:00:00", active_status: "TT", unit_price: 5000 },
    { courtid: 2, opening_time: "5:00:00", close_time: "17:00:00", active_status: "ALL", unit_price: 50 },
    { courtid: 2, opening_time: "17:00:00", close_time: "21:00:00", active_status: "ALL", unit_price: 60 },
    { courtid: 2, opening_time: "21:00:00", close_time: "23:00:00", active_status: "ALL", unit_price: 70 }
  ];

  // Filter price data for the specific court
  const courtPrices = priceData.filter((price) => price.courtid === court.courtId);

  return (
    <Dialog
      fullScreen={false}
      TransitionComponent={Transition}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogContent>
        <div className="singleCourt">
          <div className="singleCourtContainer">
            <div className="courtTitle">Information Court</div>
            <div className="courtBody">
              <div className="courtImage">
                <img src="https://i.pinimg.com/736x/cd/ee/0c/cdee0cc151cf70cdc587e55168b4f0a9.jpg" alt="" className="courtItemImg" />
              </div>
              <div className="courtDetails">
                <div className="courtDetail">
                  <div className="courtDetailItem">
                    <span className="courtItemKey">ID Court: </span>
                    <span className="courtItemValue">{court.courtId}</span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">Name Court: </span>
                    <span className="courtItemValue">{court.courtName}</span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">District: </span>
                    <span className="courtItemValue">{court.district}</span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">Court Address: </span>
                    <span className="courtItemValue">{court.courtAddress}</span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">Court Quantity: </span>
                    <span className="courtItemValue">{court.courtQuantity}</span>
                  </div>
                  <div className="courtDetailItem">
                    <span className="courtItemKey">Slot Duration: </span>
                    <span className="courtItemValue">{court.slotDuration}</span>
                  </div>
                </div>
                <div className="courtPriceSlot">
                  <table>
                    <thead>
                      <tr>
                        <th>Opening Time</th>
                        <th>Closing Time</th>
                        <th>Active Status</th>
                        <th>Unit Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courtPrices.map((price, index) => (
                        <tr key={index}>
                          <td>{price.opening_time}</td>
                          <td>{price.close_time}</td>
                          <td>{price.active_status}</td>
                          <td>{price.unit_price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default CourtDetail;
