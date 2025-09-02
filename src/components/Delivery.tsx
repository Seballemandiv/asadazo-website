import React from 'react';

const Delivery: React.FC = () => {
  return (
    <section id="faq" className="section">
      <div className="container">
        <h2 className="text-center mb-lg">FAQ</h2>

        <div className="faq-section">
          <div className="faq-card">
            <h3>Amsterdam Delivery</h3>
            <ul>
              <li>€15 delivery fee</li>
              <li>Free delivery for orders over €80</li>
              <li>Delivery within 24–48 hours</li>
            </ul>
          </div>

          <div className="faq-card">
            <h3>Pickup Option</h3>
            <ul>
              <li>Amsterdam Oost</li>
              <li>Always available</li>
              <li>No additional cost</li>
            </ul>
          </div>

          <div className="faq-card">
            <h3>Other Areas</h3>
            <ul>
              <li>Delivery by consultation</li>
              <li>Contact us for pricing</li>
              <li>Custom delivery times</li>
            </ul>
          </div>

          <div className="faq-card">
            <h3>Cold Chain & Packaging</h3>
            <p>
              All our products are carefully packaged to maintain the perfect temperature during transport. 
              We use specialized insulated packaging to ensure your meat arrives in perfect condition.
            </p>
            <ul>
              <li>Temperature monitoring</li>
              <li>Fresh delivery guarantee</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Delivery;
