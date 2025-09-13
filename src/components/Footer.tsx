const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand/About Column */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo.png" alt="Asadazo" />
            <h3>Asadazo</h3>
          </div>
          <p>Original Argentinian cuts, butchered in the classic porteño style.</p>
        </div>

        {/* Shop Column */}
        <div className="footer-column">
          <h4>Shop</h4>
          <ul>
            <li><a href="#products">Signature Cuts</a></li>
            <li><a href="#gift-boxes">Boxes</a></li>
            <li><a href="#subscriptions">Subscriptions</a></li>
          </ul>
        </div>

        {/* Visit Column */}
        <div className="footer-column">
          <h4>Visit</h4>
          <ul>
            <li><a href="#showroom">Showroom & Tastings</a></li>
            <li><a href="/about">Our Story</a></li>
            <li><a href="#journal">Journal</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-column">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:allemandi.Sebastian@expandam.nl">allemandi.Sebastian@expandam.nl</a></li>
            <li><a href="tel:+31612345678">+31 (0) 6 12345678</a></li>
            <li>Amsterdam Oost, Netherlands</li>
          </ul>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p className="footer-copyright">© 2024 Asadazo. All rights reserved.</p>
        <p className="footer-tagline">Designed with espresso, malbec & golden beige.</p>
      </div>
    </footer>
  );
};

export default Footer;
