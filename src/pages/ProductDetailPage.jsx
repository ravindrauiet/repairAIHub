import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../styles/productDetail.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Fetch product data from localStorage
    const fetchProduct = () => {
      setLoading(true);
      try {
        const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
        const foundProduct = storedProducts.find(p => p.id === parseInt(productId));
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Find related products (same category)
          const related = storedProducts
            .filter(p => p.category === foundProduct.category && p.id !== foundProduct.id)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          // Product not found, redirect to products page
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, navigate]);
  
  const handleQuantityChange = (amount) => {
    const newQty = quantity + amount;
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };
  
  const handleAddToCart = () => {
    // Display success message
    setMessage(`${product.partName} added to cart.`);
    setShowMessage(true);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
    
    // In a real app, this would add the product to a cart in localStorage or send it to an API
    console.log('Added to cart:', {
      product: product,
      quantity: quantity
    });
  };
  
  const handleInquiry = () => {
    // Display success message
    setMessage(`Inquiry sent for ${product.partName}.`);
    setShowMessage(true);
    
    // Hide message after 3 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
    
    // In a real app, this would send the inquiry to an API
    console.log('Inquiry for:', {
      product: product,
      quantity: quantity
    });
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>Sorry, the product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn-primary">Back to Products</Link>
      </div>
    );
  }
  
  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/products">Products</Link> / 
          <span>{product.partName}</span>
        </div>
        
        {showMessage && (
          <div className="notification success">
            {message}
          </div>
        )}
        
        <div className="product-detail-container">
          <div className="product-image-container">
            <img src={product.imageUrl} alt={product.partName} className="product-image" />
          </div>
          
          <div className="product-info">
            <h1 className="product-title">{product.partName}</h1>
            
            <div className="product-meta">
              <span className="product-brand">{product.brand}</span>
              <span className="product-model">{product.model}</span>
              <span className={`product-availability ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
            
            <div className="product-price">
              ₹{product.price.toLocaleString()}
            </div>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="text" 
                  className="quantity-input" 
                  value={quantity}
                  readOnly 
                />
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
              
              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button 
                className="inquiry-btn" 
                onClick={handleInquiry}
              >
                Send Inquiry
              </button>
            </div>
            
            <div className="product-description-short">
              {product.description}
            </div>
          </div>
        </div>
        
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'specifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button 
              className={`tab-btn ${activeTab === 'compatibility' ? 'active' : ''}`}
              onClick={() => setActiveTab('compatibility')}
            >
              Compatibility
            </button>
          </div>
          
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <h3>Product Description</h3>
                <p>{product.description}</p>
                <p>This {product.partName} is designed specifically for {product.brand} {product.model} devices. It offers superior performance and reliability, ensuring your device functions optimally after repair.</p>
                <p>All our parts undergo strict quality control checks to ensure they meet manufacturer specifications.</p>
              </div>
            )}
            
            {activeTab === 'specifications' && (
              <div className="tab-pane">
                <h3>Technical Specifications</h3>
                <table className="specs-table">
                  <tbody>
                    {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}>
                        <th>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'compatibility' && (
              <div className="tab-pane">
                <h3>Compatible With</h3>
                {product.compatibility ? (
                  <ul className="compatibility-list">
                    {product.compatibility.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>Compatible with {product.brand} {product.model} only.</p>
                )}
                <div className="compatibility-note">
                  <h4>Important Note:</h4>
                  <p>Please verify your device model before purchasing. If you're unsure about compatibility, please contact our support team.</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2>Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <Link 
                  to={`/products/${relatedProduct.id}`} 
                  key={relatedProduct.id} 
                  className="related-product-card"
                >
                  <div className="related-product-image">
                    <img src={relatedProduct.imageUrl} alt={relatedProduct.partName} />
                  </div>
                  <div className="related-product-info">
                    <h3>{relatedProduct.partName}</h3>
                    <p className="related-product-price">₹{relatedProduct.price.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage; 