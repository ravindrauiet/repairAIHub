import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { auth, getCurrentUser, isUserAdmin } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ServiceCategoryPage from './pages/ServiceCategoryPage';
import ModelServicePage from './pages/ModelServicePage';
import ContactPage from './pages/ContactPage';
import BookServicePage from './pages/BookServicePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import TechniciansPage from './pages/TechniciansPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import CareersPage from './pages/CareersPage';
import BrandsPage from './pages/BrandsPage';
import DiyGuidesPage from './pages/DiyGuidesPage';
import ModelProducts from './components/ModelProducts';
import AdminDashboard from './pages/AdminDashboard';

import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/services.css';
import './styles/contact.css';
import './styles/booking.css';
import './styles/products.css';
import './styles/productDetail.css';
import './styles/cart.css';
import './styles/technicians.css';
import './styles/auth.css';
import './styles/profile.css';
import './styles/careers.css';
import './styles/serviceCategory.css';
import './styles/modelService.css';
import './styles/brandModelSelector.css';

// Import JavaScript
import './scripts/navigation.js';

// Layout wrapper component
const AppLayout = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  // Don't show header/footer for admin routes
  if (isAdminRoute) {
    return children;
  }
  
  return (
    <>
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Use Firebase Authentication to check login state
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        
        // Get user data including role
        const userData = await getCurrentUser();
        if (userData && userData.role) {
          setUserRole(userData.role);
          setIsAdmin(userData.role === 'admin');
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    
    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Load FontAwesome icons
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/js/all.min.js';
    script.integrity = 'sha512-Tn2m0TIpgVyTzzvmxLNuqbSJH3JP8jm+Cy3hvHrW7ndTDcJ1w5mBiksqDBb8GpE2ksktFvDB/ykZ0mDpsZj20w==';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <HelmetProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="app">
              <Routes>
                {/* Only allow admin routes for users with admin role */}
                <Route 
                  path="/admin/*" 
                  element={isAdmin ? <AdminDashboard /> : <LoginPage setIsLoggedIn={setIsLoggedIn} />} 
                />
                
                <Route path="/*" element={
                  <AppLayout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/services/:category/:brandId/:modelId" element={<ModelServicePage />} />
                      <Route path="/services/category/:category" element={<ServiceCategoryPage />} />
                      <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/products/:productId" element={<ProductDetailPage />} />
                      <Route path="/products/model/:modelId" element={<ModelProducts />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/book-service" element={<BookServicePage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/technicians" element={<TechniciansPage />} />
                      <Route path="/careers" element={<CareersPage />} />
                      <Route path="/brands" element={<BrandsPage />} />
                      <Route path="/diy-guides" element={<DiyGuidesPage />} />
                    </Routes>
                  </AppLayout>
                } />
              </Routes>
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </HelmetProvider>
  );
}

export default App;
