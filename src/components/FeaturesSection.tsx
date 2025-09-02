const FeaturesSection = () => {
  return (
    <section className="features-section">
      <div className="features-grid">
        <div className="feature-card dark">
          <span className="feature-icon">🎁</span>
          <h3 className="feature-title">Gift Boxes</h3>
          <p className="feature-description">
            Curated boxes with chimichurri, artisanal salts, and our most loved cuts.
          </p>
          <button className="feature-cta">Explore gifts</button>
        </div>

        <div className="feature-card light">
          <span className="feature-icon">📍</span>
          <h3 className="feature-title">Tasting Room</h3>
          <p className="feature-description">
            Book a private asado with our butcher-chef. Small groups, weekends only.
          </p>
          <button className="feature-cta">Reserve</button>
        </div>

        <div className="feature-card dark">
          <span className="feature-icon">🚚</span>
          <h3 className="feature-title">Subscriptions</h3>
          <p className="feature-description">
            Monthly selections shipped on ice. Pause or swap cuts anytime.
          </p>
          <button className="feature-cta">Browse plans</button>
        </div>
      </div>

      <div className="newsletter-section">
        <div className="newsletter-card">
          <h2 className="newsletter-title">Get fire-worthy recipes & early cuts</h2>
          <p className="newsletter-description">Join our butcher's list—no spam, just smoke.</p>
          <form className="newsletter-form">
            <input 
              type="email" 
              placeholder="your@email.com" 
              className="newsletter-input"
              required
            />
            <button type="submit" className="newsletter-button">Join</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
