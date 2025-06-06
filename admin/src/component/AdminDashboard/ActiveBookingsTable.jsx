import { useEffect, useState } from "react";
import "./adminDashboard.scss";

const ActiveBookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [popupType, setPopupType] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings", {
          credentials: "include",
        });
        const data = await res.json();
        const active = data.filter(
          (b) => b.confirmed === false && b.status !== "Cancelled"
        );
        setBookings(active);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      }
    };
    fetchBookings();
  }, []);

  const openPopup = (type, booking) => {
    setSelectedBooking(booking);
    setPopupType(type);
  };

  const closePopup = () => {
    setSelectedBooking(null);
    setPopupType(null);
  };

  const handleConfirm = async () => {
    try {
      const res = await fetch(`/api/bookings/confirm/${selectedBooking._id}`, {
        method: "PUT",
        credentials: "include",
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.filter((b) => b._id !== selectedBooking._id)
        );
        closePopup();
      }
    } catch (err) {
      console.error("Error confirming booking", err);
    }
  };

  const handleRemove = async () => {
    try {
     const res = await fetch(`/api/bookings/admin/${selectedBooking._id}`, {

        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.filter((b) => b._id !== selectedBooking._id)
        );
        closePopup();
      }
    } catch (err) {
      console.error("Error removing booking", err);
    }
  };

  return (
    <div className="table-container">
      <h2>Active Bookings</h2>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                No active bookings.
              </td>
            </tr>
          ) : (
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.room?.name}</td>
                <td>{booking.roomNumber}</td>
                <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                <td>{booking.mobile}</td>
                <td>
                  <button
                    className="btn-action confirm"
                    onClick={() => openPopup("confirm", booking)}
                  >
                    Confirm
                  </button>
                  <button
                    className="btn-action remove"
                    onClick={() => openPopup("remove", booking)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {popupType && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>
              {popupType === "confirm"
                ? "Confirm Room Reservation"
                : "Remove Reservation"}
            </h3>
            <p>
              {popupType === "confirm"
                ? "Are you sure you want to confirm this reservation?"
                : "Are you sure you want to remove this reservation?"}
            </p>
            <div className="popup-actions">
              <button onClick={closePopup}>No</button>
              <button
                onClick={popupType === "confirm" ? handleConfirm : handleRemove}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveBookingsTable;
