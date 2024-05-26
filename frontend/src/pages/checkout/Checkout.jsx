import React, { useState, useRef, useEffect, useContext } from "react";
import { Col, FormGroup, Form, Container, Row } from "reactstrap";
import "./checkout.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Helmet from "../../assets/helmet/Helmet";
import { PayPalButton } from "react-paypal-button-v2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import queryString from "query-string";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import DetailRoom from "../../components/UI/room/DetailRoom";
import { unavailableDatesRoom } from "../../redux/API/apiRoom";
import Vnpay from "../vnpay/Vnpay";
function Checkout(props) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [unavailableDates, setUnavailableDates] = useState([]);
  const userData = useSelector((state) => state.user);
  const userId = userData._id;

  const location = useLocation();
  const currentUrl = window.location.href;

  // Tách các tham số từ URL
  const parsedUrl = queryString.parseUrl(currentUrl);

  const [profileOpen, setProfileOpen] = useState(false);
  const [openDate, setOpenDate] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [isDataHotel, setIsDataHotel] = useState([]);
  const [isRoom, isSetIsRoom] = useState(null);

  const [openRooms, setOpenRooms] = useState({});

  const [unavaliableDates, setUnavaliableDates] = useState([]);
  const [dates, setDates] = useState([
    {
      startDate: new Date(parsedUrl.query.checkin),
      endDate: new Date(parsedUrl.query.checkout),
      key: "selection",
    },
  ]);
  const [priceOfRoom, setPriceOfRoom] = useState(parsedUrl.query.priceOfRoom);
  const getNumberOfDays = (startDate, endDate) => {
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  };
  const getHotelById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/hotels/${parsedUrl.query.roomId}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data, loading, error } = useFetch(
    `http://localhost:5000/api/hotels/${parsedUrl.query.roomId}`
  );
  const handleChange = (e) => {
    console.log("nameHotel ", bookingData);
    //láy giá tiền vào room và set vào bookingData
    setBookingData({
      ...bookingData,
      price: priceOfRoom * dayCount + ((priceOfRoom * dayCount) / 100) * 10,
      nameHotel: data.name,
      [e.target.name]: e.target.value,
    });
  };
  const [valiableDates, setValiableDates] = useState();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const navigate = useNavigate();
  const totalAmount = useSelector((state) => state.cart.totalAmount);

  const [number, setNumber] = useState(parsedUrl.query.numberRoom);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const [showPayPalButton, setShowPayPalButton] = useState(false);
  const [options, setOptions] = useState({
    adult: parsedUrl.query.numberOfAdults || 1,
    children: parsedUrl.query.numberOfChildren || 0,
    room: 1,
  });

  const [bookingData, setBookingData] = useState({
    leaseId: parsedUrl.query.lease,
    user: userId,
    name: userData.username,
    phone: "",
    price: "",
    nameHotel: "",
    hotel: parsedUrl.query.roomId,
    rooms: [
      {
        roomId: null,
        price: 0,
        roomNumbers: [
          {
            number: parsedUrl.query.numberRoom,
            unavailableDates: [],
            price: parsedUrl.query.priceOfRoom,
            maxPeople: parsedUrl.query.numberOfGuests,
          },
        ],
      },
    ],
  });

  const start = new Date(dates[0].startDate);
  const end = new Date(dates[0].endDate);
  const dayCount = 1 + Math.round(end - start) / (1000 * 60 * 60 * 24);
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleClick = (e) => {
    e.preventDefault();

    navigate("/thank-you");
    // console.log(credentials);
  };

  const handleSelect = (method) => {
    setSelectedPaymentMethod(method);
    if (method === "paypal") {
      setShowPayPalButton(true);
    } else {
      setShowPayPalButton(false);
    }
  };

  const profileOpenRef = useRef(null);
  useEffect(() => {
    // Lắng nghe sự kiện click toàn bộ trang
    const handleDocumentClick = (e) => {
      if (
        profileOpenRef.current &&
        !profileOpenRef.current.contains(e.target)
      ) {
        // Người dùng đã nhấp bên ngoài phạm vi profileOpen
        // console.log(userData._id);
        setProfileOpen(false);
      }
    };

    // Đăng ký sự kiện lắng nghe khi component được mount
    document.addEventListener("click", handleDocumentClick);

    // Hủy đăng ký sự kiện khi component bị hủy
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  useEffect(() => {
    const unavailableDates = dates
      .map((dateRange) => {
        const startDate = format(dateRange.startDate, "yyyy-MM-dd");
        const endDate = format(dateRange.endDate, "yyyy-MM-dd");
        return [startDate, endDate];
      })
      .flat();
    setValiableDates(unavailableDates);

    // khi thay đổi ngày tháng thuê phòng thì sẽ thay đổi query bằng checkin và checkout
    const newSearchParams = new URLSearchParams(location.search);
    newSearchParams.set("checkin", format(dates[0].startDate, "yyyy-MM-dd"));
    newSearchParams.set("checkout", format(dates[0].endDate, "yyyy-MM-dd"));
    const queryString = newSearchParams.toString();

    newSearchParams.delete("checkin");
    newSearchParams.delete("checkout");

    const finalQueryString = `${queryString}`;
    navigate(`${location.pathname}?${finalQueryString}`);
  }, [dates, navigate, location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(bookingData, "new");
      console.log(data, "new");

      await axios.post(`http://localhost:5000/api/booking/create`, bookingData);
      // setBookingSuccess(true);
      navigate("/thank-you");
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };
  const fetchRoomByHotel = async () => {
    console.log(parsedUrl.query.roomId, "aaaaaaaaaaa");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/rooms/hotel/${parsedUrl.query.roomId}`
      );
      isSetIsRoom(response.data);
      //tách dữ liệu ngày bắt đầu và ngày kết thúc để tính giá tiền
      const numberOfDays = getNumberOfDays(
        dates[0].startDate,
        dates[0].endDate
      );
      //tính giá tiền
      const totalPrice = numberOfDays * response.data[0].price;
      //set giá tiền vào bookingData
      setBookingData((prevBookingData) => ({
        ...prevBookingData,
        // nameHotel: response.data.name,
        //láy giá tiền vào room và set vào bookingData
        rooms: prevBookingData.rooms.map((room) => ({
          ...room,
          roomId: response.data[0]._id,
        })),
      }));
    } catch (error) {
      console.error("Error fetching room:", error);
    }
  };
  useEffect(() => {
    setBookingData((prevBookingData) => ({
      ...prevBookingData,
      rooms: prevBookingData.rooms.map((room) => ({
        ...room,
        roomNumbers: room.roomNumbers.map((roomNumber) => ({
          ...roomNumber,
          number: number,
          unavailableDates: valiableDates,
        })),
      })),
    }));
    const fetchHotelByUserId = async () => {
      const reponse = await getHotelById(parsedUrl.query.roomId);
      setIsDataHotel(reponse);
    };
    fetchHotelByUserId();
  }, [valiableDates, number]);
  useEffect(() => {
    fetchRoomByHotel();
  }, [dates]);

  const handleUnavailableDates = async (id, number) => {
    try {
      const datesResponse = await unavailableDatesRoom(id, number);
      setUnavailableDates(datesResponse.unavailableDates);
    } catch (error) {
      console.error("Error fetching unavailable dates:", error);
    }
  };

  //tách unavailableDates thành startDate và enđate sau đó sẽ truyền vào DateRange để ẩn đi những ngày tháng
  const sortedDates = unavailableDates
    .map((date) => new Date(date))
    .sort((a, b) => a - b);

  const startDate = sortedDates[0];
  const endDate = sortedDates[sortedDates.length - 1];
  const disabledDates = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    disabledDates.push(new Date(d));
  }
  const handleOpenRoom = (roomNumber) => {
    setOpenRooms((prevOpenRooms) => ({
      // ...prevOpenRooms,
      [roomNumber]: !prevOpenRooms[roomNumber],
    }));
  };

  const handleToggleCheckoutDatepicker = () => {
    setOpenDate(!openDate);
  };

  const handleChangeOption = (option) => {
    setNumber(option.number);
  };

  return (
    <Helmet title="Checkout">
      {/* <CommonSection title="Checkout" /> */}
      <section className="checkout__cart">
        <div lg="8" className="checkout__left">
          <h4 className="mb-4 fw-bold">
            <i class="uil uil-angle-left"></i>Thông tin và thanh toán
          </h4>
          <p className="mb-4 fw-bold">Xác nhận </p>{" "}
          <p className="mb-4 fw-bold">
            Số phòng của bạn là: {parsedUrl.query.numberRoom}
          </p>{" "}
          <div className="headerSearchItem checkout" ref={profileOpenRef}>
            <FontAwesomeIcon icon={faCalendarDays} className="headerIcon" />
            <p
              onClick={() => setOpenDate(!openDate)}
              className="headerSearchText"
            >{`${format(dates[0].startDate, "MM/dd/yyyy")} đến ${format(
              dates[0].endDate,
              "MM/dd/yyyy"
            )}`}</p>
          </div>{" "}
          <div className="headerSearchItem  checkguest" ref={profileOpenRef}>
            <FontAwesomeIcon icon={faPerson} className="headerIcon" />
            <span
              onClick={() => setOpenOptions(!openOptions)}
              className="headerSearchText text-black"
            >{`${options.adult} người lớn · ${options.children} trẻ em · ${options.room} phòng`}</span>
          </div>{" "}
          <form onSubmit={handleSubmit} className="form-connect">
            <div className="mb-4">
              <label htmlFor="name" className="one">
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={bookingData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="name_value"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Số điện thoại
              </label>
              <input
                id="phone"
                type="text"
                name="phone"
                value={bookingData.phone}
                onChange={handleChange}
                placeholder="Enter phone"
                className=""
              />
            </div>
          </form>{" "}
          <p className="mb-4 fw-bold">Phương thức thanh toán</p>
          <Vnpay data={bookingData} paymentMethod={paymentMethod} />
          <div className="required-for-trip">
            <h4>Thông tin cần thiết khi đặt phòng</h4>
            <div className="message-host">
              <div className="text__box">
                <h5>Liên hệ với Chủ nhà</h5>
                <p>
                  Hãy chia sẻ lý do bạn muốn đặt phòng, số lượng người đi cùng
                  và những gì bạn mong muốn từ không gian ở đó.
                </p>
              </div>
              <button>Thêm</button>
            </div>
            <div className="phone-number">
              <div className="text__box">
                <h5>Số điện thoại</h5>
                <p>
                  Thêm và xác nhận số điện thoại của bạn để nhận được thông tin
                  cập nhật về chuyến đi.
                </p>
              </div>
              <button>Thêm</button>
            </div>
            <hr />
            <div className="cancellation-policy">
              <h4>Chính sách hủy</h4>
              <p>
                Hủy trước khi nhận phòng vào{" "}
                <span>
                  {" "}
                  {start.toLocaleString("en", { month: "long" })}
                  <span> </span>
                  {start.getDate().toString()}
                </span>{" "}
                để nhận được hoàn trả một phần. <br />
                <a href="#">Tìm hiểu thêm</a>
              </p>
            </div>
            <hr />
            <div className="ground-rules">
              <h4>Quy định khi ở khách sạn</h4>
              <p>
                Chúng tôi mong muốn từng khách nhớ một số điều quan trọng về
                cách thức làm một khách hàng tốt.
              </p>
              <ul>
                <li>Chấp hành các quy định của khách sạn</li>
                <li>
                  Đối xử với không gian của khách sạn như bạn đối xử với nhà của
                  mình
                </li>
              </ul>
            </div>
          </div>
          <div className="host">
            <span>
              <i className="uil uil-hourglass"></i>
            </span>
            <p>
              <span>
                Đặt phòng của bạn sẽ không được xác nhận cho đến khi Chủ nhà
                chấp nhận yêu cầu của bạn (trong vòng 24 giờ).
              </span>
              Bạn sẽ không bị tính phí cho đến khi đó.
            </p>
          </div>
          {/* <button className="buy__btn auth__btn w-100" onClick={handleSubmit}>
            Yêu cầu đặt chỗ
          </button> */}
        </div>
        <div className="checkout__container">
          <div className="checkout__hotel">
            <img src={data.photos?.[0]} alt="" />
            <div className="content">
              {" "}
              <h4>{data.name}</h4>
              <p>
                <i
                  className="uil uil-map-marker"
                  style={{
                    marginRight: "3px",
                  }}
                >
                  {" "}
                </i>
                {data.address}
              </p>
              <p>
                <i
                  className="uil uil-favorite"
                  style={{
                    marginRight: "3px",
                  }}
                ></i>{" "}
                {data.rating} ({data.reviews}{" "}
                {data.reviews > 1 ? "đánh giá" : "đánh giá"})
              </p>
            </div>
          </div>
          <hr />
          <h1>Chi tiết giá</h1>
          <div className="checkout__cost">
            <p
              style={{
                display: "flex",
                textDecoration: "underline",
              }}
            >
              {priceOfRoom ? priceOfRoom : data.price} x {dayCount}
              {dayCount > 1 ? <p>đêm</p> : <p>đêm</p>}
            </p>
            <span>
              {dayCount > 0
                ? formatNumberWithCommas(
                    priceOfRoom ? priceOfRoom * dayCount : data.price * dayCount
                  )
                : formatNumberWithCommas(
                    priceOfRoom ? priceOfRoom : data.price
                  )}
              <small
                style={{
                  textDecoration: "underline",
                }}
              >
                đ
              </small>
            </span>
          </div>
          <div className="checkout__cost taxes">
            <p
              style={{
                textDecoration: "underline",
              }}
            >
              Thuế
            </p>
            <span>
              <small
                style={{
                  textDecoration: "underline",
                }}
              >
                10%
              </small>
            </span>
          </div>
          <hr />
          <div className="checkout__cost">
            <h4>Tổng cộng (VNĐ):</h4>
            <span>
              {dayCount > 0
                ? formatNumberWithCommas(
                    priceOfRoom * dayCount +
                      ((priceOfRoom * dayCount) / 100) * 10
                  )
                : formatNumberWithCommas(priceOfRoom)}
              <small
                style={{
                  textDecoration: "underline",
                }}
              >
                đ
              </small>
            </span>
          </div>
        </div>
      </section>
    </Helmet>
  );
}

export default Checkout;
