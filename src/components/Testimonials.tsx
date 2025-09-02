import React from 'react';
import { Star, Instagram } from 'lucide-react';

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: "María González",
      text: "The best Argentine meat I've found in Amsterdam! The entraña was absolutely perfect for our asado.",
      rating: 5,
      location: "Amsterdam"
    },
    {
      id: 2,
      name: "Carlos Rodriguez",
      text: "Authentic flavors that remind me of home. The chorizo criollo is exactly like my grandmother's recipe.",
      rating: 5,
      location: "Rotterdam"
    },
    {
      id: 3,
      name: "Ana Silva",
      text: "Excellent quality and fast delivery. The molleja was a hit at our dinner party!",
      rating: 5,
      location: "Utrecht"
    }
  ];

  return (
    <div className="testimonials">
      <h2 className="text-center mb-lg">What Our Customers Say</h2>
      
      <div className="testimonials-grid">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="testimonial-card">
            <div className="rating">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} size={20} fill="gold" color="gold" />
              ))}
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-author">
              <strong>{testimonial.name}</strong>
              <span>{testimonial.location}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="social-section">
        <h3>Follow Our Journey</h3>
        <p>See our latest cuts and cooking tips on Instagram</p>
        <a href="https://instagram.com/asadazo" className="instagram-link" target="_blank" rel="noopener noreferrer">
          <Instagram size={24} />
          @asadazo
        </a>
      </div>


    </div>
  );
};

export default Testimonials;
