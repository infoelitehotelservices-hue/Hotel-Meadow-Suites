import React from "react";
import AnimatedBox from "./ui/AnimatedBox";

const About = () => {
  return (
    <div id="about">
      <section className="about section-padding">
        <div className="container">
          <div className="row">
            {/* Text Section */}
            <div className="col-md-6 mb-30">
              <AnimatedBox effect="fadeInUp">
                <span>
                  <i className="star-rating"></i>
                  <i className="star-rating"></i>
                  <i className="star-rating"></i>
                  <i className="star-rating"></i>
                  <i className="star-rating"></i>
                </span>
                <div className="section-subtitle">Meadows Hotel & Suites</div>
                <div className="section-title">Enjoy a Luxury Experience</div>
                <p>
                Discover refined comfort and impeccable service at our 48-room luxury hotel, located in the vibrant heart of Karachi. Designed to offer unforgettable experiences beyond the ordinary, we provide a perfect blend of elegance and modern amenities for both leisure and business travelers.
                </p>
                <p>
                Create lasting memories with your loved ones in our warm, family-friendly environment. At our boutique hotel, enjoy exceptional service, unmatched comfort, and a touch of elegance, ensuring every moment of your stay is truly special.
                </p>
                <div className="reservations mb-30">
                  <div className="icon">
                    <span className="flaticon-call"></span>
                  </div>
                  <div className="text">
                    <p>Call Us</p>
                    <a 
                      href="tel:+923711098946" 
                      style={{ color: '#D4AF37', textDecoration: 'none' }}
                    >
                      +92 371 1098946
                    </a>
                  </div>
                </div>
                <div className="reservations mb-30">
                  <div className="icon">
                    <span className="flaticon-envelope"></span>
                  </div>
                  <div className="text">
                    <p>Email Info</p>
                    <a 
                      href="mailto:info.elitehotelservices@gmail.com" 
                      style={{ color: '#D4AF37', textDecoration: 'none' }}
                    >
                      info.elitehotelservices@gmail.com
                    </a>
                  </div>
                </div>
                <div className="reservations">
                  <div className="icon">
                    <i className="fab fa-whatsapp" style={{ fontSize: '40px', color: '#25D366' }}></i>
                  </div>
                  <div className="text">
                    <p>WhatsApp</p>
                    <a 
                      href="https://wa.me/923711098946?text=Hello%2C%20I%20would%20like%20to%20make%20a%20reservation" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#25D366', textDecoration: 'none' }}
                    >
                      Chat with us on WhatsApp
                    </a>
                  </div>
                </div>
              </AnimatedBox>
            </div>

            {/* Image 1 */}
            <div className="col col-md-3">
              <AnimatedBox effect="fadeInUp">
                <img
                  src="/img/newroom/room4.webp"
                  alt=""
                  className="mt-90 mb-30"
                />
              </AnimatedBox>
            </div>

            {/* Image 2 */}
            <div className="col col-md-3">
              <AnimatedBox effect="fadeInUp">
                <img
                  src="/img/newroom/room5.webp"
                  alt=""
                />
              </AnimatedBox>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
