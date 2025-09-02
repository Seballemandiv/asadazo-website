import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ProductCard from './ProductCard';
import { products as initialProducts } from '../data/products';
import type { Product } from '../types';

const ProductGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const categories = [
    { id: 'all', name: 'All Cuts' },
    { id: 'meat', name: 'Beef' },
    { id: 'pork', name: 'Pork' },
    { id: 'sausages', name: 'Sausages' },
    { id: 'achuras', name: 'Achuras' }
  ];

  // Load products from localStorage on mount, or use initial products if none saved
  useEffect(() => {
    const savedProducts = localStorage.getItem('asadazo_products');
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error('Error loading saved products:', error);
        setProducts(initialProducts);
      }
    } else {
      // Initialize with default products if no saved data
      setProducts(initialProducts);
      localStorage.setItem('asadazo_products', JSON.stringify(initialProducts));
    }
  }, []);

  // Listen for changes to localStorage (when admin updates products)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProducts = localStorage.getItem('asadazo_products');
      if (savedProducts) {
        try {
          setProducts(JSON.parse(savedProducts));
        } catch (error) {
          console.error('Error loading saved products:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="products" className="products-section">
      <div className="products-container">
        <div className="products-header">
          <h2 className="products-title">Our signature cuts</h2>
        </div>

        <div className="products-filters">
          <div className="search-container">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              placeholder="Search for a specific cut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <p>No cuts found matching your search.</p>
              <button 
                className="clear-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
