const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingLeaveById,
  accessBookingByUser,
  getBooking,
  getBookingLeaveByvnpayId,
  getBookingLeaveByuserId,
  stepStatus,
  updateBooking,
  calculateHotelRevenue,
} = require("../controllers/booking.controller.js");

router.put("/update-status/:leaseId", stepStatus);

router.post("/create", createBooking);
router.get("", getBooking);
router.put("/:id", updateBooking);
router.post("/accessBooking", accessBookingByUser);
// router.post("/:id", BookingController.getOne)
router.get("/find/:leaseId", getBookingLeaveById);
router.get("/infor/:vnpayId", getBookingLeaveByvnpayId);
router.get("/:userId", getBookingLeaveByuserId);
router.get("/report/hotel/revenue", calculateHotelRevenue);
module.exports = router;
