import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import '../assets/css/slider.css';
import { Link } from 'react-router-dom';

const Slider = () => {
  return (
    <div>
      <header className="header slider-fade">
        <OwlCarousel
          className="owl-theme"
          loop
          items={1}
          autoplay
          autoplayTimeout={5000}
          animateOut="fadeOut"
          dots={true}
          nav
          navText={[
            '<i class="ti-angle-left" aria-hidden="true"></i>',
            '<i class="ti-angle-right" aria-hidden="true"></i>',
          ]}
        >
          {/* Slide 1 */}
          <div
            className="text-center item bg-img"
            data-overlay-dark="2"
            style={{
              backgroundImage:
                "url('/img/newroom/room1.webp')",
            }}
          >
            <div className="v-middle caption">
              <div className="container">
                <div className="row">
                  <div className="col-md-10 offset-md-1">
                    <h4>Luxury Hotel & Best Resort</h4>
                    <h1>Enjoy a Luxury Experience</h1>
                    <div className="butn-light mt-30 mb-30">
                    <Link to={'/rooms'} data-scroll-nav="1">
                        <span>Rooms & Suites</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div
            className="text-center item bg-img"
            data-overlay-dark="2"
            style={{
              backgroundImage:  "url('/img/newroom/room2.webp')",
            }}
          >
            <div className="v-middle caption">
              <div className="container">
                <div className="row">
                  <div className="col-md-10 offset-md-1">
                    <h4>Unique Place to Relax & Enjoy</h4>
                    <h1>The Perfect Base For You</h1>
                    <div className="butn-light mt-30 mb-30">
                    <Link to={'/rooms'} data-scroll-nav="1">
                        <span>Rooms & Suites</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 3 */}
          <div
            className="text-center item bg-img"
            data-overlay-dark="3"
            style={{
              backgroundImage:
                "url('/img/newroom/room3.webp')",
            }}
          >
            <div className="v-middle caption">
              <div className="container">
                <div className="row">
                  <div className="col-md-10 offset-md-1">
                    <h4>The Ultimate Luxury Experience</h4>
                    <h1>Enjoy The Best Moments of Life</h1>
                    <div className="butn-light mt-30 mb-30">
                      <Link to={'/rooms'} data-scroll-nav="1">
                        <span>Rooms & Suites</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </OwlCarousel>

        {/* Reservation Section */}
        <div className="reservation">
        <a href="https://wa.me/923711098946" target="_blank" rel="noopener noreferrer">
            <div className="icon d-flex justify-content-center align-items-center">
              <i className="flaticon-call"></i>
            </div>
            <div className="call">
              <span>03711098946</span> <br />
              Reservation
            </div>
          </a>
        </div>
      </header>
    </div>
  );
};

export default Slider;
