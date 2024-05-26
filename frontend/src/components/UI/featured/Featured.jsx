import { Link } from "react-router-dom";
import "./featured.css";

const Featured = () => {
  // const { data, loading, error } = useFetch(
  //   "/hotels/featured=true&limit=4"
  // );

  return (
    <div className="featured">
      {/* {loading ? (
        "Loading please wait"
      ) : ( */}
      <div className="featuredItem one">
        <img
          src="https://i.pinimg.com/originals/56/43/28/5643288ca447f84aeae3cd352acc30d9.jpg"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1 className="font-bold text-2xl">
            <Link to={`/hotels?city=Da Nang`}>Da Nang</Link>
          </h1>
          {/* <h2>{data[0]} properties</h2> */}
        </div>
      </div>
      <div className="featuredItem two">
        <img
          src="https://minhtrungland.com/wp-content/uploads/2021/04/Ve-dep-do-thi-co-Hoi-An.jpg"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1 className="font-bold text-2xl">
            <Link to={`/hotels?city=Hoi An`}>Hoi An</Link>
          </h1>
          {/* <h2>{data[1]} properties</h2> */}
        </div>
      </div>
      <div className="featuredItem three">
        <img
          src="https://cdn.justfly.vn/1200x630/media/1a/dd/2a7f-291c-4148-bbf0-29f6dc6f2e94.jpg"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1 className="font-bold text-2xl">
            <Link to={`/hotels?city=Hue`}>Hue</Link>
          </h1>
          {/* <h2>{data[2]} properties</h2> */}
        </div>
      </div>{" "}
      <div className="featuredItem four">
        <img
          src="https://images.pexels.com/photos/7336086/pexels-photo-7336086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1 className="font-bold text-2xl">
            <Link to={`/hotels?city=Da Lat`}>Da Lat</Link>
          </h1>
          {/* <h2>{data[2]} properties</h2> */}
        </div>
      </div>{" "}
      <div className="featuredItem five">
        <img
          src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
          className="featuredImg"
        />
        <div className="featuredTitles">
          <h1 className="font-bold text-2xl">
            <Link to={`/hotels?city=Da Nang`}>Nha trang</Link>
          </h1>
          {/* <h2>{data[2]} properties</h2> */}
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Featured;
