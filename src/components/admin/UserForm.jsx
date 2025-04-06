import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
    address: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // User roles
  const roles = ['user', 'admin', 'technician'];
  
  // Fetch user data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchUser = async () => {
        try {
          setFetchLoading(true);
          const token = localStorage.getItem('token');
          
          const response = await axios.get(`http://localhost:5000/api/admin/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const userData = response.data.user;
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            password: '',
            confirmPassword: '',
            role: userData.role || 'user',
            phone: userData.phone || '',
            address: userData.address || ''
          });
          
          setFetchLoading(false);
        } catch (err) {
          console.error('Error fetching user:', err);
          setError('Failed to load user data. Please try again.');
          setFetchLoading(false);
        }
      };
      
      fetchUser();
    }
  }, [id, isEditMode]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!isEditMode) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password) {
      if (formData.password.length < 6) {
        errors.password = 'Password must be at least 6 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare data for API
      const userData = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        address: formData.address
      };
      
      // Only include password if provided
      if (formData.password) {
        userData.password = formData.password;
      }
      
      if (isEditMode) {
        // Update existing user
        await axios.put(`http://localhost:5000/api/admin/users/${id}`, userData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Create new user
        await axios.post('http://localhost:5000/api/admin/users', userData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      // Redirect to users list
      navigate('/admin/users');
    } catch (err) {
      console.error('Error saving user:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to save user. Please try again.');
      }
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-form-container">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          {isEditMode ? 'Edit User' : 'Add New User'}
        </h2>
      </div>
      
      {error && (
        <div className="admin-alert admin-alert-danger">
          {error}
        </div>
      )}
      
      <div className="admin-card">
        <div className="admin-card-body">
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="name" className="admin-label">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`admin-input ${formErrors.name ? 'admin-input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
              />
              {formErrors.name && <div className="admin-form-error">{formErrors.name}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="email" className="admin-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`admin-input ${formErrors.email ? 'admin-input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
              />
              {formErrors.email && <div className="admin-form-error">{formErrors.email}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="role" className="admin-label">Role</label>
              <select
                id="role"
                name="role"
                className="admin-select"
                value={formData.role}
                onChange={handleChange}
              >
                {roles.map(role => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="password" className="admin-label">
                {isEditMode ? 'Password (leave blank to keep current)' : 'Password'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`admin-input ${formErrors.password ? 'admin-input-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
              {formErrors.password && <div className="admin-form-error">{formErrors.password}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="confirmPassword" className="admin-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className={`admin-input ${formErrors.confirmPassword ? 'admin-input-error' : ''}`}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                disabled={!formData.password && isEditMode}
              />
              {formErrors.confirmPassword && <div className="admin-form-error">{formErrors.confirmPassword}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="phone" className="admin-label">Phone Number</label>
              <input
                type="text"
                id="phone"
                name="phone"
                className="admin-input"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
              />
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="address" className="admin-label">Address</label>
              <textarea
                id="address"
                name="address"
                className="admin-textarea"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full Address"
                rows="3"
              ></textarea>
            </div>
            
            <div className="admin-form-buttons">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => navigate('/admin/users')}
                disabled={loading}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-small"></span>
                    {isEditMode ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditMode ? 'Update User' : 'Create User'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm; 