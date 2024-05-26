const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  photos: {
    type: [String], // Mảng các chuỗi (URL của hình ảnh)
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  featured: {
    type: Boolean,
    required: false,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review", // Tham chiếu đến schema đánh giá riêng
    },
  ],
  rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  rating: { type: Number, min: 0, max: 5 },
});

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
