import React, { useEffect, useState } from "react";
import axios from "axios";

const Reviews = ({ hotelId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState({});
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/reviews/${hotelId}`
        );
        setReviews(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [hotelId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="reviews__wrapper">
      {reviews.map((review) => (
        <div key={review._id} className="customer">
          <div className="customer__top">
            <img
              src={
                users[review.userId._id]?.avatar ||
                "https://cdn-icons-png.flaticon.com/512/6596/6596121.png"
              }
              alt="User"
            />
            <h4 className="customer__name">{review.nameUser}</h4>
          </div>
          <div className="customer__rating">
            <div className="stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${review.rating >= star ? "filled" : ""}`}
                >
                  &#9733;
                </span>
              ))}
            </div>
            <p className="time">
              {new Date(review.createdAt).toLocaleDateString()}
            </p>

            <p>Đã ở lại vài đêm</p>
          </div>
          <div
            className="customer__content"
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <p>{review.comment}</p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {review.photos.map((photo, index) => (
                <img
                  className="img_review"
                  key={index}
                  src={photo}
                  alt="Review"
                  style={{
                    width: "100px",
                    height: "120px",
                    marginRight: "10px",
                  }}
                />
              ))}
            </div>
            <button
              style={{
                width: "120px",
              }}
              className="btn btn-review"
            >
              Xem thêm
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Reviews;
