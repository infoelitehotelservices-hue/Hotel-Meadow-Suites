import React from "react";
import useAnimateOnScroll from "../../hook/useAnimateOnScroll";

const AnimatedBox = ({ effect = "fadeInUp", children }) => {
  const { ref, animatedClass } = useAnimateOnScroll(effect);

  return (
    <div ref={ref} className={`animate-box ${animatedClass}`}>
      {children}
    </div>
  );
};

export default AnimatedBox;
