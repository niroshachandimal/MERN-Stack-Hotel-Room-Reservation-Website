import { useEffect, useState } from "react";
import "./adminDashboard.scss";

const CancelledBookingsTable = () => {
  const [history, setHistory] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const fetchCancelled = async () => {
      const res = await fetch("/api/bookings", { credentials: "include" });
      const data = await res.json();
      const filtered = data.filter((b) => b.status === "Cancelled")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setHistory(filtered);
    };
    fetchCancelled();
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
        setHistory((prev) => prev.filter((b) => b._id !== selectedBooking._id));
      }
      setShowPopup(false);
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="table-container">
      <h2>Booking Cancellation History</h2>
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
        No cancelled bookings yet.
      </td>
    </tr>
  ) : (
    history.map((b) => (
      <tr key={b._id}>
        <td>{b.name}</td>
        <td>{b.email}</td>
        <td>{b.room?.name}</td>
        <td>{b.roomNumber}</td>
        <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
        <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
        <td>{b.mobile}</td>
        <td>
          <span
  className={`status-chip ${
    b.cancelledByAdmin ? "cancelled-by-admin" : "cancelled-by-user"
  }`}
>
  {b.cancelledByAdmin ? "Cancelled by Admin" : "Cancelled by User"}
</span>

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

export default CancelledBookingsTable;
