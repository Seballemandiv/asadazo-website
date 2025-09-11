import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { X, Trash2, Plus, Minus, CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { Order } from '../types';
import { translations } from '../data/translations';

interface CartProps {
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [isCheckout, setIsCheckout] = useState(false);
  type DeliveryZone = 'pickup' | 'inside' | 'outside';
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside');
  const t = translations.en;

  const subtotal = getCartTotal();
  const deliveryFee =
    deliveryZone === 'pickup'
      ? 0
      : deliveryZone === 'inside'
        ? (subtotal >= 80 ? 0 : 5)
        : 20; // outside the ring
  const total = subtotal + deliveryFee;
  const [submitted, setSubmitted] = useState(false);
  const ORDERS_STORAGE_KEY = 'asadazo_orders';

  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const isCustomerValid = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email);
    const baseOk = customer.name.trim().length > 1 && emailOk && customer.phone.trim().length >= 6;
    if (deliveryZone === 'pickup') return baseOk;
    return baseOk && customer.address.trim().length >= 5;
  };

  const ORDER_API = (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'https://v0-asadazo-website.vercel.app/api/create-order'
    : '/api/create-order';

  const handleCheckout = async () => {
    try {
      const items = cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        lineTotal: item.product.price * item.quantity
      }));

      const res = await fetch(ORDER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          totals: { subtotal, delivery: deliveryFee, total },
          deliveryZone,
          customer
        })
      });

      if (!res.ok) throw new Error('Order submission failed');

      // Persist order: if logged-in, save to server; always mirror locally for fallback
      try {
        if (isAuthenticated) {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cart,
              total,
              deliveryFee,
              deliveryAddress: { street: customer.address || '', city: '', postalCode: '', country: 'Netherlands' },
              pickupOption: deliveryZone === 'pickup'
            })
          });
        }
        const existing: Order[] = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
        const newOrder: Order = {
          id: String(Date.now()),
          userId: 'guest',
          items: cart,
          total,
          deliveryFee,
          deliveryAddress: { street: customer.address || '', city: '', postalCode: '', country: 'Netherlands' },
          pickupOption: deliveryZone === 'pickup',
          status: 'pending',
          createdAt: new Date()
        } as any;
        const updated = [newOrder, ...existing];
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
      } catch {}

      setSubmitted(true);
      clearCart();
    } catch (e) {
      console.error(e);
      window.alert('Failed to submit order. Please try again.');
    }
  };

  // After successful submission we want to show a confirmation message
  if (submitted) {
    const deliveryText =
      deliveryZone === 'pickup'
        ? 'Pickup at Amsterdam Oost'
        : deliveryZone === 'inside'
          ? 'Delivery inside the ring'
          : 'Delivery outside the ring';

    return (
      <div className="cart-overlay">
        <div className="cart-modal">
          <div className="cart-header">
            <h2>{t.cart.title}</h2>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <div className="cart-empty" style={{textAlign:'center'}}>
            <CheckCircle size={48} />
            <h3>Your order is under review</h3>
            <p>We will contact you regarding the delivery and payment options.</p>
            <div className="order-summary" style={{marginTop: '1rem'}}>
              <h4>Details</h4>
              <div className="order-item"><span>Name</span><span>{customer.name || '-'}</span></div>
              <div className="order-item"><span>Email</span><span>{customer.email || '-'}</span></div>
              <div className="order-item"><span>Phone</span><span>{customer.phone || '-'}</span></div>
              <div className="order-item"><span>Delivery</span><span>{deliveryText}</span></div>
            </div>
            <button className="btn-primary" onClick={onClose} style={{marginTop:'1rem'}}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="cart-overlay">
        <div className="cart-modal">
          <div className="cart-header">
            <h2>{t.cart.title}</h2>
            <button className="close-button" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          <div className="cart-empty">
            <p>{t.cart.empty}</p>
            <button className="btn-primary" onClick={onClose}>
              {t.cart.continue}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-overlay">
      <div className="cart-modal">
        <div className="cart-header">
          <h2>{t.cart.title}</h2>
          <button className="close-button" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {!isCheckout ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.product.id} className="cart-item">
                  <div className="item-info">
                    <h4>{item.product.name}</h4>
                    <p>€{item.product.price}/kg</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 0.5)}
                      disabled={item.quantity <= item.product.minPack}
                    >
                      <Minus size={16} />
                    </button>
                    <span>{item.quantity}kg</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 0.5)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <div className="item-total">
                    <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                    <button
                      className="remove-button"
                      onClick={() => removeFromCart(item.product.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-row">
                <span>{t.cart.subtotal}</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>{t.cart.delivery}</span>
                <span>€{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>{t.cart.total}</span>
                <span>€{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="cart-actions">
              <button className="btn-outline" onClick={onClose}>
                Continue Shopping
              </button>
              <button className="btn-primary" onClick={() => setIsCheckout(true)}>
                {t.cart.checkout}
              </button>
            </div>
          </>
        ) : (
          <div className="checkout-form">
            <h3>Checkout</h3>
            
            <div className="form-group">
              <label><input type="radio" name="zone" checked={deliveryZone==='pickup'} onChange={()=>setDeliveryZone('pickup')} /> Pickup at Amsterdam Oost (Free)</label>
            </div>
            <div className="form-group">
              <label><input type="radio" name="zone" checked={deliveryZone==='inside'} onChange={()=>setDeliveryZone('inside')} /> Delivery inside the ring</label>
            </div>
            <div className="form-group">
              <label><input type="radio" name="zone" checked={deliveryZone==='outside'} onChange={()=>setDeliveryZone('outside')} /> Delivery outside the ring</label>
            </div>

            {deliveryZone !== 'pickup' && (
              <div className="delivery-info">
                <p>Delivery fee: €{deliveryFee.toFixed(0)}</p>
                {deliveryZone === 'inside' ? (
                  <>
                    <p>Free delivery for orders over €80</p>
                    <p>Delivery area: Inside the ring</p>
                  </>
                ) : (
                  <>
                    <p>Outside the ring (Min order €80) — Delivery fee €20</p>
                  </>
                )}
              </div>
            )}

            <div className="order-summary">
              <h4>Order Summary</h4>
              {cart.map((item) => (
                <div key={item.product.id} className="order-item">
                  <span>{item.product.name} - {item.quantity}kg</span>
                  <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="order-total">
                <strong>Total: €{total.toFixed(2)}</strong>
              </div>
            </div>

            <div className="customer-info">
              <h4>Customer Information</h4>
              <div className="form-group">
                <label>Name</label>
                <input value={customer.name} onChange={(e)=>setCustomer({...customer,name:e.target.value})} placeholder="Full name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={customer.email} onChange={(e)=>setCustomer({...customer,email:e.target.value})} placeholder="you@example.com" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input value={customer.phone} onChange={(e)=>setCustomer({...customer,phone:e.target.value})} placeholder="06.." />
              </div>
              {deliveryZone !== 'pickup' && (
                <div className="form-group">
                  <label>Address</label>
                  <input value={customer.address} onChange={(e)=>setCustomer({...customer,address:e.target.value})} placeholder="Street, number, city" />
                </div>
              )}
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea rows={3} value={customer.notes} onChange={(e)=>setCustomer({...customer,notes:e.target.value})} />
              </div>
            </div>

            {!submitted ? (
              <div className="checkout-actions">
                <button className="btn-secondary" onClick={() => setIsCheckout(false)}>
                  Back to Cart
                </button>
                <button className="btn-primary" onClick={handleCheckout} disabled={(deliveryZone==='outside' && subtotal < 80) || !isCustomerValid()}>
                  Place Order
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
