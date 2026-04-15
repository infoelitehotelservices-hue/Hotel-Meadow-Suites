import React from 'react'
import Navbar from '../components/layout/Navbar'
import Slider from '../components/Slider'
import About from '../components/About'
import Rooms from '../components/Rooms'
import Facilities from '../components/Facilities'
import Testiominals from '../components/Testiominals'
import Footer from '../components/layout/Footer'
import Preloader from '../components/ui/Preloader'
import ScrollToTop from '../components/ui/ProgessScroll'
import Offers from '../components/Offers'
import SEO from '../components/SEO'


const HomePage = () => {
  
  return (
    <div>
       <SEO
    title="Luxury 5-Star Hotel | Meadows Hotel & Suites | [A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon,
Karachi, Pakistan]"
    description="Experience luxury at Meadows Hotel & Suites, a 5-star hotel in [A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon,
Karachi, Pakistan]. Enjoy world-class accommodations, fine dining, and exceptional service. Book your stay today!"
    ogTitle="Luxury 5-Star Hotel | Meadows Hotel & Suites | [City/Location]"
    ogDescription="Experience luxury at Meadows Hotel & Suites, a 5-star hotel in [A-150 Gulshan e Iqbal Block 3 KDA Market near Flourish Spa & Saloon,
Karachi, Pakistan]. Enjoy world-class accommodations, fine dining, and exceptional service. Book your stay today!"
/>
        <Preloader/>
        <ScrollToTop/>
      <Navbar/>
      <Slider/>
     <About/>
     <Rooms/>
       <Offers/> 
       <Facilities/>
       <Testiominals/>
       <Footer/>
    </div>
  )
}

export default HomePage
