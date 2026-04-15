import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const decodedToken = decodeToken(token);
      setUser(decodedToken);
    }
    setLoading(false); // Set loading to false after token is checked
  }, []);

  const login = (userData) => {
    localStorage.setItem("userToken", userData.userToken);
    const decodedToken = decodeToken(userData.userToken);
    setUser(decodedToken);
  };

  const logout = () => {
    localStorage.removeItem("userToken");
    setUser(null);
  };

  const decodeToken = (token) => {
    const decoded = jwtDecode(token);
    // Check if token is expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("userToken");
      return null;
    }
    return {
      id: decoded.id,
      username : decoded.username,
      email: decoded.email,
      userType: decoded.userType,
      verification : decoded.verification
    };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);