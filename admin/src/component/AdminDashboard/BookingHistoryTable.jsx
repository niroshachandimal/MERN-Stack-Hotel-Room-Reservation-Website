// BookingHistoryTable.jsx
import { useEffect, useState } from "react";
import "./adminDashboard.scss";

const BookingHistoryTable = () => {
  const [history, setHistory] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchConfirmedBookings = async () => {
      try {
        const res = await fetch("/api/bookings", {
          credentials: "include",
        });
        const data = await res.json();
        const confirmed = data.filter((b) => b.confirmed === true)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHistory(confirmed);
      } catch (error) {
        console.error("Error loading booking history:", error);
      }
    };

    fetchConfirmedBookings();
  }, []);

  const handleDelete = (booking) => {
    setSelectedBooking(booking);
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`/api/bookings/${selectedBooking._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setHistory((prev) =>
          prev.filter((b) => b._id !== selectedBooking._id)
        );
        setShowPopup(false);
      } else {
        alert("Failed to delete booking record.");
      }
    } catch (error) {
      console.error("Error deleting booking record:", error);
    }
  };

  return (
    <div className="table-container">
      <h2>Booking Confirmation History</h2>
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
    <th>Status</th>
  </tr>
</thead>
<tbody>
  {history.length === 0 ? (
    <tr>
      <td colSpan="8" style={{ textAlign: "center" }}>
        No confirmed bookings yet.
      </td>
    </tr>
  ) : (
    history.map((entry) => (
      <tr key={entry._id}>
        <td>{entry.name}</td>
        <td>{entry.email}</td>
        <td>{entry.room?.name || "N/A"}</td>
        <td>{entry.roomNumber}</td>
        <td>{new Date(entry.checkInDate).toLocaleDateString()}</td>
        <td>{new Date(entry.checkOutDate).toLocaleDateString()}</td>
        <td>{entry.mobile}</td>
        <td>
          <span className="status-chip confirmed">Confirmed</span>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Delete Reservation Record</h3>
            <p>Are you sure you want to delete this reservation record?</p>
            <div className="popup-actions">
              <button onClick={() => setShowPopup(false)}>No</button>
              <button onClick={confirmDelete}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistoryTable;
