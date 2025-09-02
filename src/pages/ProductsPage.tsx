import React from 'react';
import { products } from '../data/products';

export default function ProductsPage() {
  return (
    <div className="page container">
      <h1 className="title">Our signature cuts</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1.25rem' }}>
        {products.map((p) => (
          <div key={p.id} className="card" style={{ backdropFilter: 'blur(8px)' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{p.name}</h3>
            <p style={{ margin: '0 0 0.75rem', opacity: 0.9 }}>{p.description}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.95 }}>
              <span>€{p.pricePerKg.toFixed(2)}/kg</span>
              <span>Min: {p.minPackKg}kg</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
