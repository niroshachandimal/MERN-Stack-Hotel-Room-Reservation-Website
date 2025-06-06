import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, reset } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./Register.scss";
import { Helmet } from "react-helmet";

const Register = ({ userRole = "client" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isSuccess, isError, message } = useSelector((state) => state.auth);

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
    const payload = {
      name,
      email,
      password,
      ...(userRole === "admin" ? { role: "admin" } : {}),
    };

    dispatch(registerUser(payload));
  };

  return (
    <div className="register-page">
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className="register-card">
        <h1>{userRole === "admin" ? "Admin Register" : "Client Register"}</h1>
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
