// src/Pages/Success.jsx
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./Success.scss";

const Success = () => {
  return (
    <div className="success-page">
      <Helmet>
        <title>Success</title>
      </Helmet>
      <div className="success-card">
        <div className="icon success-icon">✔</div>
        <h1>Booking Successful</h1>
        <p>
          You’ve successfully booked a room. A confirmation email has been sent to you.
        </p>
        <Link to="/" className="btn">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
