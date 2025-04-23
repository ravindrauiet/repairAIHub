import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getBrandById, 
  updateBrand, 
  addBrand 
} from '../../services/firestoreService';
import { storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';

const BrandForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Fetch brand data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const fetchBrand = async () => {
        try {
          setFetchLoading(true);
          
          const brandData = await getBrandById(id);
          
          if (brandData) {
            setFormData({
              name: brandData.name || '',
              description: brandData.description || '',
            });
            
            if (brandData.imageUrl) {
              setCurrentImage(brandData.imageUrl);
            }
          } else {
            setError('Brand not found');
          }
          
          setFetchLoading(false);
        } catch (err) {
          console.error('Error fetching brand:', err);
          setError('Failed to load brand data. Please try again.');
          setFetchLoading(false);
        }
      };
      
      fetchBrand();
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
      setImage(file);
      
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
    setImage(null);
    setPreviewImage(null);
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Brand name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Upload image to Firebase Storage
  const uploadImageToFirebase = async (file) => {
    if (!file) return null;
    
    try {
      const storageRef = ref(storage, `brands/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setUploadProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            // Get download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
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
      let imageUrl = currentImage;
      
      // Upload new image if selected
      if (image) {
        imageUrl = await uploadImageToFirebase(image);
      }
      
      // Prepare brand data
      const brandData = {
        ...formData,
        imageUrl
      };
      
      if (isEditMode) {
        // Update existing brand
        await updateBrand(id, brandData);
        toast.success('Brand updated successfully');
      } else {
        // Create new brand
        await addBrand(brandData);
        toast.success('Brand added successfully');
      }
      
      // Redirect to brands list
      navigate('/admin/brands');
    } catch (err) {
      console.error('Error saving brand:', err);
      setError('Failed to save brand. Please try again.');
      toast.error('Failed to save brand');
      setLoading(false);
    }
  };
  
  if (fetchLoading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading brand data...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-form-container">
      <div className="admin-section-header">
        <h2 className="admin-section-title">
          {isEditMode ? 'Edit Brand' : 'Add New Brand'}
        </h2>
        <Link to="/admin/brands" className="admin-btn admin-btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Brands
        </Link>
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
              <label htmlFor="name" className="admin-label">Brand Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`admin-input ${formErrors.name ? 'admin-input-error' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Brand Name"
              />
              {formErrors.name && <div className="admin-form-error">{formErrors.name}</div>}
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="description" className="admin-label">Description (Optional)</label>
              <textarea
                id="description"
                name="description"
                className="admin-textarea"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brand Description"
                rows="3"
              ></textarea>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-label">Brand Logo (Optional)</label>
              
              <div className="admin-image-upload">
                {(previewImage || currentImage) && (
                  <div className="admin-image-preview">
                    <img 
                      src={previewImage || currentImage} 
                      alt="Brand Logo Preview" 
                      className="admin-preview-img"
                    />
                    <button
                      type="button"
                      className="admin-btn admin-btn-danger admin-btn-sm"
                      onClick={handleRemoveImage}
                    >
                      <i className="fas fa-times"></i> Remove
                    </button>
                  </div>
                )}
                
                <input
                  type="file"
                  id="brandLogo"
                  name="image"
                  className="admin-file-input"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <label htmlFor="brandLogo" className="admin-file-label">
                  <i className="fas fa-upload"></i> Choose Logo
                </label>
                <span className="admin-file-name">
                  {image ? image.name : 'No file chosen'}
                </span>
              </div>
            </div>
            
            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => navigate('/admin/brands')}
                disabled={loading}
              >
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Saving...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update' : 'Create'} Brand</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrandForm; 