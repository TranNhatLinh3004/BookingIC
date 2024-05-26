const express = require("express");
const router = express.Router();
const config = require("config");
const Booking = require("../models/booking");
// const dateFormat = require("dateformat");
// const sha256 = require("sha256");
// let axios = require("axios");
// const Order = require("../module/OrderModule");
// const Booking = require("../module/BookingModule");
// const orderController = require("../controller/orderController");
let dateformat;
import("dateformat").then((module) => {
  dateFormat = module.default;
});

router.post("/create_payment_url", async function (req, res, next) {
  const vnpaydata = req.body;

  const subtotal = req.body.subtotal;
  // const userId = req.body.userId;
  // const name = req.body.name;
  // const phone = req.body.phone;
  // const rooms = req.body.rooms;

  let date = new Date();
  let createDate = dateFormat(date, "yyyymmddHHmmss");
  let ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let config = require("config");

  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let vnpUrl = config.get("vnp_Url");
  let returnUrl = config.get("vnp_ReturnUrl");
  let orderId = dateFormat(date, "yyyymmddHHmmss");
  let amount = req.body.amount;
  let bankCode = req.body.bankCode;
  let locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  let currCode = "VND";
  let vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = "Thanh toan cho ma GD:" + orderId;
  vnp_Params["vnp_OrderType"] = "other";
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  // vnp_Params["name"] = name;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  // chuyển từ active = false sang active = true trong booking -> nhiệm vụ để xác nhận booking
  // await orderController.activateBooking(bookingId);

  // Lấy thông tin booking từ cơ sở dữ liệu thông qua id
  // const booking = await Booking.findById(bookingId);

  // Kiểm tra nếu booking đã được kích hoạt (active = true)
  // if (booking.active) {
  const booking = new Booking({
    leaseId: vnpaydata.leaseId,
    userId: vnpaydata.userId,
    name: vnpaydata.name,
    phone: vnpaydata.phone,
    hotel: vnpaydata.hotel,
    nameHotel: vnpaydata.nameHotel,
    rooms: vnpaydata.rooms,
    totalPrice: subtotal,
    active: false,
    vnpayId: orderId,
    status: "pending",
  });
  // for (const room of booking.rooms) {
  //   for (const roomNumber of room.roomNumbers) {
  //     await Room.updateOne(
  //       { _id: room.roomId, "roomNumbers.number": roomNumber.number },
  //       {
  //         $push: {
  //           "roomNumbers.$.unavailableDates": {
  //             $each: roomNumber.unavailableDates,
  //           },
  //         },
  //       }
  //     );
  //   }
  // }
  const savedBooking = await booking.save();
  // res.status(200).json(savedBooking);
  if (savedBooking === null) {
    res.status(500).json({ message: "order fail" });
  }
  res.status(200).json({ code: "00", data: vnpUrl, booking: savedBooking });
  // Xóa booking
  // await booking.deleteOne();

  // Trả về JSON cho yêu cầu thành công
  // return res.json({
  //   success: true,
  //   message: "Booking processed successfully",
  // });
  // }
});

router.get("/vnpay_ipn", async function (req, res, next) {
  console.log("start vnpay_ipn");
  let vnp_Params = req.query;
  let secureHash = vnp_Params["vnp_SecureHash"];

  let orderId = vnp_Params["vnp_TxnRef"];
  let rspCode = vnp_Params["vnp_ResponseCode"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let config = require("config");
  let secretKey = config.get("vnp_HashSecret");
  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) {
    // Kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == "0") {
          // Kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == "00") {
            // Thanh toán thành công
            // Tìm và cập nhật đối tượng booking với orderId
            const booking = await Booking.findOneAndUpdate(
              { _id: orderId },
              { $set: { vnpayId: orderId } },
              { new: true }
            );

            if (!booking) {
              res
                .status(404)
                .json({ RspCode: "01", Message: "Booking not found" });
            } else {
              res.status(200).json({ RspCode: "00", Message: "Success" });
            }
          } else {
            res.status(200).json({ RspCode: "00", Message: "Success" });
          }
        } else {
          res.status(200).json({
            RspCode: "02",
            Message: "This order has been updated to the payment status",
          });
        }
      } else {
        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
      }
    } else {
      res.status(200).json({ RspCode: "01", Message: "Order not found" });
    }
  } else {
    res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
  }
});
router.get("/vnpay_return", async function (req, res, next) {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];

  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);

  let config = require("config");
  let tmnCode = config.get("vnp_TmnCode");
  let secretKey = config.get("vnp_HashSecret");
  let orderId = vnp_Params["vnp_TxnRef"];

  let querystring = require("qs");
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

  //sau khi thanh toán thành công thì trả về trang này đồng thời Order sẽ duawjvoaf vnpayId để cập nhật trạng thái isPaid = true, còn không thì sẽ xóa đi booking trong order
  if (secureHash === signed) {
    res.json({ message: "success", code: vnp_Params["vnp_ResponseCode"] });
  } else {
    // await Order.findOneAndDelete({ vnpayId: orderId });
    res.json({ message: "fail", code: "97" });
  }
});

router.post("/create", async function (req, res, next) {
  const orderId = req.body.vnp_TxnRef;

  console.log("orderId", orderId);
  try {
    // Tìm đơn hàng trong cơ sở dữ liệu với orderId nhận được
    const order = await Order.findOne({ vnpayId: orderId });

    // Kiểm tra xem đơn hàng có tồn tại không
    if (!order) {
      console.log("Đơn hàng không tồn tại");
      return;
    }

    // Cập nhật trạng thái thanh toán của đơn hàng thành true và lưu vào cơ sở dữ liệu
    order.isPaid = true;
    order.paidAt = new Date();
    await order.save();
    res.json({
      message: "Cập nhật trạng thái thanh toán thành công cho đơn hàng",
      orderId,
    });
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật trạng thái thanh toán cho đơn hàng:",
      error
    );
  }
});
router.delete("/delete", async function (req, res, next) {
  const orderId = req.body.vnp_TxnRef;

  console.log("orderId", orderId);

  try {
    // Tìm đơn hàng trong cơ sở dữ liệu với orderId nhận được
    const order = await Order.findOneAndDelete({ vnpayId: orderId });
    await order.save();

    res.json({ message: "Xóa đơn hàng thành công", orderId });
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật trạng thái thanh toán cho đơn hàng:",
      error
    );
  }
});

function sortObject(obj) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
module.exports = router;
