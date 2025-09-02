import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div style={{ padding: '2rem', color: '#E9CD9B', fontFamily: 'Inter, sans-serif', background: '#2B1F18', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: '"Cormorant Garamond", serif' }}>Asadazo</h1>
      <p>Welcome. Use the nav to explore pages.</p>
    </div>
  );
}

export default function App() {
  return (
    <div style={{ background: '#2B1F18', minHeight: '100vh' }}>
      <nav style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #E9CD9B' }}>
        <Link to="/" style={{ color: '#E9CD9B', textDecoration: 'none' }}>Home</Link>
        <Link to="/products" style={{ color: '#E9CD9B', textDecoration: 'none' }}>Products</Link>
        <Link to="/contact" style={{ color: '#E9CD9B', textDecoration: 'none' }}>Contact</Link>
        <Link to="/on-request" style={{ color: '#E9CD9B', textDecoration: 'none' }}>On Request</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
