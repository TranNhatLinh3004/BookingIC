import React, { useContext, useEffect, useState } from "react";
import Helmet from "../../assets/helmet/Helmet";
import { Container, Row, Col, NavLink } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "./home.css";
import { format } from "date-fns";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import handleScroll from "../../feature/handleScroll";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import {
  faBed,
  faCalendarDays,
  faCar,
  faPerson,
  faPlane,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import banner01 from "../../assets/images/banner01.jpeg";
import banner02 from "../../assets/images/banner05.jpg";
import banner03 from "../../assets/images/banner07.jpeg";
import banner04 from "../../assets/images/banner08.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { newSearch } from "../../redux/slices/searchSlice";
import Featured from "../../components/UI/featured/Featured";
import HotelCard from "../../components/UI/hotelcard/HotelCard";
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});
const slideData = [
  {
    image: banner01,
    alt: "Slide 1",
  },
  // {
  //   image: banner02,
  //   alt: "Slide 2",
  // },
  {
    image: banner03,
    alt: "Slide 3",
  },
  {
    image: banner04,
    alt: "Slide 4",
  },
];
const SampleNextArrow = (props) => {
  const { onClick } = props;
  // console.log(props.onClick);
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="next">
        <i
          style={{
            color: "#111",
            fontSize: "20px",
          }}
          className="uil uil-angle-right"
        ></i>{" "}
      </button>
    </div>
  );
};
const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="prev">
        <i
          style={{
            fontSize: "20px",
            color: "#111",
          }}
          className="uil uil-angle-left"
        ></i>{" "}
      </button>
    </div>
  );
};

