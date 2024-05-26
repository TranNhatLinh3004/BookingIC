import React, { useEffect } from "react";
import "./thank-you.css";
import { Link } from "react-router-dom";
function ThankYou(props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <section>
      <div className="thank__you">
        <h1>Cảm ơn bạn</h1>
        <p>Chúng tôi sẽ phản hồi bạn sớm nhất.</p>

        <button className="buy__btn auth__btn w-100">
          <Link to="/hotels">Tiếp tục đặt phòng</Link>
        </button>
      </div>
    </section>
  );
}

export default ThankYou;
