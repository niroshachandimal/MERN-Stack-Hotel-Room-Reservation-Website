// Footer.jsx
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content container">
        <div className="footer-left">
          <img src="/images/logo2.png" alt="Serene Hills" className="logo" />
          <div className="socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src="/images/instagram.png" alt="Instagram" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src="/images/twitter.png" alt="Twitter" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="/images/facebook.png" alt="Facebook" />
            </a>
          </div>
        </div>
        <div className="footer-right">
          <h3>Contact</h3>
          <p><strong>Address:</strong><br />No. 25, Misty Valley Road, Elle, Badulla, Sri Lanka.</p>
          <p><strong>Email:</strong><br />reservationsserenehillshotel@gmail.com</p>
          <p><strong>Phone:</strong><br />+94 55 225 6789</p>
        </div>
      </div>
      <div className="footer-bottom">
        © 2025 Serene Hills. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
