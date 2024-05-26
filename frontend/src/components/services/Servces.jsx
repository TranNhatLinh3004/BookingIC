import { motion } from "framer-motion";
import React from "react";
import { Container, Row, Col } from "reactstrap";
import "./services.css";
import serviceData from "../../assets/data/serviceData";
function Services(props) {
  return (
    <section className="services hidden">
      {serviceData.map((item, index) => (
        <div lg="3" md="4" key={index}>
          <div
            className="service__item"
            style={{
              backgroundColor: `${item.bg}`,
            }}
          >
            <span>
              <i class={item.icon}></i>
            </span>
            <div className="">
              <h3>{item.title}</h3>
              <p>{item.subtitle} </p>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export default Services;
