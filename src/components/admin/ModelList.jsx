import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ModelList = () => {
  // State for device models and form
  const [models, setModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [newModel, setNewModel] = useState({
    name: '',
    brandId: '',
    deviceType: '',
    releaseYear: '',
    description: ''
  });
  const [editingModel, setEditingModel] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modelToDelete, setModelToDelete] = useState(null);
  
  // Device type options
  const deviceTypes = [
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'desktop', label: 'Desktop' },
    { value: 'smartwatch', label: 'Smartwatch' },
    { value: 'other', label: 'Other' }
  ];
  
  // Fetch models and brands on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch brands first
        const brandsResponse = await axios.get('http://localhost:5000/api/brands', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setBrands(brandsResponse.data.brands);
        
        // Then fetch models
        const modelsResponse = await axios.get('http://localhost:5000/api/models', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setModels(modelsResponse.data.models);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Validate form
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name.trim()) {
      errors.name = 'Model name is required';
    }
    
    if (!data.brandId) {
      errors.brandId = 'Brand is required';
    }
    
    if (!data.deviceType) {
      errors.deviceType = 'Device type is required';
    }
    
    if (data.releaseYear && (isNaN(data.releaseYear) || parseInt(data.releaseYear) < 1980 || parseInt(data.releaseYear) > new Date().getFullYear())) {
      errors.releaseYear = `Release year must be between 1980 and ${new Date().getFullYear()}`;
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle input change for form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (editingModel) {
      setEditingModel({
        ...editingModel,
        [name]: value
      });
    } else {
      setNewModel({
        ...newModel,
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
  
  // Add new model
  const handleAddModel = async (e) => {
    e.preventDefault();
    
    if (!validateForm(newModel)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare data for submission
      const modelData = { ...newModel };
      
      // Convert releaseYear to number if provided
      if (modelData.releaseYear) {
        modelData.releaseYear = parseInt(modelData.releaseYear);
      }
      
      await axios.post('http://localhost:5000/api/models', modelData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Reset form and fetch updated models
      setNewModel({
        name: '',
        brandId: '',
        deviceType: '',
        releaseYear: '',
        description: ''
      });
      
      // Fetch updated models
      const response = await axios.get('http://localhost:5000/api/models', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setModels(response.data.models);
    } catch (err) {
      console.error('Error adding model:', err);
      setError('Failed to add model. Please try again.');
    }
  };
  
  // Edit model
  const handleEditModel = (model) => {
    setEditingModel({
      ...model,
      // Ensure brandId is a string for form select
      brandId: model.brandId.toString()
    });
    setFormErrors({});
  };
  
  // Update model
  const handleUpdateModel = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editingModel)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare data for submission
      const modelData = { ...editingModel };
      
      // Convert releaseYear to number if provided
      if (modelData.releaseYear) {
        modelData.releaseYear = parseInt(modelData.releaseYear);
      }
      
      await axios.put(`http://localhost:5000/api/models/${editingModel.id}`, modelData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Reset editing state
      setEditingModel(null);
      
      // Fetch updated models
      const response = await axios.get('http://localhost:5000/api/models', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setModels(response.data.models);
    } catch (err) {
      console.error('Error updating model:', err);
      setError('Failed to update model. Please try again.');
    }
  };
  
  // Confirm delete
  const confirmDelete = (model) => {
    setModelToDelete(model);
    setShowDeleteModal(true);
  };
  
  // Delete model
  const handleDeleteModel = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/models/${modelToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Close modal and update models list
      setShowDeleteModal(false);
      setModelToDelete(null);
      
      // Fetch updated models
      const response = await axios.get('http://localhost:5000/api/models', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setModels(response.data.models);
    } catch (err) {
      console.error('Error deleting model:', err);
      setError('Failed to delete model. Please try again.');
      setShowDeleteModal(false);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingModel(null);
    setFormErrors({});
  };
  
  // Get brand name by ID
  const getBrandName = (brandId) => {
    const brand = brands.find(b => b.id === brandId);
    return brand ? brand.name : 'Unknown Brand';
  };
  
  // Get device type label
  const getDeviceTypeLabel = (value) => {
    const deviceType = deviceTypes.find(type => type.value === value);
    return deviceType ? deviceType.label : value;
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading device models...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-models">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Device Models Management</h2>
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
        {/* Model Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{editingModel ? 'Edit Device Model' : 'Add New Device Model'}</h3>
          </div>
          <div className="admin-card-body">
            <form onSubmit={editingModel ? handleUpdateModel : handleAddModel}>
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="name" className="admin-label">
                    Model Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`admin-input ${formErrors.name ? 'has-error' : ''}`}
                    value={editingModel ? editingModel.name : newModel.name}
                    onChange={handleInputChange}
                    placeholder="Enter model name (e.g. iPhone 13 Pro)"
                  />
                  {formErrors.name && <div className="admin-error-msg">{formErrors.name}</div>}
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="brandId" className="admin-label">
                    Brand <span className="required">*</span>
                  </label>
                  <select
                    id="brandId"
                    name="brandId"
                    className={`admin-select ${formErrors.brandId ? 'has-error' : ''}`}
                    value={editingModel ? editingModel.brandId : newModel.brandId}
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
              
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label htmlFor="deviceType" className="admin-label">
                    Device Type <span className="required">*</span>
                  </label>
                  <select
                    id="deviceType"
                    name="deviceType"
                    className={`admin-select ${formErrors.deviceType ? 'has-error' : ''}`}
                    value={editingModel ? editingModel.deviceType : newModel.deviceType}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Device Type</option>
                    {deviceTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.deviceType && <div className="admin-error-msg">{formErrors.deviceType}</div>}
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="releaseYear" className="admin-label">
                    Release Year
                  </label>
                  <input
                    type="number"
                    id="releaseYear"
                    name="releaseYear"
                    className={`admin-input ${formErrors.releaseYear ? 'has-error' : ''}`}
                    value={editingModel ? editingModel.releaseYear : newModel.releaseYear}
                    onChange={handleInputChange}
                    min="1980"
                    max={new Date().getFullYear()}
                    placeholder="Enter release year"
                  />
                  {formErrors.releaseYear && <div className="admin-error-msg">{formErrors.releaseYear}</div>}
                </div>
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="description" className="admin-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="admin-textarea"
                  value={editingModel ? editingModel.description : newModel.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter model description (optional)"
                ></textarea>
              </div>
              
              <div className="admin-form-actions">
                {editingModel && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingModel ? 'Update Model' : 'Add Model'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Models List */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Device Models List</h3>
          </div>
          <div className="admin-card-body">
            {models.length === 0 ? (
              <div className="admin-empty-state">
                <i className="fas fa-mobile-alt"></i>
                <p>No device models found. Add your first model!</p>
              </div>
            ) : (
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Brand</th>
                      <th>Device Type</th>
                      <th>Release Year</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {models.map(model => (
                      <tr key={model.id}>
                        <td>{model.name}</td>
                        <td>{getBrandName(model.brandId)}</td>
                        <td>{getDeviceTypeLabel(model.deviceType)}</td>
                        <td>{model.releaseYear || 'N/A'}</td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              className="admin-btn admin-btn-sm admin-btn-primary"
                              onClick={() => handleEditModel(model)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="admin-btn admin-btn-sm admin-btn-danger"
                              onClick={() => confirmDelete(model)}
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
                Are you sure you want to delete the device model{' '}
                <strong>{modelToDelete?.name}</strong>?
              </p>
              <p className="admin-text-danger">
                <i className="fas fa-exclamation-triangle"></i> This action cannot be undone.
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
                onClick={handleDeleteModel}
              >
                Delete Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelList; 