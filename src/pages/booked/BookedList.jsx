// src/BookingList.js
import React, { useState } from 'react';
import "./BookedList.css";

const bookings = [
    {
        id: 1138779408,
        name: "Sân Cầu lông Tre Xanh",
        price: "200.000 VND",
        status: "Giao dịch thành công",
        month: "29 tháng 04 2024",
        date: "05 tháng 05 2024",
        time: "15h00 - 17h00",
        address: "50 Xô Viết Nghệ Tĩnh, Phường 19, Bình Thạnh, Thành phố Hồ Chí Minh",
        subcourt:"3"
       
    },
    {
        id: 1136029074,
        name: "Sân Cầu lông Tre Xanh",
        price: "120.000 VND",
        status: "Giao dịch thành công",
        month: "30 tháng 04 2024",
        date: "15 tháng 05 2024",
        time: "8h00 - 9h00",
        address: "Khu Viso Kiến Thiết cũ, 50 Dân Chủ, Hiệp Phú, Quận 9, Thành phố Hồ Chí Minh",
        subcourt:"2"
    }
];

const BookingList = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);

    const handleDetailClick = (booking) => {
        if (selectedBooking && selectedBooking.id === booking.id) {
            setSelectedBooking(null); // Close if the same booking is clicked
        } else {
            setSelectedBooking(booking);
        }
    };

    return (
        <div className="container1">
            {bookings.map((booking) => (
                <div key={booking.id} className="booking-card">
                    <div className="month">{booking.month}</div>
                    <div className="booking-info">
                        <div className="booking-id">Mã giao dịch <b>{booking.id}</b></div>
                        <div className="route">
                             {booking.name}
                        </div>
                        <div className="status">{booking.status}</div>
                        <div className="price">{booking.price}</div>
                    </div>
                    <div className="detail-link" onClick={() => handleDetailClick(booking)}>Xem chi tiết</div>
                    {selectedBooking && selectedBooking.id === booking.id && (
                        <div className="booking-details">
                            <div className="transaction-success">
                                <div className="transaction-amount">{booking.price}</div>
                                <div className="transaction-info">
                                    <p>GIAO DỊCH VÀO</p>
                                    <div>{booking.month}</div>
                                    <p>PHƯƠNG THỨC THANH TOÁN</p>
                                    <p>VNpay</p>
                                </div>
                            </div>
                            <div className="product-details">
                                <h3>Chi tiết sản phẩm</h3>
                                <div className="flight-info">
                                    <p>{booking.name}</p>
                                    <p>{booking.date} · {booking.time}</p>
                                    <p> Khu vực sân {booking.subcourt} - {booking.address}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default BookingList;
