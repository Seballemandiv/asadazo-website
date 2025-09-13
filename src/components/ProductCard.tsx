import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(product.minPack);
  const [showQuantityInput, setShowQuantityInput] = useState(false);

  const handleAddToCart = () => {
    if (quantity >= product.minPack && quantity <= product.stock) {
      addToCart(product, quantity);
      setQuantity(product.minPack); // Reset to minimum
      setShowQuantityInput(false);
    }
  };

  const isOutOfStock = product.stock <= 0;
  const isQuantityValid = quantity >= product.minPack && quantity <= product.stock;

  return (
    <div className="product-card">
      <div className="product-image.pngimage">
        <img
          src={product.image || '/images/Products/Asado.jpg'}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src.endsWith('/images/Products/Asado.jpg')) return;
            target.src = '/images/Products/Asado.jpg';
          }}
        />
        <div className="product-overlay">
          {!isOutOfStock ? (
            <div className="add-to-cart-overlay">
              {showQuantityInput ? (
                <div className="quantity-input-container">
                  <div className="quantity-input">
                    <label htmlFor={`quantity-${product.id}`}>Quantity (kg):</label>
                    <input
                      id={`quantity-${product.id}`}
                      type="number"
                      min={product.minPack}
                      max={product.stock}
                      step="0.5"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value) || product.minPack)}
                      className="quantity-field"
                    />
                  </div>
                  <button 
                    className="add-to-cart-btn"
                    onClick={handleAddToCart}
                    disabled={!isQuantityValid}
                  >
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                  <button 
                    className="cancel-quantity-btn"
                    onClick={() => setShowQuantityInput(false)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button 
                  className="add-to-cart-btn"
                  onClick={() => setShowQuantityInput(true)}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </button>
              )}
            </div>
          ) : (
            <div className="out-of-stock-overlay">
              <span className="out-of-stock-text">Out of Stock</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-details">
          <div className="product-price">
            <span className="price">€{product.price.toFixed(2)}</span>
            {product.pricePerKg && <span className="price-unit">/kg</span>}
          </div>
          
          <div className="product-minimum">
            <span className="min-pack">Min: {product.minPack}kg</span>
          </div>
        </div>

        {isInCart(product.id) && (
          <div className="in-cart-indicator">
            ✓ Added to cart
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

