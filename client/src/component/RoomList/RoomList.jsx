// FILE: RoomList.jsx
import "./roomList.styles.scss";
import { Link } from "react-router-dom";
import Carousel from "../Carousel/Carousel";
import { motion } from "framer-motion";

const RoomList = ({ data }) => {
  return (
    <div id="room-list">
      {data.map((item) => (
        <motion.div
          key={item._id}
          className="room-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link to={`/rooms/all/${item._id}`} className="room-link">
            <div className="image-wrapper">
              {item.discountPrice && <span className="badge">Discount</span>}
              <Carousel data={item.img} />
            </div>
            <div className="room-info">
              <h3 className="room-name">{item.name}</h3>
              <p className="room-count">{item.roomCount || 0} rooms left</p>
              <p className="room-price">
                {item.discountPrice ? (
                  <>
                    <span className="old">LKR {item.price.toLocaleString()}</span>
                    <span className="discount"> LKR {item.discountPrice.toLocaleString()}</span>
                  </>
                ) : (
                  <>LKR {item.price.toLocaleString()}</>
                )}{" "}
                / day
              </p>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
};

export default RoomList;
