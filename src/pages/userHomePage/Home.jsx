import React, { useState, useEffect } from 'react';
import "./Home.css";
import { NavLink } from "react-router-dom";
import { GiTennisCourt } from "react-icons/gi";
import Search from '../../components/user/search/Search';
import { fetchAllCourts } from '../../services/UserServices';

const HomePage = () => {
  const [courts, setCourt] = useState([]);

  const getListCourt = async () => {
    const res = await fetchAllCourts();
    if (res.status === 200) {
      setCourt(res.data.filter((court) => court.statusCourt === 1));
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

      return `${minPrice} - ${maxPrice} VND`;
    }
    return "Đang Cập Nhật....";
  };
   const getRandomCourts = (courtsArray) => {
    const shuffled = courtsArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 9);
  };

  const randomCourts = getRandomCourts(courts);
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
        <h2 className="section__header">Popular Badminton Courts</h2>
        <div className="popular__grid">
          {randomCourts.map((court, index) => (
            <NavLink
              key={index}
              to={`/view/${court.courtID}`}
              className="popular__card"
              onClick={() => window.scrollTo(0, 100)}
            >
              {/* <img src={court.images[0] || 'default-image-url'} alt={court.courtName} /> */}
              <img src={court.images.length > 0 ? court.images[0].image : 'default-image-url'} alt={court.courtName} />
              <div className="popular__content">
                <div className="popular__card__header">
                  <h4 style={{ display: 'flex' }}>{court.courtName}</h4>
                </div>
                <p>{court.courtAddress}</p>
                <div className="subcourt-container">
                  <div className="subcourt">
                    <p className="subcourt-icon"><GiTennisCourt /></p>
                    <p> {court.courtQuantity} sân </p>
                  </div>
                  <div className="rater-container price">
                    <p>
                      {getPriceRange(court.price)}
                    </p>
                  </div>
                </div>
              </div>
            </NavLink>
          ))}
        </div>
      </section>
      <section className="section__container">
        <div className="reward__container">
          <p>20+ badminton courts</p>
          <h4>"Join BadmintonHub and unlock unbeatable discounts on your court bookings!"</h4>
          <NavLink to="/search"><button className="reward__btn">Book Now</button></NavLink>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
