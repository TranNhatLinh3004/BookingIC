import React, { useState, useRef, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./usermenu.css";
import { Link, useNavigate } from "react-router-dom";
import { NavLink } from "reactstrap";
import { logout } from "../../redux/slices/userSlice";
import { toast } from "react-toastify";
import userIcon from "../../assets/images/user-icon.png";
import { gapi } from "gapi-script";
//help me comment the code below?
export const UserMenu = () => {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [profileOpen, setProfileOpen] = useState(false);

  const close = () => {
    setProfileOpen(false);
  };
  const profileOpenRef = useRef(null);
  useEffect(() => {
    // Lắng nghe sự kiện click toàn bộ trang
    const handleDocumentClick = (e) => {
      if (
        profileOpenRef.current &&
        !profileOpenRef.current.contains(e.target)
      ) {
        // Người dùng đã nhấp bên ngoài phạm vi profileOpen
        // console.log(userData._id);
        setProfileOpen(false);
      }
    };

    // Đăng ký sự kiện lắng nghe khi component được mount
    document.addEventListener("click", handleDocumentClick);

    // Hủy đăng ký sự kiện khi component bị hủy
    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("userData");
    dispatch(logout());
    toast("Logout successfully");

    // try {
    //   const auth2 = await new Promise((resolve, reject) => {
    //     gapi.load("auth2", () => {
    //       const auth2Instance = gapi.auth2.init();
    //       resolve(auth2Instance);
    //     });
    //   });

    //   if (auth2) {
    //     await auth2.signOut();
    //     console.log("User signed out");
    //   }
    // } catch (error) {
    //   console.error("Error signing out:", error);
    // }

    navigate("/home");
  };
  return (
    <>
      <div className="profile" ref={profileOpenRef}>
        <NavLink
          className="avatar"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          <img src={userData.avatar ? userData.avatar : userIcon} alt="" />
        </NavLink>
        {profileOpen && (
          <div className="openProfile boxItems" onClick={close}>
            <div className="image">
              <div className="img">
                <img
                  src={userData.avatar ? userData.avatar : userIcon}
                  alt=""
                />
              </div>
              <div className="text">
                <Link to={`/account/${userData._id}`}>
                  <h4>{userData.username}</h4>
                </Link>
                {/* <label>Da Nang City</label> */}
              </div>
            </div>

            <div className="box-link">
              <i className="uil uil-user-square icon"></i>
              <h4>
                <Link to={`/account/${userData._id}`}>Tài khoản của tôi</Link>
              </h4>
            </div>

            {userData.user_type === "lease" ? (
              ""
            ) : (
              <div>
                <div className="box-link">
                  <i className="uil uil-book-alt icon"></i>
                  <h4>
                    <Link to={`/bookinglists`}>Danh sách booking</Link>
                  </h4>
                </div>
                <div className="box-link">
                  <i className="uil uil-heart-alt icon"></i>
                  <h4>
                    <Link to={`/wishlists`}>Danh sách yêu thích</Link>
                  </h4>
                </div>
              </div>
            )}
            <div className="box-link">
              <i className="uil uil-sign-out-alt icon"></i>
              <h4>
                <a onClick={handleLogout}>Đăng xuất</a>
              </h4>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
