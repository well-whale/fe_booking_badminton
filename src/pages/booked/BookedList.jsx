// src/BookingList.js
import React, { useEffect, useState } from 'react';
import "./BookedList.css";
import { getBookedByID } from '../../services/UserServices';
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/userSlice';
import Pagination from '@mui/material/Pagination';
import { Box } from '@mui/material';

const BookingList = () => {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const user = useSelector(selectUser)?.user; // Ensure user is selected correctly

    const itemsPerPage = 3;

    const fetchData = async (userID) => {
        try {
            const response = await getBookedByID(userID);
            console.log(response.data)
            const sortedData = response.data.sort((a, b) => new Date(b.paymentResDTO.paymentDate) - new Date(a.paymentResDTO.paymentDate));
            setPaymentHistory(sortedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        if (user && user.userID) {
            fetchData(user.userID);
        }
    }, [user]);

    const handleDetailClick = (paymentHistory) => {
        if (selectedBooking && selectedBooking.id === paymentHistory.id) {
            setSelectedBooking(null); // Close if the same booking is clicked
        } else {
            setSelectedBooking(paymentHistory); // Open new booking details
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleChangePage = (event, value) => {
        setCurrentPage(value);
    };

    // Calculate the items to display based on current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = paymentHistory.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container1">
            {currentItems.map((paymentHistory) => (
                <div key={paymentHistory.id} className="booking-card">
                    <div className="month">{formatDate(paymentHistory.paymentResDTO.paymentDate)}</div>
                    <div className="booking-info">
                        <div className="booking-id">Mã giao dịch <b>{paymentHistory.paymentResDTO.trasactionCode}</b></div>
                        <div className="route">
                            {paymentHistory.courtName}
                        </div>
                        <div className="status">{paymentHistory.paymentResDTO.paymentStatus}</div>
                        <div className="price">{paymentHistory.totalPrice * 1000} VND</div>
                    </div>
                    <div className="detail-link" onClick={() => handleDetailClick(paymentHistory)}>Xem chi tiết</div>
                    {selectedBooking && selectedBooking.id === paymentHistory.id && (
                        <div className="booking-details">
                            <div className="transaction-success">
                                <div className="transaction-amount">{paymentHistory.totalPrice * 1000} VND</div>
                                <div className="transaction-info">
                                    <p>GIAO DỊCH VÀO</p>
                                    <div>{formatDate(paymentHistory.paymentResDTO.paymentDate)}</div>
                                    <p>PHƯƠNG THỨC THANH TOÁN</p>
                                    <p>VNpay</p>
                                </div>
                            </div>
                            <div className="product-details">
                                <h3>Chi tiết sản phẩm</h3>
                                {paymentHistory.bookingDetails.map((detail, index) => (
                                    <div key={index} className="flight-info">
                                        <p>{paymentHistory.courtName}</p>
                                        <p>{paymentHistory.bookingDate} · {detail.startTime}-{detail.endTime}</p>
                                        <p>Khu vực sân {detail.subCourtName} - {paymentHistory.address}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
            <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                    count={Math.ceil(paymentHistory.length / itemsPerPage)}
                    page={currentPage}
                    onChange={handleChangePage}
                />
            </Box>
        </div>
    );
};

export default BookingList;
