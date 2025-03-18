import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import ContactPage from './pages/ContactPage';
import BookServicePage from './pages/BookServicePage';
import ProductPage from './pages/ProductPage';
import TechniciansPage from './pages/TechniciansPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';

import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/services.css';
import './styles/contact.css';
import './styles/booking.css';
import './styles/products.css';
import './styles/technicians.css';
import './styles/auth.css';
import './styles/profile.css';

// Import JavaScript
import './scripts/navigation.js';

function App() {
  // Load FontAwesome icons
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    link.integrity = 'sha512-9usAa10IRO0HhonpyAIVpjrylPvoDwiPUiKdWk5t3PyolY1cOd4DSE0Ga+ri4AuTroPR5aQvXU9xC6qOPnzFeg==';
    link.crossOrigin = 'anonymous';
    link.referrerPolicy = 'no-referrer';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book-service" element={<BookServicePage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/technicians" element={<TechniciansPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
