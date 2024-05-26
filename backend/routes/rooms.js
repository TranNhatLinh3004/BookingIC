const router = require("express").Router();

const {
  createRoom,
  deleteRoom,
  getRoom,
  getRooms,
  updateRoom,
  updateRoomAvailability,
  getRoomByHotel,
  getUnavailableDatesForRoom,
} = require("../controllers/room.controller.js");
// import { verifyAdmin } from "../utils/verifyToken.js";

// //CREATE
// router.post("/:hotelid", verifyAdmin, createRoom);

// //UPDATE
// router.put("/availability/:id", updateRoomAvailability);
// router.put("/:id", verifyAdmin, updateRoom);
// //DELETE
// router.delete("/:id/:hotelid", verifyAdmin, deleteRoom);
//GET
router.get("/unavailableDates/:roomId", getUnavailableDatesForRoom);
//CREATE
router.post("/:hotelid", createRoom);

router.get("/hotel/:id", getRoomByHotel);

router.get("/:id", getRoom);
//GET ALL
router.get("/:hotelId/:roomNumber", getRoom);

router.get("/", getRooms);

module.exports = router;
