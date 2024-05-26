import React, { useEffect, useState } from "react";
import "./bookinglist.css";
import booking from "../../assets/images/booking.png";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import queryString from "query-string";
import { Rating } from "react-simple-star-rating";
import { ImagetoBase64 } from "../../utility/ImagetoBase64";
function BookingList(props) {
  const [isReviewSubmitted, setIsReviewSubmitted] = useState({});
  const userData = useSelector((state) => state.user);
  const [reloadData, setReloadData] = useState(false);
  const [dataLeave, setDataLeave] = useState({});
  const location = useLocation();
  const currentUrl = window.location.href;
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [photos, setPhotos] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const [showReviewForms, setShowReviewForms] = useState({});
  // Tách các tham số từ URL
  const parsedUrl = queryString.parseUrl(currentUrl);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/booking/${userData._id}`
        );
        console.log(response.data);

        // getbookingLeaveById(userData._id);
        setDataLeave(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);
  const handleRating = (rate) => {
    setRating(rate);

    // other logic
  };
  const handleImageChange = async (e) => {
    const files = e.target.files;
    const newImageUrls = await Promise.all(
      Array.from(files).map((file) => ImagetoBase64(file))
    );

    const data = await Promise.all(newImageUrls);
    setPhotos((prevPhotos) => [...prevPhotos, ...data]);
  };

  const handleReivew = async (hotelId, bookingId, nameUser) => {
    const review = {
      userId: userData._id,
      hotelId: hotelId,
      rating: rating,
      comment: comment,
      photos: photos,
      nameUser: nameUser,
    };

    console.log(review);
    try {
      await axios.post(`http://localhost:5000/api/reviews`, review);
      await axios.put(`http://localhost:5000/api/booking/${bookingId}`, {
        isRated: true,
      });
      setIsReviewSubmitted((prevState) => ({
        ...prevState,
        [bookingId]: true,
      }));
      toast.success("Đánh giá thành công");
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeletePhoto = (index) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };
  const handleShowReviewForm = (id) => {
    setShowReviewForms((prevState) => ({ ...prevState, [id]: true }));
  };
  const handleCancelReview = (id) => {
    setShowReviewForms((prevState) => ({ ...prevState, [id]: false }));
    setComment("");
    setRating(0);
    setPhotos([]);
    setIsReviewSubmitted((prevState) => ({ ...prevState, [id]: false })); //
  };
  return (
    <div>
      <section className="booking ">
        <div lg="8" className="booking__top">
          <h4 className="mb-4 fw-bold">
            <i class="uil uil-angle-left"></i>Danh sách đặt phòng
          </h4>
          {/* <p className="mb-4 fw-bold">Your booking</p>{" "} */}
        </div>

        <div className="information">
          <p className="mb-4 fw-bold">Lịch sử đặt phòng của bạn</p>{" "}
          <div className="wrapper booking__list">
            {dataLeave.length === 0 ? (
              <div className="wishlists__text">
                <h4>Chưa có phòng nào được đặt</h4>
                <p
                  style={{
                    color: "grey",
                    fontSize: "20px",
                  }}
                >
                  Đã đến lúc lên lịch đặt phòng cho những chuyển đi cũng như
                  nghĩ dưỡng thôi nào
                </p>
              </div>
            ) : (
              <>
                {Array.isArray(dataLeave) &&
                  dataLeave.map((item) => {
                    return (
                      <div className="left" key={item._id}>
                        <div className="total line">
                          <p>Tên khách sạn:</p>
                          <p>{item.nameHotel}</p>
                        </div>
                        {item.rooms.map((room, roomIndex) => (
                          <div
                            key={room.roomId}
                            className="total__wrapper line"
                          >
                            <div className="total line">
                              <p>Số phòng:</p>
                              <p>
                                {room.roomNumbers.map(
                                  (roomNumber, numberIndex) => (
                                    <span key={numberIndex}>
                                      {roomNumber.number}
                                    </span>
                                  )
                                )}
                              </p>
                            </div>

                            <div className="total line">
                              <p>Ngày đặt / trả phòng:</p>
                              <p>
                                {room.roomNumbers.map(
                                  (roomNumber, numberIndex) => (
                                    <div
                                      key={numberIndex}
                                      style={{ display: "flex" }}
                                    >
                                      {roomNumber.unavailableDates.map(
                                        (date, index) => (
                                          <p>
                                            {new Date(date).toLocaleDateString(
                                              "en-GB"
                                            )}{" "}
                                            {index <
                                              roomNumber.unavailableDates
                                                .length -
                                                1 && " - "}
                                          </p>
                                        )
                                      )}
                                    </div>
                                  )
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div className="total line">
                          <p>Họ và tên:</p>
                          <p>{item.name}</p>
                        </div>
                        <div className="total line">
                          <p>Số điện thoại:</p>
                          <p>(84+) {item.phone}</p>
                        </div>
                        <div className="total line">
                          <p>Email:</p>
                          <p>{userData.email}</p>
                        </div>
                        <div className="total line">
                          <p>Tổng giá:</p>
                          <p>{formatNumberWithCommas(item.totalPrice)} VNĐ</p>
                        </div>

                        <div className="total line">
                          <p>Trạng thái:</p>
                          <p>
                            {item.status === "completed"
                              ? item.status
                              : item.status}
                          </p>
                        </div>
                        <div className="total line">
                          {item.isRated && (
                            <p
                              className="pending_tx"
                              style={{
                                color: "green",
                                position: "relative",
                                left: "-20px",
                              }}
                            >
                              Đã đánh giá
                            </p>
                          )}
                        </div>

                        <div className="form__reviewuser">
                          {item.status === "completed" && !item.isRated && (
                            <div>
                              {!isReviewSubmitted[item._id] ? (
                                !showReviewForms[item._id] ? (
                                  <button
                                    type="submit"
                                    className="btn__review"
                                    onClick={() =>
                                      handleShowReviewForm(item._id)
                                    }
                                  >
                                    Đánh giá
                                  </button>
                                ) : (
                                  <div>
                                    <div className="total line">
                                      <Rating onClick={handleRating} />
                                    </div>
                                    <div className="total line">
                                      <textarea
                                        placeholder="..."
                                        rows={3}
                                        style={{
                                          width: "100%",
                                          padding: "10px",
                                        }}
                                        name="comment"
                                        id=""
                                        value={comment}
                                        onChange={(e) =>
                                          setComment(e.target.value)
                                        }
                                      ></textarea>
                                    </div>
                                    <div className="wrapper__img">
                                      <label
                                        style={{
                                          display: "block",
                                          marginBottom: "10px",
                                        }}
                                        htmlFor="photos"
                                        className="wrapper__img"
                                      >
                                        <i
                                          className="uil uil-camera-plus"
                                          style={{ fontSize: "25px" }}
                                        ></i>
                                        Thêm hình ảnh
                                      </label>
                                      <div className="container__img">
                                        {photos
                                          ? photos.map((photo, index) => (
                                              <div className="temp" key={index}>
                                                <img
                                                  className="nint"
                                                  src={photo}
                                                  alt={index}
                                                />
                                                <button
                                                  className="btn__cancel"
                                                  type="button"
                                                  onClick={() =>
                                                    handleDeletePhoto(index)
                                                  }
                                                >
                                                  <i className="uil uil-times"></i>
                                                </button>
                                              </div>
                                            ))
                                          : ""}
                                      </div>
                                      <input
                                        type="file"
                                        name="photos"
                                        id="photos"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                      />
                                    </div>
                                    <div className="btn-group">
                                      <button
                                        onClick={() =>
                                          handleReivew(
                                            item.hotel,
                                            item._id,
                                            item.name
                                          )
                                        }
                                        className="buy__btn auth__btn"
                                      >
                                        Đánh giá
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleCancelReview(item._id)
                                        }
                                        className="buy__btn auth__btn cancel-btn"
                                        style={{
                                          background: "#eb7474",
                                        }}
                                      >
                                        Hủy đánh giá
                                      </button>
                                    </div>
                                  </div>
                                )
                              ) : (
                                <p className="pending_tx">
                                  Chờ chủ khách sạn đánh giá
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </>
            )}
            <div className="right">
              <button className="buy__btn auth__btn w-100">
                <Link to="/hotels">Tiếp tục đặt phòng</Link>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default BookingList;
