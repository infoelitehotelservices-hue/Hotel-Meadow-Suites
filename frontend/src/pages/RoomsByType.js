import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import ScrollToTop from "../components/ui/ProgessScroll";
import Preloader from "../components/ui/Preloader";
import AnimatedBox from "../components/ui/AnimatedBox";
import { message } from "antd";

const RoomById = () => {
  const { roomTypeId } = useParams(); // Get the roomTypeId from URL
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
        try {
          const response = await fetch(`${process.env.REACT_APP_API}/api/room/rooms/${roomTypeId}`);
          const data = await response.json();
          if (data.success && data.rooms) {
            setRooms(data.rooms);
          } else {
            setError("No rooms found for the selected criteria.");
          }
        } catch (error) {
          message.error("Error fetching rooms:", error);
          setError("Failed to fetch rooms. Please try again later.");
        } finally {
          setLoading(false);
        }
      };
    fetchRooms();
  }, [roomTypeId]);

  const handleNavigate = (id) => {
    navigate(`/rooms/${id}`);
  };


  return (
    <>
      <Navbar />
      <Preloader />
      <ScrollToTop/>
      <div className="banner-header section-padding valign bg-img bg-fixed" data-overlay-dark="4"  style={{backgroundImage : "url('/img/newroom/Deluxesingle.webp')"}}>
        <div className="container">
            <div className="row">
				<div className="col-md-12 caption mt-90">
				    <span>
                        <i className="star-rating"></i>
                        <i className="star-rating"></i>
                        <i className="star-rating"></i>
                        <i className="star-rating"></i>
                        <i className="star-rating"></i>
                    </span>
					<h5>Meadows Hotel & Suites</h5>
					<h1>Rooms & Suites</h1>
				</div>
			</div>
        </div>
    </div>

      {/* Rooms Section */}
      <section className="room-section-padding mt-5">
  <div className="container">
    {error && <p className="alert alert-danger">{error}</p>}
    {loading && <p className="loading-text">Loading rooms...</p>}
    <div className="row">
      {rooms && rooms.length > 0 ? (
        rooms.map((room, index) => (
          <div className={`col-md-12 ${index % 2 === 0 ? "left" : "right"}`} key={room._id}>
            <AnimatedBox effect="fadeInUp">
              <div className={`rooms2 mb-90 ${index % 2 === 0 ? "" : "left"}`}>
                <figure className="room-image-wrapper">
                  <img 
                    src={`${process.env.REACT_APP_API}/${room.images[0]}`} 
                    alt={room.name} 
                    className="img-fluid room-image" 
                  />
                </figure>
                <div className="room-caption">
                  <h3>
                    {room.pricePerNight}$ <span>/ Night</span>
                  </h3>
                  <h4>
                    <Link to={`/rooms/${room._id}`}>{room.name}</Link>
                  </h4>
                  <p className="room-description">{room.description}</p>
                  <div className="row room-facilities">
                    {room.amenities.map((amenity, index) => (
                      <div className="col-md-4" key={index}>
                        <ul>
                          <li>
                            <img 
                              src={`${process.env.REACT_APP_API}/${amenity.logo}`} 
                              alt={amenity.name} 
                              className="amenity-logo" 
                            />
                            {amenity.name}
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
                  <hr className="border-2" />
                  <div className="info-wrapper">
                    <div className="more">
                    <button onClick={() => handleNavigate(room._id)} className="link-btn" style={{background:'none',border:'none',padding:0,cursor:'pointer' , color : 'GrayText'}}>
                        Details <i className="ti-arrow-right"></i>
                      </button>
                    </div>
                    <div className="butn-dark">
                      <Link to={`/book-now/${room._id}`} data-scroll-nav="1">
                        <span>Book Now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedBox>
          </div>
        ))
      ) : (
        !loading && <p>No rooms found for the selected criteria.</p>
      )}
    </div>
  </div>
</section>
    </>
  );
};

export default RoomById;
