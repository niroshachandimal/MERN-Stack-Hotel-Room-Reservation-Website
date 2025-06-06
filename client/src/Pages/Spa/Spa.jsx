// FILE: client/src/Pages/Spa/Spa.jsx

import "./spa.styles.scss";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";


const Spa = () => {
  return (
    <div className="spa-page">
      <Helmet>
        <title>Spa & Wellness</title>
      </Helmet>
      <section className="spa-hero">
        <img src="/images/spa/spa-hero.jpg" alt="Spa Hero" />
        <div className="hero-text">
          <h1>SPA & WELLNESS</h1>
          <p>Find harmony at our tropical hillside retreat in Ella, Sri Lanka</p>
        </div>
      </section>

      <motion.section className="spa-intro" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
        <div className="spa-overview container">
          <img src="/images/spa/spa-lobby.jpg" alt="Spa Lobby" />
          <div>
            <h2>A Serene Escape</h2>
            <p>
              Experience a sanctuary of peace surrounded by the lush beauty of Ella. Serene Hills offers holistic spa rituals drawing on ancient healing traditions from Sri Lanka and across Asia. Enjoy herbal therapies, Ayurvedic treatments, and rejuvenating wellness programs in an idyllic mountain setting.
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section className="spa-facilities container" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h2>SPA FACILITIES</h2>
        <ul>
          <li>5 Private Treatment Suites</li>
          <li>Ayurvedic Consultation Room</li>
          <li>Steam & Sauna Chambers</li>
          <li>Relaxation Lounge with Herbal Teas</li>
          <li>Outdoor Massage Pavilion</li>
          <li>Essential Oil Bath Ritual Room</li>
        </ul>
      </motion.section>

      <motion.section className="spa-gallery container" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }}>
        <h2>Gallery</h2>
        <div className="grid">
          <img src="/images/spa/spa-room1.jpg" alt="Room" />
          <img src="/images/spa/spa-treatment1.jpg" alt="Massage" />
          <img src="/images/spa/spa-yoga.jpg" alt="Yoga" />
        </div>
      </motion.section>

      <motion.section className="spa-treatment container" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
        <h2>SIGNATURE TREATMENTS</h2>
        <div className="treatment-block">
          <div>
            <h3>Serene Ceylon Ritual (120 mins)</h3>
            <p>
              A full-body detox and balance experience using herbal oils, warm stones and coconut scrubs. Ends with a tranquil scalp massage.
            </p>
          </div>
          <div>
            <h3>Ayurveda Bliss (90 mins)</h3>
            <p>
              Ayurvedic marma massage combined with steam therapy and warm poultice healing to stimulate vital energy.
            </p>
          </div>
        </div>
      </motion.section>

   
    </div>
  );
};

export default Spa;
