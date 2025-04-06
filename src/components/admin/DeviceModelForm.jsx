import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeviceModelForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brandId: '',
    specifications: '',
    image: null
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  
  // Get brands for dropdown
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  
  // Fetch brands for dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await axios.get('http://localhost:5000/api/brands', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setBrands(response.data.brands || []);
        setBrandsLoading(false);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands. Please try again.');
        setBrandsLoading(false);
      }
    };
    
    fetchBrands();
  }, []);
  
  // Fetch device model data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchDeviceModel = async () => {
        try {
          setFetchLoading(true);
          const token = localStorage.getItem('token');
          
          const response = await axios.get(`http://localhost:5000/api/device-models/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const modelData = response.data.deviceModel;
          setFormData({
            name: modelData.name || '',
            description: modelData.description || '',
            brandId: modelData.brandId?.toString() || '',
            specifications: modelData.specifications || '',
            image: null // We don't load the actual image file, just the URL
          });
          
          if (modelData.image) {
            setCurrentImage(`http://localhost:5000/${modelData.image}`);
          }
          
          setFetchLoading(false);
        } catch (err) {
          console.error('Error fetching device model:', err);
          setError('Failed to load device model data. Please try again.');
          setFetchLoading(false);
        }
      };
      
      fetchDeviceModel();
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
  
  // Handle file upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setFormData(prevData => ({
        ...prevData,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Clear error
      if (formErrors.image) {
        setFormErrors(prev => ({
          ...prev,
          image: null
        }));
      }
    }
  };
  
  // Remove selected image
  const handleRemoveImage = () => {
    setFormData(prevData => ({
      ...prevData,
      image: null
    }));
    setPreviewImage(null);
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Model name is required';
    }
    
    if (!formData.brandId) {
      errors.brandId = 'Brand is required';
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
      
      // Create FormData object for file upload
      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('brandId', formData.brandId);
      
      if (formData.description) {
        formDataObj.append('description', formData.description);
      }
      
      if (formData.specifications) {
        formDataObj.append('specifications', formData.specifications);
      }
      
      // Only append image if there's a new one
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      
      if (isEditMode) {
        // Update existing device model
        await axios.put(`http://localhost:5000/api/device-models/${id}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Create new device model
        await axios.post('http://localhost:5000/api/device-models', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      // Redirect to device models list
      navigate('/admin/device-models');
    } catch (err) {
      console.error('Error saving device model:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to save device model. Please try again.');
      }
      setLoading(false);
    }
  };
  
  if (fetchLoading || brandsLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-form-container">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          {isEditMode ? 'Edit Device Model' : 'Add New Device Model'}
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
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="name" className="admin-label">Model Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`admin-input ${formErrors.name ? 'admin-input-error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Device Model Name"
                />
                {formErrors.name && <div className="admin-form-error">{formErrors.name}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="brandId" className="admin-label">Brand</label>
                <select
                  id="brandId"
                  name="brandId"
                  className={`admin-select ${formErrors.brandId ? 'admin-input-error' : ''}`}
                  value={formData.brandId}
                  onChange={handleChange}
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {formErrors.brandId && <div className="admin-form-error">{formErrors.brandId}</div>}
              </div>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="description" className="admin-label">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                className="admin-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Device Model Description"
                rows="3"
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="specifications" className="admin-label">Specifications (Optional)</label>
              <textarea
                id="specifications"
                name="specifications"
                className="admin-textarea"
                value={formData.specifications}
                onChange={handleChange}
                placeholder="Enter technical specifications"
                rows="4"
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-label">Device Image (Optional)</label>
              
              <div className="admin-image-upload">
                {(previewImage || currentImage) && (
                  <div className="admin-image-preview">
                    <img 
                      src={previewImage || currentImage} 
                      alt="Device Preview" 
                      className="admin-preview-img"
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={handleRemoveImage}
                    >
                      Remove
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="admin-file-input"
                />
                
                <label htmlFor="image" className="admin-file-label">
                  {previewImage || currentImage 
                    ? 'Change Image' 
                    : isEditMode 
                      ? 'Upload New Image' 
                      : 'Upload Image'}
                </label>
              </div>
            </div>
            
            <div className="admin-form-buttons">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => navigate('/admin/device-models')}
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
                  isEditMode ? 'Update Device Model' : 'Create Device Model'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviceModelForm; 