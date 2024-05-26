const Room = require("../models/room.js");
const Hotel = require("../models/hotel.js");
// import { createError } from "../utils/error.js";

const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (err) {
    next(err);
  }
};
const getUnavailableDatesForRoom = async (req, res, next) => {
  try {
    // Lấy id của phòng từ request parameters
    const roomId = req.params.roomId;
    // Lấy số phòng từ request query
    const roomNumber = req.query.number;

    // Tìm phòng trong cơ sở dữ liệu dựa trên roomId
    const room = await Room.findById(roomId);

    // Kiểm tra xem phòng có tồn tại không
    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    // Tìm kiếm số phòng cụ thể trong roomNumbers
    const selectedRoom = room.roomNumbers.find(
      (rm) => rm.number === parseInt(roomNumber)
    );

    // Kiểm tra xem số phòng đã chọn có tồn tại không
    if (!selectedRoom) {
      return res.status(404).json({ message: "Không tìm thấy số phòng" });
    }

    // Lấy 2 ngày cuối cùng từ mảng unavailableDates
    const unavailableDates = selectedRoom.unavailableDates.slice(-2);

    res.status(200).json({ unavailableDates: unavailableDates });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unavailable" });
  }
};

const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (err) {
    next(err);
  }
};
const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Room status has been updated.");
  } catch (err) {
    next(err);
  }
};
const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelid;
  try {
    await Room.findByIdAndDelete(req.params.id);
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $pull: { rooms: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("Room has been deleted.");
  } catch (err) {
    next(err);
  }
};
const getRoom = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const roomNumber = req.params.roomNumber;

    // Tìm phòng dựa trên Hotel_id và số phòng trong mảng roomNumbers
    const room = await Room.findOne(
      {
        Hotel_id: hotelId,
        "roomNumbers.number": roomNumber,
      },
      {
        "roomNumbers.$": 1,
        _id: 1,
        Hotel_id: 1,
        title: 1,
        price: 1,
        maxPeople: 1,
        desc: 1,
        images: 1,
        amenities: 1,
      }
    );

    if (!room) {
      return res.status(404).json({ message: "Phòng không tồn tại" });
    }

    // Lấy thông tin chi tiết của phòng tương ứng với số phòng và khách sạn
    const roomDetail = room.roomNumbers.find(
      (roomNumber) => roomNumber.number === Number(req.params.roomNumber)
    );

    res.status(200).json(roomDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

const getRoomByHotel = async (req, res, next) => {
  try {
    const room = await Room.find({ Hotel_id: req.params.id });
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  updateRoomAvailability,
  deleteRoom,
  getRoomByHotel,
  getUnavailableDatesForRoom,
};
