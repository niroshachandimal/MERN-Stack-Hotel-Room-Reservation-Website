// src/component/Auth/ForgotPasswordPopup.jsx
import { useState } from "react";
import "./ForgotPassword.scss";

const ForgotPasswordPopup = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [enteredCode, setEnteredCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSendCode = async () => {
    if (!email) return setMessage("Please enter your registered email");

    const res = await fetch("/api/users/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setStep(2);
      setMessage("");
    } else {
      setMessage(data.message || "Email not found");
    }
  };

  const handleVerifyCode = async () => {
    if (!enteredCode) return setMessage("Please enter the reset code you received");

    const res = await fetch("/api/users/verify-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: enteredCode }),
    });

    const data = await res.json();
    if (res.ok) {
      setStep(3);
      setMessage("");
    } else {
      setMessage(data.message || "Invalid reset code");
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || !confirmPassword) {
      return setMessage("Please complete all required fields");
    }

    if (newPassword !== confirmPassword) {
      return setMessage("Check the entered password again");
    }

    const res = await fetch("/api/users/update-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setStep(4);
    } else {
      setMessage(data.message || "Something went wrong");
    }
  };

  return (
    <div className="forgot-popup-overlay">
      <div className="forgot-popup-box">
        <span className="close-btn" onClick={onClose}>
          &times;
        </span>

        {step === 1 && (
          <>
            <h2>Reset your password</h2>
            <p>To reset your password, please enter your registered email address below:</p>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {message && <p className="error-msg">{message}</p>}
            <button onClick={handleSendCode}>Submit</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>Check your emails!</h2>
            <p>A reset code has been sent. Please check your inbox.</p>
            <div className="code-inputs">
              <input
                type="text"
                maxLength={6}
                value={enteredCode}
                onChange={(e) => setEnteredCode(e.target.value)}
              />
            </div>
            {message && <p className="error-msg">{message}</p>}
            <button onClick={handleVerifyCode}>Submit</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2>Enter New Password</h2>
            <label>Enter your new password:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label>Re-enter password:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {message && <p className="error-msg">{message}</p>}
            <button onClick={handlePasswordUpdate}>Update Password</button>
          </>
        )}

        {step === 4 && (
          <>
            <h2>Your password has been reset</h2>
            <p>You will receive an email confirming the reset.</p>
            <button onClick={onClose}>Back to Login</button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
