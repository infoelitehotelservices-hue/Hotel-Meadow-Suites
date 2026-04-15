import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../assets/css/owl_caruosal.css";
import "../assets/css/rooms.css";
import { Link } from "react-router-dom";

const Rooms = () => {
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
      600: { items: 2 },
      1000: { items: 3 },
    },
  };

  return (
    <section className="rooms1 section-padding bg-darkblack" data-scroll-index="1">
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="section-subtitle">Meadows Hotel & Suites</div>
            <div className="section-title">Rooms & Suites</div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <OwlCarousel className="owl-theme" {...options}>
              {/* Room 1 */}
              <div className="item">
                <div className="position-re o-hidden">
                  <img
                    src="/img/newroom/Executiveroom.webp"
                    alt="Twin Deluxe Room"
                  />
                </div>
                <span className="category">
                  <Link to={'/rooms'}>Book</Link>
                </span>
                <div className="con">
                  <h6>
                    <Link to={'/rooms'}>PKR. 8000 / Night</Link>
                  </h6>
                  <h5>
                    <Link to={'/rooms'}>Executive Single Suite</Link>
                  </h5>
                  <div className="line"></div>
                  <div className="row facilities">
                    <div className="col col-md-7">
                      <ul>
                        <li>
                          <i className="flaticon-bed"></i>
                        </li>
                        <li>
                          <i className="flaticon-bath"></i>
                        </li>
                        <li>
                          <i className="flaticon-breakfast"></i>
                        </li>
                        <li>
                          <i className="flaticon-towel"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="col col-md-5 text-end">
                      <div className="permalink">
                        <Link to={'/rooms'}>
                          Details <i className="ti-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Room 2 */}
              <div className="item">
                <div className="position-re o-hidden">
                  <img
                    src="/img/newroom/Deluxesingle.webp"
                    alt="Master Deluxe Room"
                  />
                </div>
                <span className="category">
                  <Link to={'/rooms'}>Book</Link>
                </span>
                <div className="con">
                  <h6>
                    <Link to={'/rooms'}>PKR. 9000 / Night</Link>
                  </h6>
                  <h5>
                    <Link to={'/rooms'}>Deluxe Single Bedroom</Link>
                  </h5>
                  <div className="line"></div>
                  <div className="row facilities">
                    <div className="col col-md-7">
                      <ul>
                        <li>
                          <i className="flaticon-bed"></i>
                        </li>
                        <li>
                          <i className="flaticon-bath"></i>
                        </li>
                        <li>
                          <i className="flaticon-breakfast"></i>
                        </li>
                        <li>
                          <i className="flaticon-towel"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="col col-md-5 text-end">
                      <div className="permalink">
                        <Link to={'/rooms'}>
                          Details <i className="ti-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="position-re o-hidden">
                  <img
                    src="/img/newroom/Deluxeking.webp"
                    alt="Superior Deluxe Room"
                  />
                </div>
                <span className="category">
                  <Link to={'/rooms'}>Book</Link>
                </span>
                <div className="con">
                  <h6>
                    <Link to={'/rooms'}>PKR. 9000 / Night</Link>
                  </h6>
                  <h5>
                    <Link to={'/rooms'}>Deluxe King Room</Link>
                  </h5>
                  <div className="line"></div>
                  <div className="row facilities">
                    <div className="col col-md-7">
                      <ul>
                        <li>
                          <i className="flaticon-bed"></i>
                        </li>
                        <li>
                          <i className="flaticon-bath"></i>
                        </li>
                        <li>
                          <i className="flaticon-breakfast"></i>
                        </li>
                        <li>
                          <i className="flaticon-towel"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="col col-md-5 text-end">
                      <div className="permalink">
                        <Link to={'/rooms'}>
                          Details <i className="ti-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="item">
                <div className="position-re o-hidden">
                  <img
                    src="/img/newroom/FamilySuite.webp"
                    alt="Business Suites"
                  />
                </div>
                <span className="category">
                  <Link to={'/rooms'}>Book</Link>
                </span>
                <div className="con">
                  <h6>
                    <Link to={'/rooms'}>PKR. 10,000 / Night</Link>
                  </h6>
                  <h5>
                    <Link to={'/rooms'}>Executive Family Suite</Link>
                  </h5>
                  <div className="line"></div>
                  <div className="row facilities">
                    <div className="col col-md-7">
                      <ul>
                        <li>
                          <i className="flaticon-bed"></i>
                        </li>
                        <li>
                          <i className="flaticon-bath"></i>
                        </li>
                        <li>
                          <i className="flaticon-breakfast"></i>
                        </li>
                        <li>
                          <i className="flaticon-towel"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="col col-md-5 text-end">
                      <div className="permalink">
                        <Link to={'/rooms'}>
                          Details <i className="ti-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

               <div className="item">
                <div className="position-re o-hidden">
                  <img
                    src="/img/newroom/Premium-Family.webp"
                    alt="Business Suites"
                  />
                </div>
                <span className="category">
                  <Link to={'/rooms'}>Book</Link>
                </span>
                <div className="con">
                  <h6>
                    <Link to={'/rooms'}>PKR. 12,000 / Night</Link>
                  </h6>
                  <h5>
                    <Link to={'/rooms'}>Premium Family Suite</Link>
                  </h5>
                  <div className="line"></div>
                  <div className="row facilities">
                    <div className="col col-md-7">
                      <ul>
                        <li>
                          <i className="flaticon-bed"></i>
                        </li>
                        <li>
                          <i className="flaticon-bath"></i>
                        </li>
                        <li>
                          <i className="flaticon-breakfast"></i>
                        </li>
                        <li>
                          <i className="flaticon-towel"></i>
                        </li>
                      </ul>
                    </div>
                    <div className="col col-md-5 text-end">
                      <div className="permalink">
                        <Link to={'/rooms'}>
                          Details <i className="ti-arrow-right"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </OwlCarousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rooms;
