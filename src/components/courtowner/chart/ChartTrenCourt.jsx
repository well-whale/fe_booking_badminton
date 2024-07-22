import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { fetchAllCourts, getAllBooking, getAllBookingForCourtOwner, getAllCourtOfOwner } from '../../../services/UserServices';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';

const ChartOrderOfCourt = () => {
  const [courts, setCourts] = useState([]);
  const [series, setSeries] = useState([]);
  const user = useSelector(selectUser).user;

  const getListCourt = async () => {
    try {
      const res = await getAllCourtOfOwner(user.userID);
      if (res.status === 200) {
        const filteredCourts = res.data.filter(court => court.statusCourt === 1);
        setCourts(filteredCourts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getBookingCourt = async () => {
    try {
      const res = await getAllBookingForCourtOwner(user.userID);
      if (res.status === 200) {
        const bookingDayList = res.data.bookingDayList;
        const recurringBookingList = res.data.recurringBookingList;

        // Combine all bookings
        const allBookings = [...bookingDayList, ...recurringBookingList];

        // Count bookings per court
        const courtBookings = {};
        allBookings.forEach(booking => {
          const courtName = booking.courtName;
          if (!courtBookings[courtName]) {
            courtBookings[courtName] = 0;
          }
          courtBookings[courtName]++;
        });

        const courtNames = courts.map(court => court.courtName);
        const bookingCounts = courtNames.map(name => courtBookings[name] || 0);

        setSeries(bookingCounts);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getListCourt();
  }, []);

  useEffect(() => {
    if (courts.length > 0) {
      getBookingCourt();
    }
  }, [courts]);

  const options = {
    title: {
      text: 'Số lượng đặt',
      align: 'left',
    },
    chart: {
      type: 'pie',
    },
    labels: courts.map(court => court.courtName),
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="pie" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ChartOrderOfCourt;
