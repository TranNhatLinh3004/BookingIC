import { Marker, Popup } from "react-leaflet";
import React, { useEffect, useState } from "react";
import "./pin.css";
import { Link } from "react-router-dom";
import L from "leaflet";
import icon from "../../assets/images/icon.png";
function Pin({ item }) {
  // Tạo biểu tượng cho Marker
  const customIcon = new L.Icon({
    iconUrl: icon, // Đường dẫn đến biểu tượng của bạn
    iconSize: [32, 32], // Kích thước của biểu tượng
    iconAnchor: [16, 32], // Vị trí neo của biểu tượng
    popupAnchor: [0, -32], // Vị trí hiển thị Popup
  });
  return (
    <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
      <Popup>
        <div className="popupContainer">
          <img src={item?.photos[0]} alt="" />
          <div className="textContainer">
            <Link to={`/hotels/${item._id}`}>{item.name}</Link>
            <span>2 bedroom</span>
            <b>{item?.price} VNĐ</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;
