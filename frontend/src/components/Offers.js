import React, { useEffect, useState } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../assets/css/extraservices.css";
import axios from "axios";
import { message, Spin } from "antd";

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch all Offer
  const fetchOffers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/offers/get-offer`);
      if (response.data.status) {
        setOffers(response.data.offers);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error fetching offers");
    }
    setLoading(false);
  };

 useEffect(() => {
    fetchOffers();
  }, []);

  // Owl Carousel settings
  const options = {
    loop: true,
    margin: 30,
    mouseDrag: true,
    autoplay: false,
    dots: true,
    autoplayHoverPause: true,
    nav: false,
    responsive: {
      0: { items: 1 },
      600: { items: 1 },
      1000: { items: 2 },
    },
  };

  return (
    <section className="pricing section-padding">
      <div className="container">
        <div className="row">
          {/* Left Section */}
          <div className="col-md-4">
            <div className="section-subtitle">
              <span>Best Prices</span>
            </div>
            <div className="section-title">Offers / Packages</div>
            <p className="color-2">
            Take advantage of our curated packages designed to make your stay even more special. Whether it’s a romantic getaway, a family vacation, or a business trip, our offers provide exceptional value and luxury tailored to your needs.            </p>
            <p className="color-2">
            Explore our limited-time packages and enjoy exclusive perks, from discounted room rates. Book now and experience the perfect blend of luxury, comfort, and savings at our boutique hotel.            </p>
            <div className="reservations mb-30">
              <div className="icon">
                <span className="flaticon-call"></span>
              </div>
              <div className="text">
                <p className="color-2">For information</p>
                <a href="https://wa.me/923711098946" target="_blank" rel="noopener noreferrer">
                +92 371 1098946</a>
              </div>
            </div>
          </div>

          {/* Right Section - Owl Carousel */}
          <div className="col-md-8">
  {loading ? (
    <Spin size="large" />
  ) : offers.length > 0 ? (
    <OwlCarousel className="owl-theme" {...options} key={offers.length}>
      {offers.map((offer, index) => (
        <div className="pricing-card" key={index} style={{ height: "500px" }}>
          <img
            src={`${process.env.REACT_APP_API}/${offer.image}`}
            alt={`Room ${index + 1}`}
            className="carousel-img"
          />
        </div>
      ))}
    </OwlCarousel>
  ) : (
    <p>No Offers Found.</p>
  )}
</div>


        </div>
      </div>
    </section>
  );
};

export default Offers;
