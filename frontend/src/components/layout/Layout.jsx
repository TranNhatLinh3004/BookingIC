import { useEffect } from "react";
import Footer from "../footer/Footer";
import Header from "../header/Header";
import Routers from "../../routers/Routers";
import ScrollUp from "../../scrollup/ScrollUp";
import { login } from "../../redux/slices/userSlice";
import { useDispatch } from "react-redux";

function Layout(props) {
  const dispatch = useDispatch();

  return (
    <>
      <Header />
      <div>
        <Routers />
      </div>
      <Footer />
      <ScrollUp />
    </>
  );
}

export default Layout;
