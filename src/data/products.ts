export type Product = {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  minPackKg: number;
  image?: string;
};

export const products: Product[] = [
  { id: 'entrana', name: 'Entraña', description: 'Premium skirt steak, perfect for grilling', pricePerKg: 24, minPackKg: 1 },
  { id: 'cuadril', name: 'Cuadril', description: 'Top sirloin, tender and flavorful', pricePerKg: 24, minPackKg: 1 },
  { id: 'vacio', name: 'Vacío', description: 'Flank steak, perfect for asado', pricePerKg: 22, minPackKg: 2 },
  { id: 'bola-de-lomo', name: 'Bola de Lomo', description: 'Eye of round, lean and tender', pricePerKg: 26, minPackKg: 1 },
  { id: 'peceto', name: 'Peceto', description: 'Top round, excellent for roasting', pricePerKg: 26, minPackKg: 1 },
  { id: 'asado-costillar-marcado', name: 'Asado (costillar marcado)', description: 'Rib rack, traditional asado cut', pricePerKg: 22, minPackKg: 10 },
  { id: 'tira-de-asado', name: 'Tira de Asado', description: 'Short ribs, classic asado', pricePerKg: 22, minPackKg: 1 },
  { id: 'bife-de-chorizo', name: 'Bife de Chorizo', description: 'Strip steak, premium grilling cut', pricePerKg: 28, minPackKg: 1 },
  { id: 'ojo-de-bife', name: 'Ojo de Bife', description: 'Ribeye steak, marbled and juicy', pricePerKg: 45, minPackKg: 2.5 },
  { id: 'lomo', name: 'Lomo', description: 'Tenderloin, the most tender cut', pricePerKg: 47, minPackKg: 2.5 },
  { id: 'colita-de-cuadril', name: 'Colita de Cuadril', description: 'Tri-tip, flavorful and versatile', pricePerKg: 26, minPackKg: 1 },
  { id: 'paleta', name: 'Paleta', description: 'Chuck roast, perfect for slow cooking', pricePerKg: 18, minPackKg: 1 },
  { id: 'falda', name: 'Falda', description: 'Skirt steak, great for tacos', pricePerKg: 16, minPackKg: 0.5 },
  { id: 'matambre', name: 'Matambre', description: 'Flank steak roll, traditional preparation', pricePerKg: 21, minPackKg: 1 },
  { id: 'picania', name: 'Picaña', description: 'Top sirloin cap, Brazilian favorite', pricePerKg: 34, minPackKg: 1 },

  // Pork
  { id: 'matambre-de-cerdo', name: 'Matambre de Cerdo', description: 'Pork flank, perfect for grilling', pricePerKg: 21, minPackKg: 1 },
  { id: 'bondiola', name: 'Bondiola', description: 'Pork shoulder, great for roasting', pricePerKg: 19, minPackKg: 2 },
  { id: 'costilla-de-cerdo', name: 'Costilla de Cerdo', description: 'Pork ribs, perfect for BBQ', pricePerKg: 18, minPackKg: 1 },
  { id: 'lomo-de-cerdo', name: 'Lomo de Cerdo', description: 'Pork tenderloin, lean and tender', pricePerKg: 24, minPackKg: 2 },
  { id: 'chuleta-de-cerdo', name: 'Chuleta de Cerdo', description: 'Pork chops, classic cut', pricePerKg: 20, minPackKg: 1 },
  { id: 'pernil', name: 'Pernil', description: 'Pork leg, traditional roast (min by request)', pricePerKg: 17, minPackKg: 0 },

  // Sausages
  { id: 'chorizo-criollo', name: 'Chorizo Criollo', description: 'Traditional Argentine chorizo', pricePerKg: 18, minPackKg: 0.3 },
  { id: 'morcilla', name: 'Morcilla', description: 'Blood sausage, rich and flavorful', pricePerKg: 18, minPackKg: 0.3 },
  { id: 'chorizo-parrillero', name: 'Chorizo Parrillero', description: 'Grilling chorizo, perfect for asado', pricePerKg: 19, minPackKg: 1 },
  { id: 'salchicha-parrillera', name: 'Salchicha Parrillera', description: 'Grilling sausages, classic asado', pricePerKg: 18, minPackKg: 0.3 },

  // Achuras
  { id: 'chinchulines', name: 'Chinchulines', description: 'Small intestines, grilled to perfection', pricePerKg: 32, minPackKg: 0.5 },
  { id: 'molleja', name: 'Molleja', description: 'Sweetbreads, a delicacy', pricePerKg: 45, minPackKg: 0.5 },
  { id: 'tripa-gorda', name: 'Tripa Gorda', description: 'Large intestines, for stuffing', pricePerKg: 18, minPackKg: 0.5 }
];
