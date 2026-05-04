import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { message, Upload, Button } from "antd";
import { UploadOutlined, WarningFilled, CopyOutlined, CheckOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";

const PaymentPage = () => {
  const { bookingId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleUpload = async () => {
    if (!fileList.length) return message.error("Please select a file first.");

    const formData = new FormData();
    formData.append("paymentProof", fileList[0]);

    setUploading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API}/api/bookings/${bookingId}/payment-proof`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      message.success("Payment proof uploaded successfully!");
      // Navigate to confirmation page instead of homepage
      navigate(`/booking-confirmation/${bookingId}`, { 
        state: { 
          bookingId, 
          totalAmount: state?.totalAmount,
          message: 'Payment proof uploaded successfully!' 
        } 
      });
    } catch (error) {
      message.error(error.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

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
            <div style={{ width: '50px', height: '2px', background: '#D4AF37' }}></div>
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
              }}>2</div>
              <span style={{ color: '#D4AF37', fontWeight: 'bold', fontSize: '14px' }}>Payment</span>
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
              <span style={{ color: '#aaa', fontSize: '14px' }}>Confirmation</span>
            </div>
          </div>
        </div>
      </div>

    <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 20px" }}>
      <div style={{ background: '#222', color: '#fff', padding: "20px 30px", borderRadius: "8px 8px 0 0", border: '1px solid #333', borderBottom: 'none' }}>
        <h2 style={{ margin: 0, color: "#D4AF37" }}>Advance Payment</h2>
      </div>

      <div style={{ border: "1px solid #333", borderTop: "none", borderRadius: "0 0 8px 8px", padding: 30, background: '#222', color: '#fff' }}>
        <p style={{ color: "rgba(255,255,255,0.8)" }}>
          Booking ID: <strong style={{ color: '#D4AF37' }}>{bookingId}</strong>
        </p>
        {state?.totalAmount && (
          <>
            <p style={{ fontSize: 18, fontWeight: "bold", color: 'rgba(255,255,255,0.9)' }}>
              Total Amount: <span style={{ color: "#D4AF37" }}>PKR {state.totalAmount.toFixed(2)}</span>
            </p>
            <p style={{ fontSize: 16, fontWeight: "bold", color: 'rgba(255,255,255,0.9)' }}>
              Minimum Advance (10%):{" "}
              <span style={{ color: "#D4AF37" }}>PKR {(state.totalAmount * 0.1).toFixed(2)}</span>
            </p>
          </>
        )}

        <div style={{ background: "rgba(212, 175, 55, 0.1)", border: "1px solid #D4AF37", borderRadius: 6, padding: "12px 16px", margin: "16px 0" }}>
          <p style={{ margin: 0, fontWeight: "bold", color: "#D4AF37", display: "flex", alignItems: "center", gap: 8 }}>
            <WarningFilled style={{ color: "#D4AF37", fontSize: 16 }} /> Payment Instructions:
          </p>
          <ul style={{ margin: "8px 0 0 0", paddingLeft: 20, color: 'rgba(255,255,255,0.8)' }}>
            <li style={{ fontWeight: "bold", marginBottom: 4 }}>You must pay at least <span style={{ color: "#D4AF37" }}>10% of the total amount</span> as advance to confirm your booking.</li>
            <li style={{ fontWeight: "bold", marginBottom: 4 }}>Transfer the advance amount to the bank account details below.</li>
            <li style={{ fontWeight: "bold", marginBottom: 4 }}>Upload a clear screenshot or receipt of your payment proof.</li>
            <li style={{ fontWeight: "bold" }}>Our team will verify and confirm your booking within 24 hours.</li>
          </ul>
        </div>

        <hr style={{ borderColor: '#333' }} />

        <h4 style={{ marginTop: 20, color: '#D4AF37' }}>Bank Account Details</h4>
        <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}>
          <tbody>
            {[
              ["Bank Name", "Meezan Bank LTD", false],
              ["Account Title", "Meadow Suites and hotel", false],
              ["Account Number", "10550113557328", true],
              ["IBAN", "PK39 MEZN 0010 5501 1355 7328", true],
            ].map(([label, value, copyable]) => (
              <tr key={label} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "10px 0", color: "rgba(255,255,255,0.6)", width: "40%" }}>{label}</td>
                <td style={{ padding: "10px 0", fontWeight: "bold", color: '#fff' }}>
                  {value}
                  {copyable && (
                    <span
                      onClick={() => handleCopy(value, label)}
                      style={{ marginLeft: 10, cursor: "pointer", color: copiedField === label ? "#4CAF50" : "#D4AF37" }}
                      title={`Copy ${label}`}
                    >
                      {copiedField === label ? <CheckOutlined /> : <CopyOutlined />}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

  

        <Upload
          beforeUpload={(file) => {
            setFileList([file]);
            return false;
          }}
          fileList={fileList}
          onRemove={() => setFileList([])}
          accept="image/jpeg,image/png,image/jpg"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>Select Payment Proof</Button>
        </Upload>

        <Button
          type="primary"
          onClick={handleUpload}
          loading={uploading}
          disabled={!fileList.length}
          style={{ marginTop: 20, background: "#D4AF37", borderColor: "#D4AF37", color: "#1a1a2e", fontWeight: "bold" }}
          block
        >
          {uploading ? "Uploading..." : "Submit Payment Proof"}
        </Button>
      </div>
    </div>
    </div>
    </>
  );
};

export default PaymentPage;
