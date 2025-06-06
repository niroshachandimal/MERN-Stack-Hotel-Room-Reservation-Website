// BookingDetailsTable.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./ClientDashboard.scss";
import { useNavigate } from "react-router-dom";

const BookingDetailsTable = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchClientBookings = async () => {
      try {
        const res = await fetch("/api/bookings", {
          credentials: "include",
        });
        const data = await res.json();
        const userBookings = data
          .filter(
            (b) =>
              b.email === user?.email &&
              b.confirmed === false &&
              b.status !== "Cancelled"
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(userBookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    if (user) {
      fetchClientBookings();
    }
  }, [user]);

  const handleCancel = (booking) => {
    setSelectedBooking(booking);
    setShowPopup(true);
  };

  const confirmCancel = async () => {
    try {
      const res = await fetch(`/api/bookings/${selectedBooking._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setBookings((prev) =>
          prev.filter((b) => b._id !== selectedBooking._id)
        );
        navigate("/cancel-success");
      } else {
        alert(data.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
    } finally {
      setShowPopup(false);
    }
  };

  return (
    <div className="table-container">
      <h2>Booking Details</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Room</th>
            <th>Room Number</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Mobile</th>
            <th>Confirmed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No active bookings.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.room?.name || "N/A"}</td>
                <td>{booking.roomNumber}</td>
                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                <td>{booking.mobile}</td>
                <td>{booking.confirmed ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="cancel-btn"
                    onClick={() => handleCancel(booking)}
                    disabled={booking.confirmed}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Cancel Reservation</h3>
            <p>Are you sure you want to cancel this reservation?</p>
            <div className="popup-actions">
              <button onClick={() => setShowPopup(false)}>No</button>
              <button onClick={confirmCancel}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetailsTable;
