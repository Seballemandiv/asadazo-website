import type { Product } from '../types';

export const products: Product[] = [
  // Meat (Carne) - Beef cuts
  {
    id: 'entraña',
    name: 'Entrana',
    price: 24,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Premium skirt steak.',
    image: '/images/Products/entrana.jpg'
  },
  {
    id: 'cuadril',
    name: 'Colita de cuadril',
    price: 24,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Top sirloin.',
    image: '/images/Products/Colita-de-cuadril.jpg'
  },
  {
    id: 'vacio',
    name: 'Vacío',
    price: 22,
    pricePerKg: true,
    minPack: 2,
    stock: 0,
    category: 'meat',
    description: 'Flank steak.',
    image: '/images/Products/Vacio.jpg'
  },
  {
    id: 'peceto',
    name: 'Peceto',
    price: 26,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Top round.',
    image: '/images/Products/Peceto.jpg'
  },
  {
    id: 'asado',
    name: 'Asado',
    price: 22,
    pricePerKg: true,
    minPack: 10,
    stock: 0,
    category: 'meat',
    description: 'Traditional asado cut \(Costillar marcado on request\)',
    image: '/images/Products/Asado.jpg'
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
    image: '/images/Products/Bife-de-chorizo.jpg'
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
    image: '/images/Products/Ojo-de-bife.jpg'
  },
  {
    id: 'lomo',
    name: 'Bola de Lomo',
    price: 47,
    pricePerKg: true,
    minPack: 2.5,
    stock: 0,
    category: 'meat',
    description: 'Tenderloin, the most tender cut',
    image: '/images/Products/Bola-de-lomo.jpg'
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
    image: '/images/Products/paleta.jpg'
  },
  {
    id: 'falda',
    name: 'Falda',
    price: 16,
    pricePerKg: true,
    minPack: 0.5,
    stock: 0,
    category: 'meat',
    description: 'Skirt steak.',
    image: '/images/Products/falda.jpg'
  },
  {
    id: 'matambre-de-novillo',
    name: 'Matambre de Novillo',
    price: 21,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Flank steak roll.',
    image: '/images/Products/Matambre-de-novillo.jpg'
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
    image: '/images/Products/picana.jpg'
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
    description: 'Pork Flank steak roll',
    image: '/images/Products/Matambre-de-cerdo.jpg'
  },
  {
    id: 'bondiola',
    name: 'Bondiola de Cerdo',
    price: 19,
    pricePerKg: true,
    minPack: 2,
    stock: 0,
    category: 'pork',
    description: 'Pork shoulder',
    image: '/images/Products/Bondiola-de-cerdo.jpg'
  },
  {
    id: 'costilla-de-cerdo',
    name: 'Costilla de Cerdo',
    price: 18,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'pork',
    description: 'Pork ribs',
    image: '/images/Products/Costilla-de-cerdo.jpg'
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
    image: '/images/Products/lomo-de-cerdo.jpg'
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
    image: '/images/Products/chuleta-de-cerdo.jpg'
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
    image: '/images/Products/pernil.jpg'
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
    image: '/images/Products/chorizo-criollo-argentino.jpg'
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
    image: '/images/Products/morcilla-dulce.jpg'
  },
  {
    id: 'salchicha-parrillera',
    name: 'Salchicha Parrillera',
    price: 18,
    pricePerKg: true,
    minPack: 0.3,
    stock: 0,
    category: 'sausages',
    description: 'Grilling sausages',
    image: '/images/Products/Salchicha-parrillera.jpg'
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
    description: 'Small intestines',
    image: '/images/Products/Chinchulines.jpg'
  },
  {
    id: 'molleja',
    name: 'Molleja de Corazon',
    price: 45,
    pricePerKg: true,
    minPack: 0.5,
    stock: 0,
    category: 'achuras',
    description: 'Sweetbreads, a delicacy',
    image: '/images/Products/Molleja.jpg'
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
