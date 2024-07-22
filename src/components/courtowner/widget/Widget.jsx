import React, { useState, useEffect } from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BackupTableIcon from "@mui/icons-material/BackupTable";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import "./Widget.css";
import { fetchAllCourts, fetchAllUsers, getAllCourtOfOwner, getAllPayment } from "../../../services/UserServices";
import { Link } from "react-router-dom";
import VND from "../../price/PriceFormat";
import { useSelector } from "react-redux";
import { selectUser } from "../../../redux/userSlice";

const Widget = ({ type }) => {
  const [data, setData] = useState({});
  const [amount, setAmount] = useState(0);
  const [diff, setDiff] = useState(0);
  const user = useSelector(selectUser).user;

  useEffect(() => {
    const getData = async () => {
      let result;

      switch (type) {
        case "customer":
          result = await fetchAllUsers();
          console.log(result.data);
          if (result.status === 200) {
            setData({
              title: "Tài Khoản",
              isMoney: false,
              namelink: "Xem toàn bộ người dùng",
              link: "/admin/listUsers",
              icon: (
                <PersonOutlineOutlinedIcon
                  className="icon"
                  style={{ color: "crimson", backgroundColor: "#ff000033" }}
                />
              ),
              amount: result.data.result.length,
            });
          }
          break;
        case "court":
          result = await getAllCourtOfOwner(user.userID);
          if (result.status === 200) {
            setData({
              title: "Sân ",
              isMoney: false,
              namelink: "Xem toàn bộ sân cầu lông",
              link: "/admin/listCourtActive",
              icon: (
                <BackupTableIcon
                  className="icon"
                  style={{ color: "goldenrod", backgroundColor: "#daa52033" }}
                />
              ),
              amount: result.data.length,
            });
          }
          break;
          case "earnings":
            result = await getAllPayment();
            console.log(result.data);
            if (result.status === 200) {
              // Calculate the total earnings
              const totalEarnings = result.data.reduce((acc, payment) => acc + payment.paymentAmount, 0);
          
              setData({
                title: "TOTAL EARNINGS",
                // isMoney: true,
                link: "View net earnings",
                icon: (
                  <MonetizationOnOutlinedIcon
                    className="icon"
                    style={{ color: "green", backgroundColor: "#00800033" }}
                  />
                ),
                // amount: totalEarnings, // Set the calculated total earnings amount
                amount: VND.format(totalEarnings) // Format the earnings amount if needed
              });
            }
            break;
        default:
          break;
      }
    };

    getData();
  }, [type]);

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {data.amount}
        </span>
        <span className="link">
          <Link to={data.link}>{data.namelink}</Link>
        </span>
      </div>
      <div className="right">
        <div className="percentage positive">
          <KeyboardArrowUpIcon />
          {diff}%
        </div>
        {data.icon}
      </div>
    </div>
  );
};

export default Widget;
