import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, getAllProductCategories, getProductsByCategory } from '../data/products';
import '../styles/products.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch product data
    const fetchProducts = () => {
      setLoading(true);
      try {
        const allCategories = getAllProductCategories();
        setCategories(['all', ...allCategories]);
        
        const allProducts = getAllProducts();
        setProducts(allProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  // Filter products based on active category and search query
  const filteredProducts = () => {
    let filtered = products;
    
    // Filter by category if not 'all'
    if (activeCategory !== 'all') {
      filtered = getProductsByCategory(activeCategory);
    }
    
    // Filter by search query if exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.brand.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const formatCategoryName = (category) => {
    if (category === 'all') return 'All Products';
    
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="products-page">
      <section className="page-hero">
        <div className="container">
          <h1>Products & Price Guide</h1>
          <p>
            Browse our comprehensive list of devices we repair, 
            along with market prices and typical repair costs in India
          </p>
        </div>
      </section>
      
      <div className="container">
        <div className="products-container">
          <div className="products-filters">
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <i className="fas fa-search"></i>
            </div>
            
            <div className="category-filters">
              <h3>Categories</h3>
              <div className="category-list">
                {categories.map((category) => (
                  <button 
                    key={category}
                    className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {formatCategoryName(category)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-info">
              <p>
                <i className="fas fa-info-circle"></i>
                These prices are indicative and may vary based on model, 
                condition, and specific issues.
              </p>
            </div>
          </div>
          
          <div className="products-grid">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts().length > 0 ? (
              filteredProducts().map((product) => (
                <div className="product-card" key={product.id}>
                  <div className="product-image">
                    <img src={product.image || '/images/placeholder-product.jpg'} alt={product.name} />
                  </div>
                  
                  <div className="product-content">
                    <h3>{product.name}</h3>
                    <div className="product-brand">
                      <span>Brand:</span> {product.brand}
                    </div>
                    
                    <div className="product-price">
                      <div className="market-price">
                        <span>Market Price:</span> {product.marketPrice}
                      </div>
                    </div>
                    
                    <p className="product-description">{product.description}</p>
                    
                    <div className="repair-costs">
                      <h4>Common Repair Costs:</h4>
                      <ul>
                        {Object.entries(product.repairCost).map(([repair, cost], index) => (
                          <li key={index}>
                            <span className="repair-type">
                              {repair.replace(/([A-Z])/g, ' $1')
                                .replace(/^./, str => str.toUpperCase())}:
                            </span>
                            <span className="repair-cost">{cost}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="product-action">
                      <Link to="/book-service" className="btn-primary">Book Repair</Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-products">
                <i className="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try a different search term or category</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="cta-section">
          <h2>Need help finding the right service?</h2>
          <p>Our customer service team is available to guide you through our repair options</p>
          <div className="cta-buttons">
            <Link to="/contact" className="btn-primary">Contact Us</Link>
            <Link to="/services" className="btn-secondary">View All Services</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage; 