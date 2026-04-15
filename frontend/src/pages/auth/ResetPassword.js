import React, { useState } from "react";
import '../../assets/css/authform.css'
import { resetPassword } from "../../services/api";
import Preloader from "../../components/ui/Preloader";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }
    try {
      const response = await resetPassword(form);
      setMessage(response.data.message);
      setTimeout(() => {
        navigate('/login');  
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <><Preloader /><Navbar /><div className="form-body">
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Reset Password</h1>
          <p>Enter your email and the OTP sent to reset your password.</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              required />
          </div>
          <div className="input-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Enter OTP"
              onChange={handleChange}
              required />
          </div>
          <div className="input-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password (min. 8 characters)"
              minLength={8}
              onChange={handleChange}
              required />
          </div>
          <button className="btn" type="submit">Reset Password</button>
        </form>
        <p className="message">{message}</p>
      </div>
    </div></>
  );
};

export default ResetPassword;
