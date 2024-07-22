import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { getAllBooking } from '../../../services/UserServices';

class ChartOrderType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      series: [0, 0],
      options: {
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
      },
    };
  }

  async componentDidMount() {
    try {
      const result = await getAllBooking();
      if (result.status === 200) {
        const bookingDayList = result.data.bookingDayList || [];
        const recurringBookingList = result.data.recurringBookingList || [];
        
        console.log('Fetched booking data:', result.data);
        
        const dayBookings = bookingDayList.length;
        const recurringBookings = recurringBookingList.length;

        this.setState({
          series: [dayBookings, recurringBookings]
        });
      } else {
        console.error('Failed to fetch bookings:', result);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  }

  render() {
    return (
      <div>
        <div id="chart">
          <ReactApexChart options={this.state.options} series={this.state.series} type="pie" height={350} />
        </div>
        <div id="html-dist"></div>
      </div>
    );
  }
}

export default ChartOrderType;
