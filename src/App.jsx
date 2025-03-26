import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartProvider } from './context/CartContext';
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
import ModelProducts from './components/ModelProducts';

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

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  // Load FontAwesome icons
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://kit.fontawesome.com/a076d05399.js';
    script.crossOrigin = 'anonymous';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Header isLoggedIn={isLoggedIn} />
          <main className="main-content">
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
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
