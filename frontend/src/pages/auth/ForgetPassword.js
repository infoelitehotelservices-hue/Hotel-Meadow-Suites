import React, { useState } from "react";
import { forgotPassword } from "../../services/api";
import '../../assets/css/authform.css'
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Preloader from "../../components/ui/Preloader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email });
      if (response.data.status) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate('/reset-password', { state: { email } });  
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    }
  };

  return (
    <>
    <Preloader/>
    <Navbar />
    <div className="form-body">
      <div className="form-wrapper">
        <div className="form-header">
          <h1>Forgot Password</h1>
          <p>Enter your registered email address, and we will send you an OTP to reset your password.</p>
        </div>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required />
          </div>
          <button className="btn" type="submit">Send OTP</button>
        </form>
        <p className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</p>
      </div>
    </div></>
  );
};

export default ForgotPassword;
