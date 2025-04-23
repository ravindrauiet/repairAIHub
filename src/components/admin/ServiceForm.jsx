import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as firestoreService from '../../services/firestoreService';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import app from '../../firebase/config';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const storage = getStorage(app);
  
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    longDescription: '',
    priceRange: '',
    icon: '',
    category: '',
    featured: false,
    imageUrl: ''
  });
  
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fetch service details if editing and categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Get all services to extract unique categories
        const services = await firestoreService.getAllServices();
        const uniqueCategories = [...new Set(services.map(service => service.category).filter(Boolean))];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setErrorMessage('Failed to load categories from Firebase');
      }
    };
    
    const fetchServiceDetails = async () => {
      if (!isEditing) return;
      
      setLoading(true);
      try {
        const service = await firestoreService.getServiceById(id);
        
        if (service) {
          setFormData({
            title: service.title || '',
            shortDescription: service.shortDescription || '',
            longDescription: service.longDescription || '',
            priceRange: service.priceRange || '',
            icon: service.icon || '',
            category: service.category || '',
            featured: service.featured || false,
            imageUrl: service.imageUrl || ''
          });
          
          if (service.imageUrl) {
            setPreviewUrl(service.imageUrl);
          }
        } else {
          setErrorMessage('Service not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service details:', err);
        setErrorMessage('Failed to load service details from Firebase');
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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Service title is required';
    }
    
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    }
    
    if (!formData.priceRange.trim()) {
      newErrors.priceRange = 'Price range is required';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Upload image to Firebase Storage and get URL
  const uploadImageToFirebase = async (file) => {
    if (!file) return null;
    
    const fileRef = ref(storage, `services/${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaveLoading(true);
    
    try {
      let imageUrl = formData.imageUrl;
      
      // Upload new image if selected
      if (image) {
        imageUrl = await uploadImageToFirebase(image);
      }
      
      // Prepare service data
      const serviceData = {
        ...formData,
        imageUrl
      };
      
      if (isEditing) {
        // Update existing service
        await firestoreService.updateService(id, serviceData);
      } else {
        // Create new service
        await firestoreService.addService(serviceData);
      }
      
      setSaveLoading(false);
      
      // Redirect to services list on success
      navigate('/admin/services');
    } catch (err) {
      console.error('Error saving service:', err);
      setErrorMessage('Failed to save service to Firebase. Please try again.');
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
                <label htmlFor="title" className="admin-label">Service Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className={`admin-input ${errors.title ? 'is-invalid' : ''}`}
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter service title"
                />
                {errors.title && <div className="admin-error-msg">{errors.title}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="priceRange" className="admin-label">Price Range</label>
                <input
                  type="text"
                  id="priceRange"
                  name="priceRange"
                  className={`admin-input ${errors.priceRange ? 'is-invalid' : ''}`}
                  value={formData.priceRange}
                  onChange={handleChange}
                  placeholder="e.g. ₹500 - ₹2,000"
                />
                {errors.priceRange && <div className="admin-error-msg">{errors.priceRange}</div>}
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="category" className="admin-label">Category</label>
                <select
                  id="category"
                  name="category"
                  className={`admin-select ${errors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="">Select Category</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>
                      {category}
                    </option>
                  ))}
                  <option value="new">+ Add New Category</option>
                </select>
                {errors.category && <div className="admin-error-msg">{errors.category}</div>}
              </div>
              
              {formData.category === 'new' && (
                <div className="admin-form-group">
                  <label htmlFor="newCategory" className="admin-label">New Category</label>
                  <input
                    type="text"
                    id="newCategory"
                    name="newCategory"
                    className="admin-input"
                    value={formData.newCategory || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      newCategory: e.target.value
                    })}
                    placeholder="Enter new category name"
                    autoFocus
                  />
                </div>
              )}
              
              <div className="admin-form-group">
                <label htmlFor="icon" className="admin-label">Icon Name</label>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  className="admin-input"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="e.g. tv, mobile-alt, etc."
                />
                <small className="admin-help-text">FontAwesome icon name</small>
              </div>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="shortDescription" className="admin-label">Short Description</label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                className={`admin-input ${errors.shortDescription ? 'is-invalid' : ''}`}
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief description (displayed in cards)"
              />
              {errors.shortDescription && <div className="admin-error-msg">{errors.shortDescription}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="longDescription" className="admin-label">Long Description</label>
              <textarea
                id="longDescription"
                name="longDescription"
                className="admin-textarea"
                value={formData.longDescription}
                onChange={handleChange}
                placeholder="Detailed service description"
                rows={5}
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-label">Service Image</label>
              <div className="admin-image-upload">
                {previewUrl ? (
                  <div className="admin-preview-image">
                    <img src={previewUrl} alt="Service preview" />
                    <button
                      type="button"
                      className="admin-remove-image"
                      onClick={() => {
                        setImage(null);
                        setPreviewUrl('');
                        setFormData({...formData, imageUrl: ''});
                      }}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ) : (
                  <div className="admin-upload-placeholder">
                    <i className="fas fa-cloud-upload-alt"></i>
                    <p>Upload Image</p>
                  </div>
                )}
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="admin-file-input"
                />
              </div>
            </div>
            
            <div className="admin-form-group">
              <div className="admin-checkbox-group">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="admin-checkbox"
                />
                <label htmlFor="featured" className="admin-checkbox-label">
                  Feature this service on homepage
                </label>
              </div>
            </div>
            
            <div className="admin-form-buttons">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => navigate('/admin/services')}
                disabled={saveLoading}
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
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Save Service'
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