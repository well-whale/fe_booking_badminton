import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./ListCourt.css";
import { NavLink } from "react-router-dom";
import { fetchAllCourts } from '../../services/UserServices';

const ListCourt = () => {
  const [courts, setCourt] = useState([]);

  const getListCourt = async () => {
    const res = await fetchAllCourts();
    if (res.status === 200) {
      setCourt(res.data);
    }
  };
  const getRandomCourts = (courtsArray) => {
    const shuffled = courtsArray.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 9);
  };

  const randomCourts = getRandomCourts(courts);

  useEffect(() => {
    getListCourt();
  }, []);
  return (
    <section className="product-detail-list-container">
      <h2 className="section__header">Các Sân Khác  </h2>
      <Carousel
        showThumbs={false}
        showStatus={false}
        showArrows={true}
        autoPlay
        infiniteLoop
        centerMode
        centerSlidePercentage={33.33}
        dynamicHeight={false}
      >
        {randomCourts.map((court, index) => (
          <div key={index} className="carousel-card">
            <img src={court.images} className="carousel-card-img" alt={court.courtName} />
            <div className="carousel-card-body">
              <h5 className="carousel-card-title">{court.courtName}</h5>
              <p className="carousel-card-text">{court.district}</p>
              <NavLink key={index} to={`/view/${court.courtID}`} className="popular__card" >
              <button className="btn" onClick={() => window.scrollTo(0, 100)}>
              Xem Sân
              </button>
              </NavLink>
              
            </div>
          </div>
        ))}
      </Carousel>
    </section>
  );
};

export default ListCourt;
