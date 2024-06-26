import React, { useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./CourtDetail.css";
import { CiWifiOn } from "react-icons/ci";
import { FaMotorcycle } from "react-icons/fa";
import { GiWaterBottle } from "react-icons/gi";
import { MdOutlineFastfood } from "react-icons/md";
import { LuMapPin } from "react-icons/lu";
import { IoMdRestaurant } from "react-icons/io";
import { getCourtByIdCourt } from "../../services/UserServices";
import { Button, Dialog, DialogActions, DialogTitle, Slide } from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const CourtDetail = () => {
  const { idCourt } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getDetailCourt = async () => {
    try {
      const res = await getCourtByIdCourt(idCourt);
      if (res.status === 200) {
        setCourt(res.data);
        console.log(res.data);
      } else {
        setError("Failed to fetch court details");
      }
    } catch (err) {
      setError("An error occurred while fetching court details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailCourt();
  }, [idCourt]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!court) {
    return <div>No court details available</div>;
  }

  const amenities = [
    { name: "Wifi", icon: <CiWifiOn /> },
    { name: "Bãi đỗ xe máy", icon: <FaMotorcycle /> },
    { name: "Nước uống", icon: <GiWaterBottle /> },
    { name: "Căng tin", icon: <IoMdRestaurant /> },
    { name: "Đồ ăn", icon: <MdOutlineFastfood /> },
  ];

  const getPriceRange = (prices) => {
    if (Array.isArray(prices) && prices.length > 0) {
      const unitPrices = prices.map((price) => price.unitPrice);
      const minPrice = Math.min(...unitPrices);
      const maxPrice = Math.max(...unitPrices);

      return `${minPrice} - ${maxPrice} VND`;
    }
    return "Đang Cập Nhật....";
  };

  const priceRange = getPriceRange(court.price);

  const handleBookingClick = () => {
    navigate(`/booking/${court.courtID}`);
  };

  return (
    <section className="product-detail-container">
      <div className="image-gallery-container">
        <img className="image-gallery" src={court.images} alt={court.courtName} />

        {/* {court.images
         && (
          <ReactImageGallery
            showBullets={false}
            showFullscreenButton={false}
            showPlayButton={false}
            items={court.images.map((url) => ({
              original: url,
              thumbnail: url
            }))}
          />
        )
        } */}
      </div>

      <div className="product">
        <div className="amenities-container">
          <h2 className="product-title">{court.courtName}</h2>
          <h3 className="product-category">
            <LuMapPin /> <span>{court.courtAddress}</span>
          </h3>
          <div className="product-reviews">{/* Reviews component here */}</div>
          <p className="product-brand">
            Giờ Hoạt Động:{" "}
            <span>
              {court.startTime} - {court.endTime}
            </span>
          </p>
          <p className="product-brand">
            Quy mô: <span>{court.courtQuantity} Sân </span>
          </p>
          <p className="product-sku">
            Điện Thoại: <span>{court.phoneNumber}</span>
          </p>
          <p className="product-price">
            Giá: <span>{priceRange} </span>
          </p>
        </div>

        <div className="amenities-container">
          <h5>Dịch vụ tiện ích</h5>
          <ul className="amenities-list">
            {amenities.map((amenity, index) => (
              <li key={index} className="amenity-item">
                <div className="amenity-icon">{amenity.icon}</div>
                <div>{amenity.name}</div>
              </li>
            ))}
          </ul>
        </div>

        <button className="btn-book" onClick={handleClickOpen}>
          Đặt sân
        </button>
      </div>
      <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      className="dialog"
    >
      <div className="choseType">
        <div className="buttonType">
          <Button variant="contained" color="success" onClick={handleBookingClick}>
            <CalendarTodayIcon /> Đặt Sân Ngày
          </Button>
        </div>
        <div className="buttonType">
          <Button variant="contained" color="error" onClick={handleClose}>
            <CalendarMonthIcon /> Đặt sân cố định
          </Button>
        </div>
      </div>
    </Dialog>
    </section>
  );
};

export default CourtDetail;
