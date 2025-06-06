// FILE: client/src/Pages/Room/Room.jsx

import "./room.styles.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Carousel from "../../component/Carousel/Carousel";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";

const Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", message: "", rating: 0 });
  const [rating, setRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    const fetchRoom = async () => {
      const res = await fetch(`/api/rooms/${id}`);
      if (res.ok) {
        const data = await res.json();
        setRoom(data);
      }
    };
    fetchRoom();
  }, [id]);

  const loadReviews = async () => {
    const res = await fetch(`/api/rooms/${id}/reviews`);
    if (res.ok) {
      const data = await res.json();
      setReviews(data.reverse());
    }
  };

  useEffect(() => {
    loadReviews();
  }, [id]);

  const convertToUSD = (lkr) => (lkr * 0.0031).toFixed(2);

  const handleBookNow = () => {
    if (!user) {
      navigate("/register");
    } else {
      navigate(`/bookings/${room._id}`);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const { name, message, rating  } = reviewForm;
    if (!name || !message || rating === 0) return setErrorMsg("Please complete all fields including rating.");
    if (!user) return setErrorMsg("Please login to post a review");

    const url = editingReviewId
      ? `/api/rooms/${room._id}/reviews/${editingReviewId}`
      : `/api/rooms/${room._id}/reviews`;
    const method = editingReviewId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ name, email: user.email, message, rating })

    });

    const data = await res.json();
    if (res.ok) {
      setErrorMsg("");
      setReviewForm({ name: "", message: "", rating: 0 });
      setEditingReviewId(null);
      setRating(0);
      loadReviews();
    } else {
      setErrorMsg(data.message || "Failed to post review");
    }
  };

  const handleDelete = async (reviewId) => {
    if (!user) return;
    const res = await fetch(`/api/rooms/${room._id}/reviews/${reviewId}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.ok) loadReviews();
  };

  const handleEdit = (rev) => {
    setReviewForm({ name: rev.name, message: rev.message });
    setRating(rev.rating || 0);
    setEditingReviewId(rev._id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  };

  return (
    <div id="room">
      <div className="container">
        <Helmet><title>{room ? room.name : "Room"}</title></Helmet>
        {room && (
          <motion.div
            className="room-wrapper"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading center room-title">{room.name}</h1>

            <div className="img-wrapper">
              <Carousel data={room.img} showControls />
            </div>

            <div className="text-wrapper">
              <p>{room.desc}</p>
              <p className="count">Available: {room.roomCount}</p>
              {room.discountPrice ? (
                <>
                  <h2 className="old-price">
                    <s>LKR {room.price} (${convertToUSD(room.price)})</s>
                  </h2>
                  <h2 className="discount">
                    Discount Price: LKR {room.discountPrice} (${convertToUSD(room.discountPrice)}) / per day
                  </h2>
                </>
              ) : (
                <h2>
                  LKR {room.price} (${convertToUSD(room.price)}) / per day
                </h2>
              )}
            </div>

            <div className="cta-wrapper">
              <button className="book-btn" onClick={handleBookNow}>Book Now</button>
            </div>

            <div className="review-section">
              <h2>Client Reviews</h2>
              {reviews.slice(0, visibleCount).map((rev, index) => {
                console.log("Review:", rev);
                return(
                <motion.div
                  key={index}
                  className="review"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <strong>{rev.name}</strong>
                  <div className="star-display">
  {[1, 2, 3, 4, 5].map((s) => (
    <span key={s} className={`star ${s <= rev.rating ? "filled" : ""}`}>★</span>
  ))}
</div>

                  <p>{rev.message}</p>
                  {user && ((user.email === rev.email) || user.isAdmin) && (
                    <div className="review-actions">
                      {user.email === rev.email && (
                        <button onClick={() => handleEdit(rev)}>Edit</button>
                      )}
                      <button onClick={() => handleDelete(rev._id)}>Delete</button>
                    </div>
                  )}
                </motion.div>
              );
              
})}
              {reviews.length > visibleCount && (
                <button onClick={() => setVisibleCount(prev => prev + 5)}>Load More</button>
              )}

              {user && (
                <>
                  <h3>{editingReviewId ? "Update Your Review" : "Leave a Review"}</h3>
                  {errorMsg && <p className="error-msg">{errorMsg}</p>}

                  <form className="review-form" onSubmit={handleReviewSubmit}>
                    <input
                      type="text"
                      placeholder="Name"
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                      required
                    />
                    <textarea
                      placeholder="Write your review..."
                      value={reviewForm.message}
                      onChange={(e) => setReviewForm({ ...reviewForm, message: e.target.value })}
                      required
                    ></textarea>
                    <div className="star-input">
  {[1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      className={`star ${reviewForm.rating >= star ? "filled" : ""}`}
      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
    >
      ★
    </span>
  ))}
</div>


                    <button type="submit">{editingReviewId ? "Update Review" : "Post Review"}</button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Room;
