// src/Pages/CancelSuccess.jsx
import { Link } from "react-router-dom";
import "./cancelSuccess.scss";
import { Helmet } from "react-helmet";

const CancelSuccess = () => {
  return (
    <div className="success-page">
      <Helmet>
        <title>Cancel Success</title>
      </Helmet>
      <div className="success-card">
        <div className="icon cancel-icon">✖</div>
        <h1>Booking Cancelled</h1>
        <p>
          Your room booking has been cancelled. A confirmation email has been sent to you.
        </p>
        <Link to="/" className="btn">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default CancelSuccess;
