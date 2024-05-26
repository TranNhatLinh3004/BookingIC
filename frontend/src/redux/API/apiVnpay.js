import axios from "axios";
import qs from "qs";

export const postVnpay = async (vnpaydata, retryCount = 3) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/vnpay/create_payment_url`,
      vnpaydata,
      { withCredentials: true }
    );
    console.log(response.data);
    return response;
  } catch (error) {
    if (retryCount <= 0) {
      throw error;
    }

    // Wait for 2 seconds before retrying
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Retry the request
    return postVnpay(vnpaydata, retryCount - 1);
  }
};
