import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getProductsByCategory, productCategories, brands } from '../data/products.jsx';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import '../styles/productDetail.css';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  const imageContainerRef = useRef(null);
  const zoomFactor = 2.5;
  const thumbnailSliderRef = useRef(null);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    const loadProduct = async () => {
      setLoading(true);
      try {
        const productData = getProductById(productId);
        
        if (productData) {
          setProduct(productData);
          
          // Set default selected variant and price
          if (productData.price) {
            const variants = Object.keys(productData.price);
            if (variants.length > 0) {
              setSelectedVariant(variants[0]);
              setCurrentPrice(productData.price[variants[0]]);
            }
          }
          
          // Get related products (same category)
          const categoryProducts = getProductsByCategory(productData.category);
          const related = categoryProducts
            .filter(p => p.id !== productId)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          // Product not found, redirect to products page
          navigate('/products');
        }
      } catch (error) {
        console.error('Error loading product details:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [productId, navigate]);
  
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setCurrentPrice(product.price[variant]);
  };
  
  const handleQuantityChange = (value) => {
    const newQty = quantity + value;
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };
  
  const handleAddToCart = () => {
    // Extract the numeric price from the formatted string
    let priceValue = 0;
    if (typeof currentPrice === 'string') {
      // Remove currency symbol and commas, then parse
      priceValue = parseFloat(currentPrice.replace(/[₹,]/g, ''));
    } else {
      priceValue = currentPrice;
    }
    
    const cartProduct = {
      id: product.id,
      name: product.title,
      price: priceValue,
      image: product.image || '/images/product-placeholder.jpg',
      selectedVariant: selectedVariant,
      quantity: quantity
    };
    
    addToCart(cartProduct, quantity);
    showNotificationWithMessage(`${product.title} added to cart.`);
  };
  
  const handleAddToWishlist = () => {
    showNotificationWithMessage(`${product.title} added to wishlist.`);
    // In a real app, would add to wishlist in context/state management
  };
  
  const showNotificationWithMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };
  
  const getCategoryName = (categoryId) => {
    const category = productCategories.find(c => c.id === categoryId);
    return category ? category.name : '';
  };
  
  const getBrandNames = (brandIds) => {
    return brandIds.map(brandId => {
      const brand = brands.find(b => b.id === brandId);
      return brand ? brand.name : '';
    }).join(', ');
  };
  
  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setZoomPosition({ x, y });
  };
  
  const handleMouseEnter = () => {
    setIsZoomed(true);
  };
  
  const handleMouseLeave = () => {
    setIsZoomed(false);
  };
  
  const scrollThumbnails = (direction) => {
    if (thumbnailSliderRef.current) {
      const scrollAmount = direction === 'left' 
        ? -100
        : 100;
      
      thumbnailSliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container">
        <div className="error-container">
          <h2>Product Not Found</h2>
          <p>Sorry, the product you're looking for doesn't exist.</p>
          <Link to="/products" className="btn-primary">Back to Products</Link>
        </div>
      </div>
    );
  }
  
  // If no images array exists on the product, create a default one with the image property
  const productImages = product.images || [product.image];
  
  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/products">Products</Link> / 
          <Link to={`/products?category=${product.category}`}>{getCategoryName(product.category)}</Link> / 
          <span>{product.title}</span>
        </div>
        
        {showNotification && (
          <div className="notification">
            <i className="fas fa-check-circle"></i> {notificationMessage}
            <div className="notification-actions">
              <Link to="/cart" className="view-cart-link">View Cart</Link>
            </div>
          </div>
        )}
        
        <div className="product-detail-container">
          <div className="product-images">
            <div 
              className="main-image-container" 
              ref={imageContainerRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <img 
                src={productImages[currentImageIndex]} 
                alt={product.title} 
                className="main-image"
              />
              
              {isZoomed && (
                <div 
                  className="zoom-view"
                  style={{
                    backgroundImage: `url(${productImages[currentImageIndex]})`,
                    backgroundPosition: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                    backgroundSize: `${zoomFactor * 100}%`
                  }}
                ></div>
              )}
            </div>
            
            {productImages.length > 1 && (
              <div className="thumbnail-container">
                <button 
                  className="thumbnail-arrow thumbnail-arrow-left" 
                  onClick={() => scrollThumbnails('left')}
                >
                  <span className="material-icons">chevron_left</span>
                </button>
                
                <div className="thumbnail-slider" ref={thumbnailSliderRef}>
                  {productImages.map((image, index) => (
                    <div 
                      key={index} 
                      className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <img src={image} alt={`${product.title} - ${index + 1}`} />
                    </div>
                  ))}
                </div>
                
                <button 
                  className="thumbnail-arrow thumbnail-arrow-right" 
                  onClick={() => scrollThumbnails('right')}
                >
                  <span className="material-icons">chevron_right</span>
                </button>
              </div>
            )}
          </div>
          
          <div className="product-info">
            <div className="product-header">
              <h1>{product.title}</h1>
              <div className="product-meta">
                <span className="product-category">{getCategoryName(product.category)}</span>
                <span className="product-rating">
                  <i className="fas fa-star"></i> {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
            </div>
            
            <div className="product-price-detail">{currentPrice}</div>
            
            {product.compatibleBrands && product.compatibleBrands.length > 0 && (
              <div className="product-compatible-brands">
                <span className="label">Compatible with:</span> {getBrandNames(product.compatibleBrands)}
              </div>
            )}
            
            {Object.keys(product.price).length > 1 && (
              <div className="product-variants">
                <h3>Select Option</h3>
                <div className="variant-options">
                  {Object.keys(product.price).map(variant => (
                    <button 
                      key={variant}
                      className={`variant-option ${selectedVariant === variant ? 'active' : ''}`}
                      onClick={() => handleVariantChange(variant)}
                    >
                      {variant.charAt(0).toUpperCase() + variant.slice(1).replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className={`product-availability ${product.inStock ? '' : 'out-of-stock'}`}>
              <i className={`fas ${product.inStock ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </div>
            
            <div className="product-description-detail">
              {product.description}
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
                <span className="quantity-display">{quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 10 || !product.inStock}
                >
                  +
                </button>
              </div>
              
              <button 
                className="add-to-cart-btn" 
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <i className="fas fa-shopping-cart"></i>
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              
              <button 
                className={`wishlist-btn ${isInWishlist(product.id) ? 'in-wishlist' : ''}`}
                onClick={() => {
                  if (isInWishlist(product.id)) {
                    removeFromWishlist(product.id);
                  } else {
                    addToWishlist({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.image || '/images/product-placeholder.jpg'
                    });
                  }
                }}
              >
                <i className="fas fa-heart"></i>
              </button>
            </div>
            
            <div className="product-meta-info">
              <div className="meta-item">
                <span className="label">Warranty:</span> {product.warranty}
              </div>
              <div className="meta-item">
                <span className="label">Service Time:</span> {product.estimatedTime}
              </div>
            </div>
          </div>
          
          <div className="product-details-tabs">
            <div className="tabs-header">
              <button 
                className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                Features
              </button>
              <button 
                className={`tab-button ${activeTab === 'brands' ? 'active' : ''}`}
                onClick={() => setActiveTab('brands')}
              >
                Compatible Brands
              </button>
            </div>
            
            <div className="tab-content">
              {activeTab === 'description' && (
                <div>
                  <h3>Product Description</h3>
                  <p>{product.description}</p>
                  <p>
                    Our technicians are experts in {getCategoryName(product.category)} repairs and 
                    use only high-quality parts to ensure your device functions properly after repair.
                  </p>
                </div>
              )}
              
              {activeTab === 'features' && (
                <div>
                  <h3>Key Features</h3>
                  <ul className="features-list">
                    {product.features.map((feature, index) => (
                      <li key={index}>
                        <i className="fas fa-check"></i> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {activeTab === 'brands' && (
                <div>
                  <h3>Compatible Brands</h3>
                  <div className="compatible-brands">
                    {product.compatibleBrands.map(brandId => {
                      const brand = brands.find(b => b.id === brandId);
                      return brand ? (
                        <div key={brandId} className="brand-item">
                          <span>{brand.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h2 className="section-title">Related Products</h2>
            <div className="related-products-grid">
              {relatedProducts.map(relatedProduct => (
                <Link 
                  to={`/products/${relatedProduct.id}`} 
                  key={relatedProduct.id} 
                  className="product-card"
                >
                  <div className="product-image">
                    <img 
                      src={relatedProduct.image || '/images/product-placeholder.jpg'} 
                      alt={relatedProduct.title} 
                    />
                    {!relatedProduct.inStock && <span className="out-of-stock">Out of Stock</span>}
                  </div>
                  <div className="product-details">
                    <h3>{relatedProduct.title}</h3>
                    <div className="product-meta">
                      <span className="product-category">
                        {getCategoryName(relatedProduct.category)}
                      </span>
                    </div>
                    <div className="product-price">
                      {Object.values(relatedProduct.price)[0]}
                    </div>
                    <button className="product-btn">View Details</button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        <div className="service-cta">
          <div className="cta-content">
            <h2>Need help with {product.title}?</h2>
            <p>Our expert technicians can assist you with installation and repairs.</p>
            <div className="cta-buttons">
              <Link to="/book-service" className="btn-primary">Book a Service</Link>
              <Link to="/contact" className="btn-secondary">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 