import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBox from "../components/ui/AnimatedBox";
import "../assets/css/roomspage.css";

// Import jQuery and plugins
import $ from "jquery";
import "select2";
import "jquery-ui/ui/widgets/datepicker";
import ScrollToTop from "../components/ui/ProgessScroll";
import Preloader from "../components/ui/Preloader";
import { useAuth } from "../context/Auth";
import SEO from "../components/SEO";
import { message } from "antd";

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Filter states
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [capacity, setCapacity] = useState(1);

  // Ref for select2 element
  const selectRef = useRef(null);
  const roomTypeSelectRef = useRef(null);

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();

    // Initialize select2
    const selectEl = selectRef.current;
    if (selectEl) {
      $(selectEl).select2({
        minimumResultsForSearch: Infinity,
      });
    }

    // Initialize room type select2
    const roomTypeSelectEl = roomTypeSelectRef.current;
    if (roomTypeSelectEl) {
      $(roomTypeSelectEl).select2({
        minimumResultsForSearch: Infinity,
      }).on('change', function() {
        setSelectedRoomType($(this).val());
      });
    }

    // Initialize datepicker
    $(".datepicker").datepicker({
      orientation: "top",
      onSelect: function (dateText) {
        // Update state when a date is selected
        if ($(this).hasClass("check-in")) {
          setCheckInDate(dateText);
        } else if ($(this).hasClass("check-out")) {
          setCheckOutDate(dateText);
        }
      },
    });

    // Cleanup on unmount
    return () => {
      if (selectEl) {
        $(selectEl).select2("destroy");
      }
      if (roomTypeSelectEl) {
        $(roomTypeSelectEl).select2("destroy");
      }
      $(".datepicker").datepicker("destroy");
    };
  }, []);

  const fetchRooms = async (roomTypeId = null) => {
    try {
      setLoading(true);
      let response;
      if (roomTypeId) {
        response = await axios.get(`${process.env.REACT_APP_API}/api/room/rooms/${roomTypeId}`);
        setRooms(response.data.rooms || []);
      } else {
        response = await axios.get(`${process.env.REACT_APP_API}/api/room/get-room`);
        setRooms(response.data.rooms);
      }
      setLoading(false);
    } catch (error) {
      setError("Error fetching rooms");
      setLoading(false);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/roomtype/get-roomtype`);
      if (response.data.status) {
        setRoomTypes(response.data.roomtypes);
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
    }
  };

  // Filter rooms by selected room type
  useEffect(() => {
    if (selectedRoomType) {
      fetchRooms(selectedRoomType);
    } else {
      fetchRooms();
    }
  }, [selectedRoomType]);

  const handleFilter = async (e) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate || !capacity) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${process.env.REACT_APP_API}/api/room/check-room`, {
        params: { checkInDate, checkOutDate, capacity },
      });

      setRooms(response.data.availableRooms);
      setLoading(false);
    } catch (error) {
      setError("No rooms available for the selected dates.");
      setRooms([]);
      setLoading(false);
    }
  };

  const handleNavigate = (id) => {
    navigate(`/rooms/${id}`);
  };

  const handleReserveClick = (e, roomId) => {
    if (!user) {
      e.preventDefault(); // Prevent the default link behavior
      message.info("Please sign in to make a booking. You'll be redirected back after login.");
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', `/book-now/${roomId}`);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
    // If the user is logged in, the default behavior will proceed to the booking page
  };

  return (
    <>
    <SEO
    title="Luxury Rooms & Suites | Meadows Hotel & Suites – 5-Star Hotel in [Karachi]"
    description="Experience luxury at Meadows Hotel & Suites. Explore our spacious rooms and suites in [A-150 Gulshan e Iqbal Block 3 KDA Market]. Perfect for business, leisure, and family stays. Book now!"
    ogTitle="Luxury Rooms & Suites | Meadows Hotel & Suites – 5-Star Hotel in [Karachi]"
    ogDescription="Experience luxury at Meadows Hotel & Suites. Explore our spacious rooms and suites in [A-150 Gulshan e Iqbal Block 3 KDA Market]. Perfect for business, leisure, and family stays. Book now!"
/>
      <Navbar />
      <Preloader />
      <ScrollToTop/>
      <div className="banner-header section-padding valign bg-img bg-fixed" data-overlay-dark="4"  style={{backgroundImage : "url('img/newroom/Deluxesingle.webp')"}}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 room-caption mt-90">
              <section className="section-padding" data-scroll-index="1">
                <div className="container room-section-container">
                  <div className="section-subtitle">Find Your Perfect Stay</div>
                  <div className="section-title">Search Rooms</div>
                  <div className="booking-inner clearfix">
                    <form onSubmit={handleFilter} className="form1 clearfix">
                      <div className="col2 c3">
                        <div className="select1_wrapper">
                          <label>Room Type</label>
                          <div className="select1_inner">
                            <select
                              ref={roomTypeSelectRef}
                              className="select2 select"
                              style={{ width: "150%" }}
                              value={selectedRoomType}
                              onChange={(e) => setSelectedRoomType(e.target.value)}
                            >
                              <option value="">All Room Types</option>
                              {roomTypes.map((type) => (
                                <option key={type._id} value={type._id}>
                                  {type.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col1 c1">
                        <div className="input1_wrapper">
                          <label>Check in</label>
                          <div className="input1_inner">
                            <input
                              type="text"
                              className="form-control input datepicker check-in"
                              placeholder="Check in"
                              value={checkInDate}
                              onChange={(e) => setCheckInDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col1 c2">
                        <div className="input1_wrapper">
                          <label>Check out</label>
                          <div className="input1_inner">
                            <input
                              type="text"
                              className="form-control input datepicker check-out"
                              placeholder="Check out"
                              value={checkOutDate}
                              onChange={(e) => setCheckOutDate(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="col2 c3">
                        <div className="select1_wrapper">
                          <label>Guests</label>
                          <div className="select1_inner">
                            <select
                              ref={selectRef}
                              className="select2 select"
                              style={{ width: "100%" }}
                              value={capacity}
                              onChange={(e) => setCapacity(e.target.value)}
                            >
                              <option value="1">1 Adult</option>
                              <option value="2">2 Adults</option>
                              <option value="3">3 Adults</option>
                              <option value="4">4 Adults</option>
                            </select>
                          </div>
                        </div>
                      </div>
                      <div className="col3 c6">
                        <button type="submit" className="btn-form1-submit">
                          Check Availability
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Section */}
      <section className="room-section-padding">
  <div className="container">
    {error && <p className="alert alert-danger">{error}</p>}
    {loading && <p className="loading-text">Loading rooms...</p>}
    <div className="row">
      {rooms.length > 0 ? (
        rooms.map((room, index) => (
          <div className={`col-md-12 ${index % 2 === 0 ? "left" : "right"}`} key={room._id}>
            <AnimatedBox effect="fadeInUp">
              <div className={`rooms2 mb-90 ${index % 2 === 0 ? "" : "left"}`}>
                <figure className="room-image-wrapper">
                  <img 
                    src={`${process.env.REACT_APP_API}/${room.images[0]}`} 
                    alt={room.name} 
                    className="img-fluid room-image" 
                  />
                </figure>
                <div className="room-caption">
                  <h3>
                    {room.pricePerNight}PKR <span>/ Night</span>
                  </h3>
                  <h4>
                    <Link to={`/rooms/${room._id}`}>{room.name}</Link>
                  </h4>
                  <p className="room-description">
                    {room.description.length > 150 
                      ? room.description.substring(0, 150) + '...' 
                      : room.description}
                  </p>
                  <div className="row room-facilities">
                    {room.amenities.map((amenity, index) => (
                      <div className="col-md-4" key={index}>
                        <ul>
                          <li class="spacing">
                            <img 
                              src={`${process.env.REACT_APP_API}/${amenity.logo}`} 
                              alt={amenity.name} 
                              className="amenity-logo" 
                            />
                           <span>{amenity.name}</span>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                  <hr className="border-2" />
                  <div className="info-wrapper">
                    <div className="more">
                      <Link onClick={() => handleNavigate(room._id)} className="link-btn">
                        Details <i className="ti-arrow-right"></i>
                      </Link>
                    </div>
                    <div className="butn-dark">
                      <Link to={`/book-now/${room._id}`} onClick={(e) => handleReserveClick(e, room._id)} data-scroll-nav="1">
                        <span>Book Now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedBox>
          </div>
        ))
      ) : (
        !loading && <p>No rooms found for the selected criteria.</p>
      )}
    </div>
  </div>
</section>
    </>
  );
};

export default RoomsPage;