// FILE: client/src/Pages/Home/Home.jsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

import "./home.styles.scss";

const images = [
  "/images/carousel1.webp",
  "/images/carousel2.jpg",
  "/images/carousel3.jpg",
  "/images/carousel4.jpg",
  "/images/carousel5.jpg",
];

const services = [
  {
    title: "Basic Facilities",
    icon: "/images/facilities.png",
    items: ["Room Services", "House Keeping", "Wi-Fi & Parking"],
  },
  {
    title: "Room Amenities",
    icon: "/images/amenities.png",
    items: ["Comfortable Bedding", "Bed Room and Pool", "TV, AC", "Bar"],
  },
  {
    title: "Dining Options",
    icon: "/images/dining.png",
    items: ["Bar & Lounge", "Cafe & Canteen", "Room Service"],
  },
  {
    title: "Special Features",
    icon: "/images/special.png",
    items: ["Gym", "Spa"],
  },
];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const nextImage = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % images.length);
      setFade(true);
    }, 300);
  };

  const prevImage = () => {
    setFade(false);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
      setFade(true);
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    
    <div className="homepage">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="carousel">
        <img
          src={images[index]}
          alt="cover"
          className={`carousel-img ${fade ? "fade-in" : "fade-out"}`}
        />
        <button className="prev" onClick={prevImage}>❮</button>
        <button className="next" onClick={nextImage}>❯</button>

        <div className="dots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`dot ${i === index ? "active" : ""}`}
              onClick={() => {
                setFade(false);
                setTimeout(() => {
                  setIndex(i);
                  setFade(true);
                }, 300);
              }}
            ></span>
          ))}
        </div>
      </div>

      <motion.section
  className="intro container"
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  viewport={{ once: true }}
>
  <h1>
    EXPERIENCE TRANQUILITY & COMFORT at <span>SERENE HILLS</span> - YOUR PERFECT GETWAY in ELLA!
  </h1>
  <p>
    Nestled in the scenic beauty near Ella, Serene Hills Hotel blends natural luxury and elegance, perfect for travelers seeking peace, comfort, or adventure. With modern facilities, beautiful views, and exceptional service, your stay will be nothing short of extraordinary.
  </p>
</motion.section>

      <section className="services container">
        <h2>
          Our Best <span>Services</span>
        </h2>
        <div className="cards">
          {services.map((s, i) => (
            <motion.div
              key={i}
              className="card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
            >
              <img src={s.icon} alt={s.title} />
              <h3>{s.title}</h3>
              <ul>
                {s.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

    <motion.section
  className="spa container"
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
  viewport={{ once: true }}
>
  <div className="spa-wrapper">
    <img src="/images/spa.jpg" alt="Spa at Serene Hills" />
    <div className="spa-overlay">
      <h3>Rejuvenate at Our Signature Spa</h3>
      <p>Immerse yourself in serenity with tailored therapies and calming treatments in a peaceful mountain setting.</p>
      <Link to="/spa" className="spa-btn">Explore Spa</Link>
    </div>
  </div>
</motion.section>

    </div>
  );
};

export default Home;
