import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById, getProductsByCategory, productCategories, brands } from '../data/products.jsx';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import SEO from '../components/common/SEO';
import { generateProductSchema } from '../utils/schemaGenerator';
import '../styles/productDetail.css';
import Breadcrumb from '../components/common/Breadcrumb';

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
  const [originalPrice, setOriginalPrice] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [activeReviewTab, setActiveReviewTab] = useState('all');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  
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
              
              // Set original price (for discount calculation)
              // In a real app, this would come from the backend
              const discountPercentage = Math.floor(Math.random() * 20) + 5; // Random discount between 5-25%
              const price = typeof productData.price[variants[0]] === 'string' 
                ? parseFloat(productData.price[variants[0]].replace(/[₹,]/g, ''))
                : productData.price[variants[0]];
              
              const originalPrice = Math.round(price / (1 - discountPercentage / 100));
              setOriginalPrice(`₹${originalPrice.toLocaleString()}`);
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
    
    // Update original price for the new variant
    const discountPercentage = Math.floor(Math.random() * 20) + 5;
    const price = typeof product.price[variant] === 'string' 
      ? parseFloat(product.price[variant].replace(/[₹,]/g, ''))
      : product.price[variant];
    
    const originalPrice = Math.round(price / (1 - discountPercentage / 100));
    setOriginalPrice(`₹${originalPrice.toLocaleString()}`);
  };
  
  const handleQuantityChange = (value) => {
    const newQty = quantity + value;
    if (newQty >= 1 && newQty <= 10) {
      setQuantity(newQty);
    }
  };

  const handleSetQuantity = (event) => {
    const newQty = parseInt(event.target.value);
    if (!isNaN(newQty) && newQty >= 1 && newQty <= 10) {
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
  
  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };
  
  const handleAddToWishlist = () => {
    if (!isInWishlist(product.id)) {
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image || '/images/product-placeholder.jpg'
      });
      showNotificationWithMessage(`${product.title} added to wishlist.`);
    } else {
      removeFromWishlist(product.id);
      showNotificationWithMessage(`${product.title} removed from wishlist.`);
    }
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

  const getDiscountPercentage = () => {
    if (!originalPrice || !currentPrice) return 0;
    
    const original = typeof originalPrice === 'string' 
      ? parseFloat(originalPrice.replace(/[₹,]/g, ''))
      : originalPrice;
      
    const current = typeof currentPrice === 'string'
      ? parseFloat(currentPrice.replace(/[₹,]/g, ''))
      : currentPrice;
      
    const discount = ((original - current) / original) * 100;
    return Math.round(discount);
  };

  const getEstimatedDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + Math.floor(Math.random() * 3) + 3); // 3-5 days delivery
    
    return deliveryDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric'
    });
  };

  const generateProductCode = () => {
    // Generate a product code from the product ID and category
    if (!product) return '';
    return `${product.category.toUpperCase()}-${product.id}`;
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the review to the backend
    alert(`Thank you for your ${reviewRating}-star review!`);
    setReviewComment('');
    setReviewRating(5);
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

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: getCategoryName(product.category), path: `/products?category=${product.category}` },
    { label: product.title, path: '' }
  ];
  
  // Generate product schema for structured data
  const productSchema = generateProductSchema(product);
  
  return (
    <div className="product-detail-page">
      <SEO 
        title={`${product.title} - ${product.brand || 'CallMiBro'} Parts & Accessories`}
        description={product.description?.substring(0, 160) || `Buy ${product.title} - genuine parts and accessories for your device repair needs from CallMiBro.`}
        keywords={`${product.title}, ${product.brand || ''}, repair parts, accessories, ${product.category || ''}`}
        canonicalUrl={`/products/${productId}`}
        ogType="product"
        ogImage={product.image || '/images/product-placeholder.jpg'}
        schema={productSchema}
      />
      
      <div className="container">
        <Breadcrumb items={breadcrumbItems} />
        
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

              {getDiscountPercentage() > 0 && (
                <div className="discount-badge">
                  {getDiscountPercentage()}% OFF
                </div>
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
            
            <div className="product-code">
              Product Code: <span>{generateProductCode()}</span>
            </div>
            
            <div className="product-price-detail">
              <div className="price-container">
                <span className="current-price">{currentPrice}</span>
                {getDiscountPercentage() > 0 && (
                  <>
                    <span className="original-price">{originalPrice}</span>
                    <span className="discount-percentage">({getDiscountPercentage()}% OFF)</span>
                  </>
                )}
              </div>
            </div>
            
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
            
            <div className="product-availability-container">
              <div className={`product-availability ${product.inStock ? '' : 'out-of-stock'}`}>
                <i className={`fas ${product.inStock ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                <span>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
              </div>
              
              {product.inStock && (
                <div className="delivery-estimate">
                  <i className="fas fa-truck"></i>
                  <span>Estimated Delivery: {getEstimatedDelivery()}</span>
                </div>
              )}
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
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={quantity}
                  onChange={handleSetQuantity}
                  className="quantity-input"
                />
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
                className="buy-now-btn" 
                onClick={handleBuyNow}
                disabled={!product.inStock}
              >
                <i className="fas fa-bolt"></i>
                Buy Now
              </button>
              
              <button 
                className={`wishlist-btn ${isInWishlist(product.id) ? 'in-wishlist' : ''}`}
                onClick={handleAddToWishlist}
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
              <div className="meta-item">
                <span className="label">Return Policy:</span> 7-day replacement
              </div>
            </div>

            <div className="social-share">
              <span className="label">Share:</span>
              <div className="social-icons">
                <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-whatsapp"></i></a>
                <a href="#" className="social-icon"><i className="fab fa-pinterest"></i></a>
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
              <button 
                className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({product.reviewCount})
              </button>
              <button 
                className={`tab-button ${activeTab === 'warranty' ? 'active' : ''}`}
                onClick={() => setActiveTab('warranty')}
              >
                Warranty
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
                  <p>
                    This {product.title} is designed to provide exceptional performance and durability.
                    It's manufactured using premium materials and undergoes rigorous quality testing to
                    ensure reliability in all conditions.
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

              {activeTab === 'reviews' && (
                <div className="reviews-section">
                  <h3>Customer Reviews</h3>
                  
                  <div className="reviews-overview">
                    <div className="average-rating">
                      <span className="rating-number">{product.rating}</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star ${i < Math.floor(product.rating) ? 'filled' : ''}`}></i>
                        ))}
                      </div>
                      <span className="total-reviews">{product.reviewCount} reviews</span>
                    </div>
                    
                    <div className="rating-breakdown">
                      {[5, 4, 3, 2, 1].map(stars => (
                        <div key={stars} className="rating-bar">
                          <span>{stars} stars</span>
                          <div className="progress-bar">
                            <div 
                              className="progress" 
                              style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="reviews-filter">
                    <button 
                      className={`filter-btn ${activeReviewTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveReviewTab('all')}
                    >
                      All Reviews
                    </button>
                    <button 
                      className={`filter-btn ${activeReviewTab === 'positive' ? 'active' : ''}`}
                      onClick={() => setActiveReviewTab('positive')}
                    >
                      Positive (4-5 ★)
                    </button>
                    <button 
                      className={`filter-btn ${activeReviewTab === 'critical' ? 'active' : ''}`}
                      onClick={() => setActiveReviewTab('critical')}
                    >
                      Critical (1-3 ★)
                    </button>
                  </div>
                  
                  <div className="reviews-list">
                    {/* Mock reviews - in a real app, these would come from the backend */}
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="review-item">
                        <div className="review-header">
                          <span className="reviewer-name">Customer {index + 1}</span>
                          <div className="review-rating">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < (5 - index % 2) ? 'filled' : ''}`}></i>
                            ))}
                          </div>
                          <span className="review-date">
                            {new Date(Date.now() - index * 86400000).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="review-text">
                          {index % 2 === 0 
                            ? `This ${product.title} is excellent! The quality is outstanding and it works perfectly.` 
                            : `Good product overall, but delivery was a bit slow. The ${product.title} functions as expected.`}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="write-review">
                    <h4>Write a Review</h4>
                    <form onSubmit={handleReviewSubmit}>
                      <div className="rating-selector">
                        <span>Your Rating:</span>
                        <div className="star-rating">
                          {[5, 4, 3, 2, 1].map(star => (
                            <i 
                              key={star}
                              className={`fas fa-star ${star <= reviewRating ? 'filled' : ''}`}
                              onClick={() => setReviewRating(star)}
                            ></i>
                          ))}
                        </div>
                      </div>
                      
                      <div className="form-group">
                        <label htmlFor="review-comment">Your Review:</label>
                        <textarea 
                          id="review-comment"
                          rows="4"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your experience with this product..."
                          required
                        ></textarea>
                      </div>
                      
                      <button type="submit" className="submit-review-btn">
                        Submit Review
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {activeTab === 'warranty' && (
                <div className="warranty-section">
                  <h3>Warranty Information</h3>
                  <div className="warranty-details">
                    <p>
                      <strong>Warranty Period:</strong> {product.warranty}
                    </p>
                    <p>
                      <strong>Coverage:</strong> The warranty covers manufacturing defects and 
                      malfunctions that occur during normal use of the product.
                    </p>
                    <p>
                      <strong>Warranty Terms:</strong>
                    </p>
                    <ul>
                      <li>The warranty period begins from the date of purchase.</li>
                      <li>Proof of purchase is required for warranty claims.</li>
                      <li>The warranty is void if the product has been damaged due to misuse, accidents, or unauthorized repairs.</li>
                      <li>The warranty does not cover normal wear and tear.</li>
                    </ul>
                    
                    <p>
                      <strong>Claim Process:</strong> Contact our customer support team with your 
                      order details and a description of the issue to initiate a warranty claim.
                    </p>
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