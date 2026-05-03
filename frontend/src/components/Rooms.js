import React, { useState, useEffect } from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import "../assets/css/owl_caruosal.css";
import "../assets/css/rooms.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Rooms = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Owl Carousel settings
  const options = {
    loop: true,
    margin: 30,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    autoplayTimeout: 5000,
    autoplayHoverPause: true,
    dots: true,
    nav: true,
    navText: [
      '<i class="ti-angle-left" aria-label="Previous"></i>',
      '<i class="ti-angle-right" aria-label="Next"></i>',
    ],
    smartSpeed: 800,
    responsive: {
      0: { 
        items: 1,
        nav: true,
        dots: true,
      },
      600: { 
        items: 2,
        nav: true,
        dots: true,
      },
      1000: { 
        items: 3,
        nav: true,
        dots: true,
      },
    },
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_API}/api/roomtype/get-roomtype`);
      if (response.data.status) {
        // Fetch a sample room for each room type to display
        const roomTypesWithSamples = await Promise.all(
          response.data.roomtypes.map(async (roomType) => {
            try {
              const roomsResponse = await axios.get(
                `${process.env.REACT_APP_API}/api/room/rooms/${roomType._id}`
              );
              const sampleRoom = roomsResponse.data.rooms?.[0] || null;
              return {
                ...roomType,
                sampleRoom,
              };
            } catch (error) {
              console.error(`Error fetching rooms for type ${roomType.name}:`, error);
              return {
                ...roomType,
                sampleRoom: null,
              };
            }
          })
        );
        setRoomTypes(roomTypesWithSamples);
      }
    } catch (error) {
      console.error("Error fetching room types:", error);
    } finally {
      setLoading(false);
    }
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
            {loading ? (
              <div className="text-center text-white">
                <p>Loading rooms...</p>
              </div>
            ) : roomTypes.length === 0 ? (
              <div className="text-center text-white">
                <p>No room types available at the moment.</p>
              </div>
            ) : (
              <OwlCarousel className="owl-theme" {...options}>
                {roomTypes.map((roomType) => {
                  const room = roomType.sampleRoom;
                  const imageUrl = room?.images?.[0]
                    ? `${process.env.REACT_APP_API}/${room.images[0]}`
                    : "/img/newroom/Executiveroom.webp"; // Fallback image
                  const price = room?.discountprice || room?.pricePerNight || "N/A";
                  const roomName = room?.name || roomType.name;

                  return (
                    <div className="item" key={roomType._id}>
                      <div className="position-re o-hidden">
                        <img
                          src={imageUrl}
                          alt={roomName}
                          onError={(e) => {
                            e.target.src = "/img/newroom/Executiveroom.webp";
                          }}
                        />
                      </div>
                      <span className="category">
                        <Link to={`/roomsbytype/${roomType._id}`}>Book</Link>
                      </span>
                      <div className="con">
                        <h6>
                          <Link to={`/roomsbytype/${roomType._id}`}>
                            {price !== "N/A" ? `PKR. ${price} / Night` : "Contact for Price"}
                          </Link>
                        </h6>
                        <h5>
                          <Link to={`/roomsbytype/${roomType._id}`}>{roomName}</Link>
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
                              <Link to={`/roomsbytype/${roomType._id}`}>
                                Details <i className="ti-arrow-right"></i>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </OwlCarousel>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rooms;
