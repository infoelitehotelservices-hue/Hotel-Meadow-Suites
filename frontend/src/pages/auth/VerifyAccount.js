import React, { useState, useEffect, useRef } from "react";
import '../../assets/css/authform.css'
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../services/api";
import Preloader from "../../components/ui/Preloader";
import Navbar from "../../components/layout/Navbar";

const COOLDOWN = 60;

const VerifyAccount = () => {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cooldown <= 0) return;
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await verifyOtp(otp);
      if (response.data.status) {
        setIsSuccess(true);
        setMessage(response.data.message);
        if (response.data.userToken) {
          localStorage.setItem("userToken", response.data.userToken);
        }
        setTimeout(() => navigate("/"), 2000);
      } else {
        setIsSuccess(false);
        setMessage(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.message || "Verification failed. Please try again.");
    }
  };

  const handleResend = async () => {
    if (!email) {
      setIsSuccess(false);
      setMessage("Please enter your email address to resend OTP.");
      return;
    }
    setMessage("");
    try {
      const response = await resendOtp({ email });
      setIsSuccess(response.data.status);
      setMessage(response.data.message);
      if (response.data.status) setCooldown(COOLDOWN);
    } catch (error) {
      setIsSuccess(false);
      setMessage(error.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <><Preloader /><Navbar />
    <div className="form-body">
    <div className="form-wrapper">
      <div className="form-header">
        <h1>Verify Your Account</h1>
        <p>Please enter the OTP sent to your email to verify your account.</p>
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
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="otp">OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit">Verify</button>
      </form>
      <div style={{ textAlign: "center", marginTop: "12px" }}>
        <span style={{ fontSize: "13px", color: "#666" }}>Didn't receive the code? </span>
        <button
          onClick={handleResend}
          disabled={cooldown > 0}
          style={{
            background: "none", border: "none",
            cursor: cooldown > 0 ? "not-allowed" : "pointer",
            color: cooldown > 0 ? "#aaa" : "#D4AF37",
            fontWeight: "bold", fontSize: "13px",
            padding: 0, textDecoration: "underline"
          }}
        >
          {cooldown > 0 ? `Resend OTP (${cooldown}s)` : "Resend OTP"}
        </button>
      </div>
      <p className={`message ${isSuccess ? "success" : "error"}`}>{message}</p>
    </div>
    </div></>
  );
};

export default VerifyAccount;
