import React, { useState, useEffect, useContext } from "react";
import { Col, Container, Row, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";
import { toast } from "react-toastify";
import Helmet from "../../assets/helmet/Helmet";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/userSlice";
import { AuthContext } from "../../customer-hooks/AuthContext";
import userIcon from "../../assets/images/user-icon.png";
import { ImagetoBase64 } from "../../utility/ImagetoBase64";
function Register(props) {
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  /**code sua */
  const [image, setImage] = useState(null);
  /**code sua */

  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    avatar: "",
    user_type: "user",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  /**code sua */
  const handleImageChange = async (e) => {
    const data = await ImagetoBase64(e.target.files[0]);

    setData((preve) => {
      return {
        ...preve,
        avatar: data,
      };
    });
  };
  /**code sua */

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data);
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: JSON.stringify(data), // Đảm bảo truyền dữ liệu email và password trong một đối tượng JSON
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // Chỉnh sửa "Content Type" thành "Content-Type"
      });
      const responseData = await response.json();
      if (response.ok) {
        toast.success(
          "Bạn đã đăng ký thành công. Chào mừng " +
            data.username.toLocaleUpperCase()
        );
        // Xử lý khi yêu cầu thành công
        setRedirect(true);
      } else {
        if (responseData.error === "User Already Exists") {
          toast.error("Người dùng đã tồn tại. Vui lòng thử lại.");
        } else if (
          responseData.error === "Password must have at least 6 characters"
        ) {
          toast.error("Mật khẩu phải có ít nhất 6 ký tự");
        } else {
          toast.error("Đã xảy ra lỗi không xác định. Vui lòng thử lại.");
        }
      }
    } catch (error) {
      setRedirect(false);
    }
  };
  if (redirect) {
    navigate("/login");
  }
  return (
    <Helmet title="Đăng ký">
      <section className="">
        <Container>
          <Row>
            <Col lg="6" className="m-auto text-center">
              <Form className="auth__form register" onSubmit={handleSubmit}>
                <h3 className="fw-bold fs-4 mb-4">Đăng ký</h3>
                <FormGroup className="form__group image">
                  <label className="avatar" htmlFor="file">
                    <p
                      style={{
                        height: "90px",
                      }}
                    >
                      form__group image
                    </p>
                    <img
                      src={
                        data.avatar
                          ? data.avatar
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWuhNDOhXBeXzCpgEl4Zr7kOuDyo7Y4vOKRkaaAnVaCEt7mxOouosrwYPXUnJ5l1MPjRY&usqp=CAU"
                      }
                      alt=""
                    />
                    <input
                      id="file"
                      name="file"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </FormGroup>

                <FormGroup className="form__group">
                  <input
                    required
                    type="text"
                    placeholder="Tên người dùng"
                    value={data.username}
                    name="username"
                    onChange={handleOnChange}
                    id="username"
                  />
                </FormGroup>

                <FormGroup className="form__group">
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    value={data.email}
                    name="email"
                    id="email"
                    onChange={handleOnChange}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <input
                    required
                    value={data.password}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Mật khẩu"
                    onChange={handleOnChange}
                  />{" "}
                  <span className="icon-eye" onClick={handleShowPassword}>
                    {showPassword ? (
                      <i
                        className="uil uil-eye"
                        style={{
                          position: "relative",
                          right: "10px",
                        }}
                      ></i>
                    ) : (
                      <i
                        className="uil uil-eye-slash"
                        style={{
                          position: "relative",
                          right: "10px",
                        }}
                      ></i>
                    )}
                  </span>
                </FormGroup>

                <button>
                  <span className="circle1"></span>
                  <span className="circle2"></span>
                  <span className="circle3"></span>
                  <span className="circle4"></span>
                  <span className="circle5"></span>
                  <span className="text">Gửi</span>
                </button>
                <p>
                  Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Register;
