import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Autocomplete, TextField } from '@mui/material';
import "../search/Search.css";

const address = [
  "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8",
  "Quận 10", "Quận 11", "Quận 12", "Quận Phú Nhuận", "Quận Bình Thạnh",
  "Quận Gò Vấp", "Quận Tân Bình", "Quận Bình Tân", "Quận Tân Phú",
  "Thủ Đức", "Bình Chánh", "Hóc Môn", "Củ Chi", "Cần Giờ", "Nhà Bè"
];

const Search = () => {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    navigate(`/search?district=${selectedDistrict}`);
  };

  return (
    <div className="booking__container">
      <form onSubmit={handleSubmit}>
        <div className="form__group">
          <div className="input__group">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={address}
              sx={{ width: 300 }}
              onChange={(event, newValue) => {
                setSelectedDistrict(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Location" />}
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
  );
};

export default Search;
