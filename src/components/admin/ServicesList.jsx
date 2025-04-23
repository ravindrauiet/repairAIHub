import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../services/firestoreService';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch services from Firebase
  useEffect(() => {
    fetchServices();
  }, []);

  // Apply filtering, sorting, and pagination whenever these values change
  useEffect(() => {
    if (allServices.length > 0) {
      applyFiltersAndPagination();
    }
  }, [allServices, currentPage, sortField, sortDirection, searchTerm]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const fetchedServices = await firestoreService.getAllServices();
      setAllServices(fetchedServices);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services from Firebase. Please try again.');
      setLoading(false);
    }
  };

  // Apply client-side filtering, sorting, and pagination
  const applyFiltersAndPagination = () => {
    let filteredServices = [...allServices];

    // Apply search/filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredServices = filteredServices.filter(service => 
        (service.title && service.title.toLowerCase().includes(searchLower)) ||
        (service.description && service.description.toLowerCase().includes(searchLower)) ||
        (service.category && service.category.toLowerCase().includes(searchLower))
      );
    }

    // Apply sorting
    filteredServices.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle nested properties like Category.name
      if (sortField === 'category' && a.category && b.category) {
        aValue = a.category;
        bValue = b.category;
      }
      
      // Handle missing values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';
      
      // Handle number comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      // String comparison
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      return sortDirection === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });

    // Calculate total pages
    const total = filteredServices.length;
    const calculatedTotalPages = Math.ceil(total / ITEMS_PER_PAGE);
    
    // Ensure valid current page
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
      return;
    }
    
    setTotalPages(calculatedTotalPages);

    // Apply pagination
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedServices = filteredServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    
    setServices(paginatedServices);
  };

  // Handle sorting
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    // The useEffect will handle the actual filtering
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Delete service
  const handleDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      setLoading(true);
      await firestoreService.deleteService(serviceToDelete);
      
      setShowDeleteModal(false);
      setServiceToDelete(null);
      
      // Refresh services after deletion
      fetchServices();
      
      setLoading(false);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service. Please try again.');
      setLoading(false);
    }
  };

  // Format price as currency
  const formatPrice = (price) => {
    if (!price) return 'N/A';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Extract price from price range (e.g., "₹500 - ₹8,000" -> 500)
  const extractPrice = (priceRange) => {
    if (!priceRange) return 0;
    
    // Extract the first number from the price range
    const match = priceRange.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  return (
    <div className="admin-services">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Services Management</h2>
        <Link to="/admin/services/add" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Add New Service
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
      
      <div className="admin-card">
        <div className="admin-card-header">
          <form onSubmit={handleSearch} className="admin-search-form">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
            <button type="submit" className="admin-search-btn">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
        
        <div className="admin-card-body">
          {loading ? (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Loading services...</p>
            </div>
          ) : services.length === 0 ? (
            <div className="admin-empty-state">
              <i className="fas fa-tools admin-empty-icon"></i>
              <p>No services found.</p>
              <Link to="/admin/services/add" className="admin-btn admin-btn-primary admin-btn-sm">
                Add Your First Service
              </Link>
            </div>
          ) : (
            <>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('id')} className="sortable">
                        ID {sortField === 'id' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('title')} className="sortable">
                        Name {sortField === 'title' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('priceRange')} className="sortable">
                        Price {sortField === 'priceRange' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('category')} className="sortable">
                        Category {sortField === 'category' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.id}>
                        <td>{service.id.substring(0, 8)}...</td>
                        <td>{service.title}</td>
                        <td>{service.priceRange || 'N/A'}</td>
                        <td>{service.category || 'Uncategorized'}</td>
                        <td>
                          <div className="admin-actions">
                            <Link to={`/admin/services/edit/${service.id}`} className="admin-btn admin-btn-sm admin-btn-info">
                              <i className="fas fa-edit"></i>
                            </Link>
                            <button
                              className="admin-btn admin-btn-sm admin-btn-danger"
                              onClick={() => {
                                setServiceToDelete(service.id);
                                setShowDeleteModal(true);
                              }}
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
              
              {totalPages > 1 && (
                <div className="admin-pagination">
                  <button
                    className="admin-pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    // Only show 5 pages at a time
                    if (
                      index === 0 ||
                      index === totalPages - 1 ||
                      (index >= currentPage - 2 && index <= currentPage + 2)
                    ) {
                      return (
                        <button
                          key={index}
                          className={`admin-pagination-btn ${currentPage === index + 1 ? 'active' : ''}`}
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      );
                    }
                    
                    // Add ellipsis
                    if (
                      (index === 1 && currentPage > 3) ||
                      (index === totalPages - 2 && currentPage < totalPages - 3)
                    ) {
                      return <span key={index} className="admin-pagination-ellipsis">...</span>;
                    }
                    
                    return null;
                  })}
                  
                  <button
                    className="admin-pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>Confirm Deletion</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>Are you sure you want to delete this service? This action cannot be undone.</p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesList; 