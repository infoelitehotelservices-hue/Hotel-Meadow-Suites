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

const InvoiceDetails = ({ invoiceDetails }) => {
  if (!invoiceDetails) return (
    <div className="invoice-inner">
      <p>Please select check-in and check-out dates to see the invoice details.</p>
    </div>
  );

  const { checkInDate, checkOutDate, nights, pricePerNight, discountedPrice, subtotal, taxAmount, total } = invoiceDetails;

  return (
    <div className="invoice-inner">
      <p><strong>Check-in Date:</strong> {formatDate(checkInDate)}</p>
      <p><strong>Check-out Date:</strong> {formatDate(checkOutDate)}</p>
      <p><strong>Number of Nights:</strong> {nights}</p>
      <p>
        <strong>Price per Night:</strong> PKR {pricePerNight.toFixed(2)}
        {discountedPrice > 0 && (
          <span style={{ color: "green", marginLeft: "10px" }}>
            (Discounted: PKR {discountedPrice.toFixed(2)})
          </span>
        )}
      </p>
      <hr style={{ margin: "10px 0" }} />
      <p><strong>Subtotal:</strong> PKR {subtotal.toFixed(2)}</p>
      <p style={{ color: "#888" }}><strong>Tax (15%):</strong> PKR {taxAmount.toFixed(2)}</p>
      <p style={{ fontSize: "16px", fontWeight: "bold", borderTop: "1px solid #ccc", paddingTop: "8px" }}>
        <strong>Total (incl. tax):</strong> PKR {total.toFixed(2)}
      </p>
    </div>
  );
};

const BookNowPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [number, setNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
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
    customerName && number.length === 11 && checkInDate && checkOutDate && checkOutDate > checkInDate
  ), [customerName, number, checkInDate, checkOutDate]);

  return (
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
                label="Name"
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Name"
                required
              />
              <InputField
                label="Phone"
                type="tel"
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="03XXXXXXXXX"
                required
                error={number.length > 0 && number.length !== 11 ? "Phone number must be 11 digits." : ""}
              />
              <DatePickerField
                label="Check-in Date"
                selectedDate={checkInDate}
                onChange={(date) => setCheckInDate(date)}
                placeholder="Check in"
                minDate={new Date()}
                required
              />
              <DatePickerField
                label="Check-out Date"
                selectedDate={checkOutDate}
                onChange={(date) => setCheckOutDate(date)}
                placeholder="Check out"
                minDate={checkInDate ? new Date(checkInDate.getTime() + 86400000) : new Date()}
                required
              />
              <button
                type="submit"
                className="btn-form1-submit mt-15"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Processing..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="col-md-6">
        <div className="invoice-box">
          <div className="head-box">
            <h4>Invoice Details</h4>
          </div>
          <InvoiceDetails invoiceDetails={invoiceDetails} />
        </div>
      </div>
    </div>
  );
};

export default BookNowPage;