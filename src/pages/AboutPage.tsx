import { useState } from 'react';
import { ShoppingCart, Menu, X, ArrowLeft } from 'lucide-react';

interface AboutPageProps {
  cartCount: number;
  onCartClick: () => void;
  currentLanguage: 'en' | 'es' | 'nl';
  onLanguageChange: (lang: 'en' | 'es' | 'nl') => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ 
  cartCount, 
  onCartClick, 
  currentLanguage, 
  onLanguageChange 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
  ] as const;

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="flex-between">
            {/* Logo */}
            <div className="logo">
              <div className="logo-icon">
                <img src="/Logo full.svg" alt="Asadazo Logo" className="logo-image" />
              </div>
              <div className="logo-text">
              </div>
            </div>

            {/* Back Button */}
            <button onClick={goBack} className="back-button">
              <ArrowLeft size={20} />
              Back
            </button>

            {/* Language Switcher */}
            <div className="language-switcher">
              <select 
                value={currentLanguage}
                onChange={(e) => onLanguageChange(e.target.value as 'en' | 'es' | 'nl')}
                className="language-select"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Cart */}
            <button className="cart-button" onClick={onCartClick}>
              <ShoppingCart size={24} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="about-page">
        <div className="container">
          <div className="about-page-content">
            <h1>About Us</h1>
            
                         <div className="about-section">
               <p>
                 It all started as a dream — and soon became a bit of madness. We are Asadazo, a group of friends, family, and partners who share one passion: keeping the fire of the Argentinian asado alive, even far from home.
               </p>
               
               <p>
                 In Argentina, Sundays mean asado. It's not just about food — it's the ritual of gathering, of laughter that lingers in the air, of stories told while the fire crackles. It's the smell of smoke that stays on your clothes, the taste of meat sizzling slowly, the clink of glasses, the warmth of being together. That's the culture we grew up with, and the one we missed when we moved abroad.
               </p>
               
               <p>
                 Here in the Netherlands, we decided to bring that spirit with us. To introduce not only traditional Argentinian cuts that are hard to find here, but also the soul behind them — the sense of community, of friendship, of celebration. At Asadazo, everyone who works with us is more than a colleague; we're a family, bound together by fire, knives, and good humor.
               </p>
               
               <p>
                 And if you can't be with us at one of our asadazos — sharing the fire, the meat, and maybe a game of truco — you can still be part of it. Through our webshop, you'll find the same Argentinian cuts we put on the grill, ready for you to enjoy at home. So light up your parrilla, invite your friends, pour some wine, and let the asado spirit live on wherever you are.
               </p>
               
               <p>
                 Asadazo is our way of saying: pull up a chair, grab a plate, and be part of the family — whether here with us, or at your own table.
               </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
