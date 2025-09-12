import { useState } from 'react';
import { ShoppingCart, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import Cart from './Cart';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <img src="/images/NEW_LOGO.png" alt="Asadazo" />
        </div>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <Link to="/" className="nav-link" aria-current={isActive('/') ? 'page' : undefined}>Home</Link>
          <Link to="/products" className="nav-link" aria-current={isActive('/products') ? 'page' : undefined}>Products</Link>
          <Link to="/about" className="nav-link" aria-current={isActive('/about') ? 'page' : undefined}>About Us</Link>
          <Link to="/contact" className="nav-link" aria-current={isActive('/contact') ? 'page' : undefined}>Contact</Link>
          <Link to="/on-request" className="nav-link" aria-current={isActive('/on-request') ? 'page' : undefined}>On Request</Link>
          <Link to="/faq" className="nav-link" aria-current={isActive('/faq') ? 'page' : undefined}>FAQ</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="header-actions">
          {/* Language Selector */}
          <div className="language-selector">
            <select 
              className="language-dropdown"
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
            >
              <option value="EN">🇺🇸</option>
              <option value="ES">🇪🇸</option>
              <option value="NL">🇳🇱</option>
            </select>
          </div>

          {/* User Menu */}
          {user ? (
            <div className="user-menu-container">
              <button 
                className="user-menu-button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <User size={20} />
                <span>Account</span>
                <ChevronDown size={16} />
              </button>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <Link to="/account" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <User size={16} />
                    Account
                  </Link>
                  <Link to="/account" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <ShoppingCart size={16} />
                    Orders
                  </Link>
                  <Link to="/account" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                    <User size={16} />
                    Personal Information
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setIsUserMenuOpen(false)}>
                      <User size={16} />
                      Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout-item">
                    <User size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="login-button">Log in</Link>
          )}

          {/* Cart */}
          <button className="cart-button" onClick={handleCartClick}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <nav className="mobile-nav open">
          <Link to="/" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
          <Link to="/about" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
          <Link to="/contact" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
          <Link to="/on-request" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>On Request</Link>
          <Link to="/faq" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
          
          {user ? (
            <>
              <Link to="/account" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
              <Link to="/account" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
              <Link to="/account" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Personal Information</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Admin Panel</Link>
              )}
              <button onClick={handleLogout} className="mobile-nav-link logout-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="mobile-nav-link" onClick={() => setIsMobileMenuOpen(false)}>Log in</Link>
          )}
        </nav>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <Cart onClose={closeCart} />
      )}
    </header>
  );
};

export default Header;
