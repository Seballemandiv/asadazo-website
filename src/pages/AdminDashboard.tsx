import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Edit, Trash2, Save, X as CloseIcon, LogOut, Package, Users, Settings, AlertTriangle, CheckCircle, Search, Filter, Download, Eye, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { Product, Order, Subscription } from '../types';
import { products as initialProducts } from '../data/products';

// Mock data for orders
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    userId: '2',
    items: [
      {
        product: {
          id: '1',
          name: 'Entraña',
          price: 25.99,
          pricePerKg: true,
          minPack: 0.5,
          stock: 10,
          category: 'meat'
        },
        quantity: 1
      }
    ],
    total: 25.99,
    deliveryFee: 5.00,
    deliveryAddress: {
      street: '123 Main St',
      city: 'Amsterdam',
      postalCode: '1000 AA',
      country: 'Netherlands'
    },
    status: 'delivered',
    createdAt: new Date('2024-01-20'),
    deliveryDate: new Date('2024-01-22'),
    paymentMethod: {
      id: '1',
      type: 'card',
      last4: '1234',
      brand: 'Visa',
      isDefault: true
    }
  },
  {
    id: '2',
    userId: '2',
    items: [
      {
        product: {
          id: '2',
          name: 'Vacío',
          price: 28.99,
          pricePerKg: true,
          minPack: 0.5,
          stock: 8,
          category: 'meat'
        },
        quantity: 1.5
      }
    ],
    total: 43.49,
    deliveryFee: 5.00,
    deliveryAddress: {
      street: '123 Main St',
      city: 'Amsterdam',
      postalCode: '1000 AA',
      country: 'Netherlands'
    },
    status: 'preparing',
    createdAt: new Date('2024-01-25'),
    paymentMethod: {
      id: '1',
      type: 'card',
      last4: '1234',
      brand: 'Visa',
      isDefault: true
    }
  }
];

