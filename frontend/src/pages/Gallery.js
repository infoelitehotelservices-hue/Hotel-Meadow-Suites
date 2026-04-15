import React, { useEffect, useState } from "react";
import axios from "axios";
import Preloader from "../components/ui/Preloader";
import ScrollToTop from "../components/ui/ProgessScroll";
import Navbar from "../components/layout/Navbar";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Footer from "../components/layout/Footer";
import { message } from "antd";
import SEO from "../components/SEO";

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // State to control lightbox
  const [photoIndex, setPhotoIndex] = useState(0); // State to track current image index


  // Fetch all Gallery images
  const fetchGallery = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API}/api/gallery/get-gallery`);
      if (response.data.status) {
        setGallery(response.data.gallery);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      message.error("Error fetching Gallery", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  // Function to open lightbox
  const openLightbox = (index) => {
    setPhotoIndex(index);
    setIsOpen(true);
  };

  // Function to close lightbox
  const closeLightbox = () => {
    setIsOpen(false);
  };

  return (
    <>
    <SEO
    title="Photo Gallery | Meadows Hotel & Suites – Luxury 5-Star Hotel in [Karachi]"
    description="Explore the photo gallery of Meadows Hotel & Suites, a luxury 5-star hotel in [Karachi]. Discover our rooms, suites, dining options, and amenities. Book your stay today!"
    ogTitle="Photo Gallery | Meadows Hotel & Suites – Luxury 5-Star Hotel in [Karachi]"
    ogDescription="Explore the photo gallery of Meadows Hotel & Suites, a luxury 5-star hotel in [Karachi]. Discover our rooms, suites, dining options, and amenities. Book your stay today!"
/>
      <Preloader />
      <ScrollToTop />
      <Navbar />
      {/* Image Gallery */}
      <section className="section-padding">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="section-subtitle">Images</div>
              <div className="section-title">Image Gallery</div>
            </div>

            {/* Masonry Layout */}
            {loading ? (
              <div className="col-md-12 text-center">
                <p>Loading...</p>
              </div>
            ) : (
              <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
                <Masonry gutter="20px">
                  {gallery.map((item, index) => (
                    <div className="gallery-item" key={index}>
                      <div
                        className="img-zoom"
                        onClick={() => openLightbox(index)} // Open lightbox on click
                        style={{ cursor: "pointer" }}
                      >
                        <div className="gallery-box">
                          <div className="gallery-img">
                            <img
                              src={`${process.env.REACT_APP_API}/${item.image}`}
                              className="img-fluid mx-auto d-block"
                              alt={`gallery-img-${index}`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Masonry>
              </ResponsiveMasonry>
            )}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {isOpen && (
  <Lightbox
    open={isOpen}
    close={closeLightbox}
    slides={gallery.map(item => ({ src: `${process.env.REACT_APP_API}/${item.image}` }))}
    index={photoIndex}
    on={{
      close: closeLightbox,
      prev: () => setPhotoIndex((photoIndex + gallery.length - 1) % gallery.length),
      next: () => setPhotoIndex((photoIndex + 1) % gallery.length),
    }}
  />
)}
<Footer/>
    </>
  );
};

export default Gallery;