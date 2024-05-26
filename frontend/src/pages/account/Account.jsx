import React, { useEffect, useState } from "react";
import { Form, FormGroup } from "reactstrap";
import Helmet from "../../assets/helmet/Helmet";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import "./account.css";
import userIcon from "../../assets/images/user-icon.png";
import { useParams } from "react-router-dom";
import { ImagetoBase64 } from "../../utility/ImagetoBase64";
import { login, updateUserInfo } from "../../redux/slices/userSlice";

export const Account = () => {
  const { id } = useParams(); // Lấy id từ đường dẫn URL
  const [userData, setUserData] = useState({});
  const [newAvatar, setNewAvatar] = useState(userData.username);
  const [newUsername, setNewUsername] = useState(userData.username);
  const [newEmail, setNewEmail] = useState(userData.email);
  const [newPhone, setNewPhone] = useState(userData.phone || ""); // Set default value if available
  const [newAddress, setNewAddress] = useState(userData.address || "");
  const userLocal = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Gọi API để lấy dữ liệu người dùng từ http://localhost:5000/users/:id
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/users/${id}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setNewAvatar(data.avatar);
          setNewUsername(data.username);
          setNewEmail(data.email);
          setNewPhone(data.phone);
          setNewAddress(data.address);
        } else {
          setUserData(userLocal);
          setNewUsername(userLocal.username);
          setNewEmail(userLocal.email);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, [id]); // Chạy lại effect khi id thay đổi

  const handleImageChange = async (e) => {
    const data = await ImagetoBase64(e.target.files[0]);
    setNewAvatar(data);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userData._id}`, // Update with the correct user ID
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newUsername,
            newEmail,
            newPhone,
            newAddress,
            newAvatar,
          }),
        }
      );

      if (response.ok) {
        const updatedUserData = await response.json(); // Lấy dữ liệu mới từ response
        dispatch(updateUserInfo(updatedUserData));
        localStorage.setItem("userData", JSON.stringify(updatedUserData));

        // Cập nhật thông tin người dùng trong Redux store
        toast.success("Bạn đã cập nhật thành công.");
      } else {
        // Handle error response from the server
        console.error("Failed to update user");
        toast.error("Failed to update user.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating user.");
    }
  };
  console.log("hhhh", userData);
  return (
    <Helmet title="Account">
      <section className="accountInfo">
        <div className="sidebar__account">
          <h3 className="subtitle">TÀI KHOẢN</h3>
          <div className="img flexCenter">
            <img
              src={newAvatar ? newAvatar : userIcon}
              alt="image"
              className="image-preview"
            />
          </div>{" "}
          <input
            placeholder="Chọn ảnh"
            id="file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />{" "}
          <div className="filter__category"></div>
        </div>
        <div className="wrap_content_account">
          <div className="container boxItems">
            <h5>Hồ Sơ Của Tôi</h5>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <div className="content">
              <Form className="right" onSubmit={handleUpdate}>
                <FormGroup>
                  <label htmlFor="">Tên đăng nhập</label>
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="">Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="">Số điện thoại</label>
                  <input
                    type="text"
                    value={newPhone}
                    placeholder="Số điện thoại"
                    onChange={(e) => setNewPhone(e.target.value)}
                  />
                </FormGroup>
                <FormGroup>
                  <label htmlFor="">Địa chỉ</label>
                  <input
                    type="text"
                    value={newAddress}
                    placeholder="Địa chỉ"
                    onChange={(e) => setNewAddress(e.target.value)}
                  />
                </FormGroup>
                <button type="submit">
                  <span className="circle1"></span>
                  <span className="circle2"></span>
                  <span className="circle3"></span>
                  <span className="circle4"></span>
                  <span className="circle5"></span>
                  <span className="text">Cập nhập</span>
                </button>
              </Form>
            </div>
          </div>
        </div>
      </section>
    </Helmet>
  );
};
