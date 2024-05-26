import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const VnpayReturn = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [paymentStatus, setPaymentStatus] = useState("");
  const [responseCode, setResponseCode] = useState("");
  const [loading, setLoading] = useState(true);
  const vnp_TxnRef = queryParams.get("vnp_TxnRef");
  useEffect(() => {
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      try {
        const queryString = queryParams.toString();
        const {
          data: { message, code },
        } = await axios.get(
          `http://localhost:5000/api/vnpay/vnpay_return?${queryString}`,
          {
            cancelToken: source.token,
          }
        );

        if (code === "00") {
          await axios.post(
            `http://localhost:5000/api/vnpay/create`,
            { vnp_TxnRef: vnp_TxnRef },
            { withCredentials: true }
          );
        } else {
          await axios.delete(
            `http://localhost:5000/api/vnpay/delete`,
            { vnp_TxnRef: vnp_TxnRef },
            { withCredentials: true }
          );
        }

        setPaymentStatus(message);
        setResponseCode(code);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error("Error fetching VNPAY return data:", error);
          setPaymentStatus("failed");
          setResponseCode("");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      source.cancel();
    };
  }, []); // Empty dependency array

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="max-w-md w-full bg-white p-8 shadow-lg rounded-lg">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              {paymentStatus === "success"
                ? "Payment Successful"
                : "Payment Failed"}
            </h2>
            <p className="text-gray-700 mb-4">
              {paymentStatus === "success"
                ? "Thank you for your payment!"
                : "Oops! Something went wrong with your payment."}
            </p>
            <p className="text-gray-700">
              Response Code: <strong>{responseCode}</strong>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default VnpayReturn;
