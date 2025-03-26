import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory, brands, deviceModels } from '../data/products.jsx';
import '../styles/modelService.css';

const ModelServicePage = () => {
  const { category, brandId, modelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [products, setProducts] = useState([]);
  const [modelInfo, setModelInfo] = useState({
    description: '',
    repairProcess: '',
    videoId: ''
  });

  useEffect(() => {
    // Get brand info
    const brandInfo = brands.find(b => b.id === brandId);
    setBrand(brandInfo);

    // Get model info for this brand
    let allModels = [];
    if (deviceModels[brandId]) {
      allModels = deviceModels[brandId];
    }
    const modelData = allModels.find(m => m.id === modelId);
    setModel(modelData);

    // Get products for this category
    const categoryProducts = getProductsByCategory(category);
    setProducts(categoryProducts);

    // Set model-specific repair information (demo data)
    setModelInfo(getModelSpecificInfo(brandId, modelId, category));

    setLoading(false);
  }, [category, brandId, modelId]);

  const getModelSpecificInfo = (brand, model, category) => {
    // This would be fetched from backend in a real app
    // For now, we'll return demo content based on brand + model + category
    
    const defaultVideo = {
      mobile: 'xRH9zNCJZIY', // Generic mobile repair video
      tv: 'c9NhDl_rnMI',     // Generic TV repair video
      laptop: 'HWvJ5tXJkxk',  // Generic laptop repair video
      ac: 'jZMXQCgkL_I',     // Generic AC repair video
      'washing-machine': '34DjkM5r90I', // Generic washing machine repair
      refrigerator: '8YHQtQVhQO4' // Generic refrigerator repair
    };
    
    return {
      description: `The ${brand} ${model?.replace(/-/g, ' ')} is one of the popular models that we service frequently. We provide comprehensive repair solutions for all ${brand} ${category} models, including this specific model.`,
      repairProcess: `
        <h4>Common Issues with ${brand} ${model?.replace(/-/g, ' ')}</h4>
        <ul>
          <li>Screen damage and display issues</li>
          <li>Battery drain and charging problems</li>
          <li>Software glitches and operating system errors</li>
          <li>Water damage</li>
          <li>Audio and speaker malfunctions</li>
        </ul>
        
        <h4>Our Repair Process</h4>
        <ol>
          <li><strong>Diagnosis:</strong> Our technicians perform a thorough inspection to identify all issues with your device.</li>
          <li><strong>Quotation:</strong> We provide a transparent quote with no hidden fees.</li>
          <li><strong>Repair:</strong> Our experts use genuine parts to fix your device with precision.</li>
          <li><strong>Quality Check:</strong> Every device undergoes a comprehensive quality check before handover.</li>
          <li><strong>Warranty:</strong> We provide warranty on all repairs for your peace of mind.</li>
        </ol>
        
        <h4>DIY Repair Tips</h4>
        <p>If you're considering fixing your device yourself, here are some important tips:</p>
        <ul>
          <li>Always power off your device and remove the battery if possible before any repair attempt.</li>
          <li>Use the correct tools to avoid damaging screws or delicate components.</li>
          <li>Keep track of all screws and small parts during disassembly.</li>
          <li>Follow the video tutorial below for guidance.</li>
          <li>If you're unsure at any point, contact our professionals for assistance.</li>
        </ul>
      `,
      videoId: defaultVideo[category] || 'c9NhDl_rnMI'
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading model information...</p>
      </div>
    );
  }

  if (!brand || !model) {
    return (
      <div className="error-container">
        <h2>Model not found</h2>
        <p>The brand or model you're looking for doesn't exist.</p>
        <Link to={`/services/${category}`} className="btn-primary">
          Browse All {category.charAt(0).toUpperCase() + category.slice(1)} Services
        </Link>
      </div>
    );
  }

  return (
    <div className="model-service-page">
      <div className="model-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/services">Services</Link> {' > '}
            <Link to={`/services/${category}`}>{category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Link> {' > '}
            <Link to={`/services/${category}/${brandId}`}>{brand.name}</Link> {' > '}
            <span>{model.name}</span>
          </div>
          
          <div className="model-title">
            <div className="brand-logo">
              <img 
                src={`/images/brands/${brandId}.png`} 
                alt={brand.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder-brand.png';
                }}
              />
            </div>
            <h1>{brand.name} {model.name} Repair Services</h1>
          </div>
          
          <p className="model-description">
            Expert repair solutions for all {brand.name} {model.name} issues. 
            We offer same-day service with genuine parts and warranties.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="model-content">
          <section className="model-services">
            <h2>Available Services for {brand.name} {model.name}</h2>
            <div className="services-grid">
              {products.map(product => (
                <div key={product.id} className="service-card">
                  <div className="service-image">
                    <img 
                      src={product.image} 
                      alt={product.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/service-placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="service-details">
                    <h3>{product.title}</h3>
                    <div className="model-badge">{brand.name} {model.name}</div>
                    <p>{product.description.substring(0, 100)}...</p>
                    <div className="service-meta">
                      <div className="service-price">{Object.values(product.price)[0]}</div>
                      <div className="service-rating">
                        <i className="fas fa-star"></i> {product.rating} ({product.reviewCount})
                      </div>
                    </div>
                    <div className="service-actions">
                      <Link to={`/products/${product.id}`} className="view-details-btn">
                        View Details
                      </Link>
                      <button className="add-to-cart-btn">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="repair-guide">
            <h2>Repair Guide for {brand.name} {model.name}</h2>
            <div className="guide-content">
              <p>{modelInfo.description}</p>
              <div dangerouslySetInnerHTML={{ __html: modelInfo.repairProcess }} />
            </div>
          </section>

          <section className="video-tutorial">
            <h2>Video Repair Tutorial</h2>
            <div className="video-container">
              <iframe 
                width="100%" 
                height="500" 
                src={`https://www.youtube.com/embed/${modelInfo.videoId}`}
                title={`${brand.name} ${model.name} Repair Tutorial`}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-description">
              <p>
                This tutorial shows you how to repair common issues with your {brand.name} {model.name}. 
                Follow along for step-by-step instructions, or contact our professionals for expert assistance.
              </p>
              <div className="cta-buttons">
                <Link to="/book-service" className="btn-primary">Book a Professional Repair</Link>
                <Link to="/contact" className="btn-secondary">Get Help</Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModelServicePage; 