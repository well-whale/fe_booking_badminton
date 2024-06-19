import React, { useState } from 'react';
import "./Payment.css"
import image1 from '../../img/caytrac.png';

const Payment = ({ onPaymentMethodChange }) => {
  const [selectedMethod, setSelectedMethod] = useState('paypal');

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
    onPaymentMethodChange(event.target.value);
  };

  return (
    <div className="payment-container">
      <div className="left-section">
        <section className="booking-info">
          <h2>Thông tin đặt sân</h2>
          <img src={image1} alt="Sân cầu lông" className="court-image" />
          <p><strong>Tên sân:</strong> Sân cầu lông ABC</p>
          <p><strong>Địa chỉ:</strong> 123 Đường ABC, Phường XYZ, Quận N</p>
          <p><strong>Thời gian đặt:</strong> 15:00 - 17:00, Thứ Bảy, 25/05/2024</p>
          <p><strong>Số giờ:</strong> 2 giờ</p>
          <p><strong>Giá mỗi giờ:</strong> 200,000 VND</p>
          <p><strong>Tổng tiền:</strong> 400,000 VND</p>
        </section>
      </div>
      <div className="right-section">
        <section className="payer-info">
          <h2>Thông tin người thanh toán</h2>
          <input type="text" placeholder="Họ và tên" />
          <input type="email" placeholder="Email" />
          <input type="tel" placeholder="Số điện thoại" />
        </section>
        <section className="payment-summary">
          <h2>Tổng tiền phải thanh toán: 400,000 VND</h2>
          <h2>Chọn phương thức thanh toán</h2>
          <button className="payment-button paypal">Thanh Toán Bằng PayPal</button>
          <button className="payment-button vnpay">Thanh Toán Bằng VNPay</button>
        </section>
      </div>
    </div>
  );
};

export default Payment;
