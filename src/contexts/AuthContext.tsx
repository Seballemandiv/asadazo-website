import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string, phone: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin user
const MOCK_ADMIN: User = {
  id: '1',
  email: 'admin@asadazo.com',
  password: 'admin123',
  name: 'Admin User',
  role: 'admin',
  createdAt: new Date('2024-01-01'),
  lastLogin: new Date()
};

// Mock users array
const MOCK_USERS: User[] = [
  MOCK_ADMIN,
  {
    id: '2',
    email: 'customer@example.com',
    password: 'customer123',
    name: 'John Doe',
    role: 'customer',
    phone: '+31 6 12345678',
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date()
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('asadazo_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('asadazo_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Find user in mock data
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Update last login
      foundUser.lastLogin = new Date();
      
      // Save to localStorage
      localStorage.setItem('asadazo_user', JSON.stringify(foundUser));
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  const logout = () => {
    localStorage.removeItem('asadazo_user');
    setUser(null);
  };

  const register = async (name: string, email: string, password: string, phone: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    // Create new customer user
    const newUser: User = {
      id: (MOCK_USERS.length + 1).toString(),
      email,
      password,
      name,
      role: 'customer',
      phone,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    // Add to mock users array
    MOCK_USERS.push(newUser);

    // Save to localStorage and set as current user
    localStorage.setItem('asadazo_user', JSON.stringify(newUser));
    setUser(newUser);
    
    return true;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
