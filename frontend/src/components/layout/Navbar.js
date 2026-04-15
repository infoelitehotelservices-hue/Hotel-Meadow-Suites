import React, { useState, useEffect, useCallback } from "react";
import "../../assets/css/navbar.css";
import { useAuth } from "../../context/Auth";
import axios from "axios";
import { message } from "antd";
import { Link } from "react-router-dom";
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false);
  const [roomtypes, setRoomtypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();

  const API_URL = `${process.env.REACT_APP_API}/api/roomtype`;

  const fetchRoomtypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/get-roomtype`);
      if (response.data.status) {
        setRoomtypes(response.data.roomtypes);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error fetching room types");
    }
    setLoading(false);
  }, [API_URL]);

  useEffect(() => {
    fetchRoomtypes();
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchRoomtypes]);

  return (
    <nav className={`navbar navbar-expand-lg ${scrolling ? "nav-scroll" : ""}`}>
      <div className="container">
        <div className="logo-wrapper">
          <Link className="logo" to="/">
            <img
              src={scrolling ? "/img/logo.svg" : "/img/logo.svg"}
              className="logo-img"
              alt="Logo"
            />
          </Link>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon">
            <i className="ti-menu"></i>
          </span>
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <ScrollLink
                className="nav-link"
                to="about"
                smooth={true}
                duration={500}
              >
                About
              </ScrollLink>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/rooms'}>Rooms</Link>
            </li>
            <li className="nav-item dropdown">
              <Link
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Rooms Types <i className="ti-angle-down"></i>
              </Link>
              <ul className="dropdown-menu">
                {loading ? (
                  <li className="dropdown-item">Loading...</li>
                ) : (
                  roomtypes.map((room) => (
                    <li key={room._id}>
                      <Link to={`/roomsbytype/${room._id}`} className="dropdown-item">
                        {room.name}
                      </Link>
                    </li>
                  ))
                )}
              </ul>

            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/services'}>Our Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to={'/Gallery'}>Gallery</Link>
            </li>
            <li className="nav-item"><Link className="nav-link" to={'/contact-us'}>Contact Us</Link></li>
            {user ? (
              <>
                <li className="nav-item dropdown">
                  <Link
                    className="nav-link dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Welcome, {user.username}!
                  </Link>
                  <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                    {user.userType === "Admin" && (
                      <li>
                        <Link className="dropdown-item" to="/admin/dashboard">
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <button className="dropdown-item" onClick={logout}>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link btn btn-login"
                  to="/login"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
