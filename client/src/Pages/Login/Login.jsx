// Shared Login.jsx for both Client & Admin
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, reset } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import ForgotPasswordPopup from "../../component/Auth/ForgotPasswordPopup";
import "./Login.scss";
import { Helmet } from "react-helmet";

const Login = ({ userType = "client" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [showForgot, setShowForgot] = useState(false);

  const { email, password } = formData;

  useEffect(() => {
    if (isSuccess || user) {
      navigate(userType === "admin" ? "/dashboard" : "/");
      dispatch(reset());
    }
  }, [isSuccess, user, dispatch, navigate, userType]);

  useEffect(() => {
    if (isError) {
      setErrorMsg(message.message || message);
    }
  }, [isError, message]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return setErrorMsg("Enter email and password.");
    setErrorMsg("");
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="login-page">
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="login-card">
        <h1>{userType === "admin" ? "Admin Login" : "Client Login"}</h1>
        <form onSubmit={handleSubmit}>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <div className="form-group">
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Email</label>
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Password</label>
          </div>

          <button type="submit">Login</button>
        </form>

        <p className="forgot-text" onClick={() => setShowForgot(true)}>
          Forgot your password?
        </p>
      </div>

      {showForgot && <ForgotPasswordPopup onClose={() => setShowForgot(false)} />}
    </div>
  );
};

export default Login;
