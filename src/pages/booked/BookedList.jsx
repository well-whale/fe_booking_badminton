import React, { useEffect, useState, useMemo } from "react";
import "./BookedList.css";
import { getBookedByID } from "../../services/UserServices";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import Pagination from "@mui/material/Pagination";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  RadioGroup,
  FormLabel,
  FormControl,
  Radio,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import VND from "../../components/price/PriceFormat";

const dayMapping = {
  SUNDAY: "Chủ Nhật",
  MONDAY: "Thứ 2",
  TUESDAY: "Thứ 3",
  WEDNESDAY: "Thứ 4",
  THURSDAY: "Thứ 5",
  FRIDAY: "Thứ 6",
  SATURDAY: "Thứ 7",
};

const BookingList = () => {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookingType, setBookingType] = useState("all");
  const user = useSelector(selectUser)?.user;

  const itemsPerPage = 6;

  const fetchData = async (userID) => {
    try {
      const response = await getBookedByID(userID);
      const { bookingResponseList, recurringBookingResponseList } = response.data;

      const combinedList = [
        ...bookingResponseList.map((item) => ({
          ...item,
          uniqueKey: `booking-${item.bookingId}`,
        })),
        ...recurringBookingResponseList.map((item) => ({
          ...item,
          uniqueKey: `recurring-${item.recurringBookingID}`,
        })),
      ];

      const sortedData = combinedList.sort(
        (a, b) => new Date(b.paymentResDTO.paymentDate) - new Date(a.paymentResDTO.paymentDate)
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
    if (selectedBooking && selectedBooking.uniqueKey === paymentHistory.uniqueKey) {
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

  const handleBookingTypeChange = (event) => {
    setBookingType(event.target.value);
  };

  const filteredItems = useMemo(() => {
    return paymentHistory.filter((item) => {
      const itemDate = new Date(item.paymentResDTO.paymentDate);
      const matchesDate =
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate);

      const matchesType =
        bookingType === "all" ||
        (bookingType === "day" && item.bookingId) ||
        (bookingType === "current" && item.recurringBookingID);

      return matchesDate && matchesType;
    });
  }, [paymentHistory, startDate, endDate, bookingType]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
console.log(currentItems)
  return (
    <div>
      <div className="bookedlist">
        <div className="bookedlistfillter">
          <FormControl style={{ padding: "20px", gap: "20px" }}>
            <FormLabel id="demo-radio-buttons-group-label">Loại hình</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={bookingType}
              onChange={handleBookingTypeChange}
              name="radio-buttons-group"
            >
              <FormControlLabel value="all" control={<Radio />} label="Tất cả" />
              <FormControlLabel value="day" control={<Radio />} label="Đặt ngày" />
              <FormControlLabel value="current" control={<Radio />} label="Đặt cố định" />
            </RadioGroup>
          </FormControl>
          <Box
            display="grid"
            alignItems="center"
            style={{ padding: "20px", gap: "20px" }}
            component="section"
          >
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
            <Button onClick={handleResetDate} fullWidth variant="outlined" >
              Tất cả
            </Button>
          </Box>
        </div>

        <div className="container1">
          {currentItems.map((paymentHistory) => (
            <BookingCard
              key={paymentHistory.uniqueKey}
              paymentHistory={paymentHistory}
              selectedBooking={selectedBooking}
              handleDetailClick={handleDetailClick}
              formatDate={formatDate}
            />
          ))}
        </div>
      </div>
      <Pagination
        style={{ backgroundColor: "none" }}
        className="pagination"
        count={Math.ceil(filteredItems.length / itemsPerPage)}
        variant="outlined"
        shape="rounded"
        page={currentPage}
        onChange={handleChangePage}
      />
    </div>
  );
};

const BookingCard = ({
  paymentHistory,
  selectedBooking,
  handleDetailClick,
  formatDate,
}) => {
  return (
    <div className="booking-card">
      <div className="month">{formatDate(paymentHistory.paymentResDTO.paymentDate)}</div>
      <div className="booking-info">
        <div className="booking-id">
          Mã giao dịch <b>{paymentHistory.paymentResDTO.transactionCode}</b>
        </div>
        <div className="route">{paymentHistory.courtName}</div>
        <div className="status">{paymentHistory.paymentResDTO.paymentStatus}</div>
        <div className="price">{VND.format(paymentHistory.totalPrice)}</div>
      </div>
      <div className="detail-link" onClick={() => handleDetailClick(paymentHistory)}>
        Xem chi tiết
      </div>
      {selectedBooking && selectedBooking.uniqueKey === paymentHistory.uniqueKey && paymentHistory.bookingId && (
        <BookingDayDetails paymentHistory={paymentHistory} formatDate={formatDate} />
      )}
      {selectedBooking && selectedBooking.uniqueKey === paymentHistory.uniqueKey && paymentHistory.recurringBookingID && (
        <BookingRecurentDetails paymentHistory={paymentHistory} formatDate={formatDate} />
      )}
    </div>
  );
};

const BookingRecurentDetails = ({ paymentHistory, formatDate }) => {
  return (
    <div className="booking-details">
      <div className="transaction-success">
        <div className="transaction-amount">{VND.format(paymentHistory.totalPrice)}</div>
        <div className="transaction-info ">
          <p className="route">GIAO DỊCH VÀO</p>
          <div>{formatDate(paymentHistory.paymentResDTO.paymentDate)}</div>
          <p className="route">PHƯƠNG THỨC THANH TOÁN</p>
          <p>VNPAY</p>
        </div>
      </div>
      <div className="product-details">
        <h3>Chi tiết đặt chỗ</h3>
        <div className="flight-info">
          <p>{paymentHistory.courtName}</p>
          <p>
            {formatDate(paymentHistory.startDate)} --- {formatDate(paymentHistory.endDate)}
          </p>
          <p>
            {(paymentHistory.startTime)} --- {(paymentHistory.endTime)}
          </p>
        </div>
        <div className="flight-info">
          {paymentHistory.daysOfWeek.map((detail, index) => (
            <div key={index}>
              <p>{dayMapping[detail]}</p>
            </div>
          ))}
        </div>
        <div className="flight-info">
          {paymentHistory.subCourts.map((detail, index) => (
            <div key={index}>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BookingDayDetails = ({ paymentHistory, formatDate }) => {
  return (
    <div className="booking-details">
      <div className="transaction-success">
        <div className="transaction-amount">{VND.format(paymentHistory.totalPrice)}</div>
        <div className="transaction-info ">
          <p className="route">GIAO DỊCH VÀO</p>
          <div>{formatDate(paymentHistory.paymentResDTO.paymentDate)}</div>
          <p className="route">PHƯƠNG THỨC THANH TOÁN</p>
          <p>VNPAY</p>
        </div>
      </div>
      <div className="product-details">
        <h3>Chi tiết đặt chỗ</h3>
        {paymentHistory.bookingDetails.map((detail, index) => (
          <div key={index} className="flight-info">
            <p>{paymentHistory.courtName}</p>
            <p>{paymentHistory.address}</p>

            <p>
              {paymentHistory.bookingDate} · {detail.startTime}-{detail.endTime}
            </p>
            <p>
              Khu vực sân {detail.subCourtName} - {paymentHistory.address}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingList;