type AdminSubscription = Subscription & {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  nextDelivery?: string | Date;
  lastModified?: string | Date;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [orders] = useState<Order[]>(MOCK_ORDERS);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'subscriptions' | 'users' | 'settings'>('products');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    price: 0,
    pricePerKg: true,
    minPack: 0.5,
    stock: 0,
    category: 'meat',
    description: '',
    image: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [adminSubscriptions, setAdminSubscriptions] = useState<AdminSubscription[]>([]);
  const [subscriptionFilters, setSubscriptionFilters] = useState({
    search: '',
    status: 'all',
    frequency: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  });
  const [selectedSubscription, setSelectedSubscription] = useState<AdminSubscription | null>(null);
  const [showSubscriptionDetail, setShowSubscriptionDetail] = useState(false);

  // Use versioned storage key to prevent stale products from older deployments
  const PRODUCTS_STORAGE_KEY = 'asadazo_products_v3';

  // Load products from localStorage on mount, or use initial products if none saved
  useEffect(() => {
    let savedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!savedProducts) {
      // migrate legacy key
      const legacy = localStorage.getItem('asadazo_products');
      if (legacy) {
        savedProducts = legacy;
        localStorage.setItem(PRODUCTS_STORAGE_KEY, legacy);
        localStorage.removeItem('asadazo_products');
      }
    }
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
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initialProducts));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Load all users' subscriptions (admin view)
  const loadSubscriptions = async () => {
    try {
      const res = await fetch('/api/subscriptions?all=true');
      if (res.ok) {
        const data = await res.json();
        setAdminSubscriptions(
          (data.subscriptions || []).map((s: any) => ({
            ...s,
            createdAt: typeof s.createdAt === 'string' ? s.createdAt : new Date(s.createdAt).toISOString()
          }))
        );
      }
    } catch (e) {
      console.error('load subscriptions failed', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'subscriptions') {
      loadSubscriptions();
    }
  }, [activeTab]);

  const updateSubscriptionStatus = async (sub: AdminSubscription, status: AdminSubscription['status']) => {
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId: sub.id, updates: { status }, adminOverride: true, targetUserId: sub.userId })
      });
      if (res.ok) {
        showToastMessage('Subscription updated', 'success');
        loadSubscriptions();
      } else {
        const err = await res.json().catch(() => ({}));
        showToastMessage(err?.error || 'Failed to update', 'error');
      }
    } catch (e) {
      showToastMessage('Failed to update', 'error');
    }
  };

  // Filter and sort subscriptions
  const getFilteredSubscriptions = () => {
    let filtered = [...adminSubscriptions];

    // Search filter
    if (subscriptionFilters.search) {
      const searchLower = subscriptionFilters.search.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.customerName?.toLowerCase().includes(searchLower) ||
        sub.customerEmail?.toLowerCase().includes(searchLower) ||
        sub.id.toLowerCase().includes(searchLower) ||
        sub.type.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (subscriptionFilters.status !== 'all') {
      filtered = filtered.filter(sub => sub.status === subscriptionFilters.status);
    }

    // Frequency filter
    if (subscriptionFilters.frequency !== 'all') {
      filtered = filtered.filter(sub => sub.frequency === subscriptionFilters.frequency);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[subscriptionFilters.sortBy as keyof AdminSubscription];
      let bValue: any = b[subscriptionFilters.sortBy as keyof AdminSubscription];

      if (subscriptionFilters.sortBy === 'createdAt' || subscriptionFilters.sortBy === 'nextDelivery') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (subscriptionFilters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const handleSort = (column: string) => {
    if (subscriptionFilters.sortBy === column) {
      setSubscriptionFilters(prev => ({
        ...prev,
        sortOrder: prev.sortOrder === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      setSubscriptionFilters(prev => ({
        ...prev,
        sortBy: column,
        sortOrder: 'asc'
      }));
    }
  };

  const exportToCSV = () => {
    const filtered = getFilteredSubscriptions();
    const headers = ['ID', 'Customer', 'Email', 'Phone', 'Type', 'Frequency', 'Weight (kg)', 'Status', 'Next Delivery', 'Created'];
    const csvContent = [
      headers.join(','),
      ...filtered.map(sub => [
        sub.id,
        `"${sub.customerName || 'N/A'}"`,
        `"${sub.customerEmail || 'N/A'}"`,
        `"${sub.customerPhone || 'N/A'}"`,
        sub.type,
        sub.frequency,
        sub.totalWeight,
        sub.status,
        new Date(sub.nextDelivery || sub.createdAt).toLocaleDateString(),
        new Date(sub.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        price: newProduct.price,
        pricePerKg: newProduct.pricePerKg || true,
        minPack: newProduct.minPack || 0.5,
        stock: newProduct.stock || 0,
        category: newProduct.category as 'meat' | 'pork' | 'sausages' | 'achuras',
        description: newProduct.description || '',
        image: newProduct.image || '/images/placeholder-meat.jpg'
      };
      setProducts([...products, product]);
      setNewProduct({
        name: '',
        price: 0,
        pricePerKg: true,
        minPack: 0.5,
        stock: 0,
        category: 'meat',
        description: '',
        image: ''
      });
      setIsAddModalOpen(false);
      showToastMessage('Product added successfully!', 'success');
    } else {
      showToastMessage('Please fill in all required fields', 'error');
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setNewProduct(product);
    setIsEditModalOpen(true);
  };

  const handleUpdateProduct = () => {
    if (editingProduct && newProduct.name && newProduct.price && newProduct.category) {
      const updatedProduct: Product = {
        ...editingProduct,
        name: newProduct.name,
        price: newProduct.price,
        pricePerKg: newProduct.pricePerKg || true,
        minPack: newProduct.minPack || 0.5,
        stock: newProduct.stock || 0,
        category: newProduct.category as 'meat' | 'pork' | 'sausages' | 'achuras',
        description: newProduct.description || editingProduct.description,
        image: newProduct.image || editingProduct.image
      };
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setIsEditModalOpen(false);
      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: 0,
        pricePerKg: true,
        minPack: 0.5,
        stock: 0,
        category: 'meat',
        description: '',
        image: ''
      });
      showToastMessage('Product updated successfully!', 'success');
    } else {
      showToastMessage('Please fill in all required fields', 'error');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId));
      showToastMessage('Product deleted successfully!', 'success');
    }
  };

  const handleStockUpdate = (productId: string, newStock: number) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
    showToastMessage('Stock updated successfully!', 'success');
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'preparing': return 'Preparing';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'preparing': return 'status-preparing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).slice().sort((a, b) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }));

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'meat', label: 'Beef' },
    { value: 'pork', label: 'Pork' },
    { value: 'sausages', label: 'Sausages' },
    { value: 'achuras', label: 'Achuras' }
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="admin-tabs">
          <button 
            className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={16} />
            Products
          </button>
          <button 
            className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingCart size={16} />
            Orders
          </button>
          <button 
            className={`admin-tab ${activeTab === 'subscriptions' ? 'active' : ''}`}
            onClick={() => setActiveTab('subscriptions')}
          >
            <CheckCircle size={16} />
            Subscriptions
          </button>
          <button 
            className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <Users size={16} />
            Users
          </button>
          <button 
            className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={16} />
            Settings
          </button>
        </div>

        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="section-header">
              <h2>Manage Products</h2>
              <button onClick={() => setIsAddModalOpen(true)} className="admin-add-btn">
                <Plus size={16} />
                Add Product
              </button>
            </div>

            <div className="admin-filters">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-search-input"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="admin-category-select"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="admin-product-card">
                  <div className="admin-product-image">
                    <img src={product.image || '/images/placeholder-meat.jpg'} alt={product.name} />
                    <div className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                      {product.stock > 0 ? `${product.stock}kg` : 'Out of Stock'}
                    </div>
                  </div>
                  <div className="admin-product-info">
                    <h3>{product.name}</h3>
                    <p className="product-description">{product.description || 'No description available'}</p>
                    <div className="product-details">
                      <span className="price">€{product.price.toFixed(2)}/kg</span>
                      <span className="min-pack">Min: {product.minPack}kg</span>
                    </div>
                    <div className="stock-control">
                      <label>Stock (kg):</label>
                      <div className="stock-input-group">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={product.stock}
                          onChange={(e) => handleStockUpdate(product.id, parseFloat(e.target.value) || 0)}
                          className="stock-input"
                        />
                        <button 
                          onClick={() => handleStockUpdate(product.id, product.stock + 1)}
                          className="stock-btn"
                        >
                          +
                        </button>
                        <button 
                          onClick={() => handleStockUpdate(product.id, Math.max(0, product.stock - 1))}
                          className="stock-btn"
                        >
                          -
                        </button>
                      </div>
                    </div>
                    <div className="product-category">
                      <span className={`category-tag ${product.category}`}>
                        {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="admin-product-actions">
                    <button onClick={() => handleEditProduct(product)} className="admin-edit-btn">
                      <Edit size={16} />
                      Edit
                    </button>
                    <button onClick={() => handleDeleteProduct(product.id)} className="admin-delete-btn">
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="no-products">
                <Package size={48} />
                <h3>No products found</h3>
                <p>Try adjusting your search or category filter</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="admin-section">
            <h2>Order Management</h2>
            <div className="admin-orders-grid">
              {orders.map(order => (
                <div key={order.id} className="admin-order-card">
                  <div className="order-header">
                    <h3>Order #{order.id}</h3>
                    <span className={`status ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <div className="order-details">
                    <p><strong>Customer:</strong> User {order.userId}</p>
                    <p><strong>Total:</strong> €{order.total.toFixed(2)}</p>
                    <p><strong>Date:</strong> {order.createdAt.toLocaleDateString()}</p>
                    <p><strong>Status:</strong> {getStatusText(order.status)}</p>
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
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'subscriptions' && (
          <div className="admin-section">
            <div className="admin-section-header">
              <h2>Manage Subscriptions</h2>
              <div className="admin-actions">
                <button onClick={exportToCSV} className="admin-action-btn">
                  <Download size={16} />
                  Export CSV
                </button>
                <button onClick={loadSubscriptions} className="admin-action-btn">
                  <CheckCircle size={16} />
                  Refresh
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="admin-filters">
              <div className="filter-group">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search subscriptions..."
                  value={subscriptionFilters.search}
                  onChange={(e) => setSubscriptionFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="filter-input"
                />
              </div>
              
              <div className="filter-group">
                <Filter size={16} />
                <select
                  value={subscriptionFilters.status}
                  onChange={(e) => setSubscriptionFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="pending review">Pending Review</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="filter-group">
                <select
                  value={subscriptionFilters.frequency}
                  onChange={(e) => setSubscriptionFilters(prev => ({ ...prev, frequency: e.target.value }))}
                  className="filter-select"
                >
                  <option value="all">All Frequencies</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="triweekly">Tri-weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>

            {/* Table */}
            {adminSubscriptions.length === 0 ? (
              <div className="admin-placeholder">
                <CheckCircle size={48} />
                <h3>No subscriptions found</h3>
                <button onClick={loadSubscriptions} className="admin-add-btn">Refresh</button>
              </div>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('id')} className="sortable">
                        ID {subscriptionFilters.sortBy === 'id' && (subscriptionFilters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </th>
                      <th onClick={() => handleSort('customerName')} className="sortable">
                        Customer {subscriptionFilters.sortBy === 'customerName' && (subscriptionFilters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </th>
                      <th onClick={() => handleSort('customerEmail')} className="sortable">
                        Email {subscriptionFilters.sortBy === 'customerEmail' && (subscriptionFilters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </th>
                      <th onClick={() => handleSort('type')} className="sortable">
                        Type {subscriptionFilters.sortBy === 'type' && (subscriptionFilters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </th>
                      <th onClick={() => handleSort('frequency')} className="sortable">
                        Frequency {subscriptionFilters.sortBy === 'frequency' && (subscriptionFilters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </th>
                      <th onClick={() => handleSort('totalWeight')} className="sortable">
                        Weight {subscriptionFilters.sortBy === 'totalWeight' && (subscriptionFilters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </th>
                      <th onClick={() => handleSort('status')} className="sortable">
                        Status {subscriptionFilters.sortBy === 'status' && (subscriptionFilters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </th>
                      <th onClick={() => handleSort('nextDelivery')} className="sortable">
                        Next Delivery {subscriptionFilters.sortBy === 'nextDelivery' && (subscriptionFilters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </th>
                      <th onClick={() => handleSort('createdAt')} className="sortable">
                        Created {subscriptionFilters.sortBy === 'createdAt' && (subscriptionFilters.sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredSubscriptions().map((sub) => (
                      <tr key={sub.id}>
                        <td className="table-id">{sub.id}</td>
                        <td>
                          <div className="customer-info">
                            <div className="customer-name">{sub.customerName || 'N/A'}</div>
                            <div className="customer-phone">{sub.customerPhone || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="table-email">{sub.customerEmail || 'N/A'}</td>
                        <td className="table-type">{sub.type}</td>
                        <td className="table-frequency">{sub.frequency}</td>
                        <td className="table-weight">{sub.totalWeight}kg</td>
                        <td>
                          <span className={`status-badge status-${sub.status}`}>
                            {sub.status}
                          </span>
                        </td>
                        <td className="table-date">
                          {new Date(sub.nextDelivery || sub.createdAt).toLocaleDateString()}
                        </td>
                        <td className="table-date">
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <div className="table-actions">
                            <button
                              onClick={() => {
                                setSelectedSubscription(sub);
                                setShowSubscriptionDetail(true);
                              }}
                              className="action-btn view-btn"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              onClick={() => updateSubscriptionStatus(sub, 'confirmed')}
                              className="action-btn confirm-btn"
                              title="Confirm"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => updateSubscriptionStatus(sub, 'active')}
                              className="action-btn activate-btn"
                              title="Activate"
                            >
                              ▶
                            </button>
                            <button
                              onClick={() => updateSubscriptionStatus(sub, 'paused')}
                              className="action-btn pause-btn"
                              title="Pause"
                            >
                              ⏸
                            </button>
                            <button
                              onClick={() => updateSubscriptionStatus(sub, 'cancelled')}
                              className="action-btn cancel-btn"
                              title="Cancel"
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-section">
            <h2>User Management</h2>
            <div className="admin-placeholder">
              <Users size={48} />
              <h3>User Management</h3>
              <p>User management features coming soon...</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="admin-section">
            <h2>Admin Settings</h2>
            <div className="admin-placeholder">
              <Settings size={48} />
              <h3>Settings</h3>
              <p>Admin settings and configuration coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Add New Product</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="admin-close-btn">
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Product name"
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label>Description:</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Product description"
                  className="admin-textarea"
                  rows={3}
                />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price (€/kg):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    placeholder="0.00"
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Minimum Pack (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProduct.minPack}
                    onChange={(e) => setNewProduct({...newProduct, minPack: parseFloat(e.target.value)})}
                    placeholder="0.5"
                    className="admin-input"
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Stock (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseFloat(e.target.value)})}
                    placeholder="0"
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category:</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                    className="admin-select"
                  >
                    <option value="meat">Beef</option>
                    <option value="pork">Pork</option>
                    <option value="sausages">Sausages</option>
                    <option value="achuras">Achuras</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="admin-input"
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setIsAddModalOpen(false)} className="admin-cancel-btn">
                Cancel
              </button>
              <button onClick={handleAddProduct} className="admin-save-btn">
                <Save size={16} />
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>Edit Product</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="admin-close-btn">
                <CloseIcon size={20} />
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder="Product name"
                  className="admin-input"
                />
              </div>
              <div className="admin-form-group">
                <label>Description:</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Product description"
                  className="admin-textarea"
                  rows={3}
                />
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Price (€/kg):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                    placeholder="0.00"
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Minimum Pack (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProduct.minPack}
                    onChange={(e) => setNewProduct({...newProduct, minPack: parseFloat(e.target.value)})}
                    placeholder="0.5"
                    className="admin-input"
                  />
                </div>
              </div>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label>Stock (kg):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseFloat(e.target.value)})}
                    placeholder="0"
                    className="admin-input"
                  />
                </div>
                <div className="admin-form-group">
                  <label>Category:</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})}
                    className="admin-select"
                  >
                    <option value="meat">Beef</option>
                    <option value="pork">Pork</option>
                    <option value="sausages">Sausages</option>
                    <option value="achuras">Achuras</option>
                  </select>
                </div>
              </div>
              <div className="admin-form-group">
                <label>Image URL:</label>
                <input
                  type="text"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                  className="admin-input"
                />
              </div>
            </div>
            <div className="admin-modal-footer">
              <button onClick={() => setIsEditModalOpen(false)} className="admin-cancel-btn">
                Cancel
              </button>
              <button onClick={handleUpdateProduct} className="admin-save-btn">
                <Save size={16} />
                Update Product
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className={`admin-toast ${toastType}`}>
          <div className="toast-content">
            {toastType === 'success' ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
