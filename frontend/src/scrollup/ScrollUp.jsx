import React from "react";

import "./scrollup.css";

function ScrollUp(props) {
  const handleScrollUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", () => {
    const scrollUp = document.querySelector(".scrollup");

    if (window.scrollY > 260) {
      scrollUp.classList.add("show-scroll");
    } else {
      scrollUp.classList.remove("show-scroll");
    }
  });

  return (
    <div className="scrollup" onClick={handleScrollUp}>
      <i className="uil uil-arrow-up scrollup__icon"></i>
    </div>
  );
}

export default ScrollUp;
