import React from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BackupTableIcon from '@mui/icons-material/BackupTable';
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import "./Widget.css";

const Widget = ({ type }) => {
  let data;
  // temp
  const amount = 500;
  const diff = 30;

  switch (type) {
    case "customer":
      data = {
        title: "CUSTOMERS",
        isMoney: false,
        link: "View all custommers",
        icon: (
          <PersonOutlineOutlinedIcon
            className="icon"
            style={{ color: "crimson", backgroundColor: "#ff000033" }}
          />
        ),
      };
      break;
    case "court":
      data = {
        title: "COURT",
        isMoney: false,
        link: "View all court",
        icon: (
          <BackupTableIcon
            className="icon"
            style={{ color: "goldenrod", backgroundColor: "#daa52033" }}
          />
        ),
      };
      break;
    case "earnings":
      data = {
        title: "TOTAL EARNINGS",
        isMoney: true,
        link: "View net earnings",
        icon: (
          <MonetizationOnOutlinedIcon
            className="icon"
            style={{ color: "green", backgroundColor: "#00800033" }}
          />
        ),
      };
      break;
    

    default:
      break;
  }

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {data.isMoney && "$"} {amount}
        </span>
        <span className="link">{data.link}</span>
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
