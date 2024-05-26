import axios from "axios";
export const getbookingLeaveById = async (id) => {
    try {
        const reponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/booking/find/${id}`);
        // console.log(reponse.data);
        return reponse.data;
    } catch (error) {
        console.log(error);
    }
}
export const accessBooking = async (data) => {
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}api/orders/accessBooking`, data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const getHotelById = async (id) => {
    try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}api/hotels/find/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}