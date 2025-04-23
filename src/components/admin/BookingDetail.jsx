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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedBooking, setEditedBooking] = useState(null);
  
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
          setEditedBooking(bookingData);
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
      setEditedBooking(updatedBooking);
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
  
  // Handle edit mode toggle
  const toggleEditMode = () => {
    if (isEditMode) {
      // Exit edit mode without saving
      setEditedBooking(booking);
    }
    setIsEditMode(!isEditMode);
  };

  // Handle input changes for editing
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setEditedBooking(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setEditedBooking(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Save all booking changes
  const saveBookingChanges = async () => {
    setIsSubmitting(true);
    
    try {
      // Preserve timestamps by removing them from the edit object
      const { createdAt, updatedAt, ...bookingDataToUpdate } = editedBooking;
      
      await updateBooking(id, bookingDataToUpdate);
      
      // Refresh booking data
      const updatedBooking = await getBookingById(id);
      setBooking(updatedBooking);
      setEditedBooking(updatedBooking);
      setIsEditMode(false);
      
      toast.success('Booking information updated successfully');
      setIsSubmitting(false);
    } catch (err) {
      console.error('Error updating booking information:', err);
      toast.error('Failed to update booking information');
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
        <div className="admin-section-actions">
          <button 
            className={`admin-btn ${isEditMode ? 'admin-btn-danger' : 'admin-btn-primary'}`}
            onClick={toggleEditMode}
          >
            <i className={`fas fa-${isEditMode ? 'times' : 'edit'}`}></i>
            {isEditMode ? ' Cancel Edit' : ' Edit Booking'}
          </button>
          {isEditMode && (
            <button 
              className="admin-btn admin-btn-success"
              onClick={saveBookingChanges}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><div className="spinner-small"></div> Saving...</>
              ) : (
                <><i className="fas fa-save"></i> Save Changes</>
              )}
            </button>
          )}
          <Link to="/admin/bookings" className="admin-btn admin-btn-secondary">
            <i className="fas fa-arrow-left"></i> Back to Bookings
          </Link>
        </div>
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
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="text"
                    name="bookingId"
                    className="admin-input"
                    value={editedBooking.bookingId || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.bookingId || booking.id
                )}
              </div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Service</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="text"
                    name="serviceType"
                    className="admin-input"
                    value={editedBooking.serviceType || (editedBooking.service?.title || '')}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.service?.title || booking.serviceType || 'N/A'
                )}
              </div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Price</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="number"
                    name="service.price"
                    className="admin-input"
                    value={editedBooking.service?.price || 0}
                    onChange={handleInputChange}
                  />
                ) : (
                  formatPrice(booking.service?.price || 0)
                )}
              </div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Preferred Date</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="date"
                    name="preferredDate"
                    className="admin-input"
                    value={editedBooking.preferredDate || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.preferredDate || formatDate(booking.date)
                )}
              </div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Preferred Time</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="time"
                    name="preferredTime"
                    className="admin-input"
                    value={editedBooking.preferredTime || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.preferredTime || formatTime(booking.time)
                )}
              </div>
            </div>

            <div className="admin-detail-row">
              <div className="admin-detail-label">Status</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <select
                    name="status"
                    className="admin-select"
                    value={editedBooking.status}
                    onChange={handleInputChange}
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                ) : (
                  booking.status
                )}
              </div>
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
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="text"
                    name="name"
                    className="admin-input"
                    value={editedBooking.name || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.name || booking.customerName || 'N/A'
                )}
              </div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Email</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="email"
                    name="email"
                    className="admin-input"
                    value={editedBooking.email || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.email || booking.customerEmail || 'N/A'
                )}
              </div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Phone</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="tel"
                    name="phone"
                    className="admin-input"
                    value={editedBooking.phone || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.phone || booking.customerPhone || 'N/A'
                )}
              </div>
            </div>

            <div className="admin-detail-row">
              <div className="admin-detail-label">Address</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="text"
                    name="address"
                    className="admin-input"
                    value={editedBooking.address || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.address || 'N/A'
                )}
              </div>
            </div>

            <div className="admin-detail-row">
              <div className="admin-detail-label">City</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="text"
                    name="city"
                    className="admin-input"
                    value={editedBooking.city || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.city || 'N/A'
                )}
              </div>
            </div>

            <div className="admin-detail-row">
              <div className="admin-detail-label">Pincode</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="text"
                    name="pincode"
                    className="admin-input"
                    value={editedBooking.pincode || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.pincode || 'N/A'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Device Info Card */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Device Information</h3>
          </div>
          
          <div className="admin-card-body">
            <div className="admin-detail-row">
              <div className="admin-detail-label">Device Brand</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="text"
                    name="deviceBrand"
                    className="admin-input"
                    value={editedBooking.deviceBrand || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.deviceBrand || 'N/A'
                )}
              </div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Device Model</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <input
                    type="text"
                    name="deviceModel"
                    className="admin-input"
                    value={editedBooking.deviceModel || ''}
                    onChange={handleInputChange}
                  />
                ) : (
                  booking.deviceModel || 'N/A'
                )}
              </div>
            </div>
            
            <div className="admin-detail-row">
              <div className="admin-detail-label">Issue Description</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <textarea
                    name="issueDescription"
                    className="admin-textarea"
                    value={editedBooking.issueDescription || ''}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                ) : (
                  booking.issueDescription || booking.issue || 'N/A'
                )}
              </div>
            </div>

            <div className="admin-detail-row">
              <div className="admin-detail-label">Additional Info</div>
              <div className="admin-detail-value">
                {isEditMode ? (
                  <textarea
                    name="additionalInfo"
                    className="admin-textarea"
                    value={editedBooking.additionalInfo || ''}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                ) : (
                  booking.additionalInfo || 'N/A'
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Update Status Card */}
        {!isEditMode && (
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
        )}
        
        {/* Notes Card */}
        {booking.notes && !isEditMode && (
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