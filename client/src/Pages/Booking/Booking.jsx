// FILE: client/src/Pages/Booking.jsx
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./Booking.scss";
import { Helmet } from "react-helmet";

const Booking = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const [room, setRoom] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    checkIn: "",
    checkOut: "",
    mobile: "+94",
  });

  useEffect(() => {
    if (!user) navigate("/register");
  }, [user]);

  useEffect(() => {
    const getRoom = async () => {
      try {
        const res = await fetch(`/api/rooms/${id}`);
        const data = await res.json();
        setRoom(data);
      } catch (err) {
        console.error(err);
      }
    };
    getRoom();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, checkIn, checkOut, mobile } = formData;
    if (!name || !email || !checkIn || !checkOut || !mobile) {
      return "Please fill all required fields";
    }
    if (email !== user.email) {
      return "Please enter your registered email";
    }
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    if (inDate < today || inDate > maxDate) {
      return "Check-in date must be within the next 30 days";
    }
    if (outDate <= inDate || outDate > maxDate) {
      return "Check-out must be after check-in and within 30 days";
    }
    if (!/^\+94\d{9}$/.test(mobile)) {
      return "Mobile must be +94 followed by 9 digits";
    }

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) return setErrorMsg(validationError);

    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "Something went wrong");
      } else {
        navigate("/success");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Server error");
    }
  };

  return (
    <div className="booking-container">
      <Helmet>
        <title>Booking</title>
      </Helmet>
      <div className="booking-card">
        <h1>Book Your Room</h1>
        {room && <h2>Room: {room.name}</h2>}

        <form onSubmit={handleSubmit}>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <div className="input-group">
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Check In Date</label>
            <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Check Out Date</label>
            <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} />
          </div>

          <div className="input-group">
            <label>Mobile Number (+94XXXXXXXXX)</label>
            <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} />
          </div>

          <button type="submit" className="submit-btn">Submit Booking</button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
