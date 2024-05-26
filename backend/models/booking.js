const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    leaseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String },
    phone: { type: Number },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    nameHotel: { type: String },
    rooms: [
      {
        roomId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },

        price: {
          type: Number,
        },
        roomNumbers: [
          {
            price: Number,
            maxPeople: Number,

            number: Number,
            unavailableDates: { type: [Date] },
          },
        ],
      },
    ],
    checkinDate: {
      type: Date,
    },
    checkoutDate: {
      type: Date,
    },
    active: {
      type: Boolean,
      default: false,
    },
    vnpayId: {
      type: String,
    },
    totalPrice: {
      type: Number,
    },
    isRated: { type: Boolean, default: false },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "checked-in",
        "checked-out",
        "completed",
        "cancelled",
      ],
      default: "pending", // Default value is "confirmed" if not provided
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
