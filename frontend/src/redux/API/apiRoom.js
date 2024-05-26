import axios from "axios";

export const getRoomById = async (id) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/rooms/find/${id}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const createRoom = async (room) => {
  try {
    const response = await axios.post(
      `http://localhost:5000/api/rooms/create`,
      room
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const unavailableDatesRoom = async (roomId, number) => {
  try {
    console.log(roomId, number);
    const response = await axios.get(
      `http://localhost:5000/api/rooms/unavailableDates/${roomId}?number=${number}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
