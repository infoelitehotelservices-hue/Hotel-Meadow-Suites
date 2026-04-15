import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API}`,
});

// Add Authorization header
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("userToken");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const registerUser = (data) => API.post("/register", data);
export const loginUser = (data) => API.post("/login", data);
export const verifyOtp = (otp) => API.get(`/api/users/verify/${otp}`);
export const resendOtp = (data) => API.post("/api/users/resend-otp", data);
export const fetchUser = () => API.get("/user");
export const deleteUser = () => API.delete("/user");
export const forgotPassword = (data) => API.post("/api/users/forgot-password", data);
export const resetPassword = (data) => API.post("/api/users/reset-password", data);

