const Hotel = require("../models/hotel.js");
const Room = require("../models/room.js");
const Booking = require("../models/booking");

const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    next(err);
  }
};
const updateHotel = async (req, res, next) => {
  try {
    // Using findByIdAndUpdate to find the hotel by its ID and update its fields
    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id, // req.params.id contains the ID of the hotel to be updated
      { $set: req.body }, // Updating the hotel fields with the data from req.body
      { new: true } // { new: true } returns the updated document after the update operation
    );

    // Sending the updated hotel as a JSON response
    res.status(200).json(updatedHotel);
  } catch (err) {
    // Handling any errors that might occur during the update process
    next(err);
  }
};

const deleteHotel = async (req, res, next) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been delete");
  } catch (err) {
    next(err);
  }
};

const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    next(err);
  }
};

//  const getHotels = async (req, res, next) => {
//   const { min, max, ...others } = req.query;
//   try {
//     const hotels = await Hotel.find({
//       ...others,
//       cheapestPrice: { $gt: min || 1, $lt: max || 999 },
//     }).limit(req.query.limit);
//     res.status(200).json(hotels);
//   } catch (err) {
//     next(err);
//   }
// };

// const getHotels = async (req, res, next) => {
//   const { min, max, limit, ...others } = req.query;

//   try {
//     // Parse the limit parameter to ensure it's an integer
//     const limitValue = limit ? parseInt(limit, 10) : undefined;

//     const hotels = await Hotel.find({
//       ...others,
//       price: { $gt: min || 1, $lt: max || 9999999 },
//     }).limit(limitValue);

//     res.status(200).json(hotels);
//   } catch (err) {
//     next(err);
//   }
// };
const getHotels = async (req, res, next) => {
  const { min, max, page, limit, ...others } = req.query;

  try {
    const limitValue = limit && parseInt(limit, 10);
    const pageValue = page && parseInt(page, 10);
    const skip = (pageValue - 1) * limitValue;

    const hotels = await Hotel.find({
      ...others,
      price: { $gt: min || 1, $lt: max || 9999999 },
    })
      .skip(skip)
      .limit(limitValue);

    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};

const getAvailableHotels = async function (city, checkin, checkout) {
  const availableHotels = await Hotel.aggregate([
    { $match: { city } },
    {
      $lookup: {
        from: "rooms",
        localField: "rooms",
        foreignField: "_id",
        as: "roomDetails",
      },
    },
    { $unwind: "$roomDetails" },
    {
      $project: {
        name: 1,
        city: 1,
        "roomDetails.roomNumbers": 1,
        _id: 0,
      },
    },
    {
      $unwind: "$roomDetails.roomNumbers",
    },
    {
      $match: {
        "roomDetails.roomNumbers.unavailableDates": {
          $not: {
            $elemMatch: {
              $gte: checkin,
              $lte: checkout,
            },
          },
        },
      },
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        city: { $first: "$city" },
        availableRooms: { $push: "$roomDetails.roomNumbers" },
      },
    },
    { $match: { availableRooms: { $not: { $size: 0 } } } },
  ]);

  return availableHotels;
};
const countByCity = async (req, res, next) => {
  const cities = req.query.cities ? req.query.cities.split(",") : [];
  const { city, checkin, checkout } = req.query;
  try {
    const availableHotels = await getAvailableHotels(
      city,
      new Date(checkin),
      new Date(checkout)
    );
    res.json(availableHotels);
    // If no city is provided, fetch all hotels
    if (cities.length === 0) {
      const totalCount = await Hotel.countDocuments({});
      res.status(200).json(totalCount);
    } else {
      // Otherwise, fetch hotels based on the provided cities
      const list = await Promise.all(
        cities.map((city) => {
          return Hotel.countDocuments({
            city: { $regex: city, $options: "i" },
          });
        })
      );
      res.status(200).json(list);
    }
  } catch (error) {
    next(error);
  }
};

const searchHotels = async (
  checkInDate,
  checkOutDate,
  city = null,
  numGuests = null
) => {
  try {
    // Nếu không có city và numGuests, tìm tất cả khách sạn
    const hotels =
      city || numGuests
        ? await Hotel.find({ city }).populate("rooms")
        : await Hotel.find().populate("rooms");
    // Lọc khách sạn có phòng trống phù hợp
    const availableHotels = await Promise.all(
      hotels.map(async (hotel) => {
        // console.log(hotel, "hotel");
        const hotelId = hotel.id.toString();
        const availableRooms = await checkAvailableRooms(
          hotelId,
          checkInDate,
          checkOutDate,
          numGuests
        );

        if (availableRooms.length > 0) {
          return {
            ...hotel._doc,
            availableRooms,
          };
        }

        return null;
      })
    );

    // Loại bỏ các giá trị null (khách sạn không có phòng trống)
    const filteredHotels = availableHotels.filter(Boolean);

    return filteredHotels;
  } catch (err) {
    throw new Error(err);
  }
};

