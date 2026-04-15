import React, { useState } from 'react';
import Preloader from '../components/ui/Preloader';
import ScrollToTop from '../components/ui/ProgessScroll';
import Navbar from '../components/layout/Navbar';
import AnimatedBox from '../components/ui/AnimatedBox.js';
import SEO from '../components/SEO.js';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.message) {
            setErrorMessage('Name, email, and message are required');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API}/api/contact/contact-us`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Message sent successfully!');
                setErrorMessage('');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    subject: '',
                    message: ''
                });
            } else {
                setErrorMessage(data.error || 'Something went wrong');
                setSuccessMessage('');
            }
        } catch (err) {
            setErrorMessage('Failed to send message');
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <SEO
    title="Contact Us | Meadows Hotel & Suites – A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon, Karachi, Pakistan]"
    description="Contact Meadows Hotel & Suites, a A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon, Karachi, Pakistan]. Reach us for reservations, inquiries, or feedback. We’re here to help!"
    ogTitle="Contact Us | Meadows Hotel & Suites – A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon, Karachi, Pakistan]"
    ogDescription="Contact Meadows Hotel & Suites, a A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon, Karachi, Pakistan]. Reach us for reservations, inquiries, or feedback. We’re here to help!"
/>
            <Preloader/>
            <ScrollToTop/>
            <Navbar/>
            {/* Header Banner */}
            <div className="banner-header section-padding valign bg-img bg-fixed" data-overlay-dark="3"  style={{backgroundImage : "url('img/newroom/room6.webp')"}}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-left caption mt-90">
                            <h5>Get in touch</h5>
                            <h1>Contact Us</h1>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Section */}
            <section className="contact section-padding">
                <div className="container">
                    <div className="row mb-90">
                        <div className="col-md-6 mb-60">
                            <h3>Meadows Hotel & Suites</h3>
                            <p>Meadows Hotel & Suites Gulshan is a comfortable and affordable hotel located in Gulshan-e-Iqbal, Karachi. It offers fully furnished, air-conditioned rooms with modern facilities like free Wi-Fi, private bathrooms, TV, and room service. Guests can enjoy amenities such as 24-hour front desk support, free parking, airport shuttle service, and complimentary breakfast options. Its convenient location near KDA Market and major city areas makes it suitable for both family stays and business travelers.</p>
                            <div className="reservations mb-30">
                                <div className="icon"><span className="flaticon-call"></span></div>
                                <div className="text">
                                    <p>Reservation</p>
                                    <a href="https://wa.me/923711098946" target="_blank" rel="noopener noreferrer">
                                    +92 371 1098946</a>
                                </div>
                            </div>
                            <div className="reservations mb-30">
                                <div className="icon"><span className="flaticon-envelope"></span></div>
                                <div className="text">
                                    <p>Email Info</p> <a href="mailto:info.elitehotelservices@gmail.com">info.elitehotelservices@gmail.com</a>
                                </div>
                            </div>
                            <div className="reservations">
                                <div className="icon"><span className="flaticon-location-pin"></span></div>
                                <div className="text">
                                    <p>Address</p> A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon,<br /> Karachi, Pakistan
                                </div>
                            </div>
                        </div>
                        <div className="col-md-5 mb-30 offset-md-1">
                            <h3>Get in touch</h3>
                            <form onSubmit={handleSubmit} className="contact__form">
                                {/* Form Message */}
                                {successMessage && (
                                    <div className="alert alert-success" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="alert alert-danger" role="alert">
                                        {errorMessage}
                                    </div>
                                )}
                                <div className="row">
                                    <div className="col-md-6 form-group">
                                        <input
                                            name="name"
                                            type="text"
                                            placeholder="Your Name *"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="Your Email *"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            name="phone"
                                            type="text"
                                            placeholder="Your Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-6 form-group">
                                        <input
                                            name="subject"
                                            type="text"
                                            placeholder="Subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-md-12 form-group">
                                        <textarea
                                            name="message"
                                            id="message"
                                            cols="30"
                                            rows="4"
                                            placeholder="Message *"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="col-md-12">
                                        <button type="submit" className="btn butn-dark2">
                                            <span>Send Message</span>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className="row">
                        <AnimatedBox effect='fadeInUp'>
                        <div className="col-md-12 map">
                             <iframe title="Meadows Hotel Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3618.1357439163744!2d67.09195439999999!3d24.927445199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f0043d0a2e7%3A0x641a01069608b877!2sMeadows%20Hotel%20and%20Suites%20Gulshan!5e0!3m2!1sen!2s!4v1775729009307!5m2!1sen!2s"                              width="100%"
                             height="600"
                             style={{ border: 0 }}
                             allowFullScreen=""
                             loading="lazy"></iframe>
                        </div>
                        </AnimatedBox>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;