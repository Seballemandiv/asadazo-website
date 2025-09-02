import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="section section-beige">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <h2>Original Argentinian Cuts</h2>
            <p>
              At Asadazo, we bring the authentic flavors of Argentina to Amsterdam. 
              Our passion for traditional asado cuts and premium meat selection comes 
              from generations of expertise in Argentine cuisine.
            </p>
            <p>
              We source only the finest cuts, following traditional Argentine butchery 
              techniques that have been perfected over centuries. From the tender 
              entraña to the flavorful vacío, each cut tells a story of the pampas 
              and the gaucho tradition.
            </p>
            <div className="about-features">
              <div className="feature">
                <h4>Traditional Cuts</h4>
                <p>Authentic Argentine butchery techniques</p>
              </div>
              <div className="feature">
                <h4>Premium Quality</h4>
                <p>Carefully selected and aged meat</p>
              </div>
              <div className="feature">
                <h4>Expert Knowledge</h4>
                <p>Years of experience in Argentine cuisine</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img 
              src="https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Argentine meat cuts"
            />
          </div>
        </div>
      </div>


    </section>
  );
};

export default About;
