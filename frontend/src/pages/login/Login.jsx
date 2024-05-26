import React, { useState, useEffect, useContext } from "react";
import { Col, Container, Row, Form, FormGroup } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { toast } from "react-toastify";
import Helmet from "../../assets/helmet/Helmet";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/userSlice";
import GoogleLoginButton from "./GoogleLoginButton";

function Login(props) {
  const clientID =
    "89963773715-m76s4kh6g54gj4166omqlemfgrjv69ht.apps.googleusercontent.com";
  const [showPassword, setShowPassword] = useState(false);
  // const { login } = useContext(AuthContext);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleShowPassword = () => {
    setShowPassword((preve) => !preve);
  };

  const [data, setData] = useState({
    username: "",
    password: "",
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

  const userData = useSelector((state) => state);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // alert(password, username);
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        body: JSON.stringify(data), // Đảm bảo truyền dữ liệu email và password trong một đối tượng JSON
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // Chỉnh sửa "Content Type" thành "Content-Type"
      });

      // Đây là nơi xử lý đăng nhập, bạn có thể gửi dữ liệu đăng nhập đến máy chủ ở đây.
      const dataRes = await response.json();

      if (response.ok) {
        // Đăng nhập thành công
        toast.success("Đăng nhập thành công");
        // localStorage.setItem("loggedIn", "true");
        // localStorage.setItem("username", username);
        // Xử lý khi yêu cầu thành công
        const userData = {
          _id: dataRes._id,
          email: dataRes.email,
          username: dataRes.username,
          avatar: dataRes.avatar,
          user_type: dataRes.user_type,
          // Không bao gồm mật khẩu
        };

        // // Lưu thông tin đăng nhập vào Local Storage
        localStorage.setItem("userData", JSON.stringify(userData));

        // Dispatch action login để cập nhật store trong Redux
        dispatch(login(dataRes));
        navigate("/home");
      } else {
        toast.error(
          "Tên người dùng không tồn tại hoặc mật khẩu không chính xác. Vui lòng thử lại."
        );
      }
    } catch (error) {}
  };

  // google
  console.log("tai sao m tu dang nhap", userData.email);
  return (
    <Helmet title="Đăng nhập">
      <section className="">
        <Container>
          <Row>
            <Col lg="6" className="m-auto text-center">
              <Form className="auth__form" onSubmit={handleSubmit}>
                <h3 className="fw-bold fs-4 mb-4">Đăng nhập</h3>

                <FormGroup className="form__group">
                  <input
                    type="text"
                    placeholder="Nhập tên của bạn"
                    value={data.username}
                    required
                    name="username"
                    onChange={handleOnChange}
                  />
                </FormGroup>
                <FormGroup className="form__group">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    name="password"
                    placeholder="Nhập mật khẩu của bạn"
                    value={data.password}
                    onChange={handleOnChange}
                  />
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
                <p className="page-link" style={{ marginBottom: "10px" }}>
                  <Link to="/forgotPassword">Quên mật khẩu?</Link>
                </p>
                <button>
                  <span className="circle1"></span>
                  <span className="circle2"></span>
                  <span className="circle3"></span>
                  <span className="circle4"></span>
                  <span className="circle5"></span>
                  <span className="text">Gửi</span>
                </button>
                <p>
                  Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link>
                </p>
                <span className="line__text">Hoặc</span>
                <GoogleLoginButton />
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
}

export default Login;
