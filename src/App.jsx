import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import TechniciansPage from './pages/TechniciansPage';
import ProductsPage from './pages/ProductsPage';
import NotFoundPage from './pages/NotFoundPage';

// Import CSS files
import './styles/globals.css';
import './styles/layout.css';
import './styles/services.css';
import './styles/forms.css';
import './styles/technicians.css';
import './styles/contact.css';
import './styles/home.css';
import './styles/booking.css';
import './styles/products.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/technicians" element={<TechniciansPage />} />
          <Route path="/book-service" element={<BookingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
