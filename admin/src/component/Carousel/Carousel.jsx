import { useEffect, useState } from "react";
import "./carousel.styles.scss";

const Carousel = ({ data }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data || data.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === data.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  if (!data || data.length === 0) {
    return null; // or show a placeholder image
  }

  return (
    <div className="carousel-wrapper">
      <img src={data[currentIndex]} alt="Room" />
    </div>
  );
};

export default Carousel;
