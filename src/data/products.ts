import type { Product } from '../types';

export const products: Product[] = [
  // Meat (Carne) - Beef cuts
  {
    id: 'entrana',
    name: 'Entraña',
    price: 24,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Premium skirt steak, perfect for grilling',
    image: '/images/entrana.jpg'
  },
  {
    id: 'cuadril',
    name: 'Cuadril',
    price: 24,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Top sirloin, tender and flavorful',
    image: '/images/cuadril.jpg'
  },
  {
    id: 'vacio',
    name: 'Vacío',
    price: 22,
    pricePerKg: true,
    minPack: 2,
    stock: 0,
    category: 'meat',
    description: 'Flank steak, perfect for asado',
    image: '/images/vacio.jpg'
  },
  {
    id: 'bola-de-lomo',
    name: 'Bola de Lomo',
    price: 26,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Eye of round, lean and tender',
    image: '/images/bola-de-lomo.jpg'
  },
  {
    id: 'peceto',
    name: 'Peceto',
    price: 26,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Top round, excellent for roasting',
    image: '/images/peceto.jpg'
  },
  {
    id: 'asado',
    name: 'Asado (costillar marcado)',
    price: 22,
    pricePerKg: true,
    minPack: 10,
    stock: 0,
    category: 'meat',
    description: 'Rib rack, traditional asado cut',
    image: '/images/asado.jpg'
  },
  {
    id: 'tira-de-asado',
    name: 'Tira de Asado',
    price: 22,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Short ribs, classic asado',
    image: '/images/tira-de-asado.jpg'
  },
  {
    id: 'bife-de-chorizo',
    name: 'Bife de Chorizo',
    price: 28,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Strip steak, premium grilling cut',
    image: '/images/bife-de-chorizo.jpg'
  },
  {
    id: 'ojo-de-bife',
    name: 'Ojo de Bife',
    price: 45,
    pricePerKg: true,
    minPack: 2.5,
    stock: 0,
    category: 'meat',
    description: 'Ribeye steak, marbled and juicy',
    image: '/images/ojo-de-bife.jpg'
  },
  {
    id: 'lomo',
    name: 'Lomo',
    price: 47,
    pricePerKg: true,
    minPack: 2.5,
    stock: 0,
    category: 'meat',
    description: 'Tenderloin, the most tender cut',
    image: '/images/lomo.jpg'
  },
  {
    id: 'colita-de-cuadril',
    name: 'Colita de Cuadril',
    price: 26,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Tri-tip, flavorful and versatile',
    image: '/images/colita-de-cuadril.jpg'
  },
  {
    id: 'paleta',
    name: 'Paleta',
    price: 18,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Chuck roast, perfect for slow cooking',
    image: '/images/paleta.jpg'
  },
  {
    id: 'falda',
    name: 'Falda',
    price: 16,
    pricePerKg: true,
    minPack: 0.5,
    stock: 0,
    category: 'meat',
    description: 'Skirt steak, great for tacos',
    image: '/images/falda.jpg'
  },
  {
    id: 'matambre',
    name: 'Matambre',
    price: 21,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Flank steak roll, traditional preparation',
    image: '/images/matambre.jpg'
  },
  {
    id: 'picana',
    name: 'Picaña',
    price: 34,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Top sirloin cap, Brazilian favorite',
    image: '/images/picana.jpg'
  },

  // Pork cuts
  {
    id: 'matambre-de-cerdo',
    name: 'Matambre de Cerdo',
    price: 21,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'pork',
    description: 'Pork flank, perfect for grilling',
    image: '/images/matambre-de-cerdo.jpg'
  },
  {
    id: 'bondiola',
    name: 'Bondiola',
    price: 19,
    pricePerKg: true,
    minPack: 2,
    stock: 0,
    category: 'pork',
    description: 'Pork shoulder, great for roasting',
    image: '/images/bondiola.jpg'
  },
  {
    id: 'costilla-de-cerdo',
    name: 'Costilla de Cerdo',
    price: 18,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'pork',
    description: 'Pork ribs, perfect for BBQ',
    image: '/images/costilla-de-cerdo.jpg'
  },
  {
    id: 'lomo-de-cerdo',
    name: 'Lomo de Cerdo',
    price: 24,
    pricePerKg: true,
    minPack: 2,
    stock: 0,
    category: 'pork',
    description: 'Pork tenderloin, lean and tender',
    image: '/images/lomo-de-cerdo.jpg'
  },
  {
    id: 'chuleta-de-cerdo',
    name: 'Chuleta de Cerdo',
    price: 20,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'pork',
    description: 'Pork chops, classic cut',
    image: '/images/chuleta-de-cerdo.jpg'
  },
  {
    id: 'pernil',
    name: 'Pernil',
    price: 17,
    pricePerKg: true,
    minPack: 0,
    stock: 0,
    category: 'pork',
    description: 'Pork leg, traditional roast',
    image: '/images/pernil.jpg'
  },

  // Sausages
  {
    id: 'chorizo-criollo',
    name: 'Chorizo Criollo',
    price: 18,
    pricePerKg: true,
    minPack: 0.3,
    stock: 0,
    category: 'sausages',
    description: 'Traditional Argentine chorizo',
    image: '/images/chorizo-criollo.jpg'
  },
  {
    id: 'morcilla',
    name: 'Morcilla',
    price: 18,
    pricePerKg: true,
    minPack: 0.3,
    stock: 0,
    category: 'sausages',
    description: 'Blood sausage, rich and flavorful',
    image: '/images/morcilla.jpg'
  },
  {
    id: 'chorizo-parrillero',
    name: 'Chorizo Parrillero',
    price: 19,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'sausages',
    description: 'Grilling chorizo, perfect for asado',
    image: '/images/chorizo-parrillero.jpg'
  },
  {
    id: 'salchicha-parrillera',
    name: 'Salchicha Parrillera',
    price: 18,
    pricePerKg: true,
    minPack: 0.3,
    stock: 0,
    category: 'sausages',
    description: 'Grilling sausages, classic asado',
    image: '/images/salchicha-parrillera.jpg'
  },

  // Achuras (Offal)
  {
    id: 'chinchulines',
    name: 'Chinchulines',
    price: 32,
    pricePerKg: true,
    minPack: 0.5,
    stock: 0,
    category: 'achuras',
    description: 'Small intestines, grilled to perfection',
    image: '/images/chinchulines.jpg'
  },
  {
    id: 'molleja',
    name: 'Molleja',
    price: 45,
    pricePerKg: true,
    minPack: 0.5,
    stock: 0,
    category: 'achuras',
    description: 'Sweetbreads, a delicacy',
    image: '/images/molleja.jpg'
  },
  {
    id: 'tripa-gorda',
    name: 'Tripa Gorda',
    price: 18,
    pricePerKg: true,
    minPack: 0.5,
    stock: 0,
    category: 'achuras',
    description: 'Large intestines, for stuffing',
    image: '/images/tripa-gorda.jpg'
  }
];

export const getProductsByCategory = (category: Product['category']) => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};

export const getCategories = () => {
  return [
    { id: 'all', name: 'All Products', label: 'Todos los Productos' },
    { id: 'meat', name: 'Beef', label: 'Carne de Res' },
    { id: 'pork', name: 'Pork', label: 'Cerdo' },
    { id: 'sausages', name: 'Sausages', label: 'Embutidos' },
    { id: 'achuras', name: 'Offal', label: 'Achuras' }
  ];
};
