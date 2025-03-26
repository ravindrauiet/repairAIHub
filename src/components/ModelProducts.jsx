import React from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByModel } from '../data/products';
import '../styles/modelProducts.css';

const ModelProducts = () => {
  const { modelId } = useParams();
  const products = getProductsByModel(modelId);

  if (!products.length) {
    return (
      <div className="model-products-container">
        <h2>No products found for this model</h2>
      </div>
    );
  }

  return (
    <div className="model-products-container">
      <h2>Available Services</h2>
      <div className="model-products-grid">
        {products.map((product) => (
          <div key={product.id} className="model-product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p className="description">{product.description}</p>
              <div className="price-rating">
                <span className="price">{product.price}</span>
                <span className="rating">
                  {product.rating} ★ ({product.reviewCount} reviews)
                </span>
              </div>
              <div className="features">
                <h4>Features:</h4>
                <ul>
                  {product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="product-meta">
                <span className="warranty">Warranty: {product.warranty}</span>
                <span className="time">Time: {product.estimatedTime}</span>
              </div>
              <button className="book-service-btn">Book Service</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelProducts; 