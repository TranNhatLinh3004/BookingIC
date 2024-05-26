import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import Pin from "../pin/Pin";

function Map({ items }) {
  return (
    <MapContainer
      center={[16.0544, 108.198]} // Đà Nẵng, Việt Nam
      zoom={6}
      scrollWheelZoom={false}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {(items && Array.isArray(items) ? items : [items]).map((item) => (
        <Pin item={item} key={item.id} />
      ))}
    </MapContainer>
  );
}

export default Map;
