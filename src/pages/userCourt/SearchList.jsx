import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { NavLink } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import "./SearchList.css";
import { searchByDistrict } from "../../services/UserServices";
import VND from "../../components/price/PriceFormat";
import { TbReportMoney  } from "react-icons/tb";
import { PiCourtBasketball } from "react-icons/pi";


const address = [
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

const SearchList = () => {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [listSearchCourts, setListSearchCourts] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const district = params.get("district");
    if (district) {
      setSelectedDistrict(district);
      searchByDistrict(district)
        .then((response) => {
          setListSearchCourts(
            response.data.filter((court) => court.statusCourt === 1)
          );
          console.log(response.data);
        })

        .catch((error) => {
          console.error("There was an error making the request!", error);
        });
    }
  }, [location.search]);

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/search?district=${selectedDistrict}`);
  };

  const getPriceRange = (prices) => {
    if (Array.isArray(prices) && prices.length > 0) {
      const unitPrices = prices.map((price) => price.unitPrice);
      const minPrice = Math.min(...unitPrices);
      const maxPrice = Math.max(...unitPrices);

      return `${VND.format(minPrice)} - ${VND.format(maxPrice)}`;
    }
    return "Đang Cập Nhật....";
  };
  return (
    <div>
      <div className="section__container">
        <div className="booking__container1">
          <form onSubmit={handleSubmit}>
            <div className="form__group">
              <div className="input__group">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={address}
                  sx={{ width: 300 }}
                  value={selectedDistrict}
                  onChange={(event, newValue) => {
                    setSelectedDistrict(newValue || ""); // Ensure newValue is never null
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option === value || value === ""
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Khu vực" />
                  )}
                />
              </div>
              <p>Hãy chọn khu vực bạn muốn chơi?</p>
            </div>
            <button className="search" type="submit">
              <div id="s-circle"></div>
              Search
            </button>
          </form>
        </div>

        <section className="popular__container">
          <h2 className="section__header">Search Results</h2>
          <div className="popular__grid">
            {listSearchCourts.length === 0 ? (
              <p>No courts found.</p>
            ) : (
              listSearchCourts.map((court, index) => (
                <NavLink
                  key={index}
                  to={`/view/${court.courtID}`}
                  className="popular__card"
                  onClick={() => window.scrollTo(0, 100)}
                >
                  <img
                    src={
                      court.images.length > 0
                        ? court.images[0].image
                        : "default-image-url"
                    }
                    alt={court.courtName}
                  />
                  <div className="popular__content">
                <div className="popular__card__header">
                  <h4 style={{ display: 'flex' }}>{court.courtName}</h4>
                </div>
                <p className='popular__card__address'>{court.courtAddress}</p>
                <div className="subcourt-container">
                  <div className=" rater-container price">
                    <p className="subcourt-icon " ><PiCourtBasketball style={{width:"30px", height:"30px"}}/></p>
                    <p>{court.courtQuantity} sân</p>
                  </div>
                  <div className="rater-container price">
                  <p className="subcourt-icon " ><TbReportMoney  style={{width:"30px", height:"30px"}}/></p>

                    <p>{getPriceRange(court.price)}</p>
                  </div>
                </div>
              </div>
                </NavLink>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SearchList;
