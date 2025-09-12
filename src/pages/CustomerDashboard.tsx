import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, CreditCard, User, Plus, Edit, Trash2, MapPin, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Order, PaymentMethod } from '../types';
import Toast from '../components/Toast';

// Orders are stored locally for now
const ORDERS_STORAGE_KEY = 'asadazo_orders';

const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '1234',
    brand: 'Visa',
    isDefault: true
  },
  {
    id: '2',
    type: 'card',
    last4: '5678',
    brand: 'American Express',
    isDefault: false
  },
  {
    id: '3',
    type: 'bank_transfer',
    iban: 'NL91ABNA0417164300',
    accountHolder: 'John Doe',
    isDefault: false
  },
  {
    id: '4',
    type: 'klarna',
    isDefault: false
  },
  {
    id: '5',
    type: 'ideal',
    idealBank: 'INGBNL2A',
    isDefault: false
  }
];

type PaymentFormData = {
  type: 'card' | 'bank_transfer' | 'klarna' | 'ideal';
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  iban: string;
  accountHolder: string;
  idealBank: string;
};

const tabs: Array<{ key: 'orders' | 'payment' | 'profile' | 'logout'; label: string; icon: React.ReactNode }> = [
  { key: 'orders', label: 'Orders', icon: <Package size={16} /> },
  { key: 'payment', label: 'Payment Methods', icon: <CreditCard size={16} /> },
  { key: 'profile', label: 'Profile', icon: <User size={16} /> },
  { key: 'logout', label: 'Logout', icon: <LogOut size={16} /> },
];

const CustomerDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'payment' | 'profile' | 'logout'>('orders');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<PaymentFormData>({
    type: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    iban: '',
    accountHolder: '',
    idealBank: ''
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'card': return <CreditCard size={20} />;
      case 'bank_transfer': return <MapPin size={20} />;
      case 'klarna': return <span className="klarna-icon">K</span>;
      case 'ideal': return <span className="ideal-icon">iDEAL</span>;
      default: return <CreditCard size={20} />;
    }
  };

  const handleAddPaymentMethod = () => {
    setShowAddPaymentModal(false);
    setNewPaymentMethod({
      type: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      iban: '',
      accountHolder: '',
      idealBank: ''
    });
    setToast({ message: 'Payment method added', type: 'success' });
  };

  const handleDeletePaymentMethod = (id: string) => {
    console.log('Deleting payment method:', id);
    setToast({ message: 'Payment method removed', type: 'success' });
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    console.log('Setting default payment method:', id);
    setToast({ message: 'Default payment method updated', type: 'success' });
  };

  const onKeyDownTabs = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabs.findIndex(t => t.key === activeTab);
    if (e.key === 'ArrowRight') {
      const next = (currentIndex + 1) % tabs.length;
      setActiveTab(tabs[next].key);
    } else if (e.key === 'ArrowLeft') {
      const prev = (currentIndex - 1 + tabs.length) % tabs.length;
      setActiveTab(tabs[prev].key);
    }
  }, [activeTab]);

  // Handle logout tab
  if (activeTab === 'logout') {
    logout();
    navigate('/');
    return null;
  }

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.orders)) {
            setOrders(data.orders);
            return;
          }
        }
      } catch {}
      // Fallback to localStorage if not logged in or API not available
      try {
        const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (saved) setOrders(JSON.parse(saved));
      } catch {}
    };
    load();
  }, []);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">My Account</h1>
          <button className="logout-button" onClick={() => setActiveTab('logout')}>
            <User size={16} />
            Logout
          </button>
        </div>

        <div
          className="dashboard-tabs"
          role="tablist"
          aria-label="Account sections"
          onKeyDown={onKeyDownTabs}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              id={`tab-${t.key}`}
              role="tab"
              aria-selected={activeTab === t.key}
              aria-controls={`panel-${t.key}`}
              tabIndex={activeTab === t.key ? 0 : -1}
              className={`tab-button ${activeTab === t.key ? 'active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        <div className="dashboard-content">
          {activeTab === 'orders' && (
            <div id="panel-orders" role="tabpanel" aria-labelledby="tab-orders" className="orders-section">
              <h2>My Orders</h2>
              {orders.length === 0 ? (
                <div className="empty-state">
                  <Package size={48} />
                  <h3>No orders yet</h3>
                  <p>Start shopping to see your orders here</p>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h3>Order #{order.id}</h3>
                          <p className="order-date">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="order-status">
                          <span className={`status-badge ${order.status}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span>{item.product.name}</span>
                            <span>{item.quantity}kg</span>
                            <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="order-footer">
                        <div className="order-total">
                          <strong>Total: €{order.total.toFixed(2)}</strong>
                        </div>
                        {order.deliveryDate && (
                          <div className="delivery-date">
                            Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'payment' && (
            <div id="panel-payment" role="tabpanel" aria-labelledby="tab-payment" className="payment-section">
              <div className="section-header">
                <h2>Payment Methods</h2>
                <button 
                  className="add-button"
                  onClick={() => setShowAddPaymentModal(true)}
                >
                  <Plus size={16} />
                  Add Payment Method
                </button>
              </div>

              <div className="payment-methods-list">
                {MOCK_PAYMENT_METHODS.map(method => (
                  <div key={method.id} className="payment-method-card">
                    <div className="payment-method-info">
                      <div className="card-icon">
                        {getPaymentMethodIcon(method.type)}
                      </div>
                      <div className="card-details">
                        <h4>{method.type === 'card' ? `${method.brand} •••• ${method.last4}` : method.type}</h4>
                        {method.isDefault && (
                          <span className="default-badge">Default</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="payment-method-actions">
                      {!method.isDefault && (
                        <button 
                          className="set-default-button"
                          onClick={() => handleSetDefaultPaymentMethod(method.id)}
                        >
                          Set Default
                        </button>
                      )}
                      <button 
                        className="edit-button"
                        onClick={() => console.log('Edit payment method:', method.id)}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="delete-button"
                        onClick={() => handleDeletePaymentMethod(method.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div id="panel-profile" role="tabpanel" aria-labelledby="tab-profile" className="profile-section">
              <h2>Personal Information</h2>
              
              <form className="profile-form" onSubmit={(e) => { e.preventDefault(); setToast({ message: 'Profile saved', type: 'success' }); }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue="John Doe" />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue="john.doe@example.com" />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" defaultValue="+31 6 12345678" />
                </div>

                <div className="address-section">
                  <h3>Address Information</h3>
                  <div className="address-grid">
                    <div className="form-group">
                      <label>Street</label>
                      <input type="text" defaultValue="123 Main Street" />
                    </div>
                    
                    <div className="form-group">
                      <label>Number</label>
                      <input type="text" defaultValue="42" />
                    </div>
                    
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" defaultValue="Amsterdam" />
                    </div>
                    
                    <div className="form-group">
                      <label>Region/Province</label>
                      <input type="text" defaultValue="North Holland" />
                    </div>
                    
                    <div className="form-group">
                      <label>Postal Code</label>
                      <input type="text" defaultValue="1000 AA" />
                    </div>
                    
                    <div className="form-group">
                      <label>Country</label>
                      <select defaultValue="Netherlands">
                        <option value="Netherlands">Netherlands</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Germany">Germany</option>
                        <option value="France">France</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="profile-actions">
                  <button type="button" className="btn-cancel" onClick={() => setToast({ message: 'Changes discarded', type: 'success' })}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-save">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add Payment Method</h2>
              <button 
                className="close-btn"
                onClick={() => setShowAddPaymentModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-content">
              <div className="payment-type-selector">
                <button 
                  className={`payment-type-btn ${newPaymentMethod.type === 'card' ? 'active' : ''}`}
                  onClick={() => setNewPaymentMethod(prev => ({ ...prev, type: 'card' }))}
                >
                  <CreditCard size={20} />
                  Credit Card
                </button>
                <button 
                  className={`payment-type-btn ${newPaymentMethod.type === 'bank_transfer' ? 'active' : ''}`}
                  onClick={() => setNewPaymentMethod(prev => ({ ...prev, type: 'bank_transfer' }))}
                >
                  <span className="bank-icon">🏦</span>
                  SEPA Transfer
                </button>
                <button 
                  className={`payment-type-btn ${newPaymentMethod.type === 'klarna' ? 'active' : ''}`}
                  onClick={() => setNewPaymentMethod(prev => ({ ...prev, type: 'klarna' }))}
                >
                  <span className="klarna-icon">K</span>
                  Klarna
                </button>
                <button 
                  className={`payment-type-btn ${newPaymentMethod.type === 'ideal' ? 'active' : ''}`}
                  onClick={() => setNewPaymentMethod(prev => ({ ...prev, type: 'ideal' }))}
                >
                  <span className="ideal-icon">iDEAL</span>
                  iDEAL
                </button>
              </div>

              {newPaymentMethod.type === 'card' && (
                <div className="card-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input 
                        type="text" 
                        placeholder="1234 5678 9012 3456"
                        value={newPaymentMethod.cardNumber}
                        onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardNumber: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        value={newPaymentMethod.expiryDate}
                        onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, expiryDate: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input 
                        type="text" 
                        placeholder="123"
                        value={newPaymentMethod.cvv}
                        onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cvv: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={newPaymentMethod.cardholderName}
                      onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, cardholderName: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {newPaymentMethod.type === 'bank_transfer' && (
                <div className="bank-form">
                  <div className="form-group">
                    <label>IBAN</label>
                    <input 
                      type="text" 
                      placeholder="NL91ABNA0417164300"
                      value={newPaymentMethod.iban}
                      onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, iban: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Holder Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      value={newPaymentMethod.accountHolder}
                      onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, accountHolder: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              {newPaymentMethod.type === 'klarna' && (
                <div className="klarna-form">
                  <div className="klarna-info">
                    <p>Pay later with Klarna. No fees, no interest.</p>
                  </div>
                  <div className="klarna-benefits">
                    <ul>
                      <li>Pay in 30 days</li>
                      <li>No fees or interest</li>
                      <li>Secure checkout</li>
                    </ul>
                  </div>
                </div>
              )}

              {newPaymentMethod.type === 'ideal' && (
                <div className="ideal-form">
                  <div className="form-group">
                    <label>Select Bank</label>
                    <select 
                      value={newPaymentMethod.idealBank}
                      onChange={(e) => setNewPaymentMethod(prev => ({ ...prev, idealBank: e.target.value }))}
                    >
                      <option value="">Select your bank</option>
                      <option value="INGBNL2A">ING Bank</option>
                      <option value="RABONL2U">Rabobank</option>
                      <option value="ABNANL2A">ABN AMRO</option>
                      <option value="TRIBNL2U">Triodos Bank</option>
                    </select>
                  </div>
                  <div className="ideal-info">
                    <p>Pay directly from your bank account with iDEAL.</p>
                  </div>
                  <div className="ideal-benefits">
                    <ul>
                      <li>Instant payment</li>
                      <li>No additional fees</li>
                      <li>Secure bank transfer</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowAddPaymentModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="save-btn"
                  onClick={handleAddPaymentMethod}
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={2500}
        />
      )}
    </div>
  );
};

export default CustomerDashboard;
