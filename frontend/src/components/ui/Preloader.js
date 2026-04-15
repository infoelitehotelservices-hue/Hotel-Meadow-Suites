import React, { useEffect, useState } from "react";

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a loading delay (e.g., API calls or page load)
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  return (
    loading && (
      <div className="preloader-bg">
        <div id="preloader">
          <div id="preloader-status">
            <div className="preloader-position loader">
              <span></span>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Preloader;
