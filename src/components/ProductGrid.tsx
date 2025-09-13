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

  // LocalStorage key with versioning to avoid stale data across deployments
  const PRODUCTS_STORAGE_KEY = 'asadazo_products_v3';

  // Load products from localStorage on mount, or use initial products if none saved
  useEffect(() => {
    // Try new key first
    let savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    // Migrate from older keys if present
    if (!savedProducts) {
      const legacy = localStorage.getItem('asadazo_products');
      if (legacy) {
        savedProducts = legacy;
        // write to new key and remove legacy
        localStorage.setItem(PRODUCTS_STORAGE_KEY, legacy);
        localStorage.removeItem('asadazo_products');
      }
    }
    if (savedProducts) {
      try {
        const parsed: Product[] = JSON.parse(savedProducts);
        // Migration/sanitization: ensure images use /images/... paths
        const sanitized = parsed.map((p) => {
          const defaultMatch = initialProducts.find(d => d.id === p.id);
          const isValidPublicPath = typeof p.image === 'string' && p.image.startsWith('/');
          const image = isValidPublicPath ? p.image : (defaultMatch?.image ?? p.image);
          return { ...p, image } as Product;
        });
        setProducts(sanitized);
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(sanitized));
      } catch (error) {
        console.error('Error loading saved products:', error);
        setProducts(initialProducts);
      }
    } else {
      // Initialize with default products if no saved data
      setProducts(initialProducts);
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
    }
  }, []);

  // Removed storage listener to prevent unnecessary re-renders that broke images

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).slice().sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  // Debug logging
  console.log('Selected category:', selectedCategory);
  console.log('Total products:', products.length);
  console.log('Filtered products:', filteredProducts.length);
  console.log('Products by category:', products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>));

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
