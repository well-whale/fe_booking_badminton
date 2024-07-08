import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const BookedDetail = ({ open, onClose, booking }) => {
    const [selectedBooking, setSelectedBooking] = useState(null);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    const handleDetailClick = (paymentHistory) => {
        if (selectedBooking && selectedBooking.id === paymentHistory.id) {
            setSelectedBooking(null); // Close if the same booking is clicked
        } else {
            setSelectedBooking(paymentHistory); // Open new booking details
        }
    };

  if (!booking) return null;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Booking Details</DialogTitle>
      <div key={booking.id} className="booking-card">
                    <div className="month">{formatDate(booking.paymentResDTO.paymentDate)}</div>
                    <div className="booking-info">
                        <div className="booking-id">Mã giao dịch <b>{booking.paymentResDTO.trasactionCode}</b></div>
                        <div className="route">
                            {booking.courtName}
                        </div>
                        <div className="status">{booking.paymentResDTO.paymentStatus}</div>
                    </div>
                        <div className="booking-details">
                            <div className="transaction-success">
                                <div className="transaction-amount">{booking.totalPrice * 1000} VND</div>
                                <div className="transaction-info">
                                    <p>GIAO DỊCH VÀO</p>
                                    <div>{formatDate(booking.paymentResDTO.paymentDate)}</div>
                                    <p>PHƯƠNG THỨC THANH TOÁN</p>
                                    <p>VNpay</p>
                                </div>
                            </div>
                            <div className="product-details">
                                <h3>Chi tiết sản phẩm</h3>
                                {booking.bookingDetails.map((detail, index) => (
                                    <div key={index} className="flight-info">
                                        <p>{booking.courtName}</p>
                                        <p>{booking.bookingDate} · {detail.startTime}-{detail.endTime}</p>
                                        <p>Khu vực sân {detail.subCourtName} - {booking.address}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    
                </div>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookedDetail;
