// BookingHistoryTable.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./ClientDashboard.scss";

const BookingHistoryTable = () => {
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const res = await fetch("/api/bookings", {
          credentials: "include",
        });
        const data = await res.json();
        const historyRecords = data
          .filter(
            (b) =>
              b.email === user?.email &&
              (b.confirmed === true || b.status === "Cancelled")
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setHistory(historyRecords);
      } catch (error) {
        console.error("Error loading booking history:", error);
      }
    };

    if (user) {
      fetchAllBookings();
    }
  }, [user]);

  return (
    <div className="table-container">
      <h2>Booking History</h2>
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
                No history yet.
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
                  <span
                    className={`status-chip ${
                      entry.confirmed
                        ? "confirmed"
                        : entry.status === "Cancelled" && entry.cancelledByAdmin
                        ? "cancelled"
                        : entry.status === "Cancelled"
                        ? "cancelled"
                        : "unknown"
                    }`}
                  >
                    {entry.confirmed
                      ? "Confirmed"
                      : entry.status === "Cancelled" && entry.cancelledByAdmin
                      ? "Cancelled by Admin"
                      : entry.status === "Cancelled"
                      ? "Cancelled by User"
                      : "Unknown"}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BookingHistoryTable;
