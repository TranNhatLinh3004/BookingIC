import React, { useState } from "react";
import "./addhotel.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
const AddHotelPage = () => {
  const [step, setStep] = useState(1);
  const handleCheckOutChange = (date) => {
    setFormData({ ...formData, checkOutTime: date });
  };
  const [dataResponse, setDataResponse] = useState([]);
  const [roomData, setRoomData] = useState({
    Hotel_id: "",
    title: "",
    price: 0,
    maxPeople: 0,
    desc: "",
    images: [],
    amenities: [],
    roomNumbers: [],
  });
  const handleRoomChange = (e) => {
    if (e.target.name === "images" || e.target.name === "amenities") {
      setRoomData({
        ...roomData,
        [e.target.name]: e.target.value.split(","),
      });
    } else if (e.target.name === "roomNumbers") {
      setRoomData({
        ...roomData,
        [e.target.name]: e.target.value.split(",").map((num) => ({
          number: parseInt(num),
          unavailableDates: [],
        })),
      });
    } else {
      setRoomData({
        ...roomData,
        Hotel_id: dataResponse._id,
        [e.target.name]: e.target.value,
      });
    }
  };
  const userData = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    photos: [
      "https://images.pexels.com/photos/20142606/pexels-photo-20142606/free-photo-of-balcony-greece.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/20142606/pexels-photo-20142606/free-photo-of-balcony-greece.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/20142606/pexels-photo-20142606/free-photo-of-balcony-greece.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/20142606/pexels-photo-20142606/free-photo-of-balcony-greece.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      "https://images.pexels.com/photos/20142606/pexels-photo-20142606/free-photo-of-balcony-greece.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ],
    description: "",
    price: 0,
    latitude: 0,
    longitude: 0,
    featured: false,
    reviews: [],
    rooms: [],
    rating: 0,
    userId: "",
  });
  console.log(formData);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      userId: userData._id,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/hotels", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // Chỉnh sửa "Content Type" thành "Content-Type"
      }); // Đây là nơi xử lý đăng nhập, bạn có thể gửi dữ liệu đăng nhập đến máy chủ ở đây.
      const dataRes = await response.json();

      setDataResponse(dataRes);

      console.log(dataRes._id);
      if (response.ok) {
        toast.success("Tạo khách sạn thành công");
        setStep(2);
      }
    } catch (error) {}
    // Gửi dữ liệu form đến server
    console.log(formData);
  };
  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/rooms/${dataResponse._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(roomData),
        }
      );

      if (response.ok) {
        toast.success("Room created successfully!");
        setStep(1);
      } else {
        alert("Failed to create room.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the room.");
    }
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="container__add mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Thêm Khách Sạn</h1>
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="mb-4">
                <label htmlFor="name" className="block font-bold mb-2">
                  Tên Khách Sạn
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block font-bold mb-2">
                  Địa Chỉ
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="city" className="block font-bold mb-2">
                  Thành Phố
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block font-bold mb-2">
                  Mô Tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="block font-bold mb-2">
                  Giá
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="latitude" className="block font-bold mb-2">
                  Vĩ Độ
                </label>
                <input
                  type="number"
                  id="latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="longitude" className="block font-bold mb-2">
                  Kinh Độ
                </label>
                <input
                  type="number"
                  id="longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="featured" className="block font-bold mb-2">
                  Nổi Bật
                </label>
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={(e) =>
                    setFormData({ ...formData, featured: e.target.checked })
                  }
                  className="form-checkbox"
                />
              </div>
              {/* <div className="mb-4">
            <label htmlFor="reviews" className="block font-bold mb-2">
              Số Lượng Đánh Giá
            </label>
            <input
              type="number"
              id="reviews"
              name="reviews"
              value={formData.reviews}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div> */}
              {/* <div className="mb-4">
            <label htmlFor="rooms" className="block font-bold mb-2">
              Số Phòng
            </label>
            <input
              type="number"
              id="rooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div> */}
              <div className="mb-4">
                <label htmlFor="rating" className="block font-bold mb-2">
                  Đánh Giá
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Thêm Khách Sạn
              </button>
            </form>
          </div>
        );

      case 2:
        return (
          <div className="container__add mx-auto">
            <h1>Tạo phòng</h1>
            <form onSubmit={handleRoomSubmit}>
              <label>
                Tiêu đề:
                <input
                  type="text"
                  name="title"
                  value={roomData.title}
                  onChange={handleRoomChange}
                  required
                />
              </label>
              <label>
                Giá:
                <input
                  type="number"
                  name="price"
                  value={roomData.price}
                  onChange={handleRoomChange}
                  required
                />
              </label>
              <label>
                Số người tối đa:
                <input
                  type="number"
                  name="maxPeople"
                  value={roomData.maxPeople}
                  onChange={handleRoomChange}
                  required
                />
              </label>
              <label>
                Mô tả:
                <textarea
                  name="desc"
                  value={roomData.desc}
                  onChange={handleRoomChange}
                  required
                />
              </label>
              <label>
                Ảnh (danh sách URL, phân cách bằng dấu phẩy):
                <input
                  type="text"
                  name="images"
                  value={roomData.images.join(",")}
                  onChange={handleRoomChange}
                  required
                />
              </label>
              <label>
                Tiện nghi (danh sách, phân cách bằng dấu phẩy):
                <input
                  type="text"
                  name="amenities"
                  value={roomData.amenities.join(",")}
                  onChange={handleRoomChange}
                  required
                />
              </label>
              <label>
                Số phòng (danh sách số phòng, phân cách bằng dấu phẩy):
                <input
                  type="text"
                  name="roomNumbers"
                  value={roomData.roomNumbers
                    .map((num) => num.number)
                    .join(",")}
                  onChange={handleRoomChange}
                  required
                />
              </label>
              <button type="submit">Tạo phòng</button>
            </form>
          </div>
        );
    }
  };
  return <React.Fragment>{renderStep()}</React.Fragment>;
};

export default AddHotelPage;
