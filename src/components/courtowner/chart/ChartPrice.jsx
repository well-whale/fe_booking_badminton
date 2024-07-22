import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { getPayRevenueForCourtOwner } from '../../../services/UserServices';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/userSlice';

const ChartPrice = () => {
  const [series, setSeries] = useState([{
    name: 'Doanh Thu',
    data: Array(12).fill(0) // Initialize with 12 zeros
  }]);
  
  const user = useSelector(selectUser).user;

  useEffect(() => {
    const fetchPaymentData = async () => {
      const result = await getPayRevenueForCourtOwner(user.userID);
      console.log("API response:", result); // Log the API response to inspect

      if (result.status === 200) {
        // Process the payment data
        const monthlyEarnings = Array(12).fill(0); // Array to hold earnings for each month

        result.data.forEach(payment => {
          const month = new Date(payment.paymentDate).getMonth(); // Get the month (0-11)
          monthlyEarnings[month] += payment.paymentAmount; // Add the payment amount to the corresponding month
        });

        console.log("Monthly earnings:", monthlyEarnings); // Log the processed monthly earnings

        setSeries([{
          name: 'Doanh Thu',
          data: monthlyEarnings
        }]);
      }
    };

    fetchPaymentData();
  }, [user.userID]);

  const options = {
    chart: {
      type: 'area',
      stacked: false,
      height: 350,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: 'zoom'
      }
    },
    dataLabels: {
      enabled: false
    },
    markers: {
      size: 0,
    },
    title: {
      text: 'Doanh Thu',
      align: 'left'
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val;
        },
      },
      title: {
        text: 'VND'
      },
    },
    xaxis: {
      categories: [
        'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
      ],
      type: 'category' // Change back to category
    },
    tooltip: {
      shared: false,
      y: {
        formatter: function (val) {
          return val;
        }
      }
    }
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="line" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ChartPrice;
