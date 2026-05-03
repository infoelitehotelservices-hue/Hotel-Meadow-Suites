import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { CheckCircleOutlined, HomeOutlined, MailOutlined } from "@ant-design/icons";

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <>
  
    <div style={{paddingBottom: '60px' }}>
      {/* Progress Indicator */}
      <div className="progress-indicator" style={{ 
        background: '#000000ff', 
        padding: '20px 0', 
        marginBottom: '40px',
        borderBottom: '2px solid #D4AF37'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: '#4CAF50', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>✓</div>
              <span style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '14px' }}>Details</span>
            </div>
            <div style={{ width: '50px', height: '2px', background: '#4CAF50' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: '#4CAF50', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>✓</div>
              <span style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '14px' }}>Payment</span>
            </div>
            <div style={{ width: '50px', height: '2px', background: '#4CAF50' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '30px', 
                height: '30px', 
                borderRadius: '50%', 
                background: '#4CAF50', 
                color: '#fff', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>✓</div>
              <span style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '14px' }}>Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 650, margin: "0 auto", padding: "0 20px" }}>
        {/* Success Card */}
        <div style={{ 
          background: '#222', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          border: '1px solid #333'
        }}>
          {/* Header */}
          <div style={{ 
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)', 
            padding: '40px 30px', 
            textAlign: 'center' 
          }}>
            <CheckCircleOutlined style={{ fontSize: '64px', color: '#fff', marginBottom: '15px' }} />
            <h1 style={{ color: '#fff', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
              Payment Proof Submitted!
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', margin: '10px 0 0', fontSize: '16px' }}>
              Thank you for your booking
            </p>
          </div>

          {/* Content */}
          <div style={{ padding: '40px 30px' }}>
            {/* Booking ID */}
            <div style={{ 
              background: 'rgba(212, 175, 55, 0.1)', 
              border: '2px dashed #D4AF37', 
              borderRadius: '8px', 
              padding: '20px',
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 8px', fontSize: '14px' }}>Your Booking ID</p>
              <h2 style={{ 
                color: '#D4AF37', 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: 'bold',
                letterSpacing: '1px'
              }}>
                {bookingId}
              </h2>
            </div>

            {/* What's Next Section */}
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#D4AF37', fontSize: '18px', marginBottom: '15px' }}>
                📋 What Happens Next?
              </h3>
              <div style={{ 
                background: 'rgba(212, 175, 55, 0.1)', 
                border: '1px solid #D4AF37', 
                borderRadius: '8px', 
                padding: '20px' 
              }}>
                <ol style={{ 
                  margin: 0, 
                  paddingLeft: '20px', 
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.8'
                }}>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Verification in Progress:</strong> Our team is reviewing your payment proof
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Email Confirmation:</strong> You'll receive a confirmation email within 24 hours
                  </li>
                  <li style={{ marginBottom: '10px' }}>
                    <strong>Invoice Attached:</strong> Your booking invoice will be included in the email
                  </li>
                  <li>
                    <strong>Booking Status:</strong> Check your email for updates on your booking status
                  </li>
                </ol>
              </div>
            </div>

            {/* Important Information */}
            <div style={{ 
              background: 'rgba(33, 150, 243, 0.1)', 
              border: '1px solid #2196F3', 
              borderRadius: '8px', 
              padding: '15px',
              marginBottom: '30px'
            }}>
              <p style={{ 
                margin: 0, 
                color: '#64B5F6', 
                fontSize: '14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <MailOutlined style={{ fontSize: '18px', marginTop: '2px' }} />
                <span>
                  <strong>Important:</strong> Please check your email (including spam folder) for booking confirmation and invoice. 
                  Save your Booking ID for future reference.
                </span>
              </p>
            </div>

            {/* Contact Information */}
            <div style={{ 
              borderTop: '1px solid #333', 
              paddingTop: '20px',
              marginBottom: '20px'
            }}>
              <h4 style={{ color: '#D4AF37', fontSize: '16px', marginBottom: '10px' }}>
                Need Help?
              </h4>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 8px' }}>
                📞 Phone: <strong style={{ color: '#fff' }}>+92 371 1098946</strong>
              </p>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: 0 }}>
                ✉️ Email: <strong style={{ color: '#fff' }}>info.elitehotelservices@gmail.com</strong>
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <Button
                type="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={() => navigate("/")}
                style={{ 
                  flex: 1,
                  minWidth: '200px',
                  background: '#D4AF37', 
                  borderColor: '#D4AF37',
                  color: '#1a1a2e',
                  fontWeight: 'bold',
                  height: '48px'
                }}
              >
                Back to Home
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/rooms")}
                style={{ 
                  flex: 1,
                  minWidth: '200px',
                  height: '48px',
                  borderColor: '#D4AF37',
                  color: '#D4AF37',
                  fontWeight: 'bold'
                }}
              >
                Browse More Rooms
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p style={{ 
          textAlign: 'center', 
          color: 'rgba(255,255,255,0.5)', 
          fontSize: '13px', 
          marginTop: '30px' 
        }}>
          Thank you for choosing Meadows Hotel & Suites. We look forward to welcoming you!
        </p>
      </div>
    </div>
    </>
  );
};

export default BookingConfirmation;
