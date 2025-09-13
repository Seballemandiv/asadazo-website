import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Check, Calendar, Package, MapPin, ShoppingCart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { SubscriptionProduct, Address, Product } from '../types';
import { products } from '../data/products';
import Toast from '../components/Toast';

const SubscriptionPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    type: '' as '' | 'weekly' | 'biweekly' | 'triweekly' | 'monthly',
    frequency: '' as '' | 'weekly' | 'biweekly' | 'triweekly' | 'monthly',
    totalWeight: 0,
    deliveryMethod: '' as '' | 'pickup' | 'delivery',
    deliveryAddress: {
      street: '',
      number: '',
      city: '',
      region: '',
      postalCode: '',
      country: 'Netherlands'
    } as Address,
    selectedProducts: [] as SubscriptionProduct[],
    notes: ''
  });

  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  const steps = [
    { number: 1, title: 'Choose Frequency', icon: <Calendar size={20} /> },
    { number: 2, title: 'Select Weight', icon: <Package size={20} /> },
    { number: 3, title: 'Delivery Method', icon: <MapPin size={20} /> },
    { number: 4, title: 'Choose Cuts', icon: <ShoppingCart size={20} /> },
    { number: 5, title: 'Review & Confirm', icon: <Check size={20} /> }
  ];

  // Load products when type changes
  useEffect(() => {
    if (formData.type) {
      loadProducts();
    }
  }, [formData.type]);

  const loadProducts = () => {
    // Filter products that are available for subscription (meat products)
    const meatProducts = products.filter(product => 
      product.category === 'meat' && product.stock > 0
    );
    setAvailableProducts(meatProducts);
  };


  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTypeSelect = (type: 'weekly' | 'biweekly' | 'triweekly' | 'monthly') => {
    setFormData(prev => ({
      ...prev,
      type,
      totalWeight: 0, // Let user input their own weight
      frequency: type
    }));
  };

  const handleWeightChange = (weight: number) => {
    setFormData(prev => ({
      ...prev,
      totalWeight: weight
    }));
  };

  const handleDeliveryMethod = (method: 'pickup' | 'delivery') => {
    setFormData(prev => ({
      ...prev,
      deliveryMethod: method
    }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [field]: value
      }
    }));
  };

  const handleProductSelect = (product: { productId: string; productName: string; price: number }, weight: number) => {
    const existingIndex = formData.selectedProducts.findIndex(p => p.productId === product.productId);
    
    if (existingIndex >= 0) {
      // Update existing product
      const updated = [...formData.selectedProducts];
      updated[existingIndex] = {
        ...updated[existingIndex],
        weight: weight
      };
      setFormData(prev => ({
        ...prev,
        selectedProducts: updated
      }));
    } else {
      // Add new product
      setFormData(prev => ({
        ...prev,
        selectedProducts: [
          ...prev.selectedProducts,
          {
            productId: product.productId,
            productName: product.productName,
            weight: weight,
            price: product.price,
            isSuggestion: true
          }
        ]
      }));
    }
  };

  const removeProduct = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter(p => p.productId !== productId)
    }));
  };

  const getTotalWeight = () => {
    return formData.selectedProducts.reduce((sum, product) => sum + product.weight, 0);
  };

  const getTotalPrice = () => {
    return formData.selectedProducts.reduce((sum, product) => sum + (product.price * product.weight), 0);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.type !== '';
      case 2: return formData.totalWeight > 0;
      case 3: return formData.deliveryMethod !== '' && (formData.deliveryMethod === 'pickup' || 
        (formData.deliveryAddress.street && formData.deliveryAddress.city && formData.deliveryAddress.postalCode));
      case 4: return formData.selectedProducts.length > 0 && Math.abs(getTotalWeight() - formData.totalWeight) < 0.1;
      case 5: return true;
      default: return false;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          selectedProducts: formData.selectedProducts,
          frequency: formData.frequency,
          deliveryAddress: formData.deliveryAddress,
          pickupOption: formData.deliveryMethod === 'pickup',
          notes: formData.notes,
          userEmail: user?.email || 'guest@asadazo.nl' // Use user email if logged in, otherwise guest
        })
      });

      if (response.ok) {
        setToast({ message: 'Subscription created successfully! It will be reviewed shortly.', type: 'success' });
        setTimeout(() => {
          if (user) {
            navigate('/account');
          } else {
            navigate('/');
          }
        }, 2000);
      } else {
        const error = await response.json();
        setToast({ message: error.error || 'Failed to create subscription', type: 'error' });
      }
    } catch (error) {
      setToast({ message: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3>Choose your subscription frequency</h3>
            <div className="option-grid">
              <button
                className={`option-card ${formData.type === 'weekly' ? 'selected' : ''}`}
                onClick={() => handleTypeSelect('weekly')}
              >
                <Calendar size={32} />
                <h4>Weekly</h4>
                <p>Fresh cuts every week</p>
              </button>
              <button
                className={`option-card ${formData.type === 'biweekly' ? 'selected' : ''}`}
                onClick={() => handleTypeSelect('biweekly')}
              >
                <Calendar size={32} />
                <h4>Every 2 weeks</h4>
                <p>Fresh cuts every two weeks</p>
              </button>
              <button
                className={`option-card ${formData.type === 'triweekly' ? 'selected' : ''}`}
                onClick={() => handleTypeSelect('triweekly')}
              >
                <Calendar size={32} />
                <h4>Every 3 weeks</h4>
                <p>Fresh cuts every three weeks</p>
              </button>
              <button
                className={`option-card ${formData.type === 'monthly' ? 'selected' : ''}`}
                onClick={() => handleTypeSelect('monthly')}
              >
                <Calendar size={32} />
                <h4>Monthly</h4>
                <p>Premium selection monthly</p>
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h3>Select Total Weight</h3>
            <div className="weight-input">
              <label>Total Weight (kg)</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.totalWeight || ''}
                  onChange={(e) => handleWeightChange(parseFloat(e.target.value) || 0)}
                  placeholder="Enter weight in kg"
                />
              <p className="weight-hint">
                {formData.type === 'weekly' ? 'Recommended: 2-6kg for weekly delivery' : 
                 formData.type === 'biweekly' ? 'Recommended: 4-8kg for bi-weekly delivery' :
                 formData.type === 'triweekly' ? 'Recommended: 6-12kg for tri-weekly delivery' :
                 formData.type === 'monthly' ? 'Recommended: 8-15kg for monthly delivery' : 
                 'Choose any amount that works for you'}
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h3>Choose Delivery Method</h3>
            <div className="delivery-options">
              <button
                className={`delivery-option ${formData.deliveryMethod === 'pickup' ? 'selected' : ''}`}
                onClick={() => handleDeliveryMethod('pickup')}
              >
                <MapPin size={32} />
                <h4>Pickup</h4>
                <p>Collect from our location in Amsterdam</p>
                <span className="price">Free</span>
              </button>
              <button
                className={`delivery-option ${formData.deliveryMethod === 'delivery' ? 'selected' : ''}`}
                onClick={() => handleDeliveryMethod('delivery')}
              >
                <MapPin size={32} />
                <h4>Delivery</h4>
                <p>We deliver anywhere in the Netherlands</p>
                <span className="price">From €10</span>
              </button>
            </div>

            {formData.deliveryMethod === 'delivery' && (
              <div className="delivery-guidelines">
                <h4>Delivery Guidelines</h4>
                <div className="guidelines-content">
                  <div className="guideline-section">
                    <h5>Amsterdam Delivery:</h5>
                    <ul>
                      <li><strong>Inside the ring:</strong> €10 (Minimum order 1kg. Orders €80+ = free delivery)</li>
                      <li><strong>Outside the ring:</strong> €20 (Minimum order €80. Orders €160+ = free delivery)</li>
                    </ul>
                  </div>
                  <div className="guideline-section">
                    <h5>Outside Amsterdam:</h5>
                    <ul>
                      <li><strong>Rate:</strong> €1 per kilometer from Amsterdam</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {formData.deliveryMethod === 'delivery' && (
              <div className="address-form">
                <h4>Delivery Address</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Street</label>
                    <input
                      type="text"
                      value={formData.deliveryAddress.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Number</label>
                    <input
                      type="text"
                      value={formData.deliveryAddress.number}
                      onChange={(e) => handleAddressChange('number', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={formData.deliveryAddress.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input
                      type="text"
                      value={formData.deliveryAddress.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <select
                      value={formData.deliveryAddress.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                    >
                      <option value="Netherlands">Netherlands</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h3>Choose Your Cuts</h3>
            <div className="weight-summary">
              <p>Target: {formData.totalWeight}kg | Selected: {getTotalWeight().toFixed(1)}kg</p>
              {Math.abs(getTotalWeight() - formData.totalWeight) > 0.1 && (
                <p className="weight-warning">
                  {getTotalWeight() > formData.totalWeight ? 'Over target by' : 'Under target by'} {Math.abs(getTotalWeight() - formData.totalWeight).toFixed(1)}kg
                </p>
              )}
            </div>
            
            <div className="products-section">
              <h4>Available Cuts</h4>
              <div className="products-grid">
                {availableProducts.map((product) => (
                  <div key={product.id} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} loading="lazy" />
                    </div>
                    <div className="product-info">
                      <h5>{product.name}</h5>
                      <p className="product-description">{product.description}</p>
                      <div className="product-price">€{product.price}/kg</div>
                    </div>
                    <div className="product-actions">
                      <input
                        type="number"
                        min="0"
                        max={formData.totalWeight}
                        step="0.5"
                        placeholder="Weight (kg)"
                        onChange={(e) => handleProductSelect({
                          productId: product.id,
                          productName: product.name,
                          price: product.price
                        }, parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {formData.selectedProducts.length > 0 && (
              <div className="selected-products">
                <h4>Selected Products</h4>
                <div className="selected-list">
                  {formData.selectedProducts.map((product, index) => (
                    <div key={index} className="selected-item">
                      <span>{product.productName} - {product.weight}kg (€{(product.weight * product.price).toFixed(2)})</span>
                      <button onClick={() => removeProduct(product.productId)}>Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="step-content">
            <h3>Review Your Subscription</h3>
            <div className="review-summary">
              <div className="summary-card">
                <h4>Subscription Details</h4>
                <div className="summary-item">
                  <span>Type:</span>
                  <span>{formData.type === 'weekly' ? 'Weekly' : formData.type === 'monthly' ? 'Monthly' : 'Custom'} Box</span>
                </div>
                <div className="summary-item">
                  <span>Weight:</span>
                  <span>{formData.totalWeight}kg</span>
                </div>
                <div className="summary-item">
                  <span>Frequency:</span>
                  <span>{formData.frequency}</span>
                </div>
                <div className="summary-item">
                  <span>Delivery:</span>
                  <span>{formData.deliveryMethod === 'pickup' ? 'Pickup' : 'Delivery'}</span>
                </div>
                {formData.deliveryMethod === 'delivery' && (
                  <div className="summary-item">
                    <span>Address:</span>
                    <span>{formData.deliveryAddress.street} {formData.deliveryAddress.number}, {formData.deliveryAddress.city}</span>
                  </div>
                )}
              </div>

              <div className="summary-card">
                <h4>Selected Cuts</h4>
                {formData.selectedProducts.map((product, index) => (
                  <div key={index} className="product-summary">
                    <span>{product.productName}</span>
                    <span>{product.weight}kg × €{product.price} = €{(product.weight * product.price).toFixed(2)}</span>
                  </div>
                ))}
                <div className="total-summary">
                  <strong>Total: €{getTotalPrice().toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="notes-section">
              <label>Additional Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requests or notes..."
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <div className="subscription-header">
          <h1>Create Your Subscription</h1>
          <p>Get regular deliveries of premium Argentinian cuts</p>
        </div>

        <div className="steps-indicator">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep === step.number ? 'current' : ''}`}
            >
              <div className="step-icon">{step.icon}</div>
              <span className="step-title">{step.title}</span>
            </div>
          ))}
        </div>

        <div className="subscription-form">
          {renderStepContent()}

          <div className="form-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={handlePrevious}
              >
                <ChevronLeft size={16} />
                Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button
                type="button"
                className="btn-primary"
                onClick={handleNext}
                disabled={!isStepValid()}
              >
                Next
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary"
                onClick={handleSubmit}
                disabled={isLoading || !isStepValid()}
              >
                {isLoading ? 'Creating...' : 'Create Subscription'}
              </button>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SubscriptionPage;
