import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../components/common/Breadcrumb';
import '../styles/brands.css';

const BrandsPage = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/brands');
        setBrands(response.data.brands || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands. Please try again later.');
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Fallback brands data if API fails
  const fallbackBrands = [
    { id: 1, name: 'Apple', image: '/images/brands/apple.png', description: 'Repair services for all Apple devices including iPhone, iPad, MacBook, and more.' },
    { id: 2, name: 'Samsung', image: '/images/brands/samsung.png', description: 'Expert repair for all Samsung devices including Galaxy phones, tablets, and TVs.' },
    { id: 3, name: 'Sony', image: '/images/brands/sony.png', description: 'Professional repair services for Sony products including TVs, PlayStation, cameras, and more.' },
    { id: 4, name: 'LG', image: '/images/brands/lg.png', description: 'Quality repair solutions for LG devices including smartphones, TVs, and home appliances.' },
    { id: 5, name: 'Google', image: '/images/brands/google.png', description: 'Specialized repair services for Google Pixel phones and other Google devices.' },
    { id: 6, name: 'Xiaomi', image: '/images/brands/xiaomi.png', description: 'Reliable repair for all Xiaomi devices including smartphones, tablets, and smart home products.' },
    { id: 7, name: 'OnePlus', image: '/images/brands/oneplus.png', description: 'Expert repair services for all OnePlus smartphone models.' },
    { id: 8, name: 'Huawei', image: '/images/brands/huawei.png', description: 'Professional repair solutions for Huawei smartphones, tablets, and laptops.' },
    { id: 9, name: 'Lenovo', image: '/images/brands/lenovo.png', description: 'Comprehensive repair services for Lenovo laptops, tablets, and smartphones.' },
    { id: 10, name: 'Dell', image: '/images/brands/dell.png', description: 'Quality repair solutions for Dell laptops, desktops, and monitors.' },
    { id: 11, name: 'HP', image: '/images/brands/hp.png', description: 'Expert repair for HP laptops, desktops, and printers.' },
    { id: 12, name: 'Asus', image: '/images/brands/asus.png', description: 'Professional repair services for Asus laptops, smartphones, and monitors.' }
  ];

  // Use fallback data if API fails or returns empty
  const displayBrands = brands.length > 0 ? brands : fallbackBrands;

  return (
    <div className="brands-page">
      <div className="page-banner">
        <div className="container">
          <h1>Brands We Service</h1>
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'Brands', path: '/brands' }
          ]} />
        </div>
      </div>

      <div className="container section-padding">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading brands...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="material-icons">error</i>
            <p>{error}</p>
          </div>
        ) : (
          <>
            <div className="section-intro">
              <h2>Top Device Brands We Repair</h2>
              <p>We offer professional repair services for all major brands. Select a brand to see the available repair services.</p>
            </div>

            <div className="brands-grid">
              {displayBrands.map((brand) => (
                <div className="brand-card" key={brand.id}>
                  <div className="brand-image">
                    <img 
                      src={brand.image || `https://via.placeholder.com/150x150?text=${brand.name}`} 
                      alt={`${brand.name} logo`} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://via.placeholder.com/150x150?text=${brand.name}`;
                      }}
                    />
                  </div>
                  <div className="brand-content">
                    <h3>{brand.name}</h3>
                    <p>{brand.description || `Professional repair services for all ${brand.name} devices`}</p>
                    <Link to={`/services/brand/${brand.name.toLowerCase()}`} className="btn btn-primary">
                      View Services
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-cta">
              <h3>Don't see your brand?</h3>
              <p>We repair many more brands and devices not listed here. Contact us for any repair needs!</p>
              <Link to="/contact" className="btn btn-secondary">Contact Us</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BrandsPage; 