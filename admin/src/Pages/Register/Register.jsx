// admin/src/Pages/Register/Register.jsx

import { useState, useEffect } from "react";
import { registerUser, reset } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Register.scss"; // make sure to copy the SCSS
import { Helmet } from "react-helmet";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isSuccess, isError, message } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const { name, email, password } = formData;

  useEffect(() => {
    if (isSuccess) {
      navigate("/login");
      dispatch(reset());
    }
  }, [isSuccess, dispatch, navigate]);

  useEffect(() => {
    if (isError) {
      setErrorMsg(message.message || message);
    }
  }, [isError, message]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return setErrorMsg("Please complete all fields.");
    }

    setErrorMsg("");
    dispatch(registerUser({ name, email, password, role: "admin" }));
  };

  return (
    <div className="register-page">
      <Helmet>
        <title>Register</title>
      </Helmet>

      <div className="register-card">
        <h1>Admin Register</h1>
        <form onSubmit={handleSubmit}>
          {errorMsg && <p className="error-msg">{errorMsg}</p>}

          <div className="form-group">
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder=" "
              required
            />
            <label>Name</label>
          </div>

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

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
