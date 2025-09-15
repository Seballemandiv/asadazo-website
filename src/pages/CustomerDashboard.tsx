import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, Plus, Edit, Trash2, MapPin, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import type { Order, Subscription } from '../types';
import Toast from '../components/Toast';

// Orders are stored locally for now
const ORDERS_STORAGE_KEY = 'asadazo_orders';

// Payment methods UI removed per request

// Payment method state removed

const tabs: Array<{ key: 'orders' | 'subscriptions' | 'profile' | 'logout'; label: string; icon: React.ReactNode }> = [
  { key: 'orders', label: 'Orders', icon: <Package size={16} /> },
  { key: 'subscriptions', label: 'Subscriptions', icon: <Calendar size={16} /> },
  { key: 'profile', label: 'Profile', icon: <User size={16} /> },
  { key: 'logout', label: 'Logout', icon: <LogOut size={16} /> },
];

const CustomerDashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'subscriptions' | 'profile' | 'logout'>('subscriptions');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Payment UI removed

  // Payment handlers removed

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
      // Load orders
      try {
        const res = await fetch('/api/orders');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.orders)) {
            setOrders(data.orders);
          }
        }
      } catch {}
      // Fallback to localStorage if not logged in or API not available
      try {
        const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
        if (saved) setOrders(JSON.parse(saved));
      } catch {}

      // Load subscriptions (include credentials)
      try {
        const subRes = await fetch('/api/subscriptions', { credentials: 'include' });
        if (subRes.ok) {
          const subData = await subRes.json();
          if (Array.isArray(subData.subscriptions)) {
            setSubscriptions(subData.subscriptions);
          }
        }
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

          {/* Payment Methods section removed */}

          {activeTab === 'profile' && (
            <div id="panel-profile" role="tabpanel" aria-labelledby="tab-profile" className="profile-section">
              <h2>Personal Information</h2>
              
              <form className="profile-form" onSubmit={(e) => { e.preventDefault(); setToast({ message: 'Profile saved', type: 'success' }); }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" defaultValue={user?.name || ''} readOnly />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" defaultValue={user?.email || ''} readOnly />
                </div>
                
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" defaultValue={user?.phone || ''} readOnly />
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

          {activeTab === 'subscriptions' && (
            <div id="panel-subscriptions" role="tabpanel" aria-labelledby="tab-subscriptions" className="subscriptions-section">
              <div className="section-header">
                <h2>My Subscriptions</h2>
                <button 
                  className="add-button"
                  onClick={() => navigate('/subscriptions')}
                >
                  <Plus size={16} />
                  New Subscription
                </button>
              </div>
              
              {subscriptions.length === 0 ? (
                <div className="empty-state">
                  <Calendar size={48} />
                         <h3>Create your subscriptions</h3>
                         <p>Get regular deliveries of premium Argentinian cuts</p>
                  <button 
                    className="btn-primary"
                    onClick={() => navigate('/subscriptions')}
                  >
                    Create Subscription
                  </button>
                </div>
              ) : (
                <div className="subscriptions-list">
                  {subscriptions.map((subscription) => (
                    <div key={subscription.id} className="subscription-card">
                      <div className="subscription-header">
                        <div className="subscription-info">
                                 <h3>
                                   {subscription.type === 'weekly' ? 'Weekly' :
                                    subscription.type === 'biweekly' ? 'Bi-weekly' :
                                    subscription.type === 'triweekly' ? 'Tri-weekly' :
                                    subscription.type === 'monthly' ? 'Monthly' : 'Custom'} Box
                                 </h3>
                          <p className="subscription-weight">{subscription.totalWeight}kg</p>
                        </div>
                        <div className={`subscription-status status-${subscription.status}`}>
                          {subscription.status === 'active' ? 'Active' :
                           subscription.status === 'pending review' ? 'Under Review' :
                           subscription.status === 'confirmed' ? 'Confirmed' :
                           subscription.status === 'cancelled' ? 'Cancelled' : 'Paused'}
                        </div>
                      </div>
                      
                      <div className="subscription-details">
                        <div className="subscription-products">
                          <h4>Selected Cuts:</h4>
                          <ul>
                            {subscription.selectedProducts.map((product, index) => (
                              <li key={index}>
                                {product.productName} - {product.weight}kg
                                {product.isSuggestion && <span className="suggestion-badge">Suggested</span>}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="subscription-meta">
                          <p><strong>Frequency:</strong> {subscription.frequency}</p>
                          <p><strong>Next Delivery:</strong> {new Date(subscription.nextDelivery).toLocaleDateString()}</p>
                          <p><strong>Delivery:</strong> {subscription.pickupOption ? 'Pickup' : 'Delivery'}</p>
                        </div>
                      </div>
                      
                      <div className="subscription-actions">
                        {subscription.status === 'active' && (
                          <button 
                            className="btn-outline"
                            onClick={() => {
                              // TODO: Implement pause functionality
                              setToast({ message: 'Subscription paused', type: 'success' });
                            }}
                          >
                            Pause
                          </button>
                        )}
                        <button 
                          className="btn-cancel"
                          onClick={() => {
                            // TODO: Implement cancel functionality
                            setToast({ message: 'Subscription cancelled', type: 'success' });
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment modal removed */}

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
