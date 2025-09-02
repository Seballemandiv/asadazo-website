import { useState } from 'react';
import { ShoppingCart, Menu, X, ArrowLeft, Send, Upload } from 'lucide-react';

interface OnRequestPageProps {
  cartCount: number;
  onCartClick: () => void;
  currentLanguage: 'en' | 'es' | 'nl';
  onLanguageChange: (lang: 'en' | 'es' | 'nl') => void;
}

const OnRequestPage: React.FC<OnRequestPageProps> = ({
  cartCount,
  onCartClick,
  currentLanguage,
  onLanguageChange
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cutName: '',
    additionalInfo: '',
    picture: null as File | null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' }
  ] as const;

  const goBack = () => {
    window.history.back();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        picture: file
      }));

      const reader = new FileReader();
      reader.onload = ev => {
        setPreviewImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // UPDATED: send via our serverless API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          cut: formData.cutName,
          notes: formData.additionalInfo,
          imageProvided: Boolean(formData.picture) // we are not sending the file; just indicating if one was attached
        })
      });

      setIsSubmitted(true);

      // Reset form after submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        cutName: '',
        additionalInfo: '',
        picture: null
      });
      setPreviewImage(null);
    } catch {
      alert('Something went wrong submitting your request. Please try again.');
    }
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
              <div className="logo-text" />
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
      <main className="on-request-page">
        <div className="container">
          <div className="on-request-content">
            <h1>Request Custom Cut</h1>

            <p className="page-description">
              If the cut you are looking for is not currently available, please submit your request.
              We will look it up and provide you with an update within 24–48 hours. Thank you for your inquiry.
            </p>

            {isSubmitted ? (
              <div className="success-message">
                <h2>Request Submitted!</h2>
                <p>Thank you for your request. We'll get back to you within 24 hours with availability and pricing information.</p>
                <button onClick={goBack} className="btn-primary">
                  Return to Home
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="request-form">
                {/* Picture Upload */}
                <div className="form-section">
                  <h2>Picture of the Cut</h2>
                  <div className="image-upload-area">
                    <input
                      type="file"
                      id="picture"
                      name="picture"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="file-input"
                    />
                    <label htmlFor="picture" className="file-upload-label">
                      <Upload size={32} />
                      <span>Click to upload a picture of the cut</span>
                      <span className="file-hint">(JPG, PNG, GIF up to 5MB)</span>
                    </label>
                    {previewImage && (
                      <div className="image-preview">
                        <img src={previewImage} alt="Preview" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Cut Name */}
                <div className="form-section">
                  <h2>Cut Details</h2>
                  <div className="form-group">
                    <label htmlFor="cutName">Name of the Cut *</label>
                    <input
                      type="text"
                      id="cutName"
                      name="cutName"
                      value={formData.cutName}
                      onChange={handleInputChange}
                      placeholder="e.g., Tira de Asado, Vacío, Entraña"
                      required
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="form-section">
                  <h2>Contact Information</h2>
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="additionalInfo">Additional Information</label>
                    <textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      value={formData.additionalInfo || ''}
                      onChange={handleInputChange}
                      placeholder="Any additional details about your request..."
                      rows={4}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    <Send size={20} />
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default OnRequestPage;
