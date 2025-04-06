import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, [currentPage, sortField, sortDirection, searchTerm]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      
      // Build query params
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        sortBy: sortField,
        sortDirection: sortDirection
      });
      
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/admin/services?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setServices(response.data.services || []);
      setTotalPages(Math.ceil((response.data.total || 0) / 10));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Failed to load services. Please try again.');
      setLoading(false);
    }
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
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Delete service
  const handleDelete = async () => {
    if (!serviceToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/services/${serviceToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setShowDeleteModal(false);
      setServiceToDelete(null);
      fetchServices();
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Failed to delete service. Please try again.');
    }
  };

  // Format price as currency
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
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
                      <th onClick={() => handleSort('name')} className="sortable">
                        Name {sortField === 'name' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('price')} className="sortable">
                        Price {sortField === 'price' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
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
                        <td>{service.id}</td>
                        <td>{service.name}</td>
                        <td>{formatPrice(service.price)}</td>
                        <td>{service.Category?.name || 'Uncategorized'}</td>
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
              <h3>Confirm Delete</h3>
              <button
                className="admin-modal-close"
                onClick={() => {
                  setShowDeleteModal(false);
                  setServiceToDelete(null);
                }}
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
                onClick={() => {
                  setShowDeleteModal(false);
                  setServiceToDelete(null);
                }}
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