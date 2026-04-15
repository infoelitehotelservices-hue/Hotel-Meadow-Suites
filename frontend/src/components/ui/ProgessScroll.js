import React, { useEffect, useState } from "react";
import $ from "jquery";
import "../../assets/css/progressscroll.css"; 

const ScrollToTop = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const progressPath = document.querySelector(".progress-wrap path");

        if (progressPath) {
            const pathLength = progressPath.getTotalLength();
            progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
            progressPath.style.strokeDashoffset = pathLength;

            const updateProgress = () => {
                const scroll = $(window).scrollTop();
                const height = $(document).height() - $(window).height();
                const progress = pathLength - (scroll * pathLength / height);
                progressPath.style.strokeDashoffset = progress;
            };

            const handleScroll = () => {
                updateProgress();
                if ($(window).scrollTop() > 150) {
                    setVisible(true);
                } else {
                    setVisible(false);
                }
            };

            $(window).on("scroll", handleScroll);
            updateProgress();

            return () => {
                $(window).off("scroll", handleScroll);
            };
        }
    }, []);

    const scrollToTop = (event) => {
        event.preventDefault();
        $("html, body").animate({ scrollTop: 0 }, 550);
    };

    return (
        <div
            className={`progress-wrap ${visible ? "active-progress" : ""}`}
            onClick={scrollToTop}
        >
            <svg className="progress-circle" width="100%" height="100%" viewBox="-1 -1 102 102">
                <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
            </svg>
        </div>
    );
};

export default ScrollToTop;
