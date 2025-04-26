import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../services/firestoreService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  // Fetch products and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all products from Firestore
        const productsData = await firestoreService.getAllProducts();
        
        // Fetch all categories from Firestore
        const categoriesData = await firestoreService.getAllCategories();
        
        setProducts(productsData);
        setCategories(categoriesData);
        setTotalPages(Math.ceil(productsData.length / itemsPerPage));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle product deletion
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      try {
        await firestoreService.deleteProduct(id);
        
        // Update state to remove the deleted product
        setProducts(products.filter(product => product.id !== id));
        
        // Show success message
        toast.success('Product deleted successfully');
      } catch (err) {
        console.error('Error deleting product:', err);
        toast.error('Failed to delete product');
      }
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Handle nested properties like price.standard
      const getValue = (obj, path) => {
        const properties = path.split('.');
        return properties.reduce((prev, curr) => 
          prev && prev[curr] !== undefined ? prev[curr] : undefined, obj);
      };
      
      const aValue = getValue(a, sortBy) || '';
      const bValue = getValue(b, sortBy) || '';
      
      // Handle string vs number comparisons
      const comparison = typeof aValue === 'string' 
        ? aValue.localeCompare(bValue) 
        : aValue - bValue;
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Paginate products
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle search change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle category filter change
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Generate pagination links
  const paginationLinks = [];
  for (let i = 1; i <= Math.ceil(filteredProducts.length / itemsPerPage); i++) {
    paginationLinks.push(
      <button
        key={i}
        className={`admin-pagination-link ${currentPage === i ? 'active' : ''}`}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </button>
    );
  }

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="admin-page-header">
        <h2>Products</h2>
        <Link to="/admin/products/add" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Add New Product
        </Link>
      </div>
      
      <div className="admin-filters">
        <div className="admin-search">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="admin-search-input"
          />
        </div>
        
        <div className="admin-filter">
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="admin-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th onClick={() => handleSortChange('title')} className="admin-sortable">
                Title
                {sortBy === 'title' && (
                  <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th onClick={() => handleSortChange('category')} className="admin-sortable">
                Category
                {sortBy === 'category' && (
                  <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th>Price</th>
              <th>Compatible Brands</th>
              <th onClick={() => handleSortChange('rating')} className="admin-sortable">
                Rating
                {sortBy === 'rating' && (
                  <i className={`fas fa-chevron-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                )}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="admin-no-data">
                  No products found.
                </td>
              </tr>
            ) : (
              paginatedProducts.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="admin-product-title">
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="admin-product-thumbnail" 
                        />
                      )}
                      <span>{product.title}</span>
                    </div>
                  </td>
                  <td>
                    {categories.find(cat => cat.id === product.category)?.name || product.category}
                  </td>
                  <td>
                    {typeof product.price === 'object' 
                      ? Object.values(product.price)[0] 
                      : product.price}
                  </td>
                  <td>
                    {product.compatibleBrands && product.compatibleBrands.length > 0 
                      ? product.compatibleBrands.slice(0, 3).join(', ') + 
                        (product.compatibleBrands.length > 3 ? '...' : '')
                      : 'None'}
                  </td>
                  <td>
                    <div className="admin-rating">
                      <span className="admin-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                          <i 
                            key={star}
                            className={`fas fa-star ${star <= product.rating ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </span>
                      <span>{product.rating} ({product.reviewCount})</span>
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions">
                      <Link 
                        to={`/admin/products/edit/${product.id}`}
                        className="admin-btn admin-btn-sm admin-btn-edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                      <button
                        className="admin-btn admin-btn-sm admin-btn-delete"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {filteredProducts.length > itemsPerPage && (
        <div className="admin-pagination">
          <button
            className="admin-pagination-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i> Previous
          </button>
          
          <div className="admin-pagination-links">
            {paginationLinks}
          </div>
          
          <button
            className="admin-pagination-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
          >
            Next <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
      
      <div className="admin-results-info">
        Showing {paginatedProducts.length} of {filteredProducts.length} products
      </div>
    </div>
  );
};

export default ProductsList; 