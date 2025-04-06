import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const BookingList = () => {
  // State for bookings
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Status modal
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  
  // Available booking statuses
  const bookingStatuses = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'confirmed', label: 'Confirmed', color: 'info' },
    { value: 'in_progress', label: 'In Progress', color: 'primary' },
    { value: 'completed', label: 'Completed', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' },
    { value: 'no_show', label: 'No Show', color: 'secondary' }
  ];
  
  // Fetch bookings on component mount and when filters change
  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter, sortBy, sortDirection, searchTerm]);
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Construct query parameters
      const params = {
        page: currentPage,
        limit,
        sortBy,
        sortDirection,
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await axios.get('http://localhost:5000/api/admin/bookings', {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setBookings(response.data.bookings);
      setTotalPages(Math.ceil(response.data.total / limit));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Handle status filter
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
  };
  
  // Open status modal
  const openStatusModal = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.status);
    setStatusNote('');
    setShowStatusModal(true);
  };
  
  // Update booking status
  const updateBookingStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/admin/bookings/${selectedBooking.id}/status`, {
        status: newStatus,
        note: statusNote
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Close modal and refresh bookings
      setShowStatusModal(false);
      fetchBookings();
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError('Failed to update booking status. Please try again.');
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format booking date for display
  const formatBookingDate = (date, time) => {
    if (!date) return 'N/A';
    
    const dateObj = new Date(`${date}T${time || '00:00'}`);
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: time ? '2-digit' : undefined,
      minute: time ? '2-digit' : undefined
    }).format(dateObj);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    const statusObj = bookingStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'secondary';
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    const statusObj = bookingStatuses.find(s => s.value === status);
    return statusObj ? statusObj.label : status;
  };
  
  // Generate pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="admin-pagination">
        <button
          className="admin-pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        {startPage > 1 && (
          <>
            <button
              className="admin-pagination-btn"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="admin-pagination-ellipsis">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`admin-pagination-btn ${number === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="admin-pagination-ellipsis">...</span>}
            <button
              className="admin-pagination-btn"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          className="admin-pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-bookings-list">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Booking Management</h2>
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
          <label htmlFor="statusFilter" className="admin-filter-label">
            Status:
          </label>
          <select
            id="statusFilter"
            className="admin-select"
            value={statusFilter}
            onChange={handleStatusFilterChange}
          >
            <option value="all">All Statuses</option>
            {bookingStatuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="admin-filter-group">
          <form onSubmit={handleSearch} className="admin-search-form">
            <input
              type="text"
              className="admin-input"
              placeholder="Search by booking ID or customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="admin-btn admin-btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div className="admin-card">
        <div className="admin-card-body">
          {bookings.length === 0 ? (
            <div className="admin-empty-state">
              <i className="fas fa-calendar-alt"></i>
              <p>No bookings found. Adjust your filters or check back later.</p>
            </div>
          ) : (
            <>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th 
                        onClick={() => handleSort('id')}
                        className="sortable"
                      >
                        Booking ID 
                        {sortBy === 'id' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th>Customer</th>
                      <th>Service</th>
                      <th 
                        onClick={() => handleSort('bookingDate')}
                        className="sortable"
                      >
                        Appointment Date 
                        {sortBy === 'bookingDate' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('createdAt')}
                        className="sortable"
                      >
                        Created 
                        {sortBy === 'createdAt' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('status')}
                        className="sortable"
                      >
                        Status 
                        {sortBy === 'status' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.bookingNumber || `#${booking.id}`}</td>
                        <td>
                          {booking.user ? (
                            <div className="booking-customer">
                              <span className="customer-name">{booking.user.name}</span>
                              <span className="customer-email">{booking.user.email}</span>
                            </div>
                          ) : (
                            <div className="booking-customer">
                              <span className="customer-name">{booking.customerName}</span>
                              <span className="customer-email">{booking.customerEmail}</span>
                              <span className="customer-phone">{booking.customerPhone}</span>
                            </div>
                          )}
                        </td>
                        <td>
                          {booking.service ? booking.service.name : booking.serviceName || 'N/A'}
                          {booking.device && booking.device.model && (
                            <div className="booking-device">
                              {booking.device.brand.name} {booking.device.model.name}
                            </div>
                          )}
                          {booking.deviceInfo && (
                            <div className="booking-device">
                              {booking.deviceInfo}
                            </div>
                          )}
                        </td>
                        <td>{formatBookingDate(booking.bookingDate, booking.bookingTime)}</td>
                        <td>{formatDate(booking.createdAt)}</td>
                        <td>
                          <span className={`admin-badge admin-badge-${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <Link
                              to={`/admin/bookings/${booking.id}`}
                              className="admin-btn admin-btn-sm admin-btn-info"
                              title="View Booking Details"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>
                            <button
                              className="admin-btn admin-btn-sm admin-btn-primary"
                              onClick={() => openStatusModal(booking)}
                              title="Update Status"
                            >
                              <i className="fas fa-edit"></i>
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
            </>
          )}
        </div>
      </div>
      
      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={() => setShowStatusModal(false)}></div>
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h3>Update Booking Status</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowStatusModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Update status for booking {selectedBooking.bookingNumber || `#${selectedBooking.id}`}
              </p>
              <div className="admin-form-group">
                <label htmlFor="bookingStatus" className="admin-label">
                  Booking Status
                </label>
                <select
                  id="bookingStatus"
                  className="admin-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {bookingStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="statusNote" className="admin-label">
                  Note (optional)
                </label>
                <textarea
                  id="statusNote"
                  className="admin-textarea"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note about this status change"
                  rows="3"
                ></textarea>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={updateBookingStatus}
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingList; 