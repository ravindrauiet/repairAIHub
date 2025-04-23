import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  getModelById, 
  updateModel, 
  addModel, 
  getAllBrands 
} from '../../services/firestoreService';
import { storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';

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
  
  // Get brands for dropdown
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  
  // Fetch brands for dropdown
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setBrandsLoading(true);
        
        const brandsData = await getAllBrands();
        setBrands(brandsData || []);
        setBrandsLoading(false);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load brands. Please try again.');
        toast.error('Failed to load brands');
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
          
          const modelData = await getModelById(id);
          
          if (modelData) {
            setFormData({
              name: modelData.name || '',
              description: modelData.description || '',
              brandId: modelData.brandId || '',
              specifications: modelData.specifications || '',
            });
            
            if (modelData.imageUrl) {
              setCurrentImage(modelData.imageUrl);
            }
          } else {
            setError('Device model not found');
            toast.error('Device model not found');
          }
          
          setFetchLoading(false);
        } catch (err) {
          console.error('Error fetching device model:', err);
          setError('Failed to load device model data. Please try again.');
          toast.error('Failed to load device model data');
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
      errors.name = 'Model name is required';
    }
    
    if (!formData.brandId) {
      errors.brandId = 'Brand is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Upload image to Firebase Storage
  const uploadImageToFirebase = async (file) => {
    if (!file) return null;
    
    try {
      const storageRef = ref(storage, `models/${Date.now()}-${file.name}`);
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
      
      // Prepare device model data
      const modelData = {
        ...formData,
        imageUrl
      };
      
      if (isEditMode) {
        // Update existing device model
        await updateModel(id, modelData);
        toast.success('Device model updated successfully');
      } else {
        // Create new device model
        await addModel(modelData);
        toast.success('Device model created successfully');
      }
      
      // Redirect to device models list
      navigate('/admin/models');
    } catch (err) {
      console.error('Error saving device model:', err);
      setError('Failed to save device model. Please try again.');
      toast.error('Failed to save device model');
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
        <Link to="/admin/models" className="admin-btn admin-btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Models
        </Link>
      </div>
      
      {error && (
        <div className="admin-alert admin-alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
          <button
            className="admin-alert-close"
            onClick={() => setError(null)}
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
                <label htmlFor="name" className="admin-label">
                  Model Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`admin-input ${formErrors.name ? 'admin-input-error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Model Name"
                />
                {formErrors.name && <div className="admin-form-error">{formErrors.name}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="brandId" className="admin-label">
                  Brand <span className="required">*</span>
                </label>
                <select
                  id="brandId"
                  name="brandId"
                  className={`admin-select ${formErrors.brandId ? 'admin-input-error' : ''}`}
                  value={formData.brandId}
                  onChange={handleChange}
                >
                  <option value="">Select a Brand</option>
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
                placeholder="Model Description"
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
                placeholder="Model Specifications"
                rows="5"
              ></textarea>
              <p className="admin-form-help">
                Enter technical specifications like processor, memory, display size, etc.
              </p>
            </div>
            
            <div className="admin-form-group">
              <label className="admin-label">Model Image (Optional)</label>
              
              <div className="admin-image-upload">
                {(previewImage || currentImage) && (
                  <div className="admin-image-preview">
                    <img 
                      src={previewImage || currentImage} 
                      alt="Model Preview" 
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
                  id="modelImage"
                  name="image"
                  className="admin-file-input"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                <label htmlFor="modelImage" className="admin-file-label">
                  <i className="fas fa-upload"></i> Choose Image
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
                onClick={() => navigate('/admin/models')}
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
                    <div className="spinner-small"></div>
                    {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Saving...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update' : 'Create'} Device Model</>
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