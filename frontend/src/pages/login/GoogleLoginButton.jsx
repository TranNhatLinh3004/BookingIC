import React, { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/userSlice";
import googleIcon from "../../assets/images/search.png";

const GoogleLoginButton = () => {
  const userData = useSelector((state) => state.user);
  const clientID =
    "89963773715-hhr6d6aflio3l2lkcbj1kg756pbnua72.apps.googleusercontent.com";
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    function start() {
      gapi.client
        .init({
          client_id: clientID,
          scope: "",
        })
        .then(() => {
          setIsSignedIn(gapi.auth2.getAuthInstance()?.isSignedIn.get());
        });
    }

    gapi.load("client:auth2", start);
  });

  const responseGoogle = (response) => {
    const userData = {
      username: response.profileObj.name,
      email: response.profileObj.email,
      avatar: response.profileObj.imageUrl,
      _id: response.profileObj.googleId,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
    // Xử lý phản hồi sau khi đăng nhập thành công
    console.log("Logged in with Google:", response);
    dispatch(login(userData));
    setIsSignedIn(true);
    navigate("/home");
  };

  return (
    <div className="loginButton">
      <GoogleLogin
        clientId={clientID}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle} // Xử lý khi đăng nhập thất bại
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
        render={(renderProps) => (
          <a
            style={{
              position: "relative",
              left: "30%",
              top: "40px",
              transform: "translateY(-50%)",
              background: "#fff",
              color: "#333",
              display: "flex",
              width: "230px",
              padding: "5px 10px",
              cursor: "pointer",
            }}
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            <img
              src={googleIcon}
              alt=""
              style={{
                maxWidth: "20px",

                marginRight: "10px",
              }}
            />
            <h4
              style={{
                position: "relative",
                top: "1px",
                left: "5px",
                color: "#333",
              }}
            >
              {" "}
              Login with Google
            </h4>
          </a>
        )}
      />
    </div>
  );
};

export default GoogleLoginButton;
