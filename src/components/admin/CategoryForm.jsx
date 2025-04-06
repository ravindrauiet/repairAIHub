import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  
  // Fetch category data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          setFetchLoading(true);
          const token = localStorage.getItem('token');
          
          const response = await axios.get(`http://localhost:5000/api/categories/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const categoryData = response.data.category;
          setFormData({
            name: categoryData.name || '',
            description: categoryData.description || '',
            image: null // We don't load the actual image file, just the URL
          });
          
          if (categoryData.image) {
            setCurrentImage(`http://localhost:5000/${categoryData.image}`);
          }
          
          setFetchLoading(false);
        } catch (err) {
          console.error('Error fetching category:', err);
          setError('Failed to load category data. Please try again.');
          setFetchLoading(false);
        }
      };
      
      fetchCategory();
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
      errors.name = 'Category name is required';
    }
    
    // If not in edit mode or changing image, require an image
    if (!isEditMode && !formData.image && !currentImage) {
      errors.image = 'Category image is required';
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
      formDataObj.append('description', formData.description);
      
      // Only append image if there's a new one
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      
      if (isEditMode) {
        // Update existing category
        await axios.put(`http://localhost:5000/api/categories/${id}`, formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Create new category
        await axios.post('http://localhost:5000/api/categories', formDataObj, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }
      
      // Redirect to categories list
      navigate('/admin/categories');
    } catch (err) {
      console.error('Error saving category:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to save category. Please try again.');
      }
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading category data...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-form-container">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          {isEditMode ? 'Edit Category' : 'Add New Category'}
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
              <label htmlFor="name" className="admin-label">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`admin-input ${formErrors.name ? 'admin-input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Category Name"
              />
              {formErrors.name && <div className="admin-form-error">{formErrors.name}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="description" className="admin-label">Description</label>
              <textarea
                id="description"
                name="description"
                className="admin-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Category Description"
                rows="3"
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-label">Category Image</label>
              
              <div className="admin-image-upload">
                {(previewImage || currentImage) && (
                  <div className="admin-image-preview">
                    <img 
                      src={previewImage || currentImage} 
                      alt="Category Preview" 
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
                  className={`admin-file-input ${formErrors.image ? 'admin-input-error' : ''}`}
                />
                
                <label htmlFor="image" className="admin-file-label">
                  {previewImage || currentImage 
                    ? 'Change Image' 
                    : isEditMode 
                      ? 'Upload New Image' 
                      : 'Upload Image'}
                </label>
                
                {formErrors.image && <div className="admin-form-error">{formErrors.image}</div>}
              </div>
            </div>
            
            <div className="admin-form-buttons">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => navigate('/admin/categories')}
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
                  isEditMode ? 'Update Category' : 'Create Category'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm; 