const checkAvailableRooms = async (
  rooms,
  checkInDate,
  checkOutDate,
  numGuests
) => {
  console.log([rooms], "room");
  try {
    const hotel = await Hotel.findById(rooms);
    // console.log(hotel, "listssssssssssss");

    const room = await Room.find({ Hotel_id: rooms });
    console.log(room, "list");
    const availableRooms = await Promise.all(
      room.map((roomId) => {
        return null;
      })
    );

    return availableRooms.filter(Boolean);
  } catch (err) {
    throw new Error(err);
  }
};

const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartments", count: apartmentCount },
      { type: "resorts", count: resortCount },
      { type: "villas", count: villaCount },
      { type: "cabins", count: cabinCount },
    ]);
  } catch (err) {
    next(err);
  }
};

const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const list = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    res.status(200).json(list);
  } catch (err) {
    next(err);
  }
};

const getHotelById = async (req, res, next) => {
  try {
    const userId = req.params.userId; // Lấy userId từ request parameters
    const hotels = await Hotel.find({ userId: userId });
    res.status(200).json(hotels);
  } catch (err) {
    next(err);
  }
};
const searchHandle = async (req, res) => {
  const { city, checkin, checkout } = req.query;

  try {
    const hotelQuery = {};

    // Tìm khách sạn dựa trên thành phố
    if (city) {
      hotelQuery.city = new RegExp(city, "i");
    }

    // Chuyển đổi các ngày check-in và check-out sang đối tượng JavaScript Date
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    // Tìm các khách sạn dựa trên truy vấn khách sạn
    const hotels = await Hotel.find(hotelQuery).limit(10);
    const hotelIds = hotels.map((hotel) => hotel._id);
    console.log(hotelIds);
    // Tìm các phòng trong các khách sạn đã tìm thấy
    const rooms = await Room.find({ Hotel_id: { $in: hotelIds } });

    // Lấy tất cả các orders có liên quan đến các phòng trong khoảng thời gian yêu cầu
    const orders = await Booking.find({
      "rooms.roomId": { $in: rooms.map((room) => room._id) },
    });

    // Tạo một tập hợp các roomId và unavailableDates đã được đặt trong khoảng thời gian đó
    const bookedRoomDates = new Map();
    orders.forEach((order) => {
      order.rooms.forEach((room) => {
        room.roomNumbers.forEach((roomNumber) => {
          if (!bookedRoomDates.has(room.roomId.toString())) {
            bookedRoomDates.set(room.roomId.toString(), []);
          }
          bookedRoomDates.get(room.roomId.toString()).push({
            number: roomNumber.number,
            unavailableDates: roomNumber.unavailableDates.map((date) =>
              new Date(date).toISOString()
            ),
          });
        });
      });
    });

    // Lọc ra các phòng có sẵn trong khoảng thời gian yêu cầu
    const availableRooms = rooms.filter((room) => {
      const roomBookings = bookedRoomDates.get(room._id.toString()) || [];

      // Check if all room numbers for this room are booked
      const allBooked = room.roomNumbers.every((roomNumber) => {
        const booking = roomBookings.find(
          (b) => b.number === roomNumber.number
        );
        if (booking) {
          return booking.unavailableDates.some((date) => {
            const unavailableDate = new Date(date);
            return (
              unavailableDate >= checkinDate && unavailableDate < checkoutDate
            );
          });
        }
        return false;
      });

      // If all room numbers are booked, exclude this room
      if (allBooked) {
        return false;
      }

      // If at least one room number is available, include this room
      return true;
    });

    // Nhóm các phòng theo khách sạn tương ứng
    const hotelsWithRooms = hotels
      .map((hotel) => {
        const hotelRooms = availableRooms.filter((room) =>
          room.Hotel_id.equals(hotel._id)
        );
        return {
          hotel,
          rooms: hotelRooms,
        };
      })
      .filter((hotelWithRooms) => hotelWithRooms.rooms.length > 0);

    // Trả về kết quả
    res.status(200).json(hotelsWithRooms);
  } catch (err) {
    next(err); // Xử lý lỗi
  }
};
module.exports = {
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
};
