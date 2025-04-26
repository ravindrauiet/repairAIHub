import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as productsService from '../services/productsService';
import '../styles/products.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products, categories, and brands on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products from Firestore
        const productsData = await productsService.getAllProducts();
        
        // Fetch categories from Firestore
        const categoriesData = await productsService.getAllCategories();
        
        // Fetch brands from Firestore
        const brandsData = await productsService.getAllBrands();
        
        setProducts(productsData);
        setCategories(categoriesData);
        setBrands(brandsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products data:', err);
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Fetch filtered products when category or brand changes
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        setLoading(true);
        
        let filteredProducts = [];
        
        if (selectedCategory && selectedBrand) {
          // If both category and brand are selected
          filteredProducts = await productsService.getProductsByBrandAndCategory(selectedBrand, selectedCategory);
        } else if (selectedCategory) {
          // If only category is selected
          filteredProducts = await productsService.getProductsByCategory(selectedCategory);
        } else if (selectedBrand) {
          // If only brand is selected
          filteredProducts = await productsService.getProductsByBrand(selectedBrand);
        } else {
          // If no filters are applied
          filteredProducts = await productsService.getAllProducts();
        }
        
        setProducts(filteredProducts);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching filtered products:', err);
        setError('Failed to apply filters. Please try again.');
        setLoading(false);
      }
    };
    
    // Only fetch if the component is mounted (not on initial render)
    if (!loading || selectedCategory || selectedBrand) {
      fetchFilteredProducts();
    }
  }, [selectedCategory, selectedBrand]);

  // Filter products by search query
  const filteredProducts = products.filter(product => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      (product.title && product.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by price range
    let matchesPrice = true;
    if (product.price) {
      // If price is an object with multiple options, check any price
      if (typeof product.price === 'object') {
        const prices = Object.values(product.price).map(p => {
          // Extract number from string like '₹7,000 - ₹12,000'
          if (typeof p === 'string' && p.includes('₹')) {
            const matches = p.match(/₹([\d,]+)/g);
            if (matches && matches.length > 0) {
              // Use the first number in the range
              return parseInt(matches[0].replace(/[₹,]/g, ''), 10);
            }
          }
          return 0;
        });
        
        // Use the minimum price for comparison
        const minPrice = Math.min(...prices.filter(p => p > 0));
        matchesPrice = minPrice >= priceRange.min && minPrice <= priceRange.max;
      } else {
        // If price is a direct number
        matchesPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      }
    }
    
    return matchesSearch && matchesPrice;
  });

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle brand filter change
  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  // Handle price range change
  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value, 10);
    setPriceRange(prev => ({
      ...prev,
      [type]: value
    }));
  };

  // Handle search query change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setPriceRange({ min: 0, max: 100000 });
    setSearchQuery('');
  };

  return (
    <div className="products-page">
      <div className="products-banner">
        <div className="container">
          <h1>Our Products</h1>
          <p>
            Browse our wide range of repair products for various devices and home appliances.
            We offer genuine replacement parts and accessories for all your repair needs.
          </p>
        </div>
      </div>
      
      <div className="products-container container">
        <div className="products-sidebar">
          <div className="filter-section">
            <h3>Filters</h3>
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All
            </button>
          </div>
          
          <div className="filter-section">
            <h4>Search</h4>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <div className="filter-section">
            <h4>Categories</h4>
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-section">
            <h4>Brands</h4>
            <select
              value={selectedBrand}
              onChange={handleBrandChange}
              className="filter-select"
            >
              <option value="">All Brands</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-section">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <div className="price-input">
                <label>Min:</label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange(e, 'min')}
                />
              </div>
              <div className="price-input">
                <label>Max:</label>
                <input
                  type="number"
                  min="0"
                  max="100000"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange(e, 'max')}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="products-content">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <p>No products found matching your filters.</p>
              <button onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  <Link to={`/products/${product.id}`}>
                    <div className="product-image">
                      <img 
                        src={product.image || '/images/product-placeholder.png'} 
                        alt={product.title} 
                      />
                    </div>
                    <div className="product-info">
                      <h3 className="product-title">{product.title}</h3>
                      <div className="product-category">
                        {categories.find(cat => cat.id === product.category)?.name || product.category}
                      </div>
                      <div className="product-price">
                        {typeof product.price === 'object' 
                          ? Object.values(product.price)[0] 
                          : product.price}
                      </div>
                      <div className="product-rating">
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <i 
                              key={star}
                              className={`fas fa-star ${star <= product.rating ? 'filled' : ''}`}
                            ></i>
                          ))}
                        </div>
                        <div className="rating-count">
                          {product.rating} ({product.reviewCount} reviews)
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 