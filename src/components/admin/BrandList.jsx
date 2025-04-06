import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BrandList = () => {
  // State for brands and form
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [newBrand, setNewBrand] = useState({ name: '', description: '', logo: null });
  const [editingBrand, setEditingBrand] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  
  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);
  
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/brands', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setBrands(response.data.brands);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Failed to load brands. Please try again.');
      setLoading(false);
    }
  };
  
  // Validate form
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name.trim()) {
      errors.name = 'Brand name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle input change for form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (editingBrand) {
      setEditingBrand({
        ...editingBrand,
        [name]: value
      });
    } else {
      setNewBrand({
        ...newBrand,
        [name]: value
      });
    }
    
    // Clear error if user is correcting it
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Handle logo file change
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      if (editingBrand) {
        setEditingBrand({
          ...editingBrand,
          logo: file
        });
      } else {
        setNewBrand({
          ...newBrand,
          logo: file
        });
      }
      
      // Create preview URL for the logo
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };
  
  // Add new brand
  const handleAddBrand = async (e) => {
    e.preventDefault();
    
    if (!validateForm(newBrand)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', newBrand.name);
      
      if (newBrand.description) {
        formData.append('description', newBrand.description);
      }
      
      if (newBrand.logo) {
        formData.append('logo', newBrand.logo);
      }
      
      await axios.post('http://localhost:5000/api/brands', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Reset form and fetch updated brands
      setNewBrand({ name: '', description: '', logo: null });
      setLogoPreview(null);
      fetchBrands();
    } catch (err) {
      console.error('Error adding brand:', err);
      setError('Failed to add brand. Please try again.');
    }
  };
  
  // Edit brand
  const handleEditBrand = (brand) => {
    setEditingBrand({
      ...brand,
      logo: null // Reset logo to null since we don't want to upload existing logo
    });
    
    if (brand.logoUrl) {
      setLogoPreview(`http://localhost:5000/${brand.logoUrl}`);
    } else {
      setLogoPreview(null);
    }
    
    setFormErrors({});
  };
  
  // Update brand
  const handleUpdateBrand = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editingBrand)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', editingBrand.name);
      
      if (editingBrand.description) {
        formData.append('description', editingBrand.description);
      }
      
      if (editingBrand.logo) {
        formData.append('logo', editingBrand.logo);
      }
      
      await axios.put(`http://localhost:5000/api/brands/${editingBrand.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Reset editing state and fetch updated brands
      setEditingBrand(null);
      setLogoPreview(null);
      fetchBrands();
    } catch (err) {
      console.error('Error updating brand:', err);
      setError('Failed to update brand. Please try again.');
    }
  };
  
  // Confirm delete
  const confirmDelete = (brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };
  
  // Delete brand
  const handleDeleteBrand = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/brands/${brandToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Close modal and fetch updated brands
      setShowDeleteModal(false);
      setBrandToDelete(null);
      fetchBrands();
    } catch (err) {
      console.error('Error deleting brand:', err);
      setError('Failed to delete brand. Please try again.');
      setShowDeleteModal(false);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBrand(null);
    setLogoPreview(null);
    setFormErrors({});
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading brands...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-brands">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Brands Management</h2>
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
      
      <div className="admin-grid">
        {/* Brand Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</h3>
          </div>
          <div className="admin-card-body">
            <form onSubmit={editingBrand ? handleUpdateBrand : handleAddBrand}>
              <div className="admin-form-group">
                <label htmlFor="name" className="admin-label">
                  Brand Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`admin-input ${formErrors.name ? 'has-error' : ''}`}
                  value={editingBrand ? editingBrand.name : newBrand.name}
                  onChange={handleInputChange}
                  placeholder="Enter brand name"
                />
                {formErrors.name && <div className="admin-error-msg">{formErrors.name}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="description" className="admin-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="admin-textarea"
                  value={editingBrand ? editingBrand.description : newBrand.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter brand description (optional)"
                ></textarea>
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="logo" className="admin-label">
                  Brand Logo
                </label>
                <div className="admin-file-input">
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    className="admin-input file-input"
                    onChange={handleLogoChange}
                    accept="image/*"
                  />
                  <label htmlFor="logo" className="file-input-label">
                    <i className="fas fa-cloud-upload-alt"></i> Choose Logo
                  </label>
                  <span className="file-name">
                    {(editingBrand?.logo || newBrand.logo) ? 'Logo selected' : 'No file chosen'}
                  </span>
                </div>
                
                {logoPreview && (
                  <div className="logo-preview">
                    <img src={logoPreview} alt="Brand Logo Preview" />
                  </div>
                )}
              </div>
              
              <div className="admin-form-actions">
                {editingBrand && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingBrand ? 'Update Brand' : 'Add Brand'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Brands List */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Brands List</h3>
          </div>
          <div className="admin-card-body">
            {brands.length === 0 ? (
              <div className="admin-empty-state">
                <i className="fas fa-building"></i>
                <p>No brands found. Add your first brand!</p>
              </div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Logo</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Products</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map(brand => (
                      <tr key={brand.id}>
                        <td>
                          {brand.logoUrl ? (
                            <img
                              src={`http://localhost:5000/${brand.logoUrl}`}
                              alt={brand.name}
                              className="brand-logo-thumbnail"
                            />
                          ) : (
                            <div className="brand-logo-placeholder">
                              <i className="fas fa-building"></i>
                            </div>
                          )}
                        </td>
                        <td>{brand.name}</td>
                        <td>
                          {brand.description ? (
                            brand.description.length > 50 ? (
                              `${brand.description.substring(0, 50)}...`
                            ) : (
                              brand.description
                            )
                          ) : (
                            <span className="admin-text-muted">No description</span>
                          )}
                        </td>
                        <td>
                          <span className="admin-badge admin-badge-info">
                            {brand.products?.length || 0} products
                          </span>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              className="admin-btn admin-btn-sm admin-btn-primary"
                              onClick={() => handleEditBrand(brand)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="admin-btn admin-btn-sm admin-btn-danger"
                              onClick={() => confirmDelete(brand)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(false)}></div>
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h3>Confirm Deletion</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to delete the brand{' '}
                <strong>{brandToDelete?.name}</strong>?
              </p>
              <p className="admin-text-danger">
                <i className="fas fa-exclamation-triangle"></i> This action cannot be undone.
                {brandToDelete?.products?.length > 0 && (
                  <span>
                    {' '}
                    Products from this brand will be unbranded.
                  </span>
                )}
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleDeleteBrand}
              >
                Delete Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList; 