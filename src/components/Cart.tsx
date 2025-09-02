import { useState } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { translations } from '../data/translations';

interface CartProps {
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ onClose }) => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [pickupOption, setPickupOption] = useState(false);
  const t = translations.en;

  const deliveryFee = pickupOption ? 0 : 5;
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  const handleCheckout = () => {
    const orderDetails = {
      items: cart.map(item => `${item.product.name} - ${item.quantity}kg`).join('\n'),
      total: total,
      delivery: pickupOption ? 'Pickup' : 'Delivery',
      email: 'allemandi.Sebastian@expandam.nl'
    };

    const mailtoLink = `mailto:${orderDetails.email}?subject=New Order - Asadazo&body=Order Details:%0D%0A%0D%0A${orderDetails.items}%0D%0A%0D%0ATotal: €${total.toFixed(2)}%0D%0A${orderDetails.delivery}%0D%0A%0D%0APlease confirm this order.`;
    
    window.location.href = mailtoLink;
    onClose();
  };

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
              <label>
                <input
                  type="checkbox"
                  checked={pickupOption}
                  onChange={(e) => setPickupOption(e.target.checked)}
                />
                Pickup at Amsterdam Oost (Free)
              </label>
            </div>

            {!pickupOption && (
              <div className="delivery-info">
                <p>Delivery fee: €{deliveryFee}</p>
                <p>Free delivery for orders over €80</p>
                <p>Delivery area: Amsterdam (other areas by consultation)</p>
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

            <div className="checkout-actions">
              <button className="btn-secondary" onClick={() => setIsCheckout(false)}>
                Back to Cart
              </button>
              <button className="btn-primary" onClick={handleCheckout}>
                Place Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
