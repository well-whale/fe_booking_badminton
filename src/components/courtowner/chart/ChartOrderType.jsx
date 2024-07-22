import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getAllBookingForCourtOwner } from '../../../services/UserServices';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';

const ChartOrderType = () => {
  const [series, setSeries] = useState([0, 0]);
  const user = useSelector(selectUser).user;

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const result = await getAllBookingForCourtOwner(user.userID);
        if (result.status === 200) {
          const bookingDayList = result.data.bookingDayList || [];
          const recurringBookingList = result.data.recurringBookingList || [];

          console.log('Fetched booking data:', result.data);

          const dayBookings = bookingDayList.length;
          const recurringBookings = recurringBookingList.length;

          setSeries([dayBookings, recurringBookings]);
        } else {
          console.error('Failed to fetch bookings:', result);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookingData();
  }, [user.userID]);

  const options = {
    title: {
      text: 'Loại đặt lịch',
      align: 'left',
    },
    chart: {
      type: 'pie',
    },
    labels: ['Đặt ngày', 'Đặt cố định'],
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

export default ChartOrderType;
