import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      id: 1,
      question: "What are the delivery areas?",
      answer: "We deliver throughout Amsterdam with a €15 delivery fee. Free delivery for orders over €80. For other areas, please contact us for pricing and availability.",
      category: "delivery"
    },
    {
      id: 2,
      question: "How long does delivery take?",
      answer: "Standard delivery within Amsterdam takes 24-48 hours. We'll contact you to confirm your preferred delivery time.",
      category: "delivery"
    },
    {
      id: 3,
      question: "Can I pick up my order?",
      answer: "Yes! Pickup is available at our location in Amsterdam Oost. It's free and always available. We'll contact you when your order is ready.",
      category: "delivery"
    },
    {
      id: 4,
      question: "What allergens are in your products?",
      answer: "Our meat products are naturally gluten-free. However, some sausages may contain spices and seasonings. Please contact us for specific allergen information.",
      category: "allergens"
    },
    {
      id: 5,
      question: "How should I store the meat?",
      answer: "Keep refrigerated at 2-4°C and consume within 3-5 days. For longer storage, freeze immediately and consume within 3 months for best quality.",
      category: "products"
    },
    {
      id: 6,
      question: "What's your refund policy?",
      answer: "We guarantee the quality of our products. If you're not satisfied, contact us within 24 hours of delivery for a refund or replacement.",
      category: "general"
    },
    {
      id: 7,
      question: "Do you offer corporate orders?",
      answer: "Yes! We provide special pricing and delivery for corporate orders and events. Contact us for custom quotes and arrangements.",
      category: "general"
    },
    {
      id: 8,
      question: "Are your products halal?",
      answer: "Currently, our products are not certified halal. Please contact us if you have specific dietary requirements.",
      category: "products"
    }
  ];

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="faq">
      <h2 className="text-center mb-lg">Frequently Asked Questions</h2>
      
      <div className="faq-categories">
        <button className="category-btn active">All Questions</button>
        <button className="category-btn">Delivery</button>
        <button className="category-btn">Products</button>
        <button className="category-btn">Allergens</button>
      </div>
      
      <div className="faq-list">
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-item">
            <button 
              className="faq-question"
              onClick={() => toggleItem(faq.id)}
            >
              <span>{faq.question}</span>
              {openItems.includes(faq.id) ? (
                <ChevronUp size={20} />
              ) : (
                <ChevronDown size={20} />
              )}
            </button>
            {openItems.includes(faq.id) && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="faq-contact">
        <p>Can't find what you're looking for?</p>
        <a href="#contact" className="btn-primary">Contact Us</a>
      </div>


    </div>
  );
};

export default FAQ;
