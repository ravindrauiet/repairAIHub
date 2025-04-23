import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../services/firestoreService';
import { toast } from 'react-toastify';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import app from '../../firebase/config';

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
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
  const storage = getStorage(app);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Apply filtering, sorting, and pagination
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFiltersAndPagination();
    }
  }, [allProducts, currentPage, pageSize, sortField, sortDirection, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch all products from Firestore
      const fetchedProducts = await firestoreService.getAllProducts();
      setAllProducts(fetchedProducts);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again later.');
      toast.error('Failed to load products from database');
      setLoading(false);
    }
  };

  // Apply client-side filtering, sorting and pagination
  const applyFiltersAndPagination = () => {
    let filteredProducts = [...allProducts];
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        (product.name && product.name.toLowerCase().includes(searchLower)) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle missing values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';
      
      // Handle date comparison for createdAt
      if (sortField === 'createdAt') {
        const aDate = aValue ? new Date(aValue.toDate ? aValue.toDate() : aValue) : new Date(0);
        const bDate = bValue ? new Date(bValue.toDate ? bValue.toDate() : bValue) : new Date(0);
        return sortDirection === 'ASC' ? aDate - bDate : bDate - aDate;
      }
      
      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'ASC' ? aValue - bValue : bValue - aValue;
      }
      
      // String comparison for other fields
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      return sortDirection === 'ASC' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
    
    // Calculate total pages
    const total = filteredProducts.length;
    const calculatedTotalPages = Math.ceil(total / pageSize);
    
    // Ensure valid current page
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
      return;
    }
    
    setTotalPages(calculatedTotalPages);
    
    // Apply pagination
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
    
    setProducts(paginatedProducts);
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
    // The useEffect will handle the actual filtering
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setCurrentPage(1);
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
      
      // Delete product from Firestore
      await firestoreService.deleteProduct(productToDelete.id);
      
      // Close modal
      setShowDeleteModal(false);
      
      // Update local state
      const updatedProducts = allProducts.filter(
        product => product.id !== productToDelete.id
      );
      setAllProducts(updatedProducts);
      
      setProductToDelete(null);
      setDeleteLoading(false);
      
      toast.success('Product deleted successfully');
    } catch (err) {
      console.error('Error deleting product:', err);
      setDeleteLoading(false);
      toast.error('Failed to delete product from database');
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    
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
                        <td>{product.id.substring(0, 8)}...</td>
                        <td>
                          <div className="admin-product-info">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="admin-product-thumbnail" 
                              />
                            ) : (
                              <div className="admin-product-no-image">
                                <i className="fas fa-image"></i>
                              </div>
                            )}
                            <span>{product.name}</span>
                          </div>
                        </td>
                        <td>{formatCurrency(product.price)}</td>
                        <td>
                          <span className={`admin-stock-badge ${parseInt(product.stock) > 0 ? 'in-stock' : 'out-of-stock'}`}>
                            {parseInt(product.stock) > 0 ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>{product.category || 'Uncategorized'}</td>
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