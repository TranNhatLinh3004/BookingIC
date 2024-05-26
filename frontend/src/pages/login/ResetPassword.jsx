import React, { useState } from "react";
import Helmet from "../../assets/helmet/Helmet";
import { Container, Form, FormGroup } from "reactstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword(props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      setMessage(data.message);
      toast.success(data.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Helmet title="ResetPassword">
      <section>
        <Container>
          <Form
            onSubmit={handleResetPassword}
            className="auth__form resetPassword"
            style={{
              height: "300px",
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
              <input
                placeholder="Your Email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
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
            {message && (
              <p
                style={{
                  color: "#666666",
                  fontWeight: "500",
                }}
              >
                {message}
              </p>
            )}
            {message && (
              <p>
                <Link
                  to="/login"
                  style={{
                    position: "relative",
                    top: "20px",
                  }}
                >
                  Thử đăng nhập lại
                </Link>
              </p>
            )}
          </Form>
          {/* <Link to="/confirmPassword">HHHHH</Link> */}
        </Container>
      </section>
    </Helmet>
  );
}

export default ResetPassword;
