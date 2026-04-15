import React from 'react'
import '../assets/css/facilities.css'
import AnimatedBox from './ui/AnimatedBox'
const Facilities = () => {
  return (
    <div>
          <section className="facilties section-padding">
        <div className="container">
            <div className="row">
                <div className="col-md-12">
                    <div className="section-subtitle">Our Services</div>
                    <div className="section-title">Hotel Facilities</div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-4">
                    <AnimatedBox effect='fadeInUp'>
                    <div className="single-facility">
                        <span>
                            <img src='/img/facilities/24-hours.svg' alt='24-hours' width={100} classNameName='img'/>
                        </span>
                        <h5>24/7 Front Desk</h5>
                        <p>Our friendly staff is available around the clock to assist with any inquiries or requests.</p>
                        <div className="facility-shape"> <span className="flaticon-world"></span> </div>
                    </div>
                    </AnimatedBox>
                </div>
                <div className="col-md-4">
                <AnimatedBox effect='fadeInUp'>
                    <div className="single-facility" data-animate-effect="fadeInUp">
                    <span>
                            <img src='/img/facilities/breakfast.svg' alt='breakfast' width={100}/>
                        </span>
                        <h5>Complimentary Breakfast</h5>
                        <p>Start your day with a delicious breakfast included with your stay.</p>
                        <div className="facility-shape"> <span className="flaticon-car"></span> </div>
                    </div>
                    </AnimatedBox>
                </div>
                <div className="col-md-4">
                <AnimatedBox effect='fadeInUp'>
                    <div className="single-facility" data-animate-effect="fadeInUp">
                    <span>
                            <img src='/img/facilities/wifi.svg' alt='wifi' width={100}/>
                        </span>
                        <h5>High Speed Internet</h5>
                        <p>Stay connected with complimentary high-speed internet access throughout the hotel.</p>
                        <div className="facility-shape"> <span className="flaticon-bed"></span> </div>
                    </div>
                    </AnimatedBox>
                </div>
                <div className="col-md-4">
                <AnimatedBox effect='fadeInUp'>
                    <div className="single-facility" data-animate-effect="fadeInUp">
                    <span>
                            <img src='/img/facilities/laundry-service.svg' alt='laundry-service' width={100}/>
                        </span>
                        <h5>Laundry Service</h5>
                        <p>Convenient laundry and dry-cleaning services to keep your wardrobe fresh during your stay.</p>
                        <div className="facility-shape"> <span className="flaticon-wifi"></span> </div>
                    </div>
                    </AnimatedBox>
                </div>
                <div className="col-md-4">
                <AnimatedBox effect='fadeInUp'>
                    <div className="single-facility" data-animate-effect="fadeInUp">
                    <span>
                            <img src='/img/facilities/mop.svg' alt='mop' width={100}/>
                        </span>
                        <h5>Daily Housekeeping</h5>
                        <p>Our attentive staff ensures your room is clean and comfortable every day.</p>
                        <div className="facility-shape"> <span className="flaticon-breakfast"></span> </div>
                    </div>
                    </AnimatedBox>
                </div>
                <div className="col-md-4">
                <AnimatedBox effect='fadeInUp'>
                    <div className="single-facility" data-animate-effect="fadeInUp">
                    <span> 
                            <img src='/img/facilities/parked-car.svg' alt='parked-car' width={100}/>
                        </span>
                        <h5>Parking</h5>
                        <p>Secure parking available for guests, making it easy to explore the city at your convenience.</p>
                        <div className="facility-shape"> <span className="flaticon-breakfast"></span> </div>
                    </div>
                    </AnimatedBox>
                </div>
                <div className="col-md-4">
                <AnimatedBox effect='fadeInUp'>
                    <div className="single-facility" data-animate-effect="fadeInUp">
                    <span>
                            <img src='/img/facilities/air-conditioner.svg' alt='air-conditioner' width={100}/>
                        </span>
                        <h5>Centrally
                        Air-Conditioned</h5>
                        <p>Enjoy a comfortable atmosphere throughout the hotel with centralized air conditioning.</p>
                        <div className="facility-shape"> <span className="flaticon-breakfast"></span> </div>
                    </div>
                    </AnimatedBox>
                </div>
            </div>
        </div>
    </section>
    </div>
  )
}

export default Facilities
