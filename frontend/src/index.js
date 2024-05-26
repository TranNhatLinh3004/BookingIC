import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import "react-toastify/dist/ReactToastify.css";
import { SearchProvider } from "./contexts/SearchContext";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* <SearchProvider> */}{" "}
      <Provider store={store}>
        <ToastContainer
          theme="dark"
          position="top-right"
          autoClose={2000}
          closeOnClick
          pauseOnHover={false}
        />{" "}
        <App />
      </Provider>{" "}
      {/* </SearchProvider> */}{" "}
    </BrowserRouter>{" "}
  </React.StrictMode>
);
