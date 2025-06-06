// src/components/Account/DeleteAccountForm.jsx
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import "./Account.scss";

const DeleteAccountForm = ({ user, userType }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [blockedPopup, setBlockedPopup] = useState(false);

  useEffect(() => {
    const fetchUserBookings = async () => {
      try {
        const res = await fetch("/api/bookings", { credentials: "include" });
        const data = await res.json();
        const userBookings = data.filter(
          (b) =>
            b.email === user.email &&
            b.confirmed === false &&
            b.status !== "Cancelled"
        );
        if (userType === "client" && userBookings.length > 0) {
          setHasActiveBooking(true);
        }
      } catch (error) {
        console.error("Error checking active bookings:", error);
      }
    };

    if (user?.email) fetchUserBookings();
  }, [user, userType]);

  const handleDeleteClick = () => {
    if (!email || !password) {
      return setMessage("Please complete all required fields.");
    }

    if (email !== user.email) {
      return setMessage("Incorrect email or password");
    }

    if (hasActiveBooking && userType === "client") {
      return setBlockedPopup(true);
    }

    setMessage("");
    setShowConfirmPopup(true);
  };

  const confirmDeletion = async () => {
    try {
      const res = await fetch("/api/users/delete-account", {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Incorrect email or password");
        setShowConfirmPopup(false);
        return;
      }

      setShowConfirmPopup(false);
      setShowSuccessPopup(true);

// 🔁 Logout and redirect after delay
setTimeout(async () => {
  await dispatch(logoutUser()); // ensures /api/users/logout completes
  localStorage.removeItem("user"); // fallback (if Redux missed it)
  window.location.href = "/";
}, 2500);

    } catch (error) {
      console.error("Deletion error", error);
    }
  };

  return (
    <div className="account-form-container">
      <h2>Delete Account</h2>
      <div className="input-group">
        <label>Enter your email*</label>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="input-group">
        <label>Enter your password*</label>
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {message && <p className="error-msg">{message}</p>}
      <button className="submit-btn delete" onClick={handleDeleteClick}>
        Delete
      </button>

      {/* Confirm Popup */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete your account?</p>
            <div className="popup-actions">
              <button onClick={() => setShowConfirmPopup(false)}>Cancel</button>
              <button onClick={confirmDeletion}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup (Will show for 2.5 seconds) */}
      {showSuccessPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Account deleted</h3>
            <p>You have successfully deleted your account.</p>
          </div>
        </div>
      )}

      {/* Blocked deletion for active booking */}
      {blockedPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Attention!</h3>
            <p>
              We kindly request that you cancel your reservations before proceeding with account deletion.
            </p>
            <button className="submit-btn" onClick={() => setBlockedPopup(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteAccountForm;
