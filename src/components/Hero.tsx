const Hero = () => {
  const handleShopCuts = () => {
    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookTasting = () => {
    // Navigate to contact page
    window.location.href = '/contact';
  };

  const handleOrderNow = () => {
    // Scroll to products section
    const productsSection = document.getElementById('products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      <div className="hero-container">
        {/* Left Content */}
        <div className="hero-content">
          <div className="hero-badge">
            Grass-fed • Pasture-raised • Grain-fed • Halal
          </div>
          
          <h1 className="hero-title">
            <span className="line-1">Boutique meat,</span>
            <span className="line-2">cut the Argentinian <span className="nowrap">way</span></span>
          </h1>
          
          <p className="hero-sub">
            Entraña, vacío, matambre de cerdo, achuras and more.
          </p>
          
          <div className="hero-ctas">
            <button className="btn-primary" onClick={handleShopCuts}>
              Shop Signature Cuts
            </button>
            <button className="btn-outline" onClick={handleBookTasting}>
              Book a tasting
            </button>
          </div>
        </div>

        {/* Right Promo Card */}
        <div className="promo">
          <div className="promo-badge">
            Cut to order today
          </div>
          
          <h3 className="promo-title">Boutique</h3>
          <p className="promo-description">This week's featured cut with special pricing</p>
          
          <div className="promo-price">
            <span className="promo-old-price">€45</span>
            <span className="promo-new-price">€38</span>
            <span className="promo-discount">-15%</span>
          </div>
          
          <button className="promo-cta" onClick={handleOrderNow}>
            Order Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
