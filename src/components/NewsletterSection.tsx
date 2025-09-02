import { useState } from 'react';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Newsletter signup:', email);
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <h2>Get fire-worthy recipes & early cuts</h2>
            <p>Join our butcher's list—no spam, just smoke.</p>
          </div>
          <form onSubmit={handleSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary">
              Join
            </button>
          </form>
          {isSubmitted && (
            <div className="newsletter-success">
              <p>Thanks for subscribing! Check your email for confirmation.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
