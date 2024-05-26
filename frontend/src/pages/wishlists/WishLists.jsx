import React, { useEffect, useState } from "react";
import "./wishlists.css";
import { Link } from "react-router-dom";
import axios from "axios";
import ConfirmationModal from "./ConfirmationModal";
import { useSelector } from "react-redux";

function WishLists(props) {
  const userData = useSelector((state) => state.user);
  const userId = userData._id;
  const [favorites, setFavorites] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [favoriteToDelete, setFavoriteToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // Thêm state loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/favorites/${userId}`
        );
        setFavorites(response.data);

        console.log(response.data);
        setLoading(false); // Kết thúc việc tải dữ liệu khi dữ liệu đã được nhận
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchData();
  }, [favorites]);

  const handleDeleteFavorite = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
        data: { userId },
      });
      setFavorites(favorites.filter((favorite) => favorite._id !== id));
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDeleteClick = (favoriteId) => {
    setFavoriteToDelete(favoriteId);
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = () => {
    handleDeleteFavorite(favoriteToDelete);
    setShowConfirmationModal(false);
    setFavoriteToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowConfirmationModal(false);
    setFavoriteToDelete(null);
  };

  return (
    <div className="wishlists__container">
      <h3 className="subtitle">Danh sách yêu thích</h3>
      {loading ? ( // Hiển thị loading nếu đang tải dữ liệu
        <div>Loading...</div>
      ) : (
        <div className="wishlists__wrapper">
          {favorites.length > 0 ? (
            <>
              {favorites.map((favorite) => (
                <div className="card__item">
                  <span>
                    <i
                      className="uil uil-times"
                      onClick={() => handleDeleteClick(favorite._id)}
                    ></i>
                  </span>
                  <img src={favorite.hotel.photos[0]} alt="" />
                  <h4 className="card__name">
                    <Link
                      to={`http://localhost:3001/hotels/${favorite.hotel._id}`}
                    >
                      {favorite.hotel.name}
                    </Link>
                  </h4>
                </div>
              ))}
            </>
          ) : (
            <div className="wishlists__text">
              <h4>Tạo danh sách mong muốn đầu tiên của bạn</h4>
              <p>
                Khi bạn tìm kiếm, hãy nhấp vào biểu tượng trái tim để lưu các
                địa điểm yêu thích của bạn và Kinh nghiệm vào danh sách mong
                muốn
              </p>
            </div>
          )}
        </div>
      )}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        itemName={
          favoriteToDelete
            ? favorites.find((f) => f._id === favoriteToDelete).name
            : ""
        }
      />
    </div>
  );
}

export default WishLists;
