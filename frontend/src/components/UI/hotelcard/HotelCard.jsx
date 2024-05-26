import useFetch from "../../../hooks/useFetch";
import "./hotelcard.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import img1 from "../../../assets/images/heart1.png";
import img2 from "../../../assets/images/heart2.png";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const SampleNextArrow = (props) => {
  const { onClick } = props;
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

const HotelCard = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoriteHotels, setFavoriteHotels] = useState({});
  const userData = useSelector((state) => state.user);
  const userId = userData._id;
  const [isFavorite, setIsFavorite] = useState(false);

  const navigate = useNavigate();

  const fetchFavoriteHotels = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/favorites/${userId}`
      );

      const favoriteHotelsData = response.data.map((favorite) => favorite);
      setFavoriteHotels(favoriteHotelsData);
    } catch (error) {
      console.error("Error fetching favorite hotels:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavoriteHotels();
    }
  }, [favoriteHotels]);

  const { data, loading, error } = useFetch("http://localhost:5000/api/hotels");

  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    // className: "center",
    // centerPadding: "60px",
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const addToFavorites = async (hotel) => {
    if (!userData) {
      navigate("/login");
      return;
    }
    try {
      setIsFavorite(true);
      setFavoriteHotels((prevState) => ({
        ...prevState,
        [hotel._id]: true,
      }));
      await axios.post("http://localhost:5000/api/favorites/add", {
        hotelId: hotel._id,
        userId,
      });
      toast.success("Đã thêm vào danh sách yêu thích thành công");
    } catch (error) {
      console.error("Lỗi khi thêm vào danh sách yêu thích:", error);
    }
  };

  const handleDeleteFavorite = async (hotelId) => {
    try {
      // Gửi yêu cầu xóa yêu thích đến API backend
      await axios.delete(`http://localhost:5000/api/favorites/${hotelId}`, {
        data: { userId },
      });

      // Cập nhật state favorites
      setFavorites((prevFavorites) =>
        prevFavorites.filter((favorite) => favorite.hotel._id !== hotelId)
      );

      // Cập nhật state favoriteHotels
      setFavoriteHotels((prevFavoriteHotels) => {
        const updatedFavoriteHotels = { ...prevFavoriteHotels };
        delete updatedFavoriteHotels[hotelId];
        return updatedFavoriteHotels;
      });

      toast.success("Remove from wishlist successfully");
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  return (
    <div className="fp">
      {loading ? (
        "Loading"
      ) : (
        // <>
        <Slider {...settings}>
          {data.map((hotel) => (
            <div className="fpItem" key={hotel._id}>
              <img src={hotel.photos[0]} alt="" className="fpImg" />
              {Array.isArray(favoriteHotels) &&
              favoriteHotels.some((fav) => fav.hotel._id === hotel._id) ? (
                <img
                  onClick={() =>
                    handleDeleteFavorite(
                      favoriteHotels.find((fav) => fav.hotel._id === hotel._id)
                        ._id,
                      hotel._id
                    )
                  }
                  className="heart"
                  src={img2}
                  alt=""
                />
              ) : (
                <img
                  onClick={() => addToFavorites(hotel)}
                  className="heart"
                  src={img1}
                  alt=""
                />
              )}
              <div className="content__wrapper">
                <Link to={`http://localhost:3001/hotels/${hotel._id}`}>
                  <span className="fpName">{hotel.name}</span>
                </Link>
                <span className="fpCity">{hotel.city}</span>

                {hotel.rating && (
                  <div className="fpRating">
                    <button>{hotel.rating}</button>
                    <span>Excellent</span>
                  </div>
                )}
                <p className="fpPrice">
                  <span>Starting from</span> VND{" "}
                  {formatNumberWithCommas(hotel.price)}
                </p>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default HotelCard;
