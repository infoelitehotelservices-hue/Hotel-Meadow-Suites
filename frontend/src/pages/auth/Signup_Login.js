import React, { useState } from "react";
// import { registerUser, loginUser } from "../../src/services/api";
import '../../assets/css/Signup_Login.css';
import { useLocation, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../services/api";
import { useAuth } from "../../context/Auth";
import { RxEyeClosed, RxEyeOpen } from "react-icons/rx";
import { notification } from "antd";
import { SmileOutlined } from "@ant-design/icons";

const Signup_Login = () => {
  const { login } = useAuth();
  const [activeForm, setActiveForm] = useState("login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(loginForm);
      
      if (!response.data || !response.data.user) {
        throw new Error("Invalid response from server");
      }
  
      const { user } = response.data; // Now response.data.user should exist
  
      login(response.data); // Store token & user in context
  
      setMessage("Login successful!");
      setTimeout(() => {
        if (user.verification) {
          navigate(location.state || "/"); // Redirect to homepage if verified
        } else {
          navigate("/verify-account");
          notification.success({
            message: 'Booking Successful',
            description: `OTP request sent! Please check "${user.email}" for Verification of Account.`,
            icon: <SmileOutlined style={{ color: '#D4AF37' }} />,
            duration : 3000
          });
        }
      }, 2000);
  
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };
  
  

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (signupForm.password.length < 8) {
      setMessage("Password must be at least 8 characters long.");
      return;
    }
    try {
      const response = await registerUser(signupForm);
      
      if (response.data.status) {
        setMessage(response.data.message);
        setTimeout(() => {
          navigate("/verify-account", { state: { email: signupForm.email } });
        }, 2000);
      } else {
        setMessage(response.data.message || "Registration failed");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };
  

  return (
    <div className="body">
    <div className="wrapper">
      <div className="form-container">
        <div className="header-form">
          <img src="/img/logo.svg" alt="Hotel Logo" className="logo" />
        </div>

        <div className="toggle-buttons">
          <button
            id="loginBtn"
            className={activeForm === "login" ? "active" : ""}
            onClick={() => setActiveForm("login")}
          >
            Login
          </button>
          <button
            id="signupBtn"
            className={activeForm === "signup" ? "active" : ""}
            onClick={() => setActiveForm("signup")}
          >
            Signup
          </button>
        </div>

        {activeForm === "login" && (
          <form id="loginForm" className="form" onSubmit={handleLoginSubmit}>
            <h2>Welcome Back</h2>
            <div className="input-group">
              <label htmlFor="loginEmail">Email</label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                placeholder="Enter your email"
                onChange={handleLoginChange}
                value={loginForm.email}
                required
              />
            </div>
            <div className="input-group password-group">
              <label htmlFor="loginPassword">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="loginPassword"
                name="password"
                placeholder="Enter your password"
                onChange={handleLoginChange}
                value={loginForm.password}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <RxEyeOpen/> : <RxEyeClosed/>}
              </span>
            </div>
            <button type="submit" className="btn">Login</button>
            <p
  className="forgot-password"
  onClick={() => navigate('/forget-password')}
>
  Forgot Password?
</p>
          </form>
        )}

        {activeForm === "signup" && (
          <form id="signupForm" className="form" onSubmit={handleSignupSubmit}>
            <h2>Create Account</h2>
            <div className="input-group">
              <label htmlFor="signupName">Full Name</label>
              <input
                type="text"
                id="signupName"
                name="username"
                placeholder="Enter your name"
                onChange={handleSignupChange}
                value={signupForm.username}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="signupEmail">Email</label>
              <input
                type="email"
                id="signupEmail"
                name="email"
                placeholder="Enter your email"
                onChange={handleSignupChange}
                value={signupForm.email}
                required
              />
            </div>
            <div className="input-group password-group">
              <label htmlFor="signupPassword">Password</label>
              <input
                type={showSignupPassword ? "text" : "password"}
                id="signupPassword"
                name="password"
                placeholder="Create a password (min. 8 characters)"
                onChange={handleSignupChange}
                value={signupForm.password}
                minLength={8}
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowSignupPassword(!showSignupPassword)}
              >
                {showSignupPassword ? <RxEyeOpen/> : <RxEyeClosed/>}
              </span>
              
            </div>
            <button type="submit" className="btn">Signup</button>
          </form>
        )}

        <p>{message}</p>
      </div>
    </div>
    </div>
  );
};

export default Signup_Login;
