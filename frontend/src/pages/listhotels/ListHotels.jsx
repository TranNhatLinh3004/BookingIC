import React, { useEffect, useState } from "react";
import { format, set } from "date-fns";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { DateRange } from "react-date-range";
import "./listhotels.css";
import SearchHotelCard from "../../components/searchhotelcard/SearchHotelCard";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Map from "../../components/map/Map";
import queryString from "query-string";
function ListHotels(props) {
  const location = useLocation();
  let currentUrl = window.location.href;

  // Tách các tham số từ URL
  let parsedUrl = queryString.parseUrl(currentUrl);
  const [pageCount, setPageCount] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialDestination, setInitialDestination] = useState(
    parsedUrl.query.city || ""
  );
  const [destination, setDestination] = useState(initialDestination);
  const [dates, setDates] = useState(
    location.state?.dates || [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]
  );

  useEffect(() => {
    setDestination(destination);
  }, [parsedUrl.query]);
  // const [dates, setDates] = useState([
  //   {
  //     startDate: new Date(),
  //     endDate: new Date(),
  //     key: "selection",
  //   },
  // ]);
  const [openDate, setOpenDate] = useState(false);
  const [options, setOptions] = useState(location.state?.options || "");
  const [triggerFetch, setTriggerFetch] = useState(false);

  const [listhotel, setListHotel] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const result = await fetch(`http://localhost:5000/api/hotels`);
        if (!result.ok) {
          throw new Error("Failed to fetch hotels");
        }
        const data = await result.json();
        setListHotel(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchHotels();
  }, []);

  const { data, loading, error, reFetch } = useFetch(
    `http://localhost:5000/api/hotels?page=${currentPage}&limit=5`
  );
  const [hotel, setHotel] = useState([]);
  useEffect(() => {
    if (destination && dates) {
      const fetchData = async () => {
        try {
          if (parsedUrl.query.checkin) {
            const result = await fetch(
              `http://localhost:5000/api/search?city=${
                destination ? destination : parsedUrl.query.city
              }&checkin=${parsedUrl.query.checkin}&checkout=${
                parsedUrl.query.checkout
              }`
            );

            if (!result.ok) {
              throw new Error("Failed to fetch hotels");
            }
            const data = await result.json();
            const hotelsss = data.map((item) => item.hotel);
            console.log(hotelsss);
            setHotel(hotelsss);
          } else {
            const result = await fetch(
              `http://localhost:5000/api/hotels?city=${
                destination ? destination : parsedUrl.query.city
              }`
            );

            if (!result.ok) {
              throw new Error("Failed to fetch hotels");
            }
            const data = await result.json();
            console.log(data, "dat2");
            setHotel(data);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    } else {
      reFetch(`http://localhost:5000/api/hotels?page=${currentPage}&limit=5`);
    }
  }, [triggerFetch, parsedUrl.query.city]);

  console.log(hotel[0]?.hotel);
  // useEffect(() => {
  //   if (destination || dates) {
  //     const fetchData = async () => {
  //       try {
  //         const result = await fetch(
  //           `http://localhost:5000/api/hotels?city=${
  //             destination ? destination : parsedUrl.query.city
  //           }&checkInDate=${parsedUrl.query.checkin}&checkOutDate=${
  //             parsedUrl.query.checkout
  //           }`
  //         );
  //         if (!result.ok) {
  //           throw new Error("Failed to fetch hotels");
  //         }
  //         const data = await result.json();
  //         setHotel(data);
  //       } catch (error) {
  //         console.error(error);
  //       }
  //     };
  //     fetchData();
  //   } else {
  //     reFetch(`http://localhost:5000/api/hotels?page=${currentPage}&limit=5`);
  //   }
  // }, [triggerFetch, parsedUrl.query.city, parsedUrl.query.checkin]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     const res = await axios.get(
  //       `http://localhost:5000/api/hotels?page=${currentPage}&limit=5`
  //     );
  //     setHotel(res.data);
  //     // setPageCount(res.data.totalPages);
  //   };
  //   fetchProducts();
  // }, [currentPage]);
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

  const decodedDestination = encodeURIComponent(destination);
  const handleClick = () => {
    const formattedDates = formatDatesToArrayOfStrings(dates);
    setTriggerFetch(!triggerFetch);
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
    setHotel(data);
  }, [data]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const handleChangeDestination = (e) => {
    currentUrl = "";
    setDestination(e.target.value); // Cập nhật giá trị của state destination khi input thay đổi
  };
  const handleChangeAdult = (e) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      adult: e.target.value,
    }));
  };

  const handleChangeChildren = (e) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      children: e.target.value,
    }));
  };

  const handleChangeRoom = (e) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      room: e.target.value,
    }));
  };
  const navigate = useNavigate();
  const handleClearDestination = () => {
    setDestination("");
    navigate("/hotels");
  };
  return (
    <div>
      {" "}
      <div className="listWrapper">
        <div className="listSearch">
          <h1 className="lsTitle">Tìm kiếm</h1>
          <div className="lsItem search__text">
            <label>Khu vực</label>
            <input
              type="text"
              value={destination}
              onChange={handleChangeDestination}
            />

            {parsedUrl.query.city ? ( // Checking if the destination has value
              // <span>
              //   <Link to={`/hotels`}>
              //     <i className="uil uil-times"></i>
              //   </Link>
              // </span>
              <span onClick={handleClearDestination}>
                <i className="uil uil-times"></i>
              </span>
            ) : (
              <span onClick={handleClearDestination}>
                <i className="uil uil-times"></i>
              </span>
            )}
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
              />
            )}
          </div>
          <div className="lsItem">
            <label>Người</label>
            <div className="lsOptions">
              <div className="lsOptionItem">
                <span className="lsOptionText">Người lớn</span>
                <input
                  type="number"
                  min={1}
                  value={options.adult}
                  className="lsOptionInput"
                  onChange={handleChangeAdult}
                />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionText">Trẻ em</span>
                <input
                  type="number"
                  min={0}
                  value={options.children}
                  className="lsOptionInput"
                  onChange={handleChangeChildren}
                />
              </div>
            </div>
          </div>
          <button onClick={handleClick} className="lsButton">
            Tìm kiếm
          </button>
          {/* <Map items={hotel[0]?.hotel} /> */}
        </div>
        <div className="listResult">
          <h1 className="listHeading"> Tìm thấy: {hotel.length} chỗ nghỉ</h1>
          <div className="filter__widget">
            <select onChange={handleFilter}>
              <option>Sắp xếp</option>{" "}
              <option value="all">Tất cả Hotels</option>
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
    </div>
  );
}

export default ListHotels;
