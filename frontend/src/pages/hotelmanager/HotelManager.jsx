import React, { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import SearchHotelCard from "../../components/searchhotelcard/SearchHotelCard";
import ReactPaginate from "react-paginate";
import queryString from "query-string";
import { Link, useLocation } from "react-router-dom";
import "./hotelmanager.css";
import { useSelector } from "react-redux";
function HotelManager(props) {
  const [hotel, setHotel] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(15);
  let currentUrl = " window.location.href";
  const [triggerFetch, setTriggerFetch] = useState(false);
  const location = useLocation();
  const userData = useSelector((state) => state.user);
  const [dates, setDates] = useState(
    location.state?.dates || [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]
  );
  const height = document.body.scrollHeight;
  const [scrollTop, setScrollTop] = useState(height);

  window.addEventListener("scroll", () => {
    setScrollTop(document.body.scrollHeight);
  });
  useEffect(() => {
    window.scrollTo(0, 0);
    // handleScroll();

    // document.header.className = icon;
  }, [scrollTop]);
  const [menu, setMenu] = useState(true);
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const result = await fetch(`http://localhost:5000/api/hotels`);
        if (!result.ok) {
          throw new Error("Failed to fetch hotels");
        }
        const data = await result.json();
        const listHotels = data.filter((item) => item.userId === userData._id);
        setHotel(listHotels);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHotels();
  }, []);
  const nav__links = [
    // {
    //   path: "/home",
    //   display: "Chờ xác nhận",
    // },
    // {
    //   path: "/hotels",
    //   display: "Trống",
    // },
    // {
    //   path: "/reached",
    //   display: "Đã đặt",
    // },
    // {
    //   path: "/out-of-date",
    //   display: "Quá hạn",
    // },
    {
      path: "/hotel-manager/create",
      display: "Thêm khách sạn",
    },
  ];
  const { data, loading, error, reFetch } = useFetch(
    `http://localhost:5000/api/hotels?page=${currentPage}&limit=5`
  );
  let parsedUrl = queryString.parseUrl(currentUrl);

  const [initialDestination, setInitialDestination] = useState(
    parsedUrl.query.city || ""
  );
  const [destination, setDestination] = useState(initialDestination);
  const handleFilter = (e) => {
    let val = e.target.value;
    let sortedHotels;

    switch (val) {
      case "tang":
        sortedHotels = [...hotel].sort((a, b) => a.price - b.price);
        break;
      case "giam":
        sortedHotels = [...hotel].sort((a, b) => b.price - a.price);
        break;
      case "a-z":
        sortedHotels = [...hotel].sort((a, b) =>
          a.name.toLowerCase().localeCompare(b.name.toLowerCase())
        );
        break;
      case "z-a":
        sortedHotels = [...hotel].sort((a, b) =>
          b.name.toLowerCase().localeCompare(a.name.toLowerCase())
        );
        break;
      case "all":
      default:
        sortedHotels = [...hotel];
        break;
    }

    setHotel(sortedHotels);
  };
  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1);
  };
  useEffect(() => {
    if (destination && dates) {
      const fetchData = async () => {
        try {
          const result = await fetch(
            `http://localhost:5000/api/hotels?city=${
              destination ? destination : parsedUrl.query.city
            }`
          );
          if (!result.ok) {
            throw new Error("Failed to fetch hotels");
          }
          const data = await result.json();
          const listHotels = data.filter(
            (item) => item.userId === userData._id
          );
          setHotel(listHotels);
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    } else {
      reFetch(`http://localhost:5000/api/hotels?page=${currentPage}&limit=5`);
    }
  }, [triggerFetch, parsedUrl.query.city]);
  return (
    <div className="hotel__manager">
      <div className="listResult">
        <div className="heading__top">
          <h1 className="listHeading">Hiện có: {hotel.length} khách sạn</h1>

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

        <div className="filter__widget">
          <select onChange={handleFilter}>
            <option>Sắp xếp</option> <option value="all">Tất cả Hotels</option>
            <option value="tang">Giá: Tăng dần</option>
            <option value="giam">Giá: Giảm dần</option>
            <option value="a-z">Tên: A-Z</option>{" "}
            <option value="z-a">Tên: Z-A</option>
          </select>
        </div>
        {/* <SearchItem /> */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {hotel.map((item) => (
              <SearchHotelCard item={item} key={item._id} />
            ))}
          </>
        )}
        <ReactPaginate
          breakLabel="..."
          pageCount={pageCount}
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
}

export default HotelManager;
