import React, { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import { Account } from "../pages/account/Account";
import ResetPassword from "../pages/login/ResetPassword";
import ProtectRoute from "./ProtectRoute";
import Checkout from "../pages/checkout/Checkout";
import ResetPasswordConfirm from "../pages/login/ResetPasswordConfirm";
import HotelDetails from "../pages/hotelDetails/HotelDetails";
import ListHotels from "../pages/listhotels/ListHotels";
import "spin.js/spin.css";
import { Spinner } from "spin.js";
import WishLists from "../pages/wishlists/WishLists";
import News from "../pages/news/News";
import ThankYou from "../pages/thank-you/ThankYou";
import Confirmed from "../pages/confirmed/Confirmed";
import HotelManager from "../pages/hotelmanager/HotelManager";
import AddHotel from "../pages/addhotel/AddHotel";
import UpdateHotelPage from "../pages/updatehotel/UpdateHotel";
import UpdateHotel from "../pages/updatehotel/UpdateHotel";
import Booking from "../pages/booking/Booking";
import BookingList from "../pages/bookinglist/BookingList";
import Completed from "../components/completed/Completed";
import Cancelled from "../pages/cancelled/Cancelled";
import Report from "../pages/report/Report";
// import ThankYou from "../pages/thank-you/ThankYou";

const LazyHotel = React.lazy(() =>
  import("../pages/hotelDetails/HotelDetails")
);

function Routers(props) {
  const customSpinner = new Spinner({ color: "rgb(0, 200, 133)" });
  const navigate = useNavigate();
  // useEffect(() => {
  //   navigate("/home");
  // }, []);
  return (
    <Routes>
      <Route path="" element={<Home />} />{" "}
      <Route path="home" element={<Home />} />{" "}
      <Route path="/confirmed" element={<Confirmed />} />{" "}
      <Route path="/completed" element={<Completed />} />{" "}
      <Route path="/cancelled" element={<Cancelled />} />{" "}
      <Route path="/thank-you" element={<ThankYou />} />{" "}
      <Route path="/hotels" element={<ListHotels />} />
      {/* <Route path="/hotels" element={<ListHotels />} /> */}
      <Route path="/hotel-manager" element={<HotelManager />} />
      <Route path="/search" element={<ListHotels />} />
      <Route path="/hotel-manager/create" element={<AddHotel />} />
      <Route path="/hotel-manager/update/:id" element={<UpdateHotel />} />{" "}
      <Route
        path="hotels/:id"
        element={
          <React.Suspense
            fallback={<div ref={(el) => el && customSpinner.spin(el)} />}
          >
            <LazyHotel />
          </React.Suspense>
        }
      />{" "}
      <Route path="login" element={<Login />} />
      <Route path="forgotPassword" element={<ResetPassword />} />
      <Route path="confirmPassword" element={<ResetPasswordConfirm />} />
      <Route path="register" element={<Register />} />{" "}
      <Route path="/wishlists" element={<WishLists />} />
      <Route path="/bookinglists" element={<BookingList />} />
      <Route path="/news" element={<News />} />
      <Route path="/vnpay/return" element={<Booking />} />
      <Route path="/account/:id" element={<Account />} />
      <Route path="/report" element={<Report />} />{" "}
      <Route
        path="booking"
        element={
          <ProtectRoute>
            <Checkout />
          </ProtectRoute>
        }
      />
    </Routes>
  );
}

export default Routers;
