// FILE: admin/src/Pages/Room/Room.jsx

import "./room.styles.scss";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { reset, deleteRoom } from "../../features/room/roomSlice";
import Carousel from "../../component/Carousel/Carousel";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";


const Room = () => {
  const { user } = useSelector((state) => state.auth);
  const { isSuccess } = useSelector((state) => state.room);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      navigate("/rooms");
      dispatch(reset());
    }
  }, [isSuccess]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/rooms/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
      }

      const reviewRes = await fetch(`/api/rooms/${id}/reviews`);
      if (reviewRes.ok) {
        const reviewData = await reviewRes.json();
        setReviews(reviewData.reverse());
      }
    };

    fetchData();
  }, [id]);

  const handleDelete = () => {
    dispatch(deleteRoom(id));
  };

  const handleDeleteReview = async (reviewId) => {
    const res = await fetch(`/api/rooms/${id}/reviews/${reviewId}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.ok) {
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    }
  };

  const convertToUSD = (lkr) => (lkr * 0.0031).toFixed(2);

  return (
    <div id="admin-room-page">
      <Helmet><title>{room ? room.name : "Room"}</title></Helmet>
      <div className="container">
        {room && (
          <motion.div
            className="room-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="room-title">{room.name}</h1>

            <div className="img-wrapper">
              <Carousel data={room.img} showControls />
            </div>

            <div className="room-details">
              <p>{room.desc}</p>
              <p><strong>Available:</strong> {room.roomCount || 0}</p>

              {room.discountPrice ? (
                <>
                  <h2 className="old-price">
                    <s>LKR {room.price} (${convertToUSD(room.price)})</s>
                  </h2>
                  <h2 className="discount-price">
                    Discount Price: LKR {room.discountPrice} (${convertToUSD(room.discountPrice)}) / per day
                  </h2>
                </>
              ) : (
                <h2>
                  LKR {room.price} (${convertToUSD(room.price)}) / per day
                </h2>
              )}
            </div>

            {user?.isAdmin && (
              <div className="admin-actions">
                <Link className="edit-btn" to={`/edit/rooms/${room._id}`}>Edit Room</Link>
                <button className="delete-btn" onClick={handleDelete}>Delete Room</button>
              </div>
            )}

            <div className="review-section">
              <h2>Client Reviews</h2>
              {reviews.length > 0 ? (
                reviews.map((rev) => (
                  <motion.div
                    className="review"
                    key={rev._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <strong>{rev.name}</strong>
                    <p>{rev.message}</p>
                    
                  </motion.div>
                ))
              ) : (
                <p>No reviews yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Room;
