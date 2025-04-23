import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllModels, 
  getAllBrands, 
  deleteModel 
} from '../../services/firestoreService';
import { storage } from '../../firebase/config';
import { ref, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';

const ModelList = () => {
  // State for device models and form
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modelToDelete, setModelToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch models and brands on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Apply filters when filter parameters change
  useEffect(() => {
    applyFiltersAndPagination();
  }, [searchTerm, brandFilter, currentPage]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch brands first
      const brandsData = await getAllBrands();
      setBrands(brandsData);
      
      // Then fetch models
      const modelsData = await getAllModels();
      setModels(modelsData);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      toast.error('Failed to load data from database');
      setLoading(false);
    }
  };
  
  // Apply client-side filtering and pagination
  const applyFiltersAndPagination = () => {
    let filteredModels = [...models];
    
    // Apply brand filter
    if (brandFilter !== 'all') {
      filteredModels = filteredModels.filter(model => model.brandId === brandFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredModels = filteredModels.filter(model => 
        (model.name && model.name.toLowerCase().includes(searchLower)) ||
        (model.description && model.description.toLowerCase().includes(searchLower))
      );
    }
    
    // Calculate total pages
    const total = filteredModels.length;
    const calculatedTotalPages = Math.ceil(total / itemsPerPage);
    
    // Ensure valid current page
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
      return;
    }
    
    setTotalPages(calculatedTotalPages);
  };
  
  const handleBrandFilterChange = (e) => {
    setBrandFilter(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    // The useEffect will handle the actual filtering
  };
  
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // Open delete modal
  const openDeleteModal = (model) => {
    setModelToDelete(model);
    setShowDeleteModal(true);
  };
  
  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setModelToDelete(null);
    setIsDeleting(false);
  };
  
  // Delete model
  const handleDeleteModel = async () => {
    if (!modelToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // If the model has an image, delete it from storage
      if (modelToDelete.imageUrl) {
        try {
          // Extract path from URL
          const imageRef = ref(storage, modelToDelete.imageUrl);
          await deleteObject(imageRef);
        } catch (imageError) {
          console.error('Error deleting image:', imageError);
          // Continue with model deletion even if image deletion fails
        }
      }
      
      // Delete model from Firestore
      await deleteModel(modelToDelete.id);
      
      // Update models list
      setModels(models.filter(model => model.id !== modelToDelete.id));
      toast.success(`Model "${modelToDelete.name}" deleted successfully`);
      
      // Close modal
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting model:', err);
      setError('Failed to delete model. Please try again.');
      toast.error('Failed to delete model');
      setIsDeleting(false);
    }
  };
  
  // Get brand name from ID
  const getBrandName = (brandId) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };
  
  // Generate pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
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
        className="admin-pagination-btn"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`admin-pagination-btn ${i === currentPage ? 'active' : ''}`}
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
        className="admin-pagination-btn"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    );
    
    return <div className="admin-pagination">{pages}</div>;
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading models...</p>
      </div>
    );
  }
  
  // Calculate visible models based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleModels = models
    .filter(model => brandFilter === 'all' || model.brandId === brandFilter)
    .filter(model => {
      if (searchTerm.trim() === '') return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        (model.name && model.name.toLowerCase().includes(searchLower)) ||
        (model.description && model.description.toLowerCase().includes(searchLower))
      );
    })
    .slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <div className="admin-models-list">
      <div className="admin-header-actions">
        <h2 className="admin-section-title">Device Models Management</h2>
        <Link to="/admin/models/new" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Add New Model
        </Link>
      </div>
      
      {error && (
        <div className="admin-alert admin-alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
          <button
            className="admin-alert-close"
            onClick={() => setError(null)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {/* Filters and Search */}
      <div className="admin-filters">
        <div className="admin-filter-group">
          <label htmlFor="brandFilter" className="admin-filter-label">
            Brand:
          </label>
          <select
            id="brandFilter"
            className="admin-select"
            value={brandFilter}
            onChange={handleBrandFilterChange}
          >
            <option value="all">All Brands</option>
            {brands.map(brand => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="admin-filter-group">
          <form onSubmit={handleSearch} className="admin-search-form">
            <input
              type="text"
              className="admin-input"
              placeholder="Search models..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button type="submit" className="admin-btn admin-btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>
      
      {visibleModels.length === 0 ? (
        <div className="admin-empty-state">
          <i className="fas fa-mobile-alt admin-empty-icon"></i>
          <p>No models found</p>
          <Link to="/admin/models/new" className="admin-btn admin-btn-primary">
            Add Your First Model
          </Link>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Brand</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleModels.map(model => (
                    <tr key={model.id}>
                      <td>
                        {model.imageUrl ? (
                          <img 
                            src={model.imageUrl} 
                            alt={model.name}
                            className="admin-thumb" 
                            width="50"
                          />
                        ) : (
                          <div className="admin-no-image">No Image</div>
                        )}
                      </td>
                      <td>{model.name}</td>
                      <td>{getBrandName(model.brandId)}</td>
                      <td>
                        {model.description
                          ? model.description.length > 100
                            ? `${model.description.substring(0, 100)}...`
                            : model.description
                          : 'No description'}
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <Link
                            to={`/admin/models/edit/${model.id}`}
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            title="Edit Model"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            onClick={() => openDeleteModal(model)}
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            title="Delete Model"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {renderPagination()}
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={closeDeleteModal}></div>
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>Confirm Delete</h3>
              <button onClick={closeDeleteModal} className="admin-modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to delete the model "{modelToDelete?.name}"?
              </p>
              <p className="admin-modal-warning">
                <i className="fas fa-exclamation-triangle"></i> This action cannot be undone.
              </p>
              {modelToDelete?.imageUrl && (
                <div className="admin-delete-preview">
                  <img 
                    src={modelToDelete.imageUrl} 
                    alt={modelToDelete.name} 
                    className="admin-delete-image"
                  />
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button
                onClick={closeDeleteModal}
                className="admin-btn admin-btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteModel}
                className="admin-btn admin-btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="spinner-small"></div> Deleting...
                  </>
                ) : (
                  'Delete Model'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelList; 