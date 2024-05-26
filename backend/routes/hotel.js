const router = require("express").Router();
const {
  createHotel,
  deleteHotel,
  getHotel,
  getHotels,
  updateHotel,
  countByCity,
  countByType,
  getHotelRooms,
  getHotelById,
  searchHandle,
} = require("../controllers/hotel.controller.js");

//CREATE
router.post("/", createHotel);

//UPDATE
router.put("/:id", updateHotel);

//DELETE
router.delete("/:id", deleteHotel);
//GET
//GET ALL
router.get("/", getHotels);

router.get("/hotel-manager/:userId", getHotelById);

// router.get("/search", searchHandle);

router.get("/countByType", countByType);

router.get("/room/:id", getHotelRooms);

router.get("/:id", getHotel);

module.exports = router;
