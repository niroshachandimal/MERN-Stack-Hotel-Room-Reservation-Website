// src/components/Account/ChangePasswordForm.jsx
import { useState } from "react";
import "./Account.scss";

const ChangePasswordForm = ({ user, userType }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [popup, setPopup] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return setMessage("Please complete all required fields.");
    }

    if (newPassword !== confirmPassword) {
      return setMessage("Your confirmation password does not match the new password.");
    }

    const res = await fetch("/api/users/change-password", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email, // ✅ Send email
        currentPassword,
        newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return setMessage(data.message || "Something went wrong.");
    }

    setMessage("");
    setPopup(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="account-form-container">
      <h2>Change Password</h2>
      <div className="input-group">
        <label>Enter your current password*</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
        />
      </div>
      <div className="input-group">
        <label>Enter new password*</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
      </div>
      <div className="input-group">
        <label>Confirm new password*</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
        />
      </div>
      {message && <p className="error-msg">{message}</p>}
      <button className="submit-btn" onClick={handlePasswordChange}>
        Save
      </button>

      {popup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h3>Password Changed!</h3>
            <p>Your password has been changed successfully.</p>
            <button className="submit-btn" onClick={() => setPopup(false)}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordForm;
