import React from 'react';
import AnimatedBox from '../components/ui/AnimatedBox';
import '../assets/css/services.css'
import Facilities from '../components/Facilities';
import Navbar from '../components/layout/Navbar';
import Preloader from '../components/ui/Preloader';
import ScrollToTop from '../components/ui/ProgessScroll';
import Footer from '../components/layout/Footer';

const Services = () => {
    return (
        <div>
            <Preloader />
            <ScrollToTop />
            <Navbar />
            <Facilities />
            <section className="services">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 p-0">
                            <AnimatedBox effect="fadeInLeft">
                                <div className="img left">
                                        <img src="img/services/restraunt.webp" alt="restarant" />
                                </div>
                            </AnimatedBox>
                        </div>
                        <div className="col-md-6 p-0 bg-darkblack valign">
                            <AnimatedBox effect="fadeInRight">
                                <div className="content">
                                    <div className="cont text-left">
                                        <div className="info">
                                            <h6>Discover</h6>
                                        </div>
                                        <h4>Nearby Restraunts</h4>
                                        <p>
                                            Meadows Hotel & Suites is surrounded by renowned eateries, including Shinwari, AlviGha, McDonald’s, and Lal Qila, all within walking distance.
                                        </p>
                                        <div className="butn-dark">
                                                        <span>Learn More</span>
                                                </div>
                                    </div>
                                </div>
                            </AnimatedBox>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 bg-darkblack p-0 order2 valign">
                            <AnimatedBox effect="fadeInLeft">
                                <div className="content">
                                    <div className="cont text-left">
                                        <div className="info">
                                            <h6>Discover</h6>
                                        </div>
                                        <h4>Nearby Cinemas</h4>
                                        <p>
                                            Meadows Hotel & Suites is surrounded by renowned eateries, including Shinwari, AlviGha, McDonald’s, and Lal Qila, all within walking distance.
                                        </p>
                                        <div className="butn-dark">
                                                        <span>Learn More</span>
                                                </div>
                                    </div>
                                </div>
                            </AnimatedBox>
                        </div>
                        <div className="col-md-6 p-0 order1">
                            <AnimatedBox effect="fadeInRight">
                                <div className="img">
                                        <img src="img/services/cinema.webp" alt="Nearby Cinemas" />
                                </div>
                            </AnimatedBox>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 p-0">
                            <AnimatedBox effect="fadeInLeft">
                                <div className="img left">
                                        <img src="img/services/malls.webp" alt="" />
                                </div>
                            </AnimatedBox>
                        </div>
                        <div className="col-md-6 p-0 bg-darkblack valign">
                            <AnimatedBox effect="fadeInRight">
                                <div className="content">
                                    <div className="cont text-left">
                                        <div className="info">
                                            <h6>Discover</h6>
                                        </div>
                                        <h4>Nearby Shopping Malls
                                        </h4>
                                        <p>
                                            Enjoy the latest blockbusters at Nueplex Cinema, just a short walk from Meadows Hotel & Suites.
                                        </p>
                                        <div className="butn-dark">
                                                        <span>Learn More</span>
                                                </div>
                                    </div>
                                </div>
                            </AnimatedBox>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6 bg-darkblack p-0 order2 valign">
                            <AnimatedBox effect="fadeInLeft">
                                <div className="content">
                                    <div className="cont text-left">
                                        <div className="info">
                                            <h6>Discover</h6>
                                        </div>
                                        <h4>Nearby Airport
                                        </h4>
                                        <p>
                                            Jinnah International Airport is just a 20-minute drive from Meadows Hotel & Suites, ensuring easy travel access.
                                        </p>
                                        <div className="butn-dark">
                                                        <span>Learn More</span>
                                                </div>
                                    </div>
                                </div>
                            </AnimatedBox>
                        </div>
                        <div className="col-md-6 p-0 order1">
                            <AnimatedBox effect="fadeInRight">
                                <div className="img">
                                        <img src="img/services/airport.webp" alt="" />
                                </div>
                            </AnimatedBox>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default Services;