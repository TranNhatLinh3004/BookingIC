const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel" },
    // Các trường dữ liệu khác tùy thuộc vào yêu cầu của bạn
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Favorite", favoriteSchema);