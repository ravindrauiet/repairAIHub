import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../services/firestoreService';
import { toast } from 'react-toastify';

const OrderList = () => {
  // State for orders
  const [orders, setOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  
  // Available order statuses
  const orderStatuses = [
    { value: 'pending', label: 'Pending', color: 'warning' },
    { value: 'processing', label: 'Processing', color: 'info' },
    { value: 'shipped', label: 'Shipped', color: 'primary' },
    { value: 'delivered', label: 'Delivered', color: 'success' },
    { value: 'cancelled', label: 'Cancelled', color: 'danger' },
    { value: 'refunded', label: 'Refunded', color: 'secondary' }
  ];
  
  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);
  
  // Apply filtering, sorting, and pagination when these values change
  useEffect(() => {
    if (allOrders.length > 0) {
      applyFiltersAndPagination();
    }
  }, [allOrders, currentPage, statusFilter, sortBy, sortDirection, searchTerm]);
  
  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch all orders from Firestore
      const fetchedOrders = await firestoreService.getAllOrders();
      setAllOrders(fetchedOrders);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      toast.error('Failed to load orders from the database');
      setLoading(false);
    }
  };
  
  // Apply client-side filtering, sorting, and pagination
  const applyFiltersAndPagination = () => {
    let filteredOrders = [...allOrders];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    // Apply search
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(order => 
        (order.orderNumber && order.orderNumber.toLowerCase().includes(searchLower)) ||
        (order.user && order.user.name && order.user.name.toLowerCase().includes(searchLower)) ||
        (order.user && order.user.email && order.user.email.toLowerCase().includes(searchLower))
      );
    }
    
    // Apply sorting
    filteredOrders.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle missing values
      if (aValue === undefined) aValue = '';
      if (bValue === undefined) bValue = '';
      
      // Handle date comparison for createdAt
      if (sortBy === 'createdAt') {
        const aDate = aValue ? new Date(aValue.toDate ? aValue.toDate() : aValue) : new Date(0);
        const bDate = bValue ? new Date(bValue.toDate ? bValue.toDate() : bValue) : new Date(0);
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }
      
      // Number comparison for totalAmount
      if (sortBy === 'totalAmount') {
        const aNum = parseFloat(aValue) || 0;
        const bNum = parseFloat(bValue) || 0;
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }
      
      // String comparison for other fields
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();
      
      return sortDirection === 'asc' 
        ? aString.localeCompare(bString)
        : bString.localeCompare(aString);
    });
    
    // Calculate total pages
    const total = filteredOrders.length;
    const calculatedTotalPages = Math.ceil(total / limit);
    
    // Ensure valid current page
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(1);
      return;
    }
    
    setTotalPages(calculatedTotalPages);
    
    // Apply pagination
    const startIndex = (currentPage - 1) * limit;
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);
    
    setOrders(paginatedOrders);
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
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };
  
  // Update order status
  const updateOrderStatus = async () => {
    try {
      setLoading(true);
      
      // Update order status in Firestore
      await firestoreService.updateOrder(selectedOrder.id, {
        status: newStatus
      });
      
      // Update local state
      const updatedOrders = allOrders.map(order => 
        order.id === selectedOrder.id ? { ...order, status: newStatus } : order
      );
      setAllOrders(updatedOrders);
      
      // Close modal
      setShowStatusModal(false);
      toast.success('Order status updated successfully');
      setLoading(false);
    } catch (err) {
      console.error('Error updating order status:', err);
      setError('Failed to update order status. Please try again.');
      toast.error('Failed to update order status');
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    
    let date;
    if (dateValue.toDate) {
      // Convert Firestore Timestamp to JS Date
      date = dateValue.toDate();
    } else {
      date = new Date(dateValue);
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'secondary';
  };
  
  // Get status label
  const getStatusLabel = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status);
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
        <p>Loading orders...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-orders-list">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Order Management</h2>
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
            {orderStatuses.map(status => (
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
              placeholder="Search by order ID or customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="admin-btn admin-btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>
      
      {/* Orders Table */}
      <div className="admin-card">
        <div className="admin-card-body">
          {orders.length === 0 ? (
            <div className="admin-empty-state">
              <i className="fas fa-shopping-cart"></i>
              <p>No orders found. Adjust your filters or check back later.</p>
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
                        Order ID 
                        {sortBy === 'id' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th>Customer</th>
                      <th 
                        onClick={() => handleSort('createdAt')}
                        className="sortable"
                      >
                        Date 
                        {sortBy === 'createdAt' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('totalAmount')}
                        className="sortable"
                      >
                        Total 
                        {sortBy === 'totalAmount' && (
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
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.orderNumber || `#${order.id.substring(0, 8)}`}</td>
                        <td>
                          {order.user ? (
                            <div className="order-customer">
                              <span className="customer-name">{order.user.name}</span>
                              <span className="customer-email">{order.user.email}</span>
                            </div>
                          ) : (
                            'Guest User'
                          )}
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>{formatCurrency(order.totalAmount)}</td>
                        <td>
                          <span className={`admin-badge admin-badge-${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <Link
                              to={`/admin/orders/${order.id}`}
                              className="admin-btn admin-btn-sm admin-btn-info"
                              title="View Order Details"
                            >
                              <i className="fas fa-eye"></i>
                            </Link>
                            <button
                              className="admin-btn admin-btn-sm admin-btn-primary"
                              onClick={() => openStatusModal(order)}
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
              <h3>Update Order Status</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowStatusModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Update status for order {selectedOrder.orderNumber || `#${selectedOrder.id.substring(0, 8)}`}
              </p>
              <div className="admin-form-group">
                <label htmlFor="orderStatus" className="admin-label">
                  Order Status
                </label>
                <select
                  id="orderStatus"
                  className="admin-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {orderStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
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
                onClick={updateOrderStatus}
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

export default OrderList; 