import React, { useEffect, useState } from "react";
import axios from "axios";
import "./detailroom.css";

function DetailRoom({ onClick, hotelId, roomNumber, isOpen, onGetPrice }) {
  const [isData, setIsData] = useState(null);
  // console.log(hotelId, "hotelId");
  const formatNumberWithCommas = (number) => {
    // Check if number is defined
    if (number !== undefined && number !== null) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      // Handle the case where number is undefined or null
      return "0"; // Or any default value or message you prefer
    }
  };
  useEffect(() => {
    const fetchRoom = async () => {
      const response = await axios.get(
        `http://localhost:5000/api/rooms/${hotelId}/${roomNumber}`
      );
      setIsData(response.data);
      // console.log(response.data.price, "rooms");
      // if (response.data && response.data.price) {
      //   onGetPrice(response.data.price);
      // }
    };
    if (roomNumber) {
      fetchRoom();
    }
  }, [hotelId, roomNumber, isOpen, onGetPrice]);

  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClick}>
          &times;
        </span>
        <h3>Số phòng: {roomNumber}</h3>
        <p>Giá phòng / đêm: {formatNumberWithCommas(isData.price)} VNĐ</p>

        {/* <p>{`"${wishlistName}" will be permanently deleted.`}</p> */}
      </div>
    </div>
  ) : null;
}

export default DetailRoom;
