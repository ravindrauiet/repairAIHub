import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getBookingById, 
  updateBooking, 
  updateBookingStatus 
} from '../../services/firestoreService';
import { toast } from 'react-toastify';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOptions] = useState(['pending', 'confirmed', 'cancelled', 'completed', 'in_progress', 'no_show']);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        const bookingData = await getBookingById(id);
        
        if (!bookingData) {
          setError('Booking not found');
        } else {
          setBooking(bookingData);
          setUpdateStatus(bookingData.status);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details. Please try again.');
        toast.error('Failed to load booking details');
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
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
  
  // Format time
  const formatTime = (timeValue) => {
    if (!timeValue) return 'N/A';
    return timeValue;
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
      case 'confirmed':
        return 'admin-badge-info';
      case 'in_progress':
        return 'admin-badge-primary';
      case 'completed':
        return 'admin-badge-success';
      case 'cancelled':
        return 'admin-badge-danger';
      case 'no_show':
        return 'admin-badge-secondary';
      default:
        return 'admin-badge-secondary';
    }
  };
  
  // Handle status update
  const handleUpdateBooking = async (e) => {
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
        
        if (booking.notes) {
          updateData.notes = `${booking.notes}\n\n${formattedNote}`;
        } else {
          updateData.notes = formattedNote;
        }
      }
      
      // Update booking status with note
      await updateBookingStatus(id, updateStatus, updateNote.trim() ? updateNote : null);
      
      // Refresh booking data
      const updatedBooking = await getBookingById(id);
      setBooking(updatedBooking);
      setUpdateNote('');
      toast.success(`Booking status updated to ${updateStatus}`);
      
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking. Please try again.');
      toast.error('Failed to update booking status');
      setIsSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading booking details...</p>
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
          onClick={() => navigate('/admin/bookings')}
        >
          Back to Bookings
        </button>
      </div>
    );
  }
  
  if (!booking) {
    return (
      <div className="admin-error-container">
        <div className="admin-alert admin-alert-danger">
          <i className="fas fa-exclamation-circle"></i> Booking Not Found
        </div>
        <button
          className="admin-btn admin-btn-primary"
          onClick={() => navigate('/admin/bookings')}
        >
          Back to Bookings
        </button>
      </div>
    );
  }
  
  return (
    <div className="admin-booking-detail">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Booking Details</h2>
        <Link to="/admin/bookings" className="admin-btn admin-btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Bookings
        </Link>
      </div>
      
      <div className="admin-grid">
        {/* Booking Info Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Booking Information</h3>
            <span className={`admin-badge ${getStatusColor(booking.status)}`}>
              {booking.status.toUpperCase()}
            </span>
          </div>
          
          <div className="admin-card-body">
            <div className="admin-detail-row">
              <div className="admin-detail-label">Booking ID</div>
              <div className="admin-detail-value">{booking.id}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Service</div>
              <div className="admin-detail-value">{booking.serviceName || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Price</div>
              <div className="admin-detail-value">{formatPrice(booking.price)}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Booking Date</div>
              <div className="admin-detail-value">{formatDate(booking.date)}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Time Slot</div>
              <div className="admin-detail-value">{formatTime(booking.time)}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Created On</div>
              <div className="admin-detail-value">{formatDate(booking.createdAt)}</div>
            </div>
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
              <div className="admin-detail-value">{booking.customerName || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Email</div>
              <div className="admin-detail-value">{booking.customerEmail || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Phone</div>
              <div className="admin-detail-value">{booking.customerPhone || 'N/A'}</div>
            </div>
            
            {booking.device && (
              <div className="admin-detail-row">
                <div className="admin-detail-label">Device</div>
                <div className="admin-detail-value">{booking.device}</div>
              </div>
            )}
            
            {booking.issue && (
              <div className="admin-detail-row">
                <div className="admin-detail-label">Issue Description</div>
                <div className="admin-detail-value">{booking.issue}</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Update Status Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Update Status</h3>
          </div>
          
          <div className="admin-card-body">
            <form onSubmit={handleUpdateBooking}>
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
                      {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
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
                disabled={isSubmitting || updateStatus === booking.status}
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
        {booking.notes && (
          <div className="admin-card">
            <div className="admin-card-header">
              <h3>Notes History</h3>
            </div>
            
            <div className="admin-card-body">
              <div className="admin-notes-history">
                {booking.notes.split('\n\n').map((note, index) => (
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

export default BookingDetail; 