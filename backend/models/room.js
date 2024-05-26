const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    Hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    title: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    amenities: [{ type: String }],
    roomNumbers: [
      {
        number: Number,
        price: Number,
        maxPeople: Number,
        unavailableDates: { type: [Date] },
      },
    ],
  },
  { timestamps: true }
);

// Check if the model already exists before defining it
const Room = mongoose.models.Room || mongoose.model("Room", RoomSchema);

module.exports = Room;
