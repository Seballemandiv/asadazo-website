import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import AppShell from './components/AppShell';
import Hero from './components/Hero';
import FeaturesSection from './components/FeaturesSection';
import About from './components/About';
import Contact from './components/Contact';
import Delivery from './components/Delivery';
import OnRequest from './components/OnRequest';
import ProductsPage from './components/ProductsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubscriptionPage from './pages/SubscriptionPage';
import ProtectedRoute from './components/ProtectedRoute';
import MediaLinks from './components/MediaLinks';
import './components.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={
                <AppShell>
                  <Hero />
		   <MediaLinks />
                  <FeaturesSection />
                </AppShell>
              } />
              <Route path="/products" element={
                <AppShell>
                  <ProductsPage />
                </AppShell>
              } />
              <Route path="/about" element={
                <AppShell>
                  <About />
                </AppShell>
              } />
              <Route path="/contact" element={
                <AppShell>
                  <Contact />
                </AppShell>
              } />
              <Route path="/on-request" element={
                <AppShell>
                  <OnRequest />
                </AppShell>
              } />
              <Route path="/faq" element={
                <AppShell>
                  <Delivery />
                </AppShell>
              } />
              <Route path="/login" element={
                <AppShell>
                  <LoginPage />
                </AppShell>
              } />
              <Route path="/register" element={
                <AppShell>
                  <RegisterPage />
                </AppShell>
              } />
              <Route
                path="/subscriptions"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <SubscriptionPage />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <CustomerDashboard />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AppShell>
                      <AdminDashboard />
                    </AppShell>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
