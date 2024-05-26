const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  }, // Tham chiếu đến khách sạn
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Tham chiếu đến người dùng
  rating: { type: Number, min: 1, max: 5, required: true }, // Điểm đánh giá từ 1 đến 5
  comment: { type: String },
  photos: {
    type: [String], // Mảng các chuỗi (URL của hình ảnh)
  },
  nameUser: { type: String },
  createdAt: { type: Date, default: Date.now }, // Thời gian tạo đánh giá
});

module.exports = mongoose.model("Review", reviewSchema);
