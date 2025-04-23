import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getOrderById, 
  updateOrderStatus
} from '../../services/firestoreService';
import { toast } from 'react-toastify';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOptions] = useState(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        const orderData = await getOrderById(id);
        
        if (!orderData) {
          setError('Order not found');
        } else {
          setOrder(orderData);
          setUpdateStatus(orderData.status);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again.');
        toast.error('Failed to load order details');
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
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
    
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };
  
  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    
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
      case 'refunded':
        return 'admin-badge-secondary';
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
      const updateData = {
        status: updateStatus
      };
      
      if (updateNote.trim()) {
        // Format the note with timestamp
        const timestamp = new Date().toLocaleString();
        const formattedNote = `${timestamp}: ${updateNote}`;
        
        if (order.notes) {
          updateData.notes = `${order.notes}\n\n${formattedNote}`;
        } else {
          updateData.notes = formattedNote;
        }
      }
      
      // Update order status with note
      await updateOrderStatus(id, updateStatus, updateNote.trim() ? updateNote : null);
      
      // Refresh order data
      const updatedOrder = await getOrderById(id);
      setOrder(updatedOrder);
      setUpdateNote('');
      toast.success(`Order status updated to ${updateStatus}`);
      
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error updating order:', err);
      setError('Failed to update order. Please try again.');
      toast.error('Failed to update order status');
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
        <div className="admin-alert admin-alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
        </div>
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
        <div className="admin-alert admin-alert-danger">
          <i className="fas fa-exclamation-circle"></i> Order Not Found
        </div>
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
              <div className="admin-detail-label">Total Amount</div>
              <div className="admin-detail-value">{formatPrice(order.total)}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Payment Method</div>
              <div className="admin-detail-value">{order.paymentMethod || 'N/A'}</div>
            </div>
            
            {order.paymentId && (
              <div className="admin-detail-row">
                <div className="admin-detail-label">Payment ID</div>
                <div className="admin-detail-value">{order.paymentId}</div>
              </div>
            )}
            
            {order.trackingNumber && (
              <div className="admin-detail-row">
                <div className="admin-detail-label">Tracking Number</div>
                <div className="admin-detail-value">{order.trackingNumber}</div>
              </div>
            )}
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
              <div className="admin-detail-value">{order.customerName || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Email</div>
              <div className="admin-detail-value">{order.customerEmail || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Phone</div>
              <div className="admin-detail-value">{order.customerPhone || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        {/* Shipping Address Card */}
        {order.shippingAddress && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Shipping Address</h3>
            </div>
            
            <div className="admin-card-body">
              <div className="admin-detail-address">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          </div>
        )}
        
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
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items && order.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="admin-order-product">
                          {item.imageUrl && (
                            <img src={item.imageUrl} alt={item.name} className="admin-order-product-image" />
                          )}
                          <div className="admin-order-product-info">
                            <div className="admin-order-product-name">{item.name}</div>
                            {item.options && Object.entries(item.options).map(([key, value]) => (
                              <div key={key} className="admin-order-product-option">
                                {key}: {value}
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>{formatPrice(item.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="admin-text-right">Subtotal:</td>
                    <td>{formatPrice(order.subtotal)}</td>
                  </tr>
                  {order.discount > 0 && (
                    <tr>
                      <td colSpan="3" className="admin-text-right">Discount:</td>
                      <td>-{formatPrice(order.discount)}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="3" className="admin-text-right">Shipping:</td>
                    <td>{formatPrice(order.shipping)}</td>
                  </tr>
                  <tr>
                    <td colSpan="3" className="admin-text-right">Tax:</td>
                    <td>{formatPrice(order.tax)}</td>
                  </tr>
                  <tr className="admin-order-total">
                    <td colSpan="3" className="admin-text-right">Total:</td>
                    <td>{formatPrice(order.total)}</td>
                  </tr>
                </tfoot>
              </table>
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
                {isSubmitting ? (
                  <>
                    <div className="spinner-small"></div> Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Notes Card */}
        {order.notes && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Notes History</h3>
            </div>
            
            <div className="admin-card-body">
              <div className="admin-notes-history">
                {order.notes.split('\n\n').map((note, index) => (
                  <div key={index} className="admin-note-item">
                    <p>{note}</p>
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