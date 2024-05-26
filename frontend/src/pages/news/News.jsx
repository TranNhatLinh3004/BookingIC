import React, { useEffect, useState } from "react";
import Helmet from "../../assets/helmet/Helmet";
import Slider from "react-slick";
import banner01 from "../../assets/images/banner01.jpeg";
import banner02 from "../../assets/images/banner05.jpg";
import banner03 from "../../assets/images/banner07.jpeg";
import banner04 from "../../assets/images/banner08.jpeg";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./news.css";
import handleScroll from "../../feature/handleScroll";
// import "./Travel.scss";
const slideData = [
  {
    image: banner01,
    alt: "Slide 1",
  },
  {
    image: banner02,
    alt: "Slide 2",
  },
  {
    image: banner03,
    alt: "Slide 3",
  },
  {
    image: banner04,
    alt: "Slide 4",
  },
];
const SampleNextArrow = (props) => {
  const { onClick } = props;
  // console.log(props.onClick);
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="next">
        <i
          style={{
            color: "#111",
            fontSize: "20px",
          }}
          class="uil uil-angle-right"
        ></i>{" "}
      </button>
    </div>
  );
};
const SamplePrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="control-btn" onClick={onClick}>
      <button className="prev">
        <i
          style={{
            fontSize: "20px",
            color: "#111",
          }}
          class="uil uil-angle-left"
        ></i>{" "}
      </button>
    </div>
  );
};
const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
};
function News(props) {
  let height = document.body.scrollHeight;
  const [scrollY, setHeight] = useState(height);
  useEffect(() => {
    window.scrollTo(0, 0);
    handleScroll();

    // document.header.className = icon;
  }, [scrollY]);
  return (
    <Helmet title="News">
      <div className="section__news">
        <div className="container__banner">
          <Slider {...settings}>
            {slideData.map((slide, index) => (
              <div key={index}>
                <img
                  style={{
                    width: "100%",
                    height: "360px",
                    backgroundSize: "contain",
                    objectFit: "cover",
                  }}
                  src={slide.image}
                  alt={slide.alt}
                />
              </div>
            ))}
          </Slider>{" "}
        </div>{" "}
        <main id="main-travel">
          <section className="section-one">
            <h2>Latest</h2>
            <div className="container">
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt6833712302bd7409/65bca4f686cf3e040a3a9a5a/378_Tokyo_003-2.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <b>8 places to experience the old Tokyo</b>
                  <p>February 2</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blteaf6a1cf2dd3cc9f/65ae0441c49e3c040a079586/Header_Romantic_places.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Out & nature &middot; Beaches &middot; Couple getaways</p>
                  <b>5 romantic places you probably haven't heard of</b>
                  <p>January 22</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt8411307c4013791f/65dd6fa643ce29040a9913ce/Header_Girls_Trip.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of traveller &middot; Group trips</p>
                  <b>Top 7 destinations for a girls' trip</b>
                  <p>February 16</p>
                </figcaption>
              </a>
            </div>
          </section>
          <section className="section-two">
            <h2>Springtime trips</h2>
            <div className="container">
              <div className="item">
                <a href="">
                  <figure>
                    <img
                      src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/bltdc1d82b8b2d83e90/65effd0ac348e4040aa88e49/Songkran.jpg"
                      alt=""
                    />
                  </figure>
                  <figcaption>
                    <p>Things to do &middot; Festivals</p>
                    <b>8 places to celebrate Songkran in Thailand</b>
                    <p>March 17, 2023</p>
                  </figcaption>
                </a>
                <a href="">
                  <figure>
                    <img
                      src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt57b5d6e98d9a3065/65dd726f9930cc040ae223a4/Netherlands_Tulips_Header.jpg"
                      alt=""
                    />
                  </figure>
                  <figcaption>
                    <p>Type of trip &middot; Outdoor & nature</p>
                    <b>The top places in the Netherlands to see tulips</b>
                    <p>February 27</p>
                  </figcaption>
                </a>
              </div>
              <div className="item">
                <a href="">
                  <figure>
                    <img
                      src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt8f13807ad95d97e2/65eace990593ba040a39e33a/149368538.jpg"
                      alt=""
                    />
                  </figure>
                  <figcaption>
                    <p>Type of trip &middot; City breaks</p>
                    <b>The most beautiful destinations for spring</b>
                    <p>March 22, 2022</p>
                  </figcaption>
                </a>
                <a href="">
                  <figure>
                    <img
                      src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/bltb6a6311be8d6fd85/650d9c2ed21fb01857fdfa0e/74719911.jpg"
                      alt=""
                    />
                  </figure>
                  <figcaption>
                    <p>Type of trip &middot; Outdoor & nature</p>
                    <b>The top places in the Netherlands to see tulips</b>
                    <p>May 16, 2022</p>
                  </figcaption>
                </a>
              </div>
            </div>
          </section>
          <section className="section-three">
            <h2>Gear up for Summer</h2>
            <div className="container">
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt4431b7fd9613f09a/65eed22791ead8040a747bca/59488_org.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>
                    Type of traveller &middot; Family holidays &middot;
                    Attractions
                  </p>
                  <b>Germany’s most thrilling water parks</b>
                  <p>July 8, 2021</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/bltb237892e19f4722c/65eecfe09409ef040ab7b130/Stocksy_txp48a308e6fJJ300_OriginalDelivery_3448029.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of trip &middot; Outdoor & nature</p>
                  <b>Top 5 places for lake cabin holidays in the US</b>
                  <p>July 12, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt739f476a3e71cc3a/651d269dd22a8d65b12775a8/235954988.webp"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Things to &middot; Festivals</p>
                  <b>The 5 best summer festivals in Japan</b>
                  <p>June 27, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/bltdab61301cc1eca23/65eacc42e91890040a7c8ce9/GettyImages-1267356855.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Out & nature &middot; Beaches</p>
                  <b>The 7 most beautiful secret beaches in Europe</b>
                  <p>27 tháng 7, 2023</p>
                </figcaption>
              </a>
            </div>
          </section>
          <section className="section-four">
            <h2>City trips</h2>
            <div className="container">
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt58b97e8819c375c5/65e9913da02985040a68f874/GettyImages-1400843795.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of trip...</p>
                  <b>48 hours in Barcelona</b>
                  <p>November 3, 2022</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt4d8fd6b99e985e69/65155caa267d68be2e6e7f79/217498848.webp"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of trip...</p>
                  <b>48 hours in Liverpool</b>
                  <p>April 23, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt92011a3cb88f54ea/65eed05891ead8040a747ba7/371_Rome_003-2.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of trip...</p>
                  <b>48 hours in Rome, Italy</b>
                  <p>December 30, 2022</p>
                </figcaption>
              </a>
            </div>
          </section>
          <section className="section-five">
            <h2>Unique stays</h2>
            <div className="container">
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blta6f6eae988ee8749/65e993b2e25ad4040a544422/1683-001.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>
                    Outdoor & nature &middot; National Parks &middot; Mountains
                  </p>
                  <b>7 unique stays for your next Australia vacation</b>
                  <p>September 1, 2022</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/bltb052be5b56d03d16/6515577f85c0a18285573ddc/219730590.webp"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Out & nature &middot; Beaches &middot; Couple getaways</p>
                  <b>5 romantic places you probably haven't heard of</b>
                  <p>April 25, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://cf.bstatic.com/xdata/images/xphoto/1500x1000/156200800.jpg?k=9eb7f14183168922cb5236c988205bb130c621c2d24cfc6b23369994c2d4e862"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of traveller &middot; Group trips</p>
                  <b>Top 7 destinations for a girls' trip</b>
                  <p>May 25, 2022</p>
                </figcaption>
              </a>
            </div>
          </section>
          <section className="section-six">
            <h2>The outdoors</h2>
            <div className="container">
              <a href="">
                <figure>
                  <img
                    src="https://cf.bstatic.com/xdata/images/xphoto/1500x1000/10241862.jpg?k=7ddb3f42dd7f6205675287c04591a6b46b50ea21300b3e3b27c14feaf24dbe92"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of trip &middot; Outdoor & nature</p>
                  <b>Spectacular treehouses in the world</b>
                  <p>June 30, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blte28d6fd3383c5c84/651d4c4e09a5314cff3763a8/91408738.webp"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>
                    Thing to do &middot; Sports & adventure &middot; Active
                    trips
                  </p>
                  <b>Bike-friendly cities in the US</b>
                  <p>July 28, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt3529fb3300cb139f/65eacd55dcc2bb040a6f7359/GettyImages-561127039-2.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of trip &middot; Road trips</p>
                  <b>The 10 best California road trips</b>
                  <p>October 3, 2023</p>
                </figcaption>
              </a>
            </div>
          </section>
          <section className="section-seven">
            <h2>Cultural trips</h2>
            <div className="container">
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt4ac702ed45605b9a/65eecd9a4bd7c7040afff28e/Header_The_National_Gallery-1.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Things to do &middot; Arts &middot; Music</p>
                  <b>5 captivating museums and galleries</b>
                  <p>May 6, 2022</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blta2d464d971d95241/651434a4452d1aaffaea53dc/214201794.webp"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of trip &middot; City breaks &middot; Arts</p>
                  <b>An arts and culture guide to Liverpool, England</b>
                  <p>April 13, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt5038574a43ce7631/651d59c09799b61a2ba99dc0/266633264.webp"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Things to do &middot; Nightlife</p>
                  <b>6 incredible Bangkok rooftop bars</b>
                  <p>August 31, 2023</p>
                </figcaption>
              </a>
            </div>
          </section>
          <section className="section-eight">
            <h2>Family holidays</h2>
            <div className="container">
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt4535213952192cd1/6565aad157c00e040aafe4ae/orlando.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>
                    Type of traveller &middot; Family holidays &middot;
                    Attractions
                  </p>
                  <b>8 fun things to do in Orlando with the kids</b>
                  <p>November 28, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt2f1e7f9553a112cc/65e991ce4f1756040a016e8e/1364-003.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of traveller</p>
                  <b>5 family-friendly beaches on the Côte d'Azur</b>
                  <p>October 3, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt35665f357bbb774b/65eecf435c5087040a3d8d28/51078-003.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of trip &middot; Road trips</p>
                  <b>5 family-friendly road trips in Australia</b>
                  <p>March 10, 2023</p>
                </figcaption>
              </a>
            </div>
          </section>
          <section className="section-nine">
            <h2>Explore USA</h2>
            <div className="container">
              <div className="item">
                <a href="">
                  <figure>
                    <img
                      src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/bltf733b48ff53137c5/65eed3d7549b1d040a590751/Malibu-201.jpg"
                      alt=""
                    />
                  </figure>
                  <figcaption>
                    <p>Outdoor nature &middot; Beaches</p>
                    <b>The 9 most beautiful beaches in the US</b>
                    <p>August 2, 2022</p>
                  </figcaption>
                </a>
                <a href="">
                  <figure>
                    <img
                      src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt8ccb9ff1c8bbbd29/6560379c1946eb040a37b36f/glamping.jpg"
                      alt=""
                    />
                  </figure>
                  <figcaption>
                    <p>
                      Type of trip &middot; Outdoor & nature &middot; Mountains
                    </p>
                    <b>10 luxurious glamping spots in the US</b>
                    <p>November 24, 2023</p>
                  </figcaption>
                </a>
              </div>
              <div className="item">
                <a href="">
                  <figure>
                    <img
                      src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt183377044bff2c56/651d28fbc5c60918b636ddcd/242302670.webp"
                      alt=""
                    />
                  </figure>
                  <figcaption>
                    <p>Type of trip &middot; Outdoor & nature</p>
                    <b>5 family-friendly cabin destinations in the US</b>
                    <p>July 13, 2023</p>
                  </figcaption>
                </a>
                <a href="">
                  <figure>
                    <img
                      src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt84c09099a436d9ec/65e9925466c309040a59cf4b/16951-001.jpg"
                      alt=""
                    />
                  </figure>
                  <figcaption>
                    <p>Type of trip &middot; Outdoor & nature</p>
                    <b>Where to experience spring break in the US</b>
                    <p>January 13, 2023</p>
                  </figcaption>
                </a>
              </div>
            </div>
          </section>
          <section className="section-ten">
            <h2>Journey through Asia</h2>
            <div className="container">
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blta1e46de1aea3640c/65eed394e03e6e040af9e7ee/211489070_l.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Thing to do &middot; Food & drink</p>
                  <b>7 street foods to try in India</b>
                  <p>July 14, 2022</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt1144b082eaec6f7d/655eeeaff3fac6040a22ed98/293426828.jpg"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>
                    Type of trip &middot; Wellness escapes &middot; Mountains
                  </p>
                  <b>6 best ryokans in Japan to rejuvenate yourself</b>
                  <p>November 23, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blta4903b20102e3e84/65159e4f3e851a8e18f40a29/223110036.webp"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <b>6 inspiring sabbaticals in the Asia-Pacific region</b>
                  <p>May 15, 2023</p>
                </figcaption>
              </a>
              <a href="">
                <figure>
                  <img
                    src="https://eu-images.contentstack.com/v3/assets/bltbebdf496526c3cfd/blt7f4edfae52926455/6511847162943294b2ac4804/259840390.webp"
                    alt=""
                  />
                </figure>
                <figcaption>
                  <p>Type of trip &middot; Luxury trips </p>
                  <b>6 luxurious South Korea resorts to pamper yourself</b>
                  <p>August 18, 2023</p>
                </figcaption>
              </a>
            </div>
          </section>
        </main>
      </div>
    </Helmet>
  );
}

export default News;
