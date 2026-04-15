import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const useAnimateOnScroll = (animationEffect = "fadeInUp") => {
  const { ref, inView } = useInView({
    triggerOnce: true, // Animation runs once when the element comes into view
    threshold: 0.15, // Trigger when 15% of the element is visible
  });

  const [animatedClass, setAnimatedClass] = useState("");

  useEffect(() => {
    if (inView) {
      setAnimatedClass(`${animationEffect} animated`);
    }
  }, [inView, animationEffect]);

  return { ref, animatedClass };
};

export default useAnimateOnScroll;
