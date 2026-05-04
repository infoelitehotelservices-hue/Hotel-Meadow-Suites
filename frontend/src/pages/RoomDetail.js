import React, { useEffect, useState } from 'react';
import axios from 'axios'; // For making API requests
import { Link, useNavigate, useParams } from 'react-router-dom'; // For getting the room ID from the URL
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Navbar from '../components/layout/Navbar';
import Preloader from '../components/ui/Preloader';
import ScrollToTop from '../components/ui/ProgessScroll';
import { FaRuler, FaUserFriends } from 'react-icons/fa'; 
import { useAuth } from '../context/Auth';
import SEO from '../components/SEO';
import { message } from 'antd';

const RoomDetails = () => {
  const { id } = useParams(); // Get the room ID from the URL
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/room/get-room/${id}`); // Fetch room details
        if (response.data.status) {
          setRoom(response.data.room); // Set room data
        } else {
          setError('Room not found');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomDetails();
  }, [id]);
  
  const handleReserveClick = (e) => {
    if (!user) {
      e.preventDefault(); // Prevent the default link behavior
      message.info("Please sign in to make a booking. You'll be redirected back after login.");
      // Save the intended destination
      localStorage.setItem('redirectAfterLogin', `/book-now/${room._id}`);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    }
    // If the user is logged in, the default behavior will proceed to the booking page
  };


  if (loading) return <Preloader />;
  if (error) return <div>Error: {error}</div>;
  if (!room) return <div>Room not found</div>;

  return (
    <>
    <SEO
    title="[Premium Rooms] | Meadows Hotel & Suites – Luxury 5-Star Hotel in [Karachi]"
    description="Discover the [Premium Rooms] at Meadows Hotel & Suites, a luxury 5-star hotel in [Karachi]. Featuring [key amenities, e.g., king-size bed, city view, private balcony]. Perfect for [target audience, e.g., couples, business travelers]. Book your stay today!"
    ogTitle="[Premium Rooms] | Meadows Hotel & Suites – Luxury 5-Star Hotel in [Karachi]"
    ogDescription="Discover the [Premium Rooms] at Meadows Hotel & Suites, a luxury 5-star hotel in [Karachi]. Featuring [key amenities, e.g., king-size bed, city view, private balcony]. Perfect for [target audience, e.g., couples, business travelers]. Book your stay today!"
/>
      <Preloader />
      <ScrollToTop />
      <Navbar />
      {/* Header Section with Slider */}
      <header className="header slider">
        <OwlCarousel
          className="owl-theme"
          loop
          items={1}
          dots
          autoplay
          autoplayTimeout={5000}
          nav={false}
          responsive={{
            0: { dots: true },
            600: { dots: true },
            1000: { dots: true },
          }}
        >
          {room.images.map((image, index) => (
            <div
              key={index}
              className="text-center item bg-img"
              data-overlay-dark="3"
              style={{ backgroundImage: `url(${process.env.REACT_APP_API}/${image})` }}
            ></div>
          ))}
        </OwlCarousel>
        <div className="arrow bounce text-center">
          <button onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>
            <i className="ti-arrow-down"></i>
          </button>
        </div>
      </header>

      {/* Room Details Section */}
      <section className="rooms-page section-padding" data-scroll-index="1">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <span>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="star-rating"></i>
                ))}
              </span>
              <div className="section-subtitle">Luxury Hotel</div>
              
              {/* Room Name - Primary Heading */}
              <div className="section-title" style={{ marginBottom: '15px' }}>
                {room.name}
              </div>
              
              {/* Room Category and Number */}
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '16px', color: '#D4AF37', marginBottom: '5px' }}>
                  <strong>Category:</strong> {room.type?.name || 'Standard Room'}
                </p>
                <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>
                  <strong>Room Number:</strong> {room.roomNumber}
                </p>
              </div>
              
              {/* Pricing - After room details */}
              <div style={{ 
                background: 'rgba(212, 175, 55, 0.1)', 
                border: '1px solid #D4AF37', 
                borderRadius: '8px',
                padding: '15px 20px',
                marginBottom: '30px',
                display: 'inline-block'
              }}>
                {room.discountprice > 0 ? (
                  <div>
                    <span style={{ 
                      textDecoration: 'line-through', 
                      color: 'rgba(255,255,255,0.5)', 
                      marginRight: '15px',
                      fontSize: '18px'
                    }}>
                      PKR {room.pricePerNight}
                    </span>
                    <span style={{ 
                      fontWeight: 'bold', 
                      fontSize: '28px',
                      color: '#D4AF37'
                    }}>
                      PKR {room.discountprice}
                    </span>
                    <span style={{ 
                      fontSize: '16px', 
                      color: 'rgba(255,255,255,0.7)', 
                      marginLeft: '8px' 
                    }}>
                      / night
                    </span>
                    <span style={{
                      background: '#4CAF50',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      marginLeft: '15px',
                      fontWeight: 'bold'
                    }}>
                      SAVE PKR {room.pricePerNight - room.discountprice}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span style={{ 
                      fontWeight: 'bold', 
                      fontSize: '28px',
                      color: '#D4AF37'
                    }}>
                      PKR {room.pricePerNight}
                    </span>
                    <span style={{ 
                      fontSize: '16px', 
                      color: 'rgba(255,255,255,0.7)', 
                      marginLeft: '8px' 
                    }}>
                      / night
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-8">
              <p className="mb-30">{room.description}</p>
              <div className="row">
                <div className="col-md-6">
                  <h6>Check-in</h6>
                  <ul className="list-unstyled page-list mb-30">
                    <li>
                      <div className="page-list-icon">
                        <span className="ti-check"></span>
                      </div>
                      <div className="page-list-text">
                        <p>Check-in from {room.checkInTime}</p>
                      </div>
                    </li>
                    <li>
                      <div className="page-list-icon">
                        <span className="ti-check"></span>
                      </div>
                      <div className="page-list-text">
                        <p>Early check-in subject to availability</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <h6>Check-out</h6>
                  <ul className="list-unstyled page-list mb-30">
                    <li>
                      <div className="page-list-icon">
                        <span className="ti-check"></span>
                      </div>
                      <div className="page-list-text">
                        <p>Check-out before {room.checkOutTime}</p>
                      </div>
                    </li>
                    <li>
                      <div className="page-list-icon">
                        <span className="ti-check"></span>
                      </div>
                      <div className="page-list-text">
                        <p>Express check-out</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="col-md-12">
                  <h6>Special check-in instructions</h6>
                  <p>
                    Guests will receive an email 5 days before arrival with
                    check-in instructions; front desk staff will greet guests on
                    arrival. For more details, please contact the property using
                    the information on the booking confirmation.
                  </p>
                </div>
                <div className="col-md-12">
                  <h6>Pets</h6>
                  <p>{room.petsAllowed ? 'Pets allowed' : 'Pets not allowed'}</p>
                </div>
                <div className="col-md-12">
                  <h6>Children and extra beds</h6>
                  <p>
                    Children are welcome! Kids stay free. Children stay free when
                    using existing bedding; children may not be eligible for
                    complimentary breakfast. Rollaway/extra beds are available for
                    PKR10 per day.
                  </p>
                </div>
                <div className="col-md-12">
                  <div className="butn-dark mt-15 mb-30">
                    <Link to={`/book-now/${room._id}`} onClick={handleReserveClick}>
                      <span>Reserve Now</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 offset-md-1">
              <h6>Amenities</h6>
              <ul className="list-unstyled page-list mb-30">
                {room.amenities.map((amenity, index) => (
                  <li key={index}>
                    <div className="page-list-icon">
                      <img
                        src={`${process.env.REACT_APP_API}/${amenity.logo}`}
                        alt={amenity.name}
                        className="amenity-logo"
                      />
                    </div>
                    <div className="page-list-text">
                      <p>{amenity.name}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {/* Size and Capacity */}
              <div className="size-capacity-section mb-30">
                {room.size && room.size.trim() !== "" && (
                  <div className="size">
                    <FaRuler className="icon" />
                    <span className='p-2'>{room.size} sq. ft.</span>
                  </div>
                )}
                <div className="capacity">
                  <FaUserFriends className="icon" />
                  <span className='p-2'>{room.capacity} Guests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RoomDetails;