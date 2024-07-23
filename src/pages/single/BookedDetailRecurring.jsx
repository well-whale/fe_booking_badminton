import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import VND from '../../components/price/PriceFormat';

const BookedDetailRecurring = ({ open, onClose, booking }) => {
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
  const dayMapping = {
    SUNDAY: "Chủ Nhật",
    MONDAY: "Thứ 2",
    TUESDAY: "Thứ 3",
    WEDNESDAY: "Thứ 4",
    THURSDAY: "Thứ 5",
    FRIDAY: "Thứ 6",
    SATURDAY: "Thứ 7",
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Booking Details</DialogTitle>
      <div className="booking-details">
      <div className="transaction-success">
        <div className="transaction-amount">{VND.format(booking.totalPrice)}</div>
        <div className="transaction-info ">
          <p className="route">GIAO DỊCH VÀO</p>
          <div>{formatDate(booking.paymentResDTO.paymentDate)}</div>
          <p className="route">PHƯƠNG THỨC THANH TOÁN</p>
          <p>VNPAY</p>
        </div>
      </div>
      <div className="product-details">
        <h3>Chi tiết đặt chỗ</h3>
        <div className="flight-info">
          <p>{booking.courtName}</p>
          <p>{booking.address}</p>

          <p>
            {formatDate(booking.startDate)} --- {formatDate(booking.endDate)}
          </p>
          <p>
            {(booking.startTime)} --- {(booking.endTime)}
          </p>
        </div>
        <div className="flight-info">
          {booking.daysOfWeek.map((detail, index) => (
            <div key={index}>
              <p>{dayMapping[detail]}</p>
            </div>
          ))}
        </div>
        <div className="flight-info">
          {booking.subCourts.map((detail, index) => (
            <div key={index}>
              <p>{detail}</p>
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

export default BookedDetailRecurring;
