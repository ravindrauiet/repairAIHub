import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('DESC');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, pageSize, sortField, sortDirection]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
        sort: `${sortField}:${sortDirection.toLowerCase()}`
      });
      
      // Add search term if provided
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      const response = await axios.get(`http://localhost:5000/api/products?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortField(field);
      setSortDirection('ASC');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setCurrentPage(1);
      fetchProducts();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleShowDeleteModal = (product) => {
    setProductToDelete(product);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleDeleteProduct = async () => {
    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/products/${productToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Close modal and refresh products
      setShowDeleteModal(false);
      setProductToDelete(null);
      setDeleteLoading(false);
      
      // Refresh product list
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setDeleteLoading(false);
      // You might want to show an error message here
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (field === sortField) {
      return sortDirection === 'ASC' ? ' ↑' : ' ↓';
    }
    return '';
  };

  // Render pagination
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages.push(
      <button
        key="prev"
        className="pagination-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &laquo; Prev
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-btn ${i === currentPage ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        className="pagination-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next &raquo;
      </button>
    );
    
    return <div className="admin-pagination">{pages}</div>;
  };

  if (loading && products.length === 0) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-container">
        <p className="admin-error-message">{error}</p>
        <button className="admin-btn admin-btn-primary" onClick={fetchProducts}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="admin-products">
      <div className="admin-header-actions">
        <h2 className="admin-section-title">Products</h2>
        <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Add New Product
        </Link>
      </div>
      
      <div className="admin-filters">
        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            className="admin-input"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button type="submit" className="admin-btn admin-btn-primary">
            <i className="fas fa-search"></i> Search
          </button>
        </form>
        
        <div className="admin-page-size">
          <label>Show: </label>
          <select
            className="admin-select"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      
      <div className="admin-card">
        <div className="admin-card-body">
          {products.length === 0 ? (
            <div className="no-items">
              <p>No products found. Create your first product!</p>
              <Link to="/admin/products/new" className="admin-btn admin-btn-primary">
                <i className="fas fa-plus"></i> Add New Product
              </Link>
            </div>
          ) : (
            <>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('id')} className="sortable">
                        ID {getSortIndicator('id')}
                      </th>
                      <th>Image</th>
                      <th onClick={() => handleSort('name')} className="sortable">
                        Name {getSortIndicator('name')}
                      </th>
                      <th onClick={() => handleSort('price')} className="sortable">
                        Price {getSortIndicator('price')}
                      </th>
                      <th onClick={() => handleSort('stockQuantity')} className="sortable">
                        Stock {getSortIndicator('stockQuantity')}
                      </th>
                      <th>Category</th>
                      <th>Brand</th>
                      <th>Featured</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>
                          {product.ProductImages && product.ProductImages.length > 0 ? (
                            <img
                              src={`http://localhost:5000/${product.ProductImages[0].url}`}
                              alt={product.name}
                              className="product-thumbnail"
                            />
                          ) : (
                            <div className="no-image">No Image</div>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          <span className={`stock-badge ${product.stockQuantity <= 5 ? 'low-stock' : ''}`}>
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td>{product.Category?.name || 'N/A'}</td>
                        <td>{product.Brand?.name || 'N/A'}</td>
                        <td>
                          {product.isFeatured ? (
                            <span className="featured-badge">
                              <i className="fas fa-star"></i> Featured
                            </span>
                          ) : (
                            <span className="not-featured">Normal</span>
                          )}
                        </td>
                        <td className="actions-cell">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            title="Edit"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            onClick={() => handleShowDeleteModal(product)}
                            title="Delete"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {renderPagination()}
            </>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>Delete Product</h3>
              <button className="admin-modal-close" onClick={handleCloseDeleteModal}>
                &times;
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to delete the product "{productToDelete?.name}"?
                This action cannot be undone.
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={handleCloseDeleteModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <div className="spinner-small"></div> Deleting...
                  </>
                ) : (
                  <>Delete</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsList; 