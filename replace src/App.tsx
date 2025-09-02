import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ContactPage from './pages/ContactPage';
import OnRequestPage from './pages/OnRequestPage';

function Home() {
  return (
    <div className="page container">
      <h1 className="title">Asadazo</h1>
      <p>Welcome. Use the navigation to explore pages.</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <header className="header">
        <div className="container nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/on-request">On Request</Link>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/on-request" element={<OnRequestPage />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
