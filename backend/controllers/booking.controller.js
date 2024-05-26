const Room = require("../models/Room");
const Booking = require("../models/booking");
const User = require("../models/user");
const { format } = require("date-fns");
// Thêm dòng này vào đầu tệp
const bcrypt = require("bcrypt");
const crypto = require("crypto");
var nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const createBooking = async (req, res) => {
  const leaseId = req.body.leaseId;
  const bookingData = req.body;
  if (!leaseId) {
    return res.status(400).json("User id is required");
  }
  try {
    const booking = new Booking({
      leaseId: leaseId,
      name: bookingData.name,
      phone: bookingData.phone,
      hotel: bookingData.hotel,
      nameHotel: bookingData.nameHotel,
      rooms: bookingData.rooms.map((room) => ({
        roomId: room.roomId,
        price: room.price,
        roomNumbers: room.roomNumbers.map((roomNumber) => ({
          number: roomNumber.number,
          unavailableDates: roomNumber.unavailableDates,
        })),
      })),
      //active: bookingData.active,
    });
    for (const room of booking.rooms) {
      for (const roomNumber of room.roomNumbers) {
        await Room.updateOne(
          { _id: room.roomId, "roomNumbers.number": roomNumber.number },
          {
            $push: {
              "roomNumbers.$.unavailableDates": {
                $each: roomNumber.unavailableDates,
              },
            },
          }
        );
      }
    }
    const savedBooking = await booking.save();
    res.status(200).json(savedBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
  }
};

const stepStatus = async (req, res) => {
  const { status } = req.body;

  try {
    // Tìm bookings theo leaseId
    const bookings = await Booking.find({ _id: req.params.leaseId });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }
    console.log(bookings);
    // Cập nhật status của tất cả các bookings tìm thấy
    for (const booking of bookings) {
      booking.status = status;
      if (status === "completed" || status === "cancelled") {
        booking.active = false;
      }
      await booking.save();

      if (status === "cancelled") {
        console.log(booking, "hihi");
        const user = await handleGetUser(booking.userId);
        // Gửi email thông báo
        const email = user.email;
        await sendRejectionEmail(booking, email);
      }
    }

    // Gửi email thông báo cho từng booking (nếu cần)
    // for (const booking of bookings) {
    //   booking.status = status;
    //   await booking.save();

    //   const email = booking.userId.email;
    //   await sendEmail(email, status, booking);
    // }

    res.status(200).json({ message: "Booking status updated and email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getBookingLeaveById = async (req, res) => {
  try {
    const booking = await Booking.find({ leaseId: req.params.leaseId });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getBookingLeaveByvnpayId = async (req, res) => {
  try {
    const booking = await Booking.find({
      vnpayId: req.params.vnpayId,
    });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json(error);
  }
};
const getBookingLeaveByuserId = async (req, res) => {
  try {
    const booking = await Booking.find({
      userId: req.params.userId,
    });
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json(error);
  }
};

const handleGetUser = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};
const activateBooking = async (bookingId) => {
  try {
    // Tìm booking trong cơ sở dữ liệu
    const booking = await Booking.findById(bookingId);
    console.log(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Đánh dấu booking là đã kích hoạt (active = true)
    booking.active = true;
    booking.status = "confirmed";
    // Lưu thay đổi vào cơ sở dữ liệu
    await booking.save();

    const user = await handleGetUser(booking.userId);

    // Gửi email thông báo
    const email = user.email;
    const status = booking.status;
    await sendEmail(email, status, booking);
  } catch (error) {
    console.log("Error activating booking:", error);
    throw error; // Bạn có thể xử lý lỗi tùy thuộc vào yêu cầu của bạn
  }
};
const sendRejectionEmail = async (booking, email) => {
  try {
    // Tìm người dùng theo email
    // const user = await User.findOne({ email });
    // if (!user) {
    //   console.log("Email not found");
    //   return;
    // }

    // Thiết lập thông tin gửi email
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "linhtran.it.3004@gmail.com",
        pass: "qenz nawe apld knkk",
      },
    });

    const mailOptions = {
      from: "linhtran.it.3004@gmail.com",
      to: email,
      subject: "Đơn đặt phòng của bạn đã bị từ chối",
      text: `Đơn đặt phòng của bạn tại ${booking.nameHotel} đã bị chủ khách sạn từ chối do một vài sự cố.


Xin lỗi vì sự bất tiện này.Chúng tôi sẽ hoàn tiền lại cho bạn. Mọi thắc mắc vui lòng liên hệ với chúng tôi.
`,
    };

    // Gửi email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email: ", err);
      } else {
        console.log("Email sent: ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
const sendEmail = async (email, status, booking) => {
  try {
    // Tìm người dùng theo email
    const user = await User.findOne({ email });
    if (!user) {
      console.log("Email not found");
      return;
    }

    // Thiết lập thông tin gửi email
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "linhtran.it.3004@gmail.com",
        pass: "qenz nawe apld knkk",
      },
    });

    const mailOptions = {
      from: "linhtran.it.3004@gmail.com",
      to: email,
      subject: "Cập nhật trạng thái đặt phòng",
      text: `Trạng thái đặt phòng của bạn đã được cập nhật thành "${status}".
      
Thông tin đặt phòng:
Tên khách hàng: ${booking.name}
Số điện thoại: ${booking.phone}
Khách sạn: ${booking.nameHotel}
Giá tiền: ${booking.totalPrice} VNĐ
Số phòng: ${booking.rooms
        .map((room) => room.roomNumbers.map((roomNumber) => roomNumber.number))
        .flat()
        .join(", ")}
Thời gian đặt phòng: ${format(new Date(booking.createdAt), "HH:mm dd-MM-yyyy")}
Ngày đặt/trả: ${booking.rooms.map((room) =>
        room.roomNumbers
          .map((roomNumber) =>
            roomNumber.unavailableDates.map((date) =>
              format(new Date(date), "dd-MM-yyyy")
            )
          )
          .flat()
          .join(", ")
      )}
      `,
    };

    // Gửi email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email: ", err);
      } else {
        console.log("Email sent: ", info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
};
const accessBooking = async (req, res) => {
  try {
    // Tìm booking trong cơ sở dữ liệu
    const booking = await Booking.findById(bookingId);
    console.log(bookingId);
    if (!booking) {
      throw new Error("Booking not found");
    }

    // Đánh dấu booking là đã kích hoạt (active = true)
    booking.active = true;

    // Lưu thay đổi vào cơ sở dữ liệu
    await booking.save();
  } catch (error) {
    console.log("Error activating booking:", error);
    throw error; // Bạn có thể xử lý lỗi tùy thuộc vào yêu cầu của bạn
  }
};
const accessBookingByUser = async (req, res) => {
  try {
    const bookingId = req.body.bookingId;
    const subtotal = req.body.subtotal;
    const userId = req.body.userId;
    const name = req.body.name;
    const phone = req.body.phone;

    // chuyển từ active = false sang active = true trong booking -> nhiệm vụ để xác nhận booking
    await activateBooking(bookingId);

    // Lấy thông tin booking từ cơ sở dữ liệu thông qua id
    const booking = await Booking.findById(bookingId);

    //   // Xóa booking
    await booking.save();

    // Trả về JSON cho yêu cầu thành công
    return res.json({
      success: true,
      message: "Booking processed successfully",
    });
    // }
  } catch (error) {
    console.log("Error creating order:", error);
    // Trả về JSON cho lỗi
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the booking",
    });
  }
};

const getBooking = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    res.status(200).json(bookings);
  } catch (err) {
    console.error("Error retrieving bookings:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const calculateHotelRevenue = async (req, res) => {
  try {
    const revenues = await Booking.aggregate([
      {
        $match: {
          status: "completed", // Only include bookings with status "completed"
        },
      },
      {
        $group: {
          _id: "$hotel",
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $lookup: {
          from: "hotels",
          localField: "_id",
          foreignField: "_id",
          as: "hotelDetails",
        },
      },
      {
        $unwind: "$hotelDetails",
      },
      {
        $project: {
          _id: 0,
          hotelId: "$_id",
          hotelName: "$hotelDetails.name",
          hotelPhotos: "$hotelDetails.photos",
          hotelAddress: "$hotelDetails.address",
          hotelCity: "$hotelDetails.city",
          hotelRating: "$hotelDetails.rating",
          hotelRooms: "$hotelDetails.rooms",
          hotelUserId: "$hotelDetails.userId",
          totalRevenue: 1,
        },
      },
    ]);

    res.status(200).json(revenues);
    return revenues;
  } catch (error) {
    console.error("Error calculating hotel revenues:", error);
  }
};
// Cập nhật review
const updateBooking = async (req, res) => {
  try {
    const car = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!car) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = {
  createBooking,
  accessBookingByUser,
  getBookingLeaveById,
  getBooking,
  getBookingLeaveByvnpayId,
  getBookingLeaveByuserId,
  stepStatus,
  calculateHotelRevenue,
  updateBooking,
};
