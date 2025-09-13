export interface Product {
  id: string;
  name: string;
  price: number;
  pricePerKg: boolean;
  minPack: number;
  stock: number;
  category: 'meat' | 'pork' | 'sausages' | 'achuras';
  description?: string;
  image?: string;
  priceOnRequest?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'customer';
  phone?: string;
  address?: Address;
  savedAddresses?: Address[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface Address {
  street: string;
  number?: string;
  city: string;
  region?: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  deliveryAddress: Address;
  pickupOption?: boolean;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  deliveryDate?: Date;
  notes?: string;
  paymentMethod?: PaymentMethod;
  trackingNumber?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_transfer' | 'klarna' | 'ideal';
  last4?: string;
  brand?: string;
  isDefault: boolean;
  iban?: string;
  accountHolder?: string;
  idealBank?: string;
}

export interface CustomerProfile {
  user: User;
  orders: Order[];
  paymentMethods: PaymentMethod[];
  preferences: {
    newsletter: boolean;
    marketing: boolean;
    language: 'en' | 'es' | 'nl';
  };
}

export interface Language {
  code: 'en' | 'es' | 'nl';
  name: string;
  flag: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'delivery' | 'products' | 'allergens';
}

export interface Subscription {
  id: string;
  userId: string;
  type: 'weekly' | 'monthly' | 'custom';
  totalWeight: number; // 4kg for weekly, 12kg for monthly, custom for custom
  selectedProducts: SubscriptionProduct[];
  frequency: 'weekly' | 'monthly';
  status: 'pending review' | 'confirmed' | 'active' | 'paused' | 'cancelled';
  nextDelivery: Date;
  createdAt: Date;
  lastModified: Date;
  notes?: string;
  deliveryAddress: Address;
  pickupOption?: boolean;
}

export interface SubscriptionProduct {
  productId: string;
  productName: string;
  weight: number; // in kg
  price: number;
  isSuggestion?: boolean; // true if it's our suggestion, false if customer chose
}

export interface SubscriptionSuggestion {
  productId: string;
  productName: string;
  reason: string; // why we suggest this product
  weight: number;
  price: number;
}
