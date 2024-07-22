import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { fetchAllCourts, getAllCourtOfOwner } from "../../../services/UserServices";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";

const ChartOrder = ({ data }) => {
  const [series, setSeries] = useState([
    { name: "Đang hoạt động", data: [] },
    { name: "Chờ duyệt", data: [] },
    { name: "Tạm ngưng", data: [] },
  ]);

  useEffect(() => {
    setSeries([
      { name: "Đang hoạt động", data: data.active },
      { name: "Chờ duyệt", data: data.pending },
      { name: "Tạm ngưng", data: data.inactive },
    ]);
  }, [data]);

  const options = {
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    xaxis: {
      categories: [
        "Quận 1",
        "Quận 2",
        "Quận 3",
        "Quận 4",
        "Quận 5",
        "Quận 6",
        "Quận 7",
        "Quận 8",
        "Quận 10",
        "Quận 11",
        "Quận 12",
        "Phú Nhuận",
        "Bình Thạnh",
        "Gò Vấp",
        "Tân Bình",
        "Bình Tân",
        "Tân Phú",
        "Thủ Đức",
        "Bình Chánh",
        "Hóc Môn",
        "Củ Chi",
        "Cần Giờ",
        "Nhà Bè",
      ],
    },
    fill: {
      opacity: 1,
    },
    title: {
      text: 'Sân Cầu Lông',
      align: 'left'
    },
    // yaxis: {
    //   title: {
    //     text: 'Số sân ',
    //     align: 'center',
    //     style: {
    //       color: '#444'
    //     }
    //   }
    
    // },
    legend: {
      position: "right",
      offsetX: 0,
      offsetY: 50,
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

const ChartContainer = () => {
  const user = useSelector(selectUser).user;

  const [courts, setCourts] = useState({ active: [], pending: [], inactive: [] });

  const getListCourt = async () => {
    const res = await getAllCourtOfOwner(user.userID);
    if (res.status === 200) {
      const data = res.data;
      const districts = [
        "Quận 1",
        "Quận 2",
        "Quận 3",
        "Quận 4",
        "Quận 5",
        "Quận 6",
        "Quận 7",
        "Quận 8",
        "Quận 10",
        "Quận 11",
        "Quận 12",
        "Phú Nhuận",
        "Bình Thạnh",
        "Gò Vấp",
        "Tân Bình",
        "Bình Tân",
        "Tân Phú",
        "Thủ Đức",
        "Bình Chánh",
        "Hóc Môn",
        "Củ Chi",
        "Cần Giờ",
        "Nhà Bè",
      ];

      const active = districts.map(district =>
        data.filter(court => court.district === district && court.statusCourt === 1).length
      );
      const pending = districts.map(district =>
        data.filter(court => court.district === district && court.statusCourt === 0).length
      );
      const inactive = districts.map(district =>
        data.filter(court => court.district === district && court.statusCourt === -1).length
      );

      setCourts({ active, pending, inactive });
            // console.log(      { active, pending, inactive })

    }
  };

  useEffect(() => {
    getListCourt();
  }, []);

  return <ChartOrder data={courts} />;
};

export default ChartContainer;
