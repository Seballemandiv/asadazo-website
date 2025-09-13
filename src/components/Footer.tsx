const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        {/* Brand/About Column */}
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo.svg" alt="Asadazo" />
          </div>
          <p>Original Argentinian cuts, with the highest quality.</p>
        </div>

        {/* Shop Column */}
        <div className="footer-column">
          <h4>Shop</h4>
          <ul>
            <li><a href="#products">Signature Cuts</a></li>
            <li><a href="#subscriptions">Subscriptions</a></li>
            <li><a href="#gift-boxes">Boxes</a></li>
          </ul>
        </div>

        {/* Visit Column */}
        <div className="footer-column">
          <h4 className="cursive">Meat us</h4>
          <ul>
            <li><a href="#corporate">Corporate events</a></li>
            <li><a href="#social">Social events</a></li>
            <li><a href="#home">Private dinner</a></li>
          </ul>
        </div>

        {/* Contact Column */}
        <div className="footer-column">
          <h4>Contact</h4>
          <ul>
            <li>Amsterdam, The Netherlands</li>
            <li>Panamalaan 125, 1019 AS.</li>
            <li><a href="tel:+31627830723">+31 (0) 6 2783 0723</a></li>
            <li><a href="mailto:info@asadazo.nl">info@asadazo.nl</a></li>
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
