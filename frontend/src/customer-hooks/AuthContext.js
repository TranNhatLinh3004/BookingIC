import React, { createContext, useContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);

  // Kiểm tra trạng thái đăng nhập từ localStorage khi ứng dụng bắt đầu
  useEffect(() => {
    const localStorageLoggedIn = localStorage.getItem("loggedIn");
    const localStorageUsername = localStorage.getItem("username");
    const localStorageEmail = localStorage.getItem("email");

    if (localStorageLoggedIn === "true" && localStorageUsername) {
      setUsername(localStorageUsername);
      setIsLoggedIn(true);
      getEmail(localStorageEmail);
    }
  });

  const login = () => {
    // setUsername(name);
    setIsLoggedIn(true);

    // Lưu trạng thái đăng nhập vào localStorage
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("email", email);
  };
  const getEmail = async () => {
    try {
      await fetch(`http://localhost:5000/users/${username}`)
        .then((response) => response.json())
        .then((userData) => {
          setEmail(userData.email);
          // setPassword(userData.password);
        })
        .catch((error) => {
          console.error("Failed to get user data", error);
        });
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };
  const logout = () => {
    setUsername(null);
    setEmail(null);
    setIsLoggedIn(false);

    // Xóa trạng thái đăng nhập khỏi localStorage
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, login, logout, email, username }}
    >
      {" "}
      {children}{" "}
    </AuthContext.Provider>
  );
}
