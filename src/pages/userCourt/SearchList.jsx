import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { NavLink } from "react-router-dom";
import { Autocomplete, TextField } from "@mui/material";
import { GiTennisCourt } from "react-icons/gi";
import "./SearchList.css";
import { searchByDistrict } from "../../services/UserServices";

const address = [
  "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8",
  "Quận 10", "Quận 11", "Quận 12", "Phú Nhuận", "Bình Thạnh",
  "Gò Vấp", "Tân Bình", "Bình Tân", "Tân Phú",
  "Thủ Đức", "Bình Chánh", "Hóc Môn", "Củ Chi", "Cần Giờ", "Nhà Bè"
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
          setListSearchCourts(response.data);
          console.log(response.data)
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
      const unitPrices = prices.map(price => price.unitPrice);
      const minPrice = Math.min(...unitPrices);
      const maxPrice = Math.max(...unitPrices);

      return `${minPrice} - ${maxPrice} VND`;
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
                    setSelectedDistrict(newValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Khu vực" />
                  )}
                />
              </div>
              <p>Where are you playing?</p>
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
              <img src={court.images.length > 0 ? court.images[0].image : 'default-image-url'} alt={court.courtName} />
              <div className="popular__content">
                    <div className="popular__card__header">
                      <h4 style={{ display: "flex" }}>{court.courtName}</h4>
                    </div>
                    <p>{court.courtAddress}</p>
                    <div className="subcourt-container">
                      <div className="subcourt">
                        <p className="subcourt-icon">
                          <GiTennisCourt />
                        </p>
                        <p>{court.courtQuantity} Sân</p>
                      </div>
                      <div className="rater-container">
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
