import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusOptions] = useState(['pending', 'confirmed', 'cancelled', 'completed']);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get(`http://localhost:5000/api/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setBooking(response.data.booking);
        setUpdateStatus(response.data.booking.status);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchBookingDetails();
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
      case 'confirmed':
        return 'admin-badge-info';
      case 'completed':
        return 'admin-badge-success';
      case 'cancelled':
        return 'admin-badge-danger';
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
      const token = localStorage.getItem('token');
      
      const updateData = {
        status: updateStatus
      };
      
      if (updateNote.trim()) {
        updateData.notes = booking.notes 
          ? `${booking.notes}\n\n${new Date().toLocaleString()}: ${updateNote}`
          : `${new Date().toLocaleString()}: ${updateNote}`;
      }
      
      await axios.put(`http://localhost:5000/api/bookings/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Refresh booking data
      const response = await axios.get(`http://localhost:5000/api/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setBooking(response.data.booking);
      setUpdateNote('');
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error updating booking:', err);
      setError('Failed to update booking. Please try again.');
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
        <h2>Error</h2>
        <p>{error}</p>
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
        <h2>Booking Not Found</h2>
        <p>The booking you're looking for could not be found.</p>
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
              <div className="admin-detail-value">{booking.Service?.name || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Price</div>
              <div className="admin-detail-value">{booking.Service?.price ? formatPrice(booking.Service.price) : 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Booking Date</div>
              <div className="admin-detail-value">{formatDate(booking.bookingDate)}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Time Slot</div>
              <div className="admin-detail-value">{booking.timeSlot}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Created On</div>
              <div className="admin-detail-value">{formatDate(booking.createdAt)}</div>
            </div>
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
                disabled={isSubmitting || updateStatus === booking.status}
              >
                {isSubmitting ? 'Updating...' : 'Update Booking'}
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
              <div className="admin-detail-value">{booking.User?.name || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Email</div>
              <div className="admin-detail-value">{booking.User?.email || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Phone</div>
              <div className="admin-detail-value">{booking.contactNumber || booking.User?.phone || 'N/A'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Address</div>
              <div className="admin-detail-value">{booking.address || booking.User?.address || 'N/A'}</div>
            </div>
          </div>
        </div>
        
        {/* Device Details Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Device & Issue Details</h3>
          </div>
          
          <div className="admin-card-body">
            <div className="admin-detail-row">
              <div className="admin-detail-label">Device Details</div>
              <div className="admin-detail-value">{booking.deviceDetails || 'No device details provided'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Issue Description</div>
              <div className="admin-detail-value">{booking.issue || 'No issue description provided'}</div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Technician Assigned</div>
              <div className="admin-detail-value">{booking.technician || 'Not assigned yet'}</div>
            </div>
          </div>
        </div>
        
        {/* Notes Card */}
        {booking.notes && (
          <div className="admin-card admin-card-full">
            <div className="admin-card-header">
              <h3>Notes & History</h3>
            </div>
            
            <div className="admin-card-body">
              <div className="admin-notes">
                {booking.notes.split('\n\n').map((note, index) => (
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

export default BookingDetail; 