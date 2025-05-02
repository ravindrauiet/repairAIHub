import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../services/firestoreService';

const BookingList = () => {
  // State for bookings
  const [bookings, setBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
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
  
  // Fetch all bookings on component mount
  useEffect(() => {
    fetchAllBookings();
  }, []);
  
  // Apply filters when filter parameters change
  useEffect(() => {
    if (allBookings.length > 0) {
      applyFiltersAndPagination();
    }
  }, [allBookings, currentPage, statusFilter, sortBy, sortDirection, searchTerm]);
  
  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const fetchedBookings = await firestoreService.getAllBookings();
      setAllBookings(fetchedBookings);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings from Firebase:', err);
      setError('Failed to load bookings from Firebase. Please try again.');
      setLoading(false);
    }
  };
  
  const applyFiltersAndPagination = () => {
    let filteredBookings = [...allBookings];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredBookings = filteredBookings.filter(booking => booking.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredBookings = filteredBookings.filter(booking => 
        (booking.customerName && booking.customerName.toLowerCase().includes(searchLower)) ||
        (booking.customerEmail && booking.customerEmail.toLowerCase().includes(searchLower)) ||
        (booking.customerPhone && booking.customerPhone.includes(searchLower)) ||
        (booking.serviceName && booking.serviceName.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    filteredBookings.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle date fields
      if (sortBy === 'createdAt' || sortBy === 'date') {
        aValue = aValue ? new Date(aValue instanceof Object ? aValue.toDate() : aValue) : new Date(0);
        bValue = bValue ? new Date(bValue instanceof Object ? bValue.toDate() : bValue) : new Date(0);
      }
      
      // Handle missing values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';
      
      // Compare values
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    // Calculate total pages
    const total = filteredBookings.length;
    const calculatedTotalPages = Math.ceil(total / limit);
    setTotalPages(calculatedTotalPages);
    
    // Ensure currentPage is valid
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
      return;
    }
    
    // Apply pagination
    const startIndex = (currentPage - 1) * limit;
    const paginatedBookings = filteredBookings.slice(startIndex, startIndex + limit);
    
    setBookings(paginatedBookings);
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
      if (!selectedBooking || !selectedBooking.id) {
        setError('Invalid booking selected');
        return;
      }
      
      await firestoreService.updateBookingStatus(selectedBooking.id, newStatus, statusNote);
      
      // Close modal and refresh bookings
      setShowStatusModal(false);
      
      // Update in the local state to avoid refetching all data
      const updatedAllBookings = allBookings.map(booking => {
        if (booking.id === selectedBooking.id) {
          return {
            ...booking,
            status: newStatus,
            statusNote: statusNote,
            updatedAt: new Date()
          };
        }
        return booking;
      });
      
      setAllBookings(updatedAllBookings);
    } catch (err) {
      console.error('Error updating booking status in Firebase:', err);
      setError('Failed to update booking status. Please try again.');
    }
  };
  
  // Format date
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    
    // Handle Firestore Timestamp
    const date = dateValue instanceof Object && dateValue.toDate 
      ? dateValue.toDate() 
      : new Date(dateValue);
    
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
    
    // Handle Firestore Timestamp
    const dateObj = date instanceof Object && date.toDate
      ? date.toDate()
      : new Date(`${date}T${time || '00:00'}`);
    
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
            className={`admin-pagination-btn ${currentPage === number ? 'active' : ''}`}
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

  return (
    <div className="admin-bookings">
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
      
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-filters">
            <div className="admin-filter-group">
              <label className="admin-filter-label">Status</label>
              <select
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
            
            <form onSubmit={handleSearch} className="admin-search-form">
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-search-input"
              />
              <button type="submit" className="admin-search-btn">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        </div>
        
        <div className="admin-card-body">
          {loading ? (
            <div className="admin-loading">
              <div className="spinner"></div>
              <p>Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="admin-empty-state">
              <i className="fas fa-calendar-alt admin-empty-icon"></i>
              <p>No bookings found.</p>
            </div>
          ) : (
            <>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('id')} className="sortable">
                        ID {sortBy === 'id' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('customerName')} className="sortable">
                        Customer {sortBy === 'customerName' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('serviceName')} className="sortable">
                        Service {sortBy === 'serviceName' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('date')} className="sortable">
                        Date {sortBy === 'date' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('status')} className="sortable">
                        Status {sortBy === 'status' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('createdAt')} className="sortable">
                        Created {sortBy === 'createdAt' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td>{booking.id.substring(0, 8)}...</td>
                        <td>
                          <div className="admin-user-info">
                            <div className="admin-user-name">{booking.customerName || 'N/A'}</div>
                            <div className="admin-user-email">{booking.customerEmail || 'N/A'}</div>
                          </div>
                        </td>
                        <td>{booking.serviceName || 'N/A'}</td>
                        <td>{formatBookingDate(booking.date, booking.time)}</td>
                        <td>
                          <span className={`admin-badge admin-badge-${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status || 'pending')}
                          </span>
                        </td>
                        <td>{formatDate(booking.createdAt)}</td>
                        <td>
                          <div className="admin-actions">
                            <Link to={`/admin/bookings/${booking.id}`} className="admin-btn admin-btn-sm admin-btn-info">
                              <i className="fas fa-eye"></i>
                            </Link>
                            <button
                              className="admin-btn admin-btn-sm admin-btn-primary"
                              onClick={() => openStatusModal(booking)}
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
              
              {renderPagination()}
            </>
          )}
        </div>
      </div>
      
      {/* Status Update Modal */}
      {showStatusModal && selectedBooking && (
        <div className="admin-modal">
          <div className="admin-modal-content">
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
              <div className="admin-form-group">
                <label htmlFor="booking-status" className="admin-label">Status</label>
                <select
                  id="booking-status"
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
                <label htmlFor="status-note" className="admin-label">Note (Optional)</label>
                <textarea
                  id="status-note"
                  className="admin-textarea"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note about this status change..."
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