// src/components/CourtReview.js
import React, { useEffect, useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import { Rating } from "react-simple-star-rating";
import { IoPersonCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import axios from "axios";
import "../courts/CourtReview.css";

const CourtReview = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [averageRating, setAverageRating] = useState(0);

  
  useEffect(() => {
    // Fetch existing reviews from server (placeholder)
    axios.get("/api/reviews")
      .then(response => {
        setReviews(response.data);
        calculateAverageRating(response.data);
      })
      .catch(error => {
        toast.error("Lỗi khi tải nhận xét!");
      });
  }, []);

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    setAverageRating((totalRating / reviews.length).toFixed(1));
  };

  const handleRatingChange = (rate) => {
    setNewReview({ ...newReview, rating: rate / 20 });
  };

  const handleCommentChange = (event) => {
    setNewReview({ ...newReview, comment: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Save new review to server (placeholder)
    axios.post("/api/reviews", newReview)
      .then(response => {
        const updatedReviews = [...reviews, response.data];
        setReviews(updatedReviews);
        calculateAverageRating(updatedReviews);
        setNewReview({ rating: 0, comment: "" });
        toast.success("Nhận xét của bạn đã được gửi!");
      })
      .catch(error => {
        toast.error("Lỗi khi gửi nhận xét!");
      });
  };

  return (
    <div className="court-review-container">
      <h2>Đánh giá sân thể thao</h2>
      <div className="average-rating">
        <div className="rating-display">
          <span className="average-rating-text">Trung bình</span>
          <div className="average-rating-value">
            <strong>{averageRating}</strong>
            <Rating ratingValue={averageRating * 20} readonly size={25} />
          </div>
        </div>
      </div>
      <Form onSubmit={handleSubmit} className="review-form">
        <FormGroup>
          <Label>Đánh giá của bạn về sản phẩm này:</Label>
          <Rating onClick={handleRatingChange} ratingValue={newReview.rating * 20} size={30} />
        </FormGroup>
        <FormGroup>
          <Label>Viết nhận xét của bạn vào bên dưới:</Label>
          <Input
            type="textarea"
            value={newReview.comment}
            onChange={handleCommentChange}
            rows="4"
          />
        </FormGroup>
        <Button type="submit" color="primary">Gửi đánh giá</Button>
      </Form>
      <div className="review-list">
        {reviews.map((review, index) => (
          <div key={index} className="review-item">
            <IoPersonCircleOutline size={40} />
            <div className="review-content">
              <Rating ratingValue={review.rating * 20} readonly size={20} />
              <p>{review.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourtReview;
