import React, { useState } from "react";

import Helmet from "../../assets/helmet/Helmet";
import { Container, FormGroup } from "reactstrap";
import { Form, unstable_HistoryRouter, useParams } from "react-router-dom";

function ResetPasswordConfirm(props) {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPasswordConfirm = async (e) => {
    // e.preventDefault();
    // // Kiểm tra xác nhận mật khẩu
    // if (newPassword !== confirmPassword) {
    //   setMessage("Passwords do not match");
    //   return;
    // }
    // try {
    //   const response = await fetch(
    //     "http://localhost:5000/auth/reset-password",
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ token, newPassword }),
    //     }
    //   );
    //   const data = await response.json();
    //   setMessage(data.message);
    //   if (response.status === 200) {
    //     // Nếu việc đặt lại mật khẩu thành công, điều hướng người dùng đến trang đăng nhập hoặc trang chính của ứng dụng
    //     history.push("/login"); // Thay "/login" bằng đường dẫn bạn muốn chuyển hướng đến
    //   }
    // } catch (error) {
    //   console.error("Error:", error);
    // }
  };
  return (
    <Helmet title="ResetPasswordConfirm">
      <section>
        <Container>
          <Form
            // onSubmit={handleResetPassword}
            className="auth__form resetPassword"
            style={{
              height: "250px",
            }}
          >
            {" "}
            <h3
              className="fw-bold fs-4
                 mb-4
                "
            >
              Khôi phục tài khoản
            </h3>
            <FormGroup>
              <label>New Password:</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </FormGroup>{" "}
            <FormGroup>
              <label>Confirm New Password:</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormGroup>{" "}
            <button>
              <span className="circle1"></span>
              <span className="circle2"></span>
              <span className="circle3"></span>
              <span className="circle4"></span>
              <span className="circle5"></span>
              <span className="text">Submit</span>
            </button>
            {message && <p>{message}</p>}
          </Form>
        </Container>
      </section>
    </Helmet>
  );
}

export default ResetPasswordConfirm;
