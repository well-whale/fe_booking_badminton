import React, { useEffect, useState, useMemo } from "react";
import "./BookedList.css";
import { getBookedByID } from "../../services/UserServices";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import Pagination from "@mui/material/Pagination";
import { Box, TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import VND from "../../components/price/PriceFormat";

const BookingList = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const user = useSelector(selectUser)?.user;

  const itemsPerPage = 6;

  const fetchData = async (userID) => {
    try {
      const response = await getBookedByID(userID);
      const sortedData = response.data.sort(
        (a, b) =>
          new Date(b.paymentResDTO.paymentDate) -
          new Date(a.paymentResDTO.paymentDate)
      );
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
      setSelectedBooking(null);
    } else {
      setSelectedBooking(paymentHistory);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleChangePage = (event, value) => {
    setCurrentPage(value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date ? dayjs(date).toDate() : null);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date ? dayjs(date).toDate() : null);
  };

  const handleResetDate = () => {
    setStartDate(null);
    setEndDate(null);
  };

  const filteredItems = useMemo(() => {
    return paymentHistory.filter((item) => {
      const itemDate = new Date(item.paymentResDTO.paymentDate);
      return (!startDate || itemDate >= startDate) && (!endDate || itemDate <= endDate);
    });
  }, [paymentHistory, startDate, endDate]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div>
      <div className="container1" style={{ display: "block" }}>
        <Box display="flex" alignItems="center" style={{ padding: "20px",gap:"20px" }} component="section">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Chọn ngày bắt đầu"
              value={startDate ? dayjs(startDate) : null}
              onChange={handleStartDateChange}
              renderInput={(params) => <TextField {...params} />}
            />
            <DatePicker
              label="Chọn ngày kết thúc"
              value={endDate ? dayjs(endDate) : null}
              onChange={handleEndDateChange}
              renderInput={(params) => <TextField {...params} />}
              style={{ marginLeft: 16 }}
            />
          </LocalizationProvider>
          <Button onClick={handleResetDate} variant="outlined" style={{ marginLeft: 8 }}>
            Tất cả
          </Button>
        </Box>
        <div className="container1">
          {currentItems.map((paymentHistory) => (
            <BookingCard
              key={paymentHistory.id}
              paymentHistory={paymentHistory}
              selectedBooking={selectedBooking}
              handleDetailClick={handleDetailClick}
              formatDate={formatDate}
            />
          ))}
        </div>
      </div>
      <Pagination style={{backgroundColor:"none"}}
        className="pagination"
        count={Math.ceil(filteredItems.length / itemsPerPage)}
        variant="outlined"
        shape="rounded"
        page={currentPage}
        backgroundColor="none"
        onChange={handleChangePage}
      />
    </div>
  );
};

const BookingCard = ({ paymentHistory, selectedBooking, handleDetailClick, formatDate }) => {
  return (
    <div className="booking-card">
      <div className="month">
        {formatDate(paymentHistory.paymentResDTO.paymentDate)}
      </div>
      <div className="booking-info">
        <div className="booking-id">
          Mã giao dịch <b>{paymentHistory.paymentResDTO.transactionCode}</b>
        </div>
        <div className="route">{paymentHistory.courtName}</div>
        <div className="status">
          {paymentHistory.paymentResDTO.paymentStatus}
        </div>
        <div className="price">{VND.format(paymentHistory.totalPrice)}</div>
      </div>
      <div
        className="detail-link"
        onClick={() => handleDetailClick(paymentHistory)}
      >
        Xem chi tiết
      </div>
      {selectedBooking && selectedBooking.id === paymentHistory.id && (
        <BookingDetails paymentHistory={paymentHistory} formatDate={formatDate} />
      )}
    </div>
  );
};

const BookingDetails = ({ paymentHistory, formatDate }) => {
  return (
    <div className="booking-details">
      <div className="transaction-success">
        <div className="transaction-amount">
          {VND.format(paymentHistory.totalPrice)}
        </div>
        <div className="transaction-info ">
          <p className="route">GIAO DỊCH VÀO</p>
          <div>
            {formatDate(paymentHistory.paymentResDTO.paymentDate)}
          </div>
          <p className="route">PHƯƠNG THỨC THANH TOÁN</p>
          <p>VNPAY</p>
        </div>
      </div>
      <div className="product-details">
        <h3>Chi tiết đặt chỗ</h3>
        {paymentHistory.bookingDetails.map((detail, index) => (
          <div key={index} className="flight-info">
            <p>{paymentHistory.courtName}</p>
            <p>
              {paymentHistory.bookingDate} · {detail.startTime}-
              {detail.endTime}
            </p>
            <p>
              Khu vực sân {detail.subCourtName} -{" "}
              {paymentHistory.address}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
