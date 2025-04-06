import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    brandId: '',
    isFeatured: false,
  });
  
  // Other states
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitError, setSubmitError] = useState(null);
  
  // Fetch categories and brands on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get categories
        const categoriesResponse = await axios.get('http://localhost:5000/api/categories');
        setCategories(categoriesResponse.data.categories);
        
        // Get brands
        const brandsResponse = await axios.get('http://localhost:5000/api/brands');
        setBrands(brandsResponse.data.brands);
        
        // If in edit mode, get product details
        if (isEditMode) {
          const productResponse = await axios.get(`http://localhost:5000/api/products/${id}`);
          const product = productResponse.data.product;
          
          // Set form data
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            stockQuantity: product.stockQuantity,
            categoryId: product.categoryId,
            brandId: product.brandId,
            isFeatured: product.isFeatured,
          });
          
          // Set existing images
          if (product.ProductImages) {
            setExistingImages(product.ProductImages);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error if user is correcting it
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };
  
  // Handle removing existing image
  const handleRemoveExistingImage = async (imageId) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/products/${id}/images/${imageId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update existing images state
      setExistingImages(existingImages.filter(img => img.id !== imageId));
    } catch (err) {
      console.error('Error removing image:', err);
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!formData.stockQuantity) {
      errors.stockQuantity = 'Stock quantity is required';
    } else if (isNaN(formData.stockQuantity) || parseInt(formData.stockQuantity) < 0) {
      errors.stockQuantity = 'Stock quantity must be a non-negative number';
    }
    
    if (!formData.categoryId) {
      errors.categoryId = 'Category is required';
    }
    
    if (!formData.brandId) {
      errors.brandId = 'Brand is required';
    }
    
    // In create mode, require at least one image
    if (!isEditMode && images.length === 0) {
      errors.images = 'At least one product image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setSubmitError(null);
      const token = localStorage.getItem('token');
      
      // Prepare form data for submission
      const productFormData = new FormData();
      productFormData.append('name', formData.name);
      productFormData.append('description', formData.description);
      productFormData.append('price', formData.price);
      productFormData.append('stockQuantity', formData.stockQuantity);
      productFormData.append('categoryId', formData.categoryId);
      productFormData.append('brandId', formData.brandId);
      productFormData.append('isFeatured', formData.isFeatured);
      
      // Add images
      images.forEach(image => {
        productFormData.append('images', image);
      });
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      };
      
      if (isEditMode) {
        // Update existing product
        await axios.put(`http://localhost:5000/api/products/${id}`, productFormData, config);
      } else {
        // Create new product
        await axios.post('http://localhost:5000/api/products', productFormData, config);
      }
      
      // Redirect to products list
      navigate('/admin/products');
    } catch (err) {
      console.error('Error submitting form:', err);
      setSubmitError(err.response?.data?.message || 'An error occurred while saving the product');
      setSubmitting(false);
      setUploadProgress(0);
    }
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-product-form">
      <div className="admin-header-actions">
        <h2 className="admin-section-title">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        <Link to="/admin/products" className="admin-btn admin-btn-secondary">
          <i className="fas fa-arrow-left"></i> Back to Products
        </Link>
      </div>
      
      <div className="admin-card">
        <div className="admin-card-body">
          <form onSubmit={handleSubmit} className="admin-form">
            {submitError && (
              <div className="admin-form-error-message">
                <i className="fas fa-exclamation-circle"></i> {submitError}
              </div>
            )}
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="name" className="admin-label">
                  Product Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`admin-input ${formErrors.name ? 'has-error' : ''}`}
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                />
                {formErrors.name && <div className="admin-error-msg">{formErrors.name}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="price" className="admin-label">
                  Price <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  step="0.01"
                  min="0"
                  className={`admin-input ${formErrors.price ? 'has-error' : ''}`}
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                />
                {formErrors.price && <div className="admin-error-msg">{formErrors.price}</div>}
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="stockQuantity" className="admin-label">
                  Stock Quantity <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="stockQuantity"
                  name="stockQuantity"
                  min="0"
                  step="1"
                  className={`admin-input ${formErrors.stockQuantity ? 'has-error' : ''}`}
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                />
                {formErrors.stockQuantity && (
                  <div className="admin-error-msg">{formErrors.stockQuantity}</div>
                )}
              </div>
              
              <div className="admin-form-group admin-checkbox-container">
                <div className="admin-checkbox-group">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    className="admin-checkbox"
                    checked={formData.isFeatured}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isFeatured" className="admin-checkbox-label">
                    Feature this product on homepage
                  </label>
                </div>
              </div>
            </div>
            
            <div className="admin-form-row">
              <div className="admin-form-group">
                <label htmlFor="categoryId" className="admin-label">
                  Category <span className="required">*</span>
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  className={`admin-select ${formErrors.categoryId ? 'has-error' : ''}`}
                  value={formData.categoryId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {formErrors.categoryId && (
                  <div className="admin-error-msg">{formErrors.categoryId}</div>
                )}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="brandId" className="admin-label">
                  Brand <span className="required">*</span>
                </label>
                <select
                  id="brandId"
                  name="brandId"
                  className={`admin-select ${formErrors.brandId ? 'has-error' : ''}`}
                  value={formData.brandId}
                  onChange={handleInputChange}
                >
                  <option value="">Select Brand</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {formErrors.brandId && <div className="admin-error-msg">{formErrors.brandId}</div>}
              </div>
            </div>
            
            <div className="admin-form-group">
              <label htmlFor="description" className="admin-label">
                Description <span className="required">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                className={`admin-textarea ${formErrors.description ? 'has-error' : ''}`}
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                placeholder="Enter product description"
              ></textarea>
              {formErrors.description && (
                <div className="admin-error-msg">{formErrors.description}</div>
              )}
            </div>
            
            <div className="admin-form-group">
              <label className="admin-label">
                Product Images {!isEditMode && <span className="required">*</span>}
              </label>
              
              {existingImages.length > 0 && (
                <div className="existing-images">
                  <p className="admin-form-help">Current Images:</p>
                  <div className="image-preview-container">
                    {existingImages.map(image => (
                      <div key={image.id} className="image-preview-item">
                        <img
                          src={`http://localhost:5000/${image.url}`}
                          alt="Product"
                          className="image-preview"
                        />
                        <button
                          type="button"
                          className="image-remove-btn"
                          onClick={() => handleRemoveExistingImage(image.id)}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="admin-file-input">
                <input
                  type="file"
                  id="images"
                  name="images"
                  className={`admin-input file-input ${formErrors.images ? 'has-error' : ''}`}
                  onChange={handleImageChange}
                  multiple
                  accept="image/*"
                />
                <label htmlFor="images" className="file-input-label">
                  <i className="fas fa-cloud-upload-alt"></i> Choose Images
                </label>
                <span className="file-name">
                  {images.length > 0
                    ? `${images.length} file${images.length > 1 ? 's' : ''} selected`
                    : 'No file chosen'}
                </span>
              </div>
              
              {formErrors.images && <div className="admin-error-msg">{formErrors.images}</div>}
              
              {images.length > 0 && (
                <div className="image-preview-container">
                  {Array.from(images).map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="image-preview"
                      />
                      <button
                        type="button"
                        className="image-remove-btn"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="admin-form-actions">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => navigate('/admin/products')}
                disabled={submitting}
              >
                Cancel
              </button>
              <button type="submit" className="admin-btn admin-btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <div className="spinner-small"></div>
                    {uploadProgress > 0 ? `Uploading ${uploadProgress}%` : 'Saving...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update' : 'Create'} Product</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm; 