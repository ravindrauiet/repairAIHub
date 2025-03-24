import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/common/Hero';
import { 
  getAllProducts, 
  getProductsByCategory, 
  getProductsByBrand,
  productCategories, 
  brands 
} from '../data/products.jsx';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [visibleBrands, setVisibleBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize products
  useEffect(() => {
    setLoading(true);
    try {
      const allProducts = getAllProducts();
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update visible brands when category changes
  useEffect(() => {
    if (selectedCategory) {
      const categoryBrands = brands.filter(brand => 
        brand.categories.includes(selectedCategory)
      );
      setVisibleBrands(categoryBrands);
    } else {
      setVisibleBrands(brands);
    }
    
    // Reset selected brand if changing categories
    setSelectedBrand('');
  }, [selectedCategory]);

  // Filter products based on selected filters and search query
  useEffect(() => {
    setLoading(true);
    let results = getAllProducts();

    if (selectedCategory) {
      results = getProductsByCategory(selectedCategory);
    }

    if (selectedBrand) {
      results = results.filter(product => 
        product.compatibleBrands.includes(selectedBrand)
      );
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      results = results.filter(product => 
        product.title.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query) ||
        product.id.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(results);
    setLoading(false);
  }, [selectedCategory, selectedBrand, searchQuery]);

  // Handle category change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Handle brand change
  const handleBrandChange = (brandId) => {
    setSelectedBrand(brandId);
  };

  // Helper to get price range display
  const getPriceDisplay = (product) => {
    if (!product.price) return "Price on request";
    
    const prices = Object.values(product.price);
    if (prices.length === 1) return prices[0];
    
    // If multiple price options, show from lowest to highest
    return prices[0];
  };

  return (
    <div className="products-page">
      <Hero 
        title="Repair Parts & Products" 
        subtitle="Find genuine replacement parts for your devices"
        backgroundImage="https://images.unsplash.com/photo-1581092921461-39b9d08ed889?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      />

      <section className="section">
        <div className="container">
          <div className="products-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for parts or services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <div className="category-filters">
                <button 
                  className={`filter-button ${selectedCategory === '' ? 'active' : ''}`}
                  onClick={() => handleCategoryChange('')}
                >
                  All Categories
                </button>
                
                {productCategories.map(category => (
                  <button 
                    key={category.id}
                    className={`filter-button ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.id)}
                  >
                    <i className={`fas ${category.icon}`}></i> {category.name}
                  </button>
                ))}
              </div>

              {visibleBrands.length > 0 && (
                <div className="brand-filters">
                  <h4>Brands</h4>
                  <div className="brand-list">
                    <button 
                      className={`brand-button ${selectedBrand === '' ? 'active' : ''}`}
                      onClick={() => handleBrandChange('')}
                    >
                      All Brands
                    </button>
                    
                    {visibleBrands.map(brand => (
                      <button 
                        key={brand.id}
                        className={`brand-button ${selectedBrand === brand.id ? 'active' : ''}`}
                        onClick={() => handleBrandChange(brand.id)}
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : (
            <>
              <div className="results-count">
                <p>Showing {filteredProducts.length} products</p>
              </div>

              <div className="products-grid">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <Link to={`/products/${product.id}`} key={product.id} className="product-card">
                      <div className="product-image">
                        <img src={product.image || '/images/product-placeholder.jpg'} alt={product.title} />
                        {!product.inStock && <span className="out-of-stock">Out of Stock</span>}
                      </div>
                      <div className="product-details">
                        <h3>{product.title}</h3>
                        <div className="product-meta">
                          <span className="product-category">
                            {productCategories.find(cat => cat.id === product.category)?.name}
                          </span>
                          <span className="product-rating">
                            <i className="fas fa-star"></i> {product.rating} ({product.reviewCount})
                          </span>
                        </div>
                        <p className="product-description">{product.description.substring(0, 100)}...</p>
                        <div className="product-price">{getPriceDisplay(product)}</div>
                        <div className="product-features">
                          <ul>
                            {product.features.slice(0, 2).map((feature, idx) => (
                              <li key={idx}><i className="fas fa-check"></i> {feature}</li>
                            ))}
                          </ul>
                        </div>
                        <button className="product-btn">View Details</button>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="no-results">
                    <i className="fas fa-search"></i>
                    <h3>No products found</h3>
                    <p>Try different search criteria or browse all categories</p>
                    <button className="reset-btn" onClick={() => {
                      setSelectedCategory('');
                      setSelectedBrand('');
                      setSearchQuery('');
                    }}>Reset Filters</button>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="service-cta">
            <div className="cta-content">
              <h2>Need professional repair service?</h2>
              <p>Our trained technicians can fix your device at your home or office.</p>
              <div className="cta-buttons">
                <Link to="/book-service" className="btn-primary">Book a Repair</Link>
                <Link to="/services" className="btn-secondary">View Services</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage; 