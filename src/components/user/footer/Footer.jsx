import React from 'react';
import "../footer/Footer.css"
const Footer = () => {
  return (
    <div>
      <footer className="footer">
        <div className=" footer__container">
          <div className="footer__col">
            <h3>BadmintonHub</h3>
            <p>
              BadmintonHub là trang web đặt chỗ sân cầu lông cung cấp cách thức liền mạch và thuận tiện để tìm và đặt chỗ ở địa điểm gần bạn nhất.            </p>
            <p>
              Với giao diện thân thiện với người dùng và nhiều lựa chọn sân khác nhau, BadmintonHub hy vọng sẽ mang lại trải nghiệm thoải mái cho khách hàng đang tìm kiếm sân cầu lông.            </p>
          </div>
          <div className="footer__col">
            <h4>Company</h4>
            <p>About Us</p>
            <p>Our Team</p>
            <p>Contact Us</p>
          </div>
          <div className="footer__col">
            <h4>Legal</h4>
            <p>FAQs</p>
            <p>Terms & Conditions</p>
            <p>Privacy Policy</p>
          </div>
          <div className="footer__col">
            <h4>Resources</h4>
            <p>Social Media</p>
            <p>Help Center</p>
          </div>
        </div>
        <div className="footer__bar">
          Copyright © 2024 BadmintonHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Footer;
