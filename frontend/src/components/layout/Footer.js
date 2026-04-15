import React from 'react';
import '../../assets/css/footer.css';
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

const Footer = () => {
    return (
        <div>
            <footer className="footer">
                <div className="footer-top">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="footer-column footer-about">
                                    <h3 className="footer-title">About Hotel</h3>
                                    <p className="footer-about-text">**About Meadows Hotel & Suites**  
                                    Located in the heart of Karachi, Meadows Hotel & Suites is a luxury 5-star retreat offering refined comfort, impeccable service, and world-class amenities. With 48 elegantly designed rooms, a family-friendly atmosphere, and exceptional hospitality, we create unforgettable experiences for both leisure and business travelers. Discover the perfect blend of elegance and modern convenience at our boutique hotel.</p>
                                </div>
                            </div>
                            <div className="col-md-3 offset-md-1">
                                <div className="footer-column footer-explore clearfix">
                                    <h3 className="footer-title">Explore</h3>
                                    <ul className="footer-explore-list list-unstyled">
                                        <li>  
                                            <ScrollLink
                                                className="nav-link"
                                                to="/"
                                                smooth={true}
                                                duration={500}
                                            >
                                                Home
                                            </ScrollLink>
                                        </li>
                                        <li><Link to={'/rooms'}>Rooms & Suites</Link></li>
                                        <li>  
                                            <ScrollLink
                                                className="nav-link"
                                                to="about"
                                                smooth={true}
                                                duration={500}
                                            >
                                                About Hotel
                                            </ScrollLink>
                                        </li>
                                        <li><Link to={"/contact-us"}>Contact</Link></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="footer-column footer-contact">
                                    <h3 className="footer-title">Contact</h3>
                                    <p className="footer-contact-text">A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon, Karachi, Pakistan</p>
                                    <div className="footer-contact-info">
                                        <p className="footer-contact-phone"><span className="flaticon-call"></span> +92 371 1098946</p>
                                        <p className="footer-contact-mail">info.elitehotelservices@gmail.com </p>
                                    </div>
                                    <div className="footer-about-social-list">
    <a href="https://www.instagram.com/meadowshotelandsuitesgulshan/" target="_blank" rel="noopener noreferrer"><i className="ti-instagram"></i></a>
    <a href="https://www.facebook.com/profile.php?id=61586964809051" target="_blank" rel="noopener noreferrer"><i className="ti-facebook"></i></a>
    <a href="https://www.tiktok.com/@meadowshotelandsuites?lang=en_r=1" target="_blank" rel="noopener noreferrer"><i className="fab fa-tiktok"></i></a>
    <a href="https://www.snapchat.com/add/meadows.hotel" target="_blank" rel="noopener noreferrer"><i className="fab fa-snapchat"></i></a>
    <a href="https://www.youtube.com/@MeadowsHotelSuitesGulshan" target="_blank" rel="noopener noreferrer"><i className="ti-youtube"></i></a>
</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="footer-bottom-inner">
                                    <p className="footer-bottom-copy-right">© Copyright {new Date().getFullYear()} by <Link to={'/'}>Meadows Hotel & Suites</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;