import React from "react";
import { useSelector } from "react-redux";
// import useAuth from "../custom-hooks/useAuth";
import { Navigate } from "react-router-dom";

function ProtectRoute({ children }) {
  const userData = useSelector((state) => state.user);

  return userData.username ? children : <Navigate to="/login" />;
}

export default ProtectRoute;
