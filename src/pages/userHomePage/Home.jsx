import React, { useState, useEffect } from 'react';
import "./Home.css";
import { NavLink } from "react-router-dom";
import Search from '../../components/user/search/Search';
import { fetchAllCourts } from '../../services/UserServices';
import Pagination from '@mui/material/Pagination';
import { TbReportMoney  } from "react-icons/tb";
import { PiCourtBasketball } from "react-icons/pi";

import VND from '../../components/price/PriceFormat';
const HomePage = () => {
  const [courts, setCourts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const courtsPerPage = 6;

  const getListCourt = async () => {
    const res = await fetchAllCourts();
    if (res.status === 200) {
      setCourts(res.data.filter((court) => court.statusCourt === 1));
      console.log(res.data);
    }
  };

  useEffect(() => {
    getListCourt();
  }, []);

  const getPriceRange = (prices) => {
    if (Array.isArray(prices) && prices.length > 0) {
      const unitPrices = prices.map(price => price.unitPrice);
      const minPrice = Math.min(...unitPrices);
      const maxPrice = Math.max(...unitPrices);

      return `${VND.format(minPrice)} - ${VND.format(maxPrice)}`;
    }
    return "Đang Cập Nhật....";
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastCourt = currentPage * courtsPerPage;
  const indexOfFirstCourt = indexOfLastCourt - courtsPerPage;
  const currentCourts = courts.slice(indexOfFirstCourt, indexOfLastCourt);

  return (
    <div className="section__container header__container">
      <div className="header__image__container">
        <div className="header__content">
          <h1>Book Your Badminton Court</h1>
          <p>Play with Easily!</p>
        </div>
        <Search />
      </div>
      <section className="section__container popular__container">
        <h2 className="section__header">Danh sách sân cầu lông</h2>
        <div className="popular__grid">
          {currentCourts.map((court, index) => (
            <NavLink
              key={index}
              to={`/view/${court.courtID}`}
              className="popular__card"
              onClick={() => window.scrollTo(0, 0)}
            >
              <img src={court.images.length > 0 ? court.images[0].image : 'default-image-url'} alt={court.courtName} />
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
          ))}
        </div>
        <Pagination 
        className='pagination'
          count={Math.ceil(courts.length / courtsPerPage)} 
          variant="outlined" 
          shape="rounded" 
          page={currentPage} 
          onChange={handlePageChange} 
        />
      </section>
      <section className="section__container">
        <div className="reward__container">
          <p>20+ Sân cầu lông</p>
          <h4>"Hãy tham gia Badminton Hub và đặt sân nhanh hơn và thuận tiện hơn!"</h4>
          <NavLink to="/search" onClick={() => window.scrollTo(0, 0)}><button className="reward__btn">Đặt Ngay</button></NavLink>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
