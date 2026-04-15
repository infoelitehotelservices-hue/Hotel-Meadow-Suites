import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Alert, Spin, Button, Modal } from "antd";

const ConfirmBooking = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState({
    message: "Confirming your booking...",
    type: "info",
    loading: true,
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let timer;
    const confirmBooking = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/bookings/confirm/${token}`
        );

        setStatus({
          message: response.data.message,
          type: "success",
          loading: false,
        });

        if (response.data.confirmed) {
          setShowModal(true);
        }

        timer = setTimeout(() => navigate("/"), 6000);
      } catch (error) {
        setStatus({
          message:
            error.response?.data?.message ||
            "Invalid or expired confirmation link",
          type: "error",
          loading: false,
        });
      }
    };

    confirmBooking();
    return () => clearTimeout(timer);
  }, [token, navigate]);

  return (
    <div className="confirmation-container" style={{ textAlign: "center", padding: "20px" }}>
      {status.loading ? (
        <Spin tip="Confirming your booking..." size="large" />
      ) : (
        <div className="confirmation-message">
          <Alert message={status.message} type={status.type} showIcon style={{ marginBottom: "20px" }} />
          <Button className="btn btn-dark" onClick={() => navigate("/")} style={{ marginBottom: "20px" }}>
            Go to Homepage
          </Button>
          <Modal
            title="Booking Confirmed"
            open={showModal}
            onOk={() => setShowModal(false)}
            onCancel={() => setShowModal(false)}
            footer={[
              <Button key="ok" type="dark" onClick={() => setShowModal(false)}>
                OK
              </Button>,
            ]}
          >
            <p style={{color : "black"}}>Your booking is confirmed.</p>
            <p  style={{color : "black"}}>Please check your email for the invoice.</p>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default ConfirmBooking;
