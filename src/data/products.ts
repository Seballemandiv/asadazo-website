import type { Product } from '../types';

export const products: Product[] = [
  // Meat (Carne) - Beef cuts
  {
    id: 'entraña',
    name: 'Entrana',
    price: 24,
    pricePerKg: true,
    minPack: 1,
    stock: 20,
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
    stock: 15,
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
    stock: 25,
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
    stock: 12,
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
    stock: 30,
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
    stock: 18,
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
    stock: 10,
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
    stock: 8,
    category: 'meat',
    description: 'Tenderloin, the most tender cut',
    image: '/images/Products/Bola-de-lomo.jpg'
  },
  {
    id: 'milanesa-de-cuadrada',
    name: 'Milanesa de cuadrada',
    price: 27,
    pricePerKg: true,
    minPack: 1,
    stock: 22,
    category: 'meat',
    description: 'Square cut chuck schnitzel',
    image: '/images/Products/milanesa-de-cuadrada.jpg'
  },
  {
    id: 'milanesa-de-nalga',
    name: 'Milanesa de nalga',
    price: 28,
    pricePerKg: true,
    minPack: 1,
    stock: 16,
    category: 'meat',
    description: 'Top round schnitzel.',
    image: '/images/Products/milanesa-de-nalga.jpg'
  },
  {
    id: 'lomo-de-novillo',
    name: 'lomo-de-novillo',
    price: 58,
    pricePerKg: true,
    minPack: 1,
    stock: 6,
    category: 'meat',
    description: 'Premium tenderloin',
    image: '/images/Products/lomo-de-novillo.jpg'
  },
  {
    id: 'matambre-de-novillo',
    name: 'Matambre de Novillo',
    price: 21,
    pricePerKg: true,
    minPack: 1,
    stock: 14,
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
    stock: 9,
    category: 'meat',
    description: 'Top sirloin cap',
    image: '/images/Products/Picana.jpg'
  },

  // Pork cuts
  {
    id: 'matambre-de-cerdo',
    name: 'Matambre de Cerdo',
    price: 21,
    pricePerKg: true,
    minPack: 1,
    stock: 11,
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
    stock: 40,
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
    stock: 35,
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
    stock: 27,
    category: 'pork',
    description: 'Pork tenderloin, lean and tender',
    image: '/images/Products/lomo-de-cerdo.jpg'
  },
  // Sausages
  {
    id: 'chorizo-criollo',
    name: 'Chorizo Criollo',
    price: 18,
    pricePerKg: true,
    minPack: 0.3,
    stock: 19,
    category: 'sausages',
    description: 'Traditional Argentine chorizo',
    image: '/images/Products/Chorizo-criollo-argentino.jpg'
  },
  {
    id: 'salchicha-parrillera',
    name: 'Salchicha Parrillera',
    price: 18,
    pricePerKg: true,
    minPack: 0.3,
    stock: 13,
    category: 'sausages',
    description: 'Grilling sausages',
    image: '/images/Products/Salchicha-parrillera.jpg'
  },

  // Achuras (Offal)
  {
    id: 'morcilla',
    name: 'Morcilla dulce',
    price: 18,
    pricePerKg: true,
    minPack: 0.3,
    stock: 17,
    category: 'achuras',
    description: 'Blood sausage, rich and flavorful',
    image: '/images/Products/morcilla-dulce.jpg'
  },
  {
    id: 'chinchulines',
    name: 'Chinchulines',
    price: 32,
    pricePerKg: true,
    minPack: 0.5,
    stock: 21,
    category: 'achuras',
    description: 'Small intestines.',
    image: '/images/Products/Chinchulines.jpg'
  },
  {
    id: 'Morcilla bombón',
    name: 'Morcilla bombón criolla',
    price: 18,
    pricePerKg: true,
    minPack: 0.5,
    stock: 7,
    category: 'achuras',
    description: 'Morcilla bombón criolla',
    image: '/images/Products/morcilla-bombon.jpg'
  },
  {
    id: 'molleja',
    name: 'Molleja de Corazon',
    price: 45,
    pricePerKg: true,
    minPack: 0.5,
    stock: 15,
    category: 'achuras',
    description: 'Sweetbreads, a delicacy',
    image: '/images/Products/Molleja.jpg'
  },
  {
    id: 'morcilla rueda',
    name: 'Morcilla rueda',
    price: 18,
    pricePerKg: true,
    minPack: 0.5,
    stock: 20,
    category: 'achuras',
    description: 'cutting of black pudding wheel',
    image: '/images/Products/morcilla-rueda.jpg'
  }
,{
    id: 'bife-ancho',
    name: 'Bife Ancho',
    price: 45,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Rib Eye',
    image: '/images/Products/Bife Ancho.jpg'
  },{
    id: 'bife-angosto',
    name: 'Bife angosto',
    price: 34,
    pricePerKg: true,
    minPack: 1,
    stock: 0,
    category: 'meat',
    description: 'Striploin',
    image: '/images/Products/Bife Angosto.jpg'
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









