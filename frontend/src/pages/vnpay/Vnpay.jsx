import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postVnpay } from "../../redux/API/apiVnpay";
import { useSelector } from "react-redux";

import "./vnpay.css";

function Vnpay({ data }) {
  const [isLoading, setIsLoading] = useState(false);
  const [bankCode, setBankCode] = useState("");
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const { leaseId, name, phone, rooms, nameHotel } = data;

  console.log(data, "vnpay");
  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        throw new Error("User is not authenticated.");
      }

      const roomSubtotal = data.price;
      // const roomData = rooms.map((room) => ({
      //   roomId: room.roomId,
      //   roomNumbers: room.roomNumbers.map((roomNumber) => ({
      //     maxPeople: roomNumber.maxPeople,
      //     price: roomNumber.price,
      //     number: roomNumber.number,
      //     unavailableDates: roomNumber.unavailableDates.map((dateString) =>
      //       dateString.substring(0, 10)
      //     ),
      //   })),
      // }));

      const NewData = {
        leaseId: leaseId,
        userId: user._id,
        name: name,
        nameHotel: nameHotel,
        phone: phone,
        hotel: data.hotel,
        subtotal: roomSubtotal,
        rooms: rooms,
        paymentMethod: bankCode,
        orderType: "billpayment",
        language: "vn",
        bankCode: bankCode,
        amount: roomSubtotal,
      };

      const response = await postVnpay(NewData);
      window.location.replace(response.data.data);
    } catch (error) {
      console.error("Error processing payment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <div>
        <label>
          <input
            type="radio"
            name="bankCode"
            value="VNBANK"
            checked={bankCode === "VNBANK"}
            onChange={() => setBankCode("VNBANK")}
          />
          Thanh toán qua ATM-Tài khoản ngân hàng nội địa
        </label>
      </div>
      <div>
        <label>
          <input
            type="radio"
            name="bankCode"
            value="INTCARD"
            checked={bankCode === "INTCARD"}
            onChange={() => setBankCode("INTCARD")}
          />
          Thanh toán qua thẻ quốc tế
        </label>
      </div>
      <button
        className="purchase-btn"
        onClick={handlePurchase}
        disabled={isLoading}
      >
        {isLoading ? "Đang xử lý..." : "Thanh toán"}
      </button>
    </div>
  );
}

export default Vnpay;
