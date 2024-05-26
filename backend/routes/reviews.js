const express = require("express");
const router = express.Router();
const Review = require("../models/review.js");

// Tạo đánh giá mới
router.get("/:hotelId", async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const reviews = await Review.find({ hotelId }).populate(
      "userId",
      "userName"
    );

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, hotelId, rating, comment, photos } = req.body;

    // Tạo đối tượng đánh giá mới
    const newReview = new Review({
      userId,
      hotelId,
      rating,
      comment,
      photos,
    });

    // Lưu đánh giá mới vào cơ sở dữ liệu
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