function Home(props) {
  // const classes = useStyles();
  const [listUser, setListUser] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [hotelNames, setHotelNames] = useState({});
  const year = new Date().getFullYear();
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let height = document.body.scrollHeight;
  const [scrollY, setHeight] = useState(height);
  const [menu, setMenu] = useState(true);
  const classes = useStyles();
  window.addEventListener("scroll", () => {
    setHeight(document.body.scrollHeight);
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    handleScroll();

    // document.header.className = icon;
  }, [scrollY]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const formatDateToString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Thêm số 0 đằng trước nếu cần
    const date = String(dateObj.getDate()).padStart(2, "0"); // Thêm số 0 đằng trước nếu cần
    return `${year}-${month}-${date}`;
  };
  const formatDatesToArrayOfStrings = (datesArray) => {
    return datesArray.map((dateObj) => ({
      startDate: formatDateToString(dateObj.startDate),
      endDate: formatDateToString(dateObj.endDate),
      key: dateObj.key,
    }));
  };

  const handleSearch = () => {
    console.log(destination, dates, options, "search");
    // dispatch(newSearch({ destination, dates, options }));
    const formattedDates = formatDatesToArrayOfStrings(dates);
    navigate(
      `/search?${destination ? `city=${destination}` : ""}&checkin=${
        formattedDates[0].startDate
      }&checkout=${formattedDates[0].endDate}&numberOfGuests=${
        options.adult + options.children
      }&numberOfAdults=${options.adult}&numberOfChildren=${options.children}`,
      {
        state: { destination, dates, options },
      }
    );
  };
  const handleClear = () => {
    setDestination("");
  };
  const nav__links = [
    {
      path: "/",
      display: "Hoàn tất mục cho thuê của bạn",
    },
  ];
  const userData = useSelector((state) => state.user);
  const [reloadData, setReloadData] = useState(false);
  const [dataLeave, setDataLeave] = useState([]);

  const handleReloadData = () => {
    setReloadData((prev) => !prev);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/booking/find/${userData._id}`
        );
        console.log(response.data);

        // getbookingLeaveById(userData._id);
        setDataLeave(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [reloadData]);
  const accessBooking = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/booking/accessBooking`,
        data
      );
      if (response) {
        setReloadData((prev) => !prev);
      }
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getNameHotelById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/hotels/${id}`
      );
      return response.data.name;
    } catch (error) {}
  };

  const handleaccessBooking = async (leaveData) => {
    // const leaveData = dataLeave[0];
    const newData = {
      bookingId: leaveData._id,
      subtotal: leaveData.rooms.reduce((total, room) => total + room.price, 0),
      userId: userData._id,
      name: leaveData.name,
      phone: leaveData.phone,
      rooms: leaveData.rooms.map((room) => ({
        roomId: room.roomId,
        roomNumbers: room.roomNumbers.map((roomNumber) => ({
          price: roomNumber.price,
          maxPeople: roomNumber.maxPeople,
          number: roomNumber.number,
          unavailableDates: roomNumber.unavailableDates.map((dateString) => {
            const dateOnly = dateString.substring(0, 10);
            return dateOnly;
          }),
        })),
      })),
    };
    console.log(newData, "newwwwwwwwwwwww");
    await accessBooking(newData);
  };

  useEffect(() => {
    const getHotelNames = async () => {
      const newHotelNames = {};
      for (const item of dataLeave) {
        const hotelId = item.hotel;
        if (!hotelNames[hotelId]) {
          try {
            const hotelName = await getNameHotelById(hotelId);
            newHotelNames[hotelId] = hotelName;
          } catch (error) {
            newHotelNames[hotelId] = "Không tìm thấy tên khách sạn";
          }
        }
      }
      setHotelNames(newHotelNames);
    };
    getHotelNames();
  }, [dataLeave]);

  const hanldeRoomStatus = async (bookingId, status) => {
    console.log(bookingId, "<bookingId></bookingId>");
    try {
      const response = await axios.put(
        `http://localhost:5000/api/booking/update-status/${bookingId}`,
        {
          status: status,
        }
      );

      if (response) {
        handleReloadData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  console.log(dataLeave, "dataLeave");
  // Hàm lọc dữ liệu
  const filteredDataLeave = searchQuery
    ? dataLeave.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.phone.toString().includes(searchQuery)
      )
    : dataLeave;
  useEffect(() => {
    const fetchData = async (id) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users`); // Ensure this matches the backend route
        console.log("User deleted successfully:", response.data.message);
        setListUser(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [listUser]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/users/${id}`
      );

      console.log("User deleted successfully:", response.data.message);
      // Handle success (e.g., update UI, show notification)
    } catch (error) {
      console.error("There was a problem with the delete request:", error);
      // Handle error (e.g., show error message)
    }
  };

  const filteredDataUser = searchQuery
    ? listUser.filter(
        (item) =>
          item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toString().includes(searchQuery)
      )
    : listUser;

  const handleShowModal = (id) => {
    setDeleteConfirmation(id);
  };

  const handleConfirmDelete = () => {
    handleDelete(deleteConfirmation);
    setDeleteConfirmation(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmation(null);
  };

  return (
    <>
      {userData.user_type === "lease" || userData.user_type === "admin" ? (
        <>
          {userData.user_type === "lease" ? (
            <div className="wrapper__manage">
              <div className="heading">
                <h4>Tình trạng phòng:</h4>
                <input
                  type="text"
                  placeholder="Tìm kiếm khách theo tên hoặc số điện thoại"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ marginLeft: "20px", padding: "5px" }}
                  className="value__search"
                />
                <div className={menu ? "navigation" : "navigation active"}>
                  <ul className="menu">
                    {nav__links.map((item, index) => {
                      return (
                        <li className="" key={index}>
                          <Link
                            to={item.path}
                            className={(navClass) =>
                              navClass.isActive ? "nav__active" : ""
                            }
                          >
                            {item.display}{" "}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div
                style={{
                  height: "20px",
                }}
              ></div>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Tên khách hàng</TableCell>
                      <TableCell>Số điện thoại</TableCell>
                      <TableCell>Thời gian đặt phòng</TableCell>
                      <TableCell>Khách sạn</TableCell>
                      {/* <TableCell>Giá tiền</TableCell> */}
                      <TableCell>Số phòng</TableCell>
                      <TableCell>Ngày đặt/trả</TableCell>
                      <TableCell>Chấp nhận</TableCell>
                      <TableCell>Từ chối</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDataLeave
                      .filter((item) => item.status === "pending")
                      .map((item, index) => (
                        <React.Fragment key={item._id}>
                          {item.rooms.map((room) => (
                            <React.Fragment key={room._id}>
                              {room.roomNumbers.map((roomNumber) => (
                                <TableRow key={roomNumber._id}>
                                  <TableCell>{index + 1}</TableCell>
                                  <TableCell>{item.name}</TableCell>
                                  <TableCell>(+84) {item.phone}</TableCell>

                                  <TableCell>
                                    {format(
                                      new Date(item.createdAt),
                                      "HH:mm dd-MM-yyyy"
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {/* {hotelNames[item.hotel] || "Đang tải..."} */}
                                    {item.nameHotel}
                                  </TableCell>
                                  {/* <TableCell>{room.price}</TableCell> */}
                                  <TableCell>{roomNumber.number}</TableCell>
                                  <TableCell>
                                    {roomNumber.unavailableDates
                                      .map((dateString) => {
                                        const dateOnly = dateString.substring(
                                          0,
                                          10
                                        );
                                        return dateOnly;
                                      })
                                      .join(", ")}
                                  </TableCell>
                                  <TableCell>
                                    <button
                                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                      onClick={() => handleaccessBooking(item)}
                                    >
                                      Chấp nhận
                                    </button>
                                  </TableCell>
                                  <TableCell>
                                    <button
                                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                                      onClick={() =>
                                        hanldeRoomStatus(item._id, "cancelled")
                                      }
                                    >
                                      Từ chối
                                    </button>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </React.Fragment>
                          ))}
                        </React.Fragment>
                      )) || "Đang tải..."}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          ) : (
            <div className="wrapper__manage">
              <div className="heading">
                <h4>Dashboard Admin:</h4>
                <input
                  type="text"
                  placeholder="Tìm kiếm khách theo tên hoặc email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    marginRight: "300px",
                    padding: "5px",
                    height: "40px",
                  }}
                  className="value__search"
                />
              </div>
              <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>STT</TableCell>
                      <TableCell>Avatar</TableCell>
                      <TableCell>UserName</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Address</TableCell>
                      <TableCell>User Type</TableCell>
                      <TableCell>Thao tác</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDataUser.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>
                          <img
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                            src={user.avatar}
                            alt=""
                          />
                        </TableCell>
                        <TableCell>{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.address}</TableCell>
                        <TableCell>{user.user_type}</TableCell>
                        <TableCell>
                          <Link to={`/account/${user._id}`}>
                            <button style={{ marginRight: "10px" }}>
                              Detail
                            </button>
                          </Link>
                          <button
                            style={{ background: "#f68989" }}
                            onClick={() => handleDelete(user._id)}
                          >
                            Delete
                          </button>{" "}
                        </TableCell>
                        {/* {deleteConfirmation === user._id && (
                          <div
                            style={{
                              marginTop: "10px",
                              border: "1px solid gray",
                            }}
                            className="modal-content"
                          >
                            <h4>Xác nhận Xóa</h4>
                            <p style={{ color: "black" }}>
                              Bạn có chắc chắn muốn xóa người dùng này không?
                            </p>
                            <button onClick={handleConfirmDelete}>Xóa</button>
                            <button
                              onClick={handleCancelDelete}
                              style={{ marginLeft: "10px" }}
                            >
                              Không
                            </button>
                          </div>
                        )} */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </>
      ) : (
        <Helmet title="Home">
          <div className="section__home">
            <section className="hero__section" id="home">
              {" "}
              <div className="container__banner">
                <Slider {...settings}>
                  {slideData.map((slide, index) => (
                    <div key={index}>
                      <img
                        style={{
                          width: "100%",
                          height: "360px",
                          backgroundSize: "contain",
                          objectFit: "cover",
                        }}
                        src={slide.image}
                        alt={slide.alt}
                      />
                    </div>
                  ))}
                </Slider>{" "}
              </div>{" "}
              <div className="headerSearch">
                <div className="headerSearchItem place__home">
                  <FontAwesomeIcon icon={faBed} className="headerIcon" />
                  <input
                    type="text"
                    value={destination}
                    placeholder="Bạn muốn đi đâu?"
                    className="headerSearchInput "
                    onChange={(e) => setDestination(e.target.value)}
                  />{" "}
                  {destination ? ( // Checking if the destination has value
                    <span onClick={handleClear}>
                      <i className="uil uil-times"></i>
                    </span>
                  ) : (
                    ""
                  )}
                </div>
                <div className="headerSearchItem">
                  <FontAwesomeIcon
                    icon={faCalendarDays}
                    className="headerIcon"
                  />
                  <span
                    onClick={() => setOpenDate(!openDate)}
                    className="headerSearchText"
                  >{`${format(dates[0].startDate, "MM/dd/yyyy")} đến ${format(
                    dates[0].endDate,
                    "MM/dd/yyyy"
                  )}`}</span>
                  {openDate && (
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item) => setDates([item.selection])}
                      moveRangeOnFirstSelection={false}
                      ranges={dates}
                      className="date"
                      minDate={new Date()}
                    />
                  )}
                </div>
                <div className="headerSearchItem">
                  <FontAwesomeIcon icon={faPerson} className="headerIcon" />
                  <span
                    onClick={() => setOpenOptions(!openOptions)}
                    className="headerSearchText text-black"
                  >{`${options.adult} người lớn · ${options.children} trẻ em · ${options.room} phòng`}</span>
                  {openOptions && (
                    <div className="options">
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
                            {options.adult}
                          </span>
                          <button
                            className="optionCounterButton"
                            onClick={() => handleOption("adult", "i")}
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
                            {options.children}
                          </span>
                          <button
                            className="optionCounterButton"
                            onClick={() => handleOption("children", "i")}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="headerSearchItem btn__search">
                  <button className="headerBtn search" onClick={handleSearch}>
                    Tìm kiếm
                  </button>
                </div>
              </div>
            </section>{" "}
            <section className="section__listshotel">
              {" "}
              <div className="header__section bt">
                <h1 className="font-bold text-2xl">
                  Những phòng được khách yêu thích
                </h1>
                <Link to="/hotels">Xem thêm</Link>
              </div>
              <HotelCard />
            </section>
            <section className="offers__container hidden">
              <div className="text-start ">
                {" "}
                <div className="header__section">
                  <div class="loader"></div>
                  <h1 className="font-bold text-2xl">Ưu đãi</h1>
                </div>
                <p className="homeSubtitle">
                  Khuyến mãi, ưu đãi và ưu đãi đặc biệt dành cho bạn
                </p>
              </div>

              <div className="container__content">
                <h4>Năm mới, những chuyến phiêu lưu mới</h4>
                <p>
                  Tiết kiệm 15% trở lên khi bạn đặt phòng và lưu trú trước ngày
                  1 tháng 4 <br />
                  năm 2024
                </p>
                <button
                  className="headerBtn offer"
                  style={{
                    position: "relative",

                    marginTop: "10px",
                  }}
                >
                  Khám phá kỳ nghỉ
                </button>
              </div>
              {/* <div className="container__dot">
            <div class="loader"></div>
          </div> */}
            </section>{" "}
            <section className="trending__container">
              <div className="wrapper__heading">
                <h1 className="font-bold text-2xl">Điểm đến đang thịnh hành</h1>
                <p className="homeSubtitle">
                  Các lựa chọn phổ biến cho du khách Việt Nam
                </p>
              </div>
              <Featured />
            </section>{" "}
            <section className="section__posts">
              <div className="header__section bt">
                <h1 className="font-bold text-2xl">
                  Khám phá các khách sạn hàng đầu
                </h1>
                <Link to="/news">Xem tất cả bài viết</Link>
              </div>
              <div className="container__posts">
                <div className="posts__left posts">
                  <div className="img__wrapper">
                    <img
                      src="https://images.pexels.com/photos/3703465/pexels-photo-3703465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Khách sạn sang trọng"
                    />
                  </div>
                  <div className="content__wrapper">
                    <h4>Khách sạn Luxury Beach Resort</h4>
                    <p>
                      Trải nghiệm nghỉ dưỡng sang trọng tại bãi biển đẹp nhất
                      thế giới.
                    </p>
                  </div>
                </div>
                <div className="posts__right posts">
                  <div className="post">
                    <img
                      src="https://images.pexels.com/photos/6161513/pexels-photo-6161513.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Khách sạn thành phố"
                    />
                    <h4>Khách sạn NhuY</h4>
                    <p>Khám phá cuộc sống sôi động tại trung tâm thành phố.</p>
                  </div>
                  <div className="post">
                    <img
                      src="https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                      alt="Khách sạn nghỉ dưỡng"
                    />
                    <h4>Khu nghỉ dưỡng Resort Oasis</h4>
                    <p>
                      Tận hưởng không gian yên bình và thư giãn tại khu nghỉ
                      dưỡng.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Helmet>
      )}
    </>
  );
}

export default Home;
