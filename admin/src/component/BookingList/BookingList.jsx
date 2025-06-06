
import "./bookingList.styles.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBookings, deleteBooking } from "../../features/booking/bookingSlice";
import { Link } from "react-router-dom";

const BookingList = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.booking);

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteBooking(id));
  };

  return (
    <div className="table-container">
      <table className="booking-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Room</th>
            <th>Room Number</th>
            <th>Check In Date</th>
            <th>Check Out Date</th>
            <th>Mobile Number</th>
            <th>Confirmed</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length > 0 &&
            bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.room}</td>
                <td>{booking.roomNumber}</td>
                <td>{new Date(booking.checkIn).toLocaleDateString()}</td>
                <td>{new Date(booking.checkOut).toLocaleDateString()}</td>
                <td>{booking.mobile}</td>
                <td>{booking.confirmed ? "Yes" : "No"}</td>
                <td>
                  <Link to={`/booking/${booking._id}`}>View</Link>
                  
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;
