import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOptions] = useState(['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setOrder(response.data.order);
        setUpdateStatus(response.data.order.status);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'admin-badge-warning';
      case 'processing':
        return 'admin-badge-info';
      case 'shipped':
        return 'admin-badge-primary';
      case 'delivered':
        return 'admin-badge-success';
      case 'cancelled':
        return 'admin-badge-danger';
      default:
        return 'admin-badge-secondary';
    }
  };
  
  // Handle status update
  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    
    if (!updateStatus) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      
      const updateData = {
        status: updateStatus
      };
      
      if (updateNote.trim()) {
        updateData.notes = order.notes 
          ? `${order.notes}\n\n${new Date().toLocaleString()}: ${updateNote}`
          : `${new Date().toLocaleString()}: ${updateNote}`;
      }
      
      await axios.put(`http://localhost:5000/api/orders/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh order data
      const response = await axios.get(`http://localhost:5000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setOrder(response.data.order);
      setUpdateNote('');
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order. Please try again.');
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => navigate('/admin/orders')}
        >
          Back to Orders
        </button>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="admin-error-container">
        <h2>Order Not Found</h2>
        <p>The order you're looking for could not be found.</p>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => navigate('/admin/orders')}
        >
          Back to Orders
        </button>
      </div>
    );
  }
  
  return (
    <div className="admin-order-detail">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Order Details</h2>
        <Link to="/admin/orders" className="admin-btn admin-btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Orders
        </Link>
      </div>
      
      <div className="admin-grid">
        {/* Order Info Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Order Information</h3>
            <span className={`admin-badge ${getStatusColor(order.status)}`}>
              {order.status.toUpperCase()}
            </span>
          </div>
          
          <div className="admin-card-body">
            <div className="admin-detail-row">
              <div className="admin-detail-label">Order ID</div>
              <div className="admin-detail-value">{order.id}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Order Date</div>
              <div className="admin-detail-value">{formatDate(order.createdAt)}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Total</div>
              <div className="admin-detail-value">{formatPrice(order.totalAmount)}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Payment Method</div>
              <div className="admin-detail-value">{order.paymentMethod || 'Not specified'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Payment Status</div>
              <div className="admin-detail-value">
                <span className={`admin-badge ${order.isPaid ? 'admin-badge-success' : 'admin-badge-danger'}`}>
                  {order.isPaid ? 'PAID' : 'UNPAID'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Update Status Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Update Status</h3>
          </div>
          
          <div className="admin-card-body">
            <form onSubmit={handleUpdateOrder}>
              <div className="admin-form-group">
                <label htmlFor="status" className="admin-label">Status</label>
                <select
                  id="status"
                  className="admin-select"
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="note" className="admin-label">Add Note (Optional)</label>
                <textarea
                  id="note"
                  className="admin-textarea"
                  value={updateNote}
                  onChange={(e) => setUpdateNote(e.target.value)}
                  placeholder="Add a note about this status update"
                  rows="3"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="admin-btn admin-btn-primary admin-btn-block"
                disabled={isSubmitting || updateStatus === order.status}
              >
                {isSubmitting ? 'Updating...' : 'Update Order'}
              </button>
            </form>
          </div>
        </div>
        
        {/* Customer Info Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Customer Information</h3>
          </div>
          
          <div className="admin-card-body">
            <div className="admin-detail-row">
              <div className="admin-detail-label">Name</div>
              <div className="admin-detail-value">{order.User?.name || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Email</div>
              <div className="admin-detail-value">{order.User?.email || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Phone</div>
              <div className="admin-detail-value">{order.contactNumber || order.User?.phone || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        {/* Shipping Info Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Shipping Information</h3>
          </div>
          
          <div className="admin-card-body">
            <div className="admin-detail-row">
              <div className="admin-detail-label">Address</div>
              <div className="admin-detail-value">
                {order.shippingAddress || order.User?.address || 'No address provided'}
              </div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">City</div>
              <div className="admin-detail-value">{order.shippingCity || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">State/Province</div>
              <div className="admin-detail-value">{order.shippingState || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Postal Code</div>
              <div className="admin-detail-value">{order.shippingZip || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Country</div>
              <div className="admin-detail-value">{order.shippingCountry || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        {/* Order Items Card */}
        <div className="admin-card admin-card-full">
          <div className="admin-card-header">
            <h3>Order Items</h3>
          </div>
          
          <div className="admin-card-body">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.OrderItems?.map((item) => (
                    <tr key={item.id}>
                      <td>{item.Product?.name || 'Unknown Product'}</td>
                      <td>
                        {item.Product?.image ? (
                          <img
                            src={`http://localhost:5000/${item.Product.image}`}
                            alt={item.Product.name}
                            className="admin-product-thumbnail"
                          />
                        ) : (
                          <div className="admin-no-image">No Image</div>
                        )}
                      </td>
                      <td>{formatPrice(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="admin-text-right"><strong>Subtotal:</strong></td>
                    <td>{formatPrice(order.subtotal || 0)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="admin-text-right"><strong>Tax:</strong></td>
                    <td>{formatPrice(order.tax || 0)}</td>
                  </tr>
                  <tr>
                    <td colSpan="4" className="admin-text-right"><strong>Shipping:</strong></td>
                    <td>{formatPrice(order.shippingCost || 0)}</td>
                  </tr>
                  <tr className="admin-total-row">
                    <td colSpan="4" className="admin-text-right"><strong>Total:</strong></td>
                    <td><strong>{formatPrice(order.totalAmount)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
        
        {/* Notes Card */}
        {order.notes && (
          <div className="admin-card admin-card-full">
            <div className="admin-card-header">
              <h3>Notes & History</h3>
            </div>
            
            <div className="admin-card-body">
              <div className="admin-notes">
                {order.notes.split('\n\n').map((note, index) => (
                  <div key={index} className="admin-note">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetail; 