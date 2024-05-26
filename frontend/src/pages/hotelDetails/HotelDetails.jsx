import React, { useEffect, useState } from "react";
import "./hoteldetail.css";
import {
  faCircleArrowLeft,
  faCircleArrowRight,
  faCircleXmark,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Map from "../../components/map/Map";
import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import axios from "axios";
import { unavailableDatesRoom } from "../../redux/API/apiRoom";
import DetailRoom from "../../components/UI/room/DetailRoom";
import ReviewForm from "./ReviewForm";

function HotelDetails(props) {
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const [slideNumber, setSlideNumber] = useState(0);

  const [group, setGroup] = useState([]);

  const [open, setOpen] = useState(false);
  // const [destination, setDestination] = useState(location.state.destination);
  // const [dates, setDates] = useState(location.state.dates);
  const [openDate, setOpenDate] = useState(false);
  // const [options, setOptions] = useState(location.state.options);
  const [min, setMin] = useState(undefined);
  const [max, setMax] = useState(undefined);

  const [vailableDates, setVailableDates] = useState();

  const userData = useSelector((state) => state.user);
  // const userId = userData._id;
  const [unavailableDates, setUnavailableDates] = useState([]);
  const { data, loading, error } = useFetch(
    `http://localhost:5000/api/hotels/${id}`
  );
  const navigate = useNavigate();
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const [arrRoom, setArrRoom] = useState([]);
  const [isRoom, setIsRoom] = useState([]);
  const [numberRoom, setNumberRoom] = useState(0);

  const [openRooms, setOpenRooms] = useState({});

  const [number, setNumber] = useState("");
  const [roomPrice, setRoomPrice] = useState(0);
  const [bookingData, setBookingData] = useState([]);

  const [maxPeople, setMaxPeople] = useState(0);

  const handleChangeOption = (option) => {
    setNumber(option.number);
  };
  const [priceOfRoom, setPriceOfRoom] = useState(0);
  const handleGetPrice = (price) => {
    setRoomPrice(price);
  };

  const handleOpenRoom = (roomNumber) => {
    // console.log(roomNumber, "nember");
    setOpenRooms((prevOpenRooms) => ({
      // ...prevOpenRooms,
      [roomNumber]: !prevOpenRooms[roomNumber],
    }));
  };
  // const handleUnavailableDates = async (id, number) => {
  //   try {
  //     const datesResponse = await unavailableDatesRoom(id, number);
  //     console.log(datesResponse, "datesResponse ");

  //     setUnavailableDates(datesResponse?.unavailableDates);
  //   } catch (error) {
  //     console.error("Error fetching unavailable dates:", error);
  //   }
  // };
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/booking");

      setBookingData(res.data);

      getRoom(res.data);
    } catch (err) {
      // setError(err);
      console.log(err);
    }
  }; // Trả về hàm cleanup rỗng
  useEffect(() => {
    fetchData();
  }, [arrRoom]);

  useEffect(() => {
    const fetchRoom = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/rooms/${id}/${numberRoom}`
      );
      // console.log(response.data.price, "rooms");

      if (response.data && response.data.price) {
        setPriceOfRoom(response.data.price);
        setMaxPeople(response.data.maxPeople);

        console.log(response.data.maxPeople);
      }
    };
    if (numberRoom) {
      fetchRoom();
    }
  }, [numberRoom]);

  const getRoom = (bookingData) => {
    if (Array.isArray(bookingData)) {
      bookingData.forEach((item, index) => {
        if (item.active) {
          if (item.rooms && Array.isArray(item.rooms)) {
            item.rooms.forEach((room) => {
              if (room.roomNumbers && Array.isArray(room.roomNumbers)) {
                room.roomNumbers.forEach((roomNumber) => {
                  if (!arrRoom.includes(roomNumber.number)) {
                    // console.log(roomNumber.number);
                    // arrRoom.push(roomNumber.number);
                    console.log(arrRoom, "arrRoom");
                  }
                });
              }
            });
          }
        }
      });
    }

    return arrRoom;
  };

  const fetchRoomByHotel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/rooms/hotel/${data._id}`
      );
      setIsRoom(response.data);

      //tách dữ liệu ngày bắt đầu và ngày kết thúc để tính giá tiền
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };
  useEffect(() => {
    if (data._id) {
      fetchRoomByHotel();
    }
  }, [data]);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      const newValue = operation === "i" ? prev[name] + 1 : prev[name] - 1;
      const totalPeople =
        operation === "i"
          ? prev.adult + prev.children + 1
          : prev.adult + prev.children - 1;

      if (totalPeople > maxPeople) return prev;

      return {
        ...prev,
        [name]: newValue,
      };
    });
  };
  const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

  function dayDifference(date1, date2) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const start = new Date(dates[0].startDate);
  const end = new Date(dates[0].endDate);

  const dayCount = 1 + Math.round(end - start) / (1000 * 60 * 60 * 24);

  useEffect(() => {
    const arrDates = [];
    console.log(bookingData, "bookingData");
    if (arrRoom.includes(parseInt(numberRoom))) {
      if (Array.isArray(bookingData)) {
        console.log(bookingData, "bookingData");
        // Kiểm tra xem bookingData có phải là một mảng không
        bookingData.forEach((item, index) => {
          if (item.active) {
            if (item.rooms && Array.isArray(item.rooms)) {
              item.rooms.forEach((room) => {
                if (room.roomNumbers && Array.isArray(room.roomNumbers)) {
                  room.roomNumbers.forEach((roomNumber) => {
                    if (roomNumber.number == numberRoom) {
                      console.log(roomNumber, "roomNumber");
                      if (
                        roomNumber.unavailableDates &&
                        Array.isArray(roomNumber.unavailableDates)
                      ) {
                        roomNumber.unavailableDates.forEach((date) => {
                          arrDates.push(date);
                        });
                      }
                    }
                  });
                }
              });
            }
          }
        });
      }
      if (arrDates.length > 2) {
        const a = [];
        for (let index = 0; index < arrDates.length; index += 2) {
          if (index + 1 <= arrDates.length) {
            a.push([arrDates[index], arrDates[index + 1]]);
          } else {
            a.push(arrDates[index]);
          }
        }

        const disabledDates = [];

        const dateRanges = () => {
          for (let i = 0; i < a.length; i++) {
            const start = new Date(a[i][0]); // Convert to Date object
            const end = new Date(a[i][1]); // Convert to Date object
            for (let j = start; j <= end; j.setDate(j.getDate() + 1)) {
              disabledDates.push(new Date(j));
            }
          }
        };
        dateRanges();
        setUnavailableDates(disabledDates);

        // console.log(
        //   disabledDates,
        //   "arrDates LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL"
        // );
      } else {
        // Tách unavailableDates thành các cặp startDate và endDate
        const disabledDates = [];

        const dateRanges = () => {
          const sortedDates = arrDates
            .map((date) => new Date(date))
            .sort((a, b) => a - b);
          const startDate = sortedDates[0];
          const endDate = sortedDates[sortedDates.length - 1];
          for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            disabledDates.push(new Date(d));
          }
          return { startDate, endDate };
        };
        dateRanges();
        // console.log(dateRanges(), "dateRanges");
        //   // Tạo disabledDates array từ các cặp startDate và endDate
        // dateRanges.forEach(({ startDate, endDate }) => {
        //   for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        //     disabledDates.push(new Date(d));
        //   }
        // });
        // const a = async () => {
        //   await groupdDateArray(arrDates);
        // };
        // a();
        // groupdDateArray(arrDates);

        setUnavailableDates(disabledDates);
      }
    } else {
      setUnavailableDates([]);
    }
  }, [numberRoom]);

  const handleClick = () => {
    // reFetch();
  };
  const handleOpen = (index) => {
    setSlideNumber(index);
    setOpen(true);
  };

  const handleMove = (direction) => {
    let newSlideNumber;

    if (direction === "l") {
      newSlideNumber = slideNumber === 0 ? 4 : slideNumber - 1;
    } else {
      newSlideNumber = slideNumber === 4 ? 0 : slideNumber + 1;
    }

    setSlideNumber(newSlideNumber);
  };
  const formatNumberWithCommas = (number) => {
    // Check if number is defined
    if (number !== undefined && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      // Handle the case where number is undefined or null
      return "0"; // Or any default value or message you prefer
    }
  };
  //tách unavailableDates thành startDate và enđate sau đó sẽ truyền vào DateRange để ẩn đi những ngày tháng

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/${data._id}`);
      setReviews(response.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đánh giá:", err);
    }
  };

  const handleReviewSubmitted = (newReview) => {
    setReviews((prevReviews) => [...prevReviews, newReview]);
  };
  return (
    <div>
      {loading ? (
        <Skeleton count={10} />
      ) : (
        <div className="hotelContainer">
          {open && (
            <div className="slider">
              <FontAwesomeIcon
                icon={faCircleXmark}
                className="close"
                onClick={() => setOpen(false)}
              />{" "}
              <FontAwesomeIcon
                icon={faCircleArrowLeft}
                className="arrow"
                onClick={() => handleMove("l")}
              />
              <div className="sliderWrapper">
                <h1 className="hotelTitle">
                  {data.name}{" "}
                  <span
                    style={{
                      marginLeft: "10px",
                      color: "grey",
                    }}
                  >
                    {" "}
                    {`${slideNumber + 1} / ${data.photos.length}`}
                  </span>
                </h1>
                <img
                  src={data.photos[slideNumber]}
                  alt=""
                  className="sliderImg"
                />
              </div>
              <FontAwesomeIcon
                icon={faCircleArrowRight}
                className="arrow"
                onClick={() => handleMove("r")}
              />
            </div>
          )}
          <div className="hotelWrapper">
            <div className="hotelHeading">
              <h1 className="hotelTitle">{data.name}</h1>
              <div className="btns">
                <button className="bookNow">
                  <i class="uil uil-upload"></i> Chia sẽ
                </button>{" "}
                <button className="bookNow">
                  <i class="uil uil-heart"></i> Yêu thích
                </button>
              </div>
            </div>
            <div className="hotelImgGrid">
              {data.photos?.map((photo, index) => (
                <div className="hotelImgWrapper" key={index}>
                  <img
                    onClick={() => handleOpen(index)}
                    src={photo}
                    alt=""
                    className="hotelImg"
                  />
                </div>
              ))}
              <button onClick={() => handleOpen(0)}>
                <i class="uil uil-draggabledots"></i> Xem thêm
              </button>
            </div>
            <div className="hotelAddress">
              <FontAwesomeIcon icon={faLocationDot} />
              <span>{data.address}</span>
            </div>
            <span className="hotelDistance">
              8 guests - 2 bedrooms - 3 beds - 2 baths
            </span>{" "}
            <span className="hotelPriceHighlight">
              <i class="uil uil-star"></i> {data.rating} -{" "}
              <span style={{ textDecoration: "underline" }}>
                {data.reviews} reviews
              </span>
            </span>
            <div className="hotelDetails">
              <div className="hotelDetailsTexts">
                <h1 className="hotelTitle">Thông tin về khách sạn</h1>
                <p className="hotelDesc">
                  {data.description} Tận hưởng kỳ nghỉ tại một ngôi nhà gỗ hai
                  phòng ngủ mới xây dựng, mang phong cách kiến ​​trúc hiện đại
                  giữa thế kỷ. Nằm trên đỉnh đồi, bất động sản cung cấp một tầm
                  nhìn 360 độ rộng lớn về hoàng hôn tuyệt đẹp của núi Batulao,
                  vịnh yên bình Balayan và các cánh đồng xanh mướt của Nasugbu.
                  Địa hình và độ cao độc đáo cho phép khách hàng thưởng thức làn
                  gió núi tươi mát và thời tiết se lạnh gần như quanh năm. Bằng
                  cách kết hợp vẻ đẹp hoang sơ của nông thôn và sự tiện nghi của
                  một khách sạn boutique, ngôi nhà gỗ mang lại trải nghiệm nghỉ
                  ngơi được tái định nghĩa...
                </p>
                <button>
                  Xem thêm<i class="uil uil-angle-right"></i>
                </button>
                <h1>Vị trí</h1>
                <Map items={data} />
                <div className="serviceList">
                  <h1>Những tiện ích tại địa điểm này</h1>
                  <div className="amenities">
                    <div className="amenity">
                      <span className="icon">&#127965;</span>
                      <span className="label">Tầm nhìn núi</span>
                    </div>
                    <div className="amenity">
                      <span className="icon">&#127858;</span>
                      <span className="label">Bếp</span>
                    </div>
                    <div className="amenity">
                      <span className="icon">&#128188;</span>
                      <span className="label">Khu làm việc riêng</span>
                    </div>
                    <div className="amenity">
                      <span className="icon">&#128663;</span>
                      <span className="label">Bãi đậu xe miễn phí tại chỗ</span>
                    </div>
                    <div className="amenity">
                      <span className="icon">&#128675;</span>
                      <span className="label">Hồ bơi riêng</span>
                    </div>
                    <div className="amenity">
                      <span className="icon">&#128246;</span>
                      <span className="label">TV</span>
                    </div>
                    <div className="amenity">
                      <span className="icon">&#127785;</span>
                      <span className="label">Điều hòa không khí</span>
                    </div>
                    <div className="amenity">
                      <span className="icon">&#128226;</span>
                      <span className="label">Camera an ninh trên tài sản</span>
                    </div>
                    <div className="amenity">
                      <span className="icon">&#9899;</span>
                      <span className="label">Báo động khí độc tố</span>
                    </div>
                    <div className="amenity">
                      <span className="icon">&#9888;</span>
                      <span className="label">Báo động khói</span>
                    </div>
                  </div>
                </div>

                <h1>Đánh giá của khách</h1>
                <div className="reviews__container">
                  <div className="reviews__heading">
                    {data.rating && (
                      <div className="fpRating">
                        <button>{data.rating}</button>
                        <span>Tuyệt vời</span>
                      </div>
                    )}
                    <p>{data.reviews} Đánh giá</p>
                    <p>Đọc tất cả các đánh giá</p>
                  </div>
                  <h4>Xem điều khách yêu thích nhất:</h4>
                  <ReviewForm hotelId={data._id} />
                </div>
              </div>
              <div className="listSearch__detail">
                <h1 className="lsTitle">
                  {formatNumberWithCommas(
                    numberRoom ? priceOfRoom : data.price
                  )}{" "}
                  VNĐ / <span>đêm</span>
                </h1>
                <div className="wrapper__selectRoom">
                  <select
                    onChange={(event) => {
                      const selectedOption = event.target.value;
                      const [roomId, roomNumber] = selectedOption.split("-");
                      setNumberRoom(roomNumber);
                      handleChangeOption({ _id: roomId, number: roomNumber });
                    }}
                  >
                    <option value="">Chọn phòng</option>
                    {isRoom.map((room) =>
                      room.roomNumbers.map((option, index) => (
                        <option
                          key={option._id}
                          value={`${room._id}-${option.number}`}
                        >
                          {`Phòng ${option.number}`}
                        </option>
                      ))
                    )}
                  </select>
                  {numberRoom ? (
                    <button
                      className="btn__room"
                      onClick={() => handleOpenRoom(numberRoom)}
                    >
                      Xem thông tin phòng
                    </button>
                  ) : (
                    ""
                  )}
                  <DetailRoom
                    onClick={() => handleOpenRoom(numberRoom)}
                    hotelId={data._id}
                    roomNumber={numberRoom}
                    isOpen={openRooms[numberRoom]}
                    onGetPrice={handleGetPrice}
                  />
                </div>
                <div className="lsItem">
                  <label>Ngày nhận phòng - Ngày trả phòng</label>
                  <span onClick={() => setOpenDate(!openDate)}>{`${format(
                    dates[0].startDate,
                    "MM/dd/yyyy"
                  )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
                  {openDate && (
                    <DateRange
                      onChange={(item) => setDates([item.selection])}
                      minDate={new Date()}
                      ranges={dates}
                      disabledDates={unavailableDates}
                    />
                  )}
                </div>
                <div className="lsItem person">
                  <span
                    onClick={() => setOpenOptions(!openOptions)}
                    className="headerSearchText text-black"
                  >{`${options.adult} người lớn · ${options.children} trẻ em`}</span>
                  {openOptions && (
                    <div className="options detail">
                      <div className="optionItem text-black">
                        <span className="optionText">Người lớn</span>
                        <div className="optionCounter">
                          <button
                            disabled={options.adult <= 1}
                            className="optionCounterButton"
                            onClick={() => handleOption("adult", "d")}
                          >
                            -
                          </button>
                          <span className="optionCounterNumber">
                            {String(options.adult)}
                          </span>
                          <button
                            className="optionCounterButton"
                            onClick={() => handleOption("adult", "i")}
                            disabled={
                              options.adult + options.children >= maxPeople
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="optionItem">
                        <span className="optionText">Trẻ em</span>
                        <div className="optionCounter">
                          <button
                            disabled={options.children <= 0}
                            className="optionCounterButton"
                            onClick={() => handleOption("children", "d")}
                          >
                            -
                          </button>
                          <span className="optionCounterNumber">
                            {String(options.children)}
                          </span>
                          <button
                            className="optionCounterButton"
                            onClick={() => handleOption("children", "i")}
                            disabled={
                              options.adult + options.children >= maxPeople
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={handleClick} className="lsButton">
                  <Link
                    to={`/booking?roomId=${data._id}&checkin=${format(
                      dates[0].startDate,
                      "yyyy-MM-dd"
                    )}&checkout=${format(
                      dates[0].endDate,
                      "yyyy-MM-dd"
                    )}&numberRoom=${numberRoom}&priceOfRoom=${priceOfRoom}&numberOfGuests=${
                      options.adult + options.children
                    }&numberOfAdults=${options.adult}&numberOfChildren=${
                      options.children
                    }&lease=${data.userId}`}
                    className="text-sm text-gray-500"
                  >
                    {" "}
                    Đặt phòng
                  </Link>{" "}
                </button>
                <div style={{ height: "10px" }}></div>
                {/* <p>You won't be charged yet</p>{" "} */}
                <div className="lsOptionItem">
                  <span
                    className="lsOptionText"
                    style={{
                      marginBottom: "10px",
                    }}
                  >
                    {numberRoom ? priceOfRoom : data.price} x {dayCount}
                    {dayCount > 1 ? <p>đêm</p> : <p>đêm</p>}
                  </span>
                </div>{" "}
                <div className="lsOptionItem">
                  <span
                    className="lsOptionText"
                    style={{
                      marginBottom: "10px",
                      textDecoration: "underline",
                    }}
                  >
                    Phí dịch vụ đặt chỗ
                  </span>
                  <span className="lsOptionText">10%</span>
                </div>
                <hr />
                <div
                  className="lsOptionItem total"
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <span className="lsOptionText">Tổng cộng</span>
                  <span className="lsOptionText">
                    {numberRoom
                      ? formatNumberWithCommas(
                          priceOfRoom * dayCount +
                            ((priceOfRoom * dayCount) / 100) * 10
                        )
                      : formatNumberWithCommas(data.price)}
                    VNĐ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HotelDetails;
