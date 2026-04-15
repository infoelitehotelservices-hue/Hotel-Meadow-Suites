import React, { useEffect, useState } from 'react';
import '../assets/css/testimonials.css';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import '../assets/css/owl_caruosal.css';
import axios from 'axios';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API}/api/testimonials`)
      .then((res) => setTestimonials(res.data.testimonials || []))
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <div>
      <section className="testimonials">
        <div
          className="background bg-img bg-fixed section-padding pb-0"
          style={{ backgroundImage: "url('img/newroom/room6.webp')" }}
        >
          <div className="container">
            <div className="row">
              <div className="col-md-8 offset-md-2">
                <div className="testimonials-box">
                  <div className="head-box">
                    <h6>Testimonials</h6>
                    <h4>What Client's Say?</h4>
                    <div className="line"></div>
                  </div>

                  <OwlCarousel
                    className="owl-theme"
                    loop
                    margin={10}
                    nav
                    dots={true}
                    autoplay={true}
                    autoplayTimeout={3000}
                    autoplayHoverPause={true}
                    items={1}
                  >
                    {testimonials.map((t) => (
                      <div className="item" key={t._id}>
                        <span className="quote">
                          <img src="img/quot.svg" alt="" />
                        </span>
                        <p>{t.review}</p>
                        <div className="info">
                          <div className="author-img">
                            {t.image
                              ? <img src={`${process.env.REACT_APP_API}${t.image}`} alt={t.name} />
                              : <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#D4AF37", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: "bold" }}>
                                  {t.name.charAt(0).toUpperCase()}
                                </div>
                            }
                          </div>
                          <div className="cont">
                            <span>
                              {Array.from({ length: t.rating }).map((_, i) => (
                                <i key={i} className="star-rating"></i>
                              ))}
                            </span>
                            <h6>{t.name}</h6>
                            <span>{t.designation || "Guest review"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </OwlCarousel>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;
