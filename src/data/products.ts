export type Product = {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  minPackKg: number;
  image?: string;
};

export const products: Product[] = [
  { id: 'entrania', name: 'Entraña', description: 'Premium skirt steak, perfect for grilling', pricePerKg: 24, minPackKg: 1 },
  { id: 'vacio', name: 'Vacío', description: 'Flank steak, perfect for asado', pricePerKg: 22, minPackKg: 2 },
  { id: 'tira-asado', name: 'Tira de Asado', description: 'Short ribs, classic asado', pricePerKg: 22, minPackKg: 1 },
  { id: 'picania', name: 'Picaña', description: 'Top sirloin cap, Brazilian favorite', pricePerKg: 34, minPackKg: 1 }
];
