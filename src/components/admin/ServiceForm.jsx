import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    categoryId: '',
    featured: false
  });
  
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fetch service details if editing
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/categories', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setErrorMessage('Failed to load categories');
      }
    };
    
    const fetchServiceDetails = async () => {
      if (!isEditing) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/services/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        const service = response.data.service;
        
        setFormData({
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.duration,
          categoryId: service.categoryId,
          featured: service.featured
        });
        
        if (service.image) {
          setPreviewUrl(`http://localhost:5000/${service.image}`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service details:', err);
        setErrorMessage('Failed to load service details');
        setLoading(false);
      }
    };
    
    fetchCategories();
    fetchServiceDetails();
  }, [id, isEditing]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear errors
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaveLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare form data
      const serviceData = new FormData();
      serviceData.append('name', formData.name);
      serviceData.append('description', formData.description);
      serviceData.append('price', formData.price);
      
      if (formData.duration) {
        serviceData.append('duration', formData.duration);
      }
      
      serviceData.append('categoryId', formData.categoryId);
      serviceData.append('featured', formData.featured);
      
      if (image) {
        serviceData.append('image', image);
      }
      
      let response;
      
      if (isEditing) {
        // Update existing service
        response = await axios.put(`http://localhost:5000/api/services/${id}`, serviceData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        // Create new service
        response = await axios.post('http://localhost:5000/api/services', serviceData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      setSaveLoading(false);
      
      // Redirect to services list on success
      navigate('/admin/services');
    } catch (err) {
      console.error('Error saving service:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save service. Please try again.');
      setSaveLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading service details...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-service-form">
      <div className="admin-section-header">
        <h2 className="admin-section-title">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
      </div>
      
      {errorMessage && (
        <div className="admin-alert admin-alert-danger">
          <i className="fas fa-exclamation-circle"></i> {errorMessage}
          <button
            className="admin-alert-close"
            onClick={() => setErrorMessage('')}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="admin-card">
        <div className="admin-card-body">
          <form onSubmit={handleSubmit}>
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="name" className="admin-label">Service Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`admin-input ${errors.name ? 'is-invalid' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter service name"
                />
                {errors.name && <div className="admin-error-msg">{errors.name}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="price" className="admin-label">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className={`admin-input ${errors.price ? 'is-invalid' : ''}`}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                />
                {errors.price && <div className="admin-error-msg">{errors.price}</div>}
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="categoryId" className="admin-label">Category</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className={`admin-select ${errors.categoryId ? 'is-invalid' : ''}`}
                  value={formData.categoryId}
                  onChange={handleChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && <div className="admin-error-msg">{errors.categoryId}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="duration" className="admin-label">Duration (in minutes)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  className="admin-input"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Enter duration in minutes"
                  min="0"
                />
              </div>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="description" className="admin-label">Description</label>
              <textarea
                id="description"
                name="description"
                className={`admin-textarea ${errors.description ? 'is-invalid' : ''}`}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter service description"
                rows="5"
              ></textarea>
              {errors.description && <div className="admin-error-msg">{errors.description}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="image" className="admin-label">Service Image</label>
              <input
                type="file"
                id="image"
                name="image"
                className="admin-input"
                onChange={handleImageChange}
                accept="image/*"
              />
              
              {previewUrl && (
                <div className="admin-image-preview">
                  <img src={previewUrl} alt="Service preview" />
                </div>
              )}
            </div>
            
            <div className="admin-form-group admin-checkbox-group">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="admin-checkbox"
              />
              <label htmlFor="featured" className="admin-checkbox-label">Featured service</label>
            </div>
            
            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => navigate('/admin/services')}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <span className="spinner-sm"></span>
                    Saving...
                  </>
                ) : (
                  isEditing ? 'Update Service' : 'Create Service'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceForm; 