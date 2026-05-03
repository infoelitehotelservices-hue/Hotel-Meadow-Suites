import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Auth";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDate } from "../utils/util";
import '../assets/css/booknow.css';
import { notification, message } from "antd";
import { SmileOutlined } from "@ant-design/icons";

// Reusable Input Field Component
const InputField = ({ label, type, value, onChange, placeholder, required, error }) => (
  <div className="book-input1_wrapper">
    <label>{label}</label>
    <div className="book-input1_inner">
      <input
        type={type}
        className="form-control input"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  </div>
);

// Reusable DatePicker Field Component
const DatePickerField = ({ label, selectedDate, onChange, placeholder, minDate, required }) => (
  <div className="book-input1_wrapper">
    <label>{label}</label>
    <div className="book-input1_inner">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        className="form-control input"
        placeholderText={placeholder}
        dateFormat="dd-MM-yyyy"
        minDate={minDate}
        required={required}
      />
    </div>
  </div>
);

// Invoice Details Component
const TAX_RATE = 0.15;

const InvoiceDetails = ({ invoiceDetails, roomDetails }) => {
  if (!invoiceDetails) return (
    <div className="invoice-inner">
      <p style={{ color: 'rgba(255,255,255,0.7)', textAlign: 'center', padding: '20px' }}>
        Please select check-in and check-out dates to see the pricing details.
      </p>
    </div>
  );

  const { checkInDate, checkOutDate, nights, pricePerNight, discountedPrice, subtotal, taxAmount, total } = invoiceDetails;

  return (
    <div className="invoice-inner">
      {/* Room Info in Invoice */}
      {roomDetails && (
        <div style={{ 
          borderBottom: '2px solid #333', 
          paddingBottom: '15px', 
          marginBottom: '15px' 
        }}>
          <h4 style={{ color: '#D4AF37', marginBottom: '8px', fontSize: '16px' }}>
            {roomDetails.name}
          </h4>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>
            {roomDetails.type?.name || 'Standard Room'}
          </p>
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Check-in:</span>
          <strong style={{ color: '#fff' }}>{formatDate(checkInDate)}</strong>
        </p>
        <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Check-out:</span>
          <strong style={{ color: '#fff' }}>{formatDate(checkOutDate)}</strong>
        </p>
        <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>Duration:</span>
          <strong style={{ color: '#fff' }}>{nights} Night{nights > 1 ? 's' : ''}</strong>
        </p>
      </div>

      <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #333' }} />

      <div style={{ marginBottom: '15px' }}>
        <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>
            PKR {discountedPrice > 0 ? discountedPrice.toFixed(2) : pricePerNight.toFixed(2)} × {nights} night{nights > 1 ? 's' : ''}
          </span>
          <span style={{ color: '#fff' }}>PKR {subtotal.toFixed(2)}</span>
        </p>
        {discountedPrice > 0 && (
          <p style={{ 
            color: '#4CAF50', 
            fontSize: '13px', 
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span>💰 Discount Applied</span>
            <span>-PKR {((pricePerNight - discountedPrice) * nights).toFixed(2)}</span>
          </p>
        )}
        <p style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
          <span>Tax (15%)</span>
          <span>PKR {taxAmount.toFixed(2)}</span>
        </p>
      </div>

      <hr style={{ margin: '15px 0', border: 'none', borderTop: '2px solid #D4AF37' }} />

      <p style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: '18px', 
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '20px'
      }}>
        <span>Total Amount:</span>
        <span style={{ color: '#D4AF37' }}>PKR {total.toFixed(2)}</span>
      </p>

      {/* Cancellation Policy */}
      <div style={{ 
        background: 'rgba(212, 175, 55, 0.1)', 
        border: '1px solid #D4AF37', 
        borderRadius: '6px', 
        padding: '12px',
        marginTop: '20px'
      }}>
        <h5 style={{ 
          color: '#D4AF37', 
          fontSize: '14px', 
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          ℹ️ Cancellation Policy
        </h5>
        <ul style={{ 
          margin: 0, 
          paddingLeft: '20px', 
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.7)',
          lineHeight: '1.6'
        }}>
          <li>Free cancellation up to 48 hours before check-in</li>
          <li>50% refund for cancellations within 24-48 hours</li>
          <li>No refund for cancellations within 24 hours</li>
        </ul>
      </div>
    </div>
  );
};

const BookNowPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) {
      message.warning("You need to be logged in to make a booking.");
      // Save current location for redirect after login
      localStorage.setItem('redirectAfterLogin', `/book-now/${roomId}`);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    }
  }, [token, navigate, roomId]);

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [number, setNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [specialRequests, setSpecialRequests] = useState("");
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const [roomDetails, setRoomDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch room details
  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API}/api/room/get-room/${roomId}`);
        setRoomDetails(response.data.room);
      } catch (error) {
        message.error("Error fetching room details: " + error.message);
      }
    };

    fetchRoomDetails();
  }, [roomId]);

  // Calculate invoice details
  const calculateInvoice = useCallback(() => {
    if (checkOutDate <= checkInDate) {
      message.error("Check-out date must be after check-in date.");
      return;
    }

    const effectivePricePerNight = roomDetails.discountprice > 0
      ? roomDetails.discountprice
      : roomDetails.pricePerNight || 0;

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const subtotal = nights * effectivePricePerNight;
    const taxAmount = subtotal * TAX_RATE;
    const total = subtotal + taxAmount;

    setInvoiceDetails({
      roomId,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      nights,
      pricePerNight: roomDetails.pricePerNight,
      discountedPrice: roomDetails.discountprice || 0,
      subtotal,
      taxAmount,
      total,
    });
  }, [checkInDate, checkOutDate, roomDetails, roomId]);

  useEffect(() => {
    if (checkInDate && checkOutDate && roomDetails) {
      calculateInvoice();
    }
  }, [checkInDate, checkOutDate, roomDetails, calculateInvoice]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!customerName || !number || !checkInDate || !checkOutDate) {
      message.error("Please fill out all fields.");
      setIsLoading(false);
      return;
    }

    if (checkOutDate <= checkInDate) {
      message.error("Check-out date must be after check-in date.");
      setIsLoading(false);
      return;
    }

    try {
      // Normalize dates to the start of the day in UTC
      const normalizeDate = (date) => {
        const d = new Date(date);
        return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      };
      const bookingData = {
        customerName,
        number,
        roomId,
        checkInDate: normalizeDate(checkInDate).toISOString(),
        checkOutDate: normalizeDate(checkOutDate).toISOString(),
        adults,
        children,
        specialRequests,
        email: user.email,
      };

      const response = await axios.post(`${process.env.REACT_APP_API}/api/bookings/create`, bookingData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { bookingId } = response.data;
      notification.success({
        message: 'Booking Submitted',
        description: 'Please complete your payment to confirm the booking.',
        icon: <SmileOutlined style={{ color: '#D4AF37' }} />,
        duration: 5
      });

      navigate(`/payment/${bookingId}`, { state: { totalAmount: invoiceDetails?.total } });
    } catch (error) {
      if (error.response?.status === 403 || error.response?.status === 401) {
        message.error("Session expired. Please log in again.");
        localStorage.removeItem("userToken");
        navigate("/login");
        return;
      }
      message.error(error.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = useMemo(() => (
    customerName && number.length === 11 && checkInDate && checkOutDate && checkOutDate > checkInDate && adults > 0
  ), [customerName, number, checkInDate, checkOutDate, adults]);

  if (!roomDetails) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Loading room details...</p>
      </div>
    );
  }

  return (
    <div className="booking-page-container">
      {/* Progress Indicator */}
      {/* Progress Indicator */}
      <div className="progress-indicator" style={{ 
        background: '#000000ff', 
        padding: '20px 0', 
        marginBottom: '40px',
        borderBottom: '2px solid #D4AF37'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: '#D4AF37', 
                color: '#1a1a2e', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>1</div>
              <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>Guest Details</span>
            </div>
            <div style={{ width: '50px', height: '2px', background: '#555' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: '#555', 
                color: '#aaa', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>2</div>
              <span style={{ color: '#aaa' }}>Payment</span>
            </div>
            <div style={{ width: '50px', height: '2px', background: '#555' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: '#555', 
                color: '#aaa', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>3</div>
              <span style={{ color: '#aaa' }}>Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: '30px' }}>
        {/* Room Preview Card */}
        <div className="room-preview-card" style={{
          background: '#222',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#D4AF37', marginBottom: '15px', fontSize: '20px' }}>Your Selected Room</h3>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: '0 0 200px' }}>
              <img 
                src={`${process.env.REACT_APP_API}/${roomDetails.images[0]}`}
                alt={roomDetails.name}
                style={{ 
                  width: '100%', 
                  height: '150px', 
                  objectFit: 'cover', 
                  borderRadius: '6px' 
                }}
              />
            </div>
            <div style={{ flex: '1', minWidth: '250px' }}>
              <h4 style={{ color: '#fff', marginBottom: '10px' }}>{roomDetails.name}</h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '10px' }}>
                {roomDetails.description?.substring(0, 150)}...
              </p>
              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
                {roomDetails.size && (
                  <span>📏 {roomDetails.size} sq ft</span>
                )}
                <span>👥 Up to {roomDetails.capacity} guests</span>
                <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>
                  PKR {roomDetails.discountprice || roomDetails.pricePerNight} / night
                </span>
              </div>
            </div>
          </div>
        </div>

    <div className="row">
      <div className="col-md-6">
        <div className="booking-box">
          <div className="head-box">
            <h6>Rooms & Suites</h6>
            <h4>Hotel Booking Form</h4>
          </div>
          <div className="booking-inner clearfix">
            <form onSubmit={handleBookingSubmit} className="form1 clearfix">
              <InputField
                label="Full Name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
              <InputField
                label="Phone Number"
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="03XXXXXXXXX"
                required
                error={number.length > 0 && number.length !== 11 ? "Phone number must be 11 digits." : ""}
              />
              
              {/* Guest Count Section */}
              <div className="guest-count-section" style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div className="book-input1_wrapper" style={{ flex: 1 }}>
                  <label>Adults</label>
                  <div className="book-input1_inner">
                    <select
                      className="form-control input"
                      value={adults}
                      onChange={(e) => setAdults(parseInt(e.target.value))}
                      required
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="book-input1_wrapper" style={{ flex: 1 }}>
                  <label>Children</label>
                  <div className="book-input1_inner">
                    <select
                      className="form-control input"
                      value={children}
                      onChange={(e) => setChildren(parseInt(e.target.value))}
                      style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                    >
                      {[0, 1, 2, 3, 4].map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <DatePickerField
                label="Check-in Date"
                selectedDate={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                placeholder="Select check-in date"
                minDate={new Date()}
                required
              />
              <DatePickerField
                label="Check-out Date"
                selectedDate={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                placeholder="Select check-out date"
                minDate={checkInDate ? new Date(checkInDate.getTime() + 86400000) : new Date()}
                required
              />
              
              {/* Special Requests */}
              <div className="book-input1_wrapper">
                <label>Special Requests (Optional)</label>
                <div className="book-input1_inner">
                  <textarea
                    className="form-control input"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="E.g., Early check-in, extra bed, dietary requirements..."
                    rows="3"
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-form1-submit mt-15"
                disabled={!isFormValid || isLoading}
                style={{ background: '#D4AF37', color: '#1a1a2e', fontWeight: 'bold' }}
              >
                {isLoading ? "Processing..." : "Proceed to Payment →"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="invoice-box" style={{ position: 'sticky', top: '20px' }}>
          <div className="head-box" style={{ background: '#0f0f1e', color: '#D4AF37', padding: '15px 20px', borderRadius: '8px 8px 0 0', border: '1px solid #333', borderBottom: 'none' }}>
            <h4 style={{ margin: 0, color: '#D4AF37' }}>Booking Summary</h4>
          </div>
          <div style={{ background: '#222', border: '1px solid #333', borderRadius: '0 0 8px 8px', padding: '20px' }}>
            <InvoiceDetails invoiceDetails={invoiceDetails} roomDetails={roomDetails} />
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default BookNowPage;