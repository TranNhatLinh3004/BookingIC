const Hotel = require("../models/hotel.js");
const Room = require("../models/Room");
const Booking = require("../models/booking");

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
  searchHandle,
};
