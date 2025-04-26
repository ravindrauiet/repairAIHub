import React, { useState, useEffect } from 'react';
import * as firestoreService from '../../services/firestoreService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingDevicesManager = () => {
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // New brand and model form
  const [newBrand, setNewBrand] = useState({ id: '', name: '' });
  const [newModel, setNewModel] = useState({ id: '', name: '' });
  const [selectedBrand, setSelectedBrand] = useState(null);
  
  // Fetch service types and booking devices data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // First, fetch all service types from the categories collection
        const categories = await firestoreService.getAllCategories();
        
        // Extract the repair service categories
        const serviceTypesList = categories
          .filter(cat => cat.id.includes('repair'))
          .map(cat => ({
            id: cat.id,
            name: cat.name
          }));
        
        setServiceTypes(serviceTypesList);
        
        // If there are service types, select the first one by default
        if (serviceTypesList.length > 0) {
          setSelectedServiceType(serviceTypesList[0].id);
          await fetchBookingDevicesForServiceType(serviceTypesList[0].id);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching service types:', err);
        setError('Failed to load service types and booking devices');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch booking devices when selected service type changes
  useEffect(() => {
    if (selectedServiceType) {
      fetchBookingDevicesForServiceType(selectedServiceType);
    }
  }, [selectedServiceType]);
  
  // Fetch all booking devices for a service type
  const fetchBookingDevicesForServiceType = async (serviceType) => {
    try {
      setLoading(true);
      
      // Get the booking device document for this service type
      const bookingDeviceDoc = await firestoreService.getBookingDevice(serviceType);
      
      if (bookingDeviceDoc) {
        // Set the brands
        setBrands(bookingDeviceDoc.brands || []);
        
        // Fetch models for the first brand if any
        if (bookingDeviceDoc.brands && bookingDeviceDoc.brands.length > 0) {
          setSelectedBrand(bookingDeviceDoc.brands[0].id);
          await fetchModelsForBrand(serviceType, bookingDeviceDoc.brands[0].id);
        } else {
          setModels([]);
        }
      } else {
        // If no document exists, create empty arrays
        setBrands([]);
        setModels([]);
      }
      
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching booking devices for ${serviceType}:`, err);
      setError(`Failed to load booking devices for ${serviceType}`);
      setLoading(false);
    }
  };
  
  // Fetch models for a specific brand
  const fetchModelsForBrand = async (serviceType, brandId) => {
    try {
      // Get the booking device models for this brand
      const modelsData = await firestoreService.getBookingDeviceModels(serviceType, brandId);
      setModels(modelsData || []);
    } catch (err) {
      console.error(`Error fetching models for brand ${brandId}:`, err);
      setError(`Failed to load models for brand ${brandId}`);
    }
  };
  
  // Handle service type change
  const handleServiceTypeChange = (e) => {
    setSelectedServiceType(e.target.value);
  };
  
  // Handle brand selection change
  const handleBrandChange = async (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    
    if (brandId) {
      await fetchModelsForBrand(selectedServiceType, brandId);
    } else {
      setModels([]);
    }
  };
  
  // Handle adding a new brand
  const handleAddBrand = async () => {
    if (!newBrand.id || !newBrand.name) {
      toast.error('Brand ID and name are required');
      return;
    }
    
    // Check if ID already exists
    if (brands.some(brand => brand.id === newBrand.id)) {
      toast.error('Brand ID already exists');
      return;
    }
    
    try {
      setSaving(true);
      
      // Create updated brands array
      const updatedBrands = [...brands, newBrand];
      
      // Update the booking device document
      await firestoreService.saveBookingDevice(selectedServiceType, {
        type: selectedServiceType,
        brands: updatedBrands
      });
      
      // Update the local state
      setBrands(updatedBrands);
      setSelectedBrand(newBrand.id);
      setNewBrand({ id: '', name: '' });
      
      toast.success('Brand added successfully');
      
      // Initialize empty models for this brand
      await firestoreService.saveBookingDeviceModels(selectedServiceType, newBrand.id, []);
      setModels([]);
      
      setSaving(false);
    } catch (err) {
      console.error('Error adding brand:', err);
      toast.error('Failed to add brand');
      setSaving(false);
    }
  };
  
  // Handle adding a new model
  const handleAddModel = async () => {
    if (!newModel.id || !newModel.name) {
      toast.error('Model ID and name are required');
      return;
    }
    
    // Check if ID already exists
    if (models.some(model => model.id === newModel.id)) {
      toast.error('Model ID already exists');
      return;
    }
    
    try {
      setSaving(true);
      
      // Create updated models array
      const updatedModels = [...models, newModel];
      
      // Update the booking device models document
      await firestoreService.saveBookingDeviceModels(selectedServiceType, selectedBrand, updatedModels);
      
      // Update the local state
      setModels(updatedModels);
      setNewModel({ id: '', name: '' });
      
      toast.success('Model added successfully');
      setSaving(false);
    } catch (err) {
      console.error('Error adding model:', err);
      toast.error('Failed to add model');
      setSaving(false);
    }
  };
  
  // Handle deleting a brand
  const handleDeleteBrand = async (brandId) => {
    if (window.confirm('Are you sure you want to delete this brand? All models associated with this brand will also be deleted.')) {
      try {
        setSaving(true);
        
        // Create updated brands array
        const updatedBrands = brands.filter(brand => brand.id !== brandId);
        
        // Update the booking device document
        await firestoreService.saveBookingDevice(selectedServiceType, {
          type: selectedServiceType,
          brands: updatedBrands
        });
        
        // Delete the booking device models document for this brand
        await firestoreService.deleteBookingDeviceModels(selectedServiceType, brandId);
        
        // Update the local state
        setBrands(updatedBrands);
        
        // If the deleted brand was selected, select another one if available
        if (selectedBrand === brandId) {
          if (updatedBrands.length > 0) {
            setSelectedBrand(updatedBrands[0].id);
            await fetchModelsForBrand(selectedServiceType, updatedBrands[0].id);
          } else {
            setSelectedBrand(null);
            setModels([]);
          }
        }
        
        toast.success('Brand deleted successfully');
        setSaving(false);
      } catch (err) {
        console.error('Error deleting brand:', err);
        toast.error('Failed to delete brand');
        setSaving(false);
      }
    }
  };
  
  // Handle deleting a model
  const handleDeleteModel = async (modelId) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        setSaving(true);
        
        // Create updated models array
        const updatedModels = models.filter(model => model.id !== modelId);
        
        // Update the booking device models document
        await firestoreService.saveBookingDeviceModels(selectedServiceType, selectedBrand, updatedModels);
        
        // Update the local state
        setModels(updatedModels);
        
        toast.success('Model deleted successfully');
        setSaving(false);
      } catch (err) {
        console.error('Error deleting model:', err);
        toast.error('Failed to delete model');
        setSaving(false);
      }
    }
  };
  
  if (loading && !brands.length) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading booking devices...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-error">
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          className="admin-btn admin-btn-primary"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="admin-page-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="admin-page-header">
        <h2>Booking Devices Manager</h2>
        <p className="admin-page-subtitle">
          Manage device brands and models available for booking repair services
        </p>
      </div>
      
      <div className="admin-content-wrapper">
        <div className="admin-card mb-4">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Select Service Type</h3>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label>Service Type</label>
              <select
                value={selectedServiceType}
                onChange={handleServiceTypeChange}
                className="admin-select"
                disabled={loading}
              >
                {serviceTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="admin-row">
          <div className="admin-col-6">
            <div className="admin-card mb-4">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Manage Brands</h3>
              </div>
              <div className="admin-card-body">
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Brand ID</label>
                    <input
                      type="text"
                      value={newBrand.id}
                      onChange={(e) => setNewBrand({...newBrand, id: e.target.value})}
                      placeholder="e.g., samsung-mobile"
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Brand Name</label>
                    <input
                      type="text"
                      value={newBrand.name}
                      onChange={(e) => setNewBrand({...newBrand, name: e.target.value})}
                      placeholder="e.g., Samsung"
                      className="admin-input"
                    />
                  </div>
                  <div className="admin-form-group">
                    <button
                      className="admin-btn admin-btn-primary"
                      onClick={handleAddBrand}
                      disabled={saving}
                    >
                      {saving ? 'Adding...' : 'Add Brand'}
                    </button>
                  </div>
                </div>
                
                <div className="admin-table-container mt-4">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {brands.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="admin-no-data">
                            No brands found. Add a brand to get started.
                          </td>
                        </tr>
                      ) : (
                        brands.map(brand => (
                          <tr key={brand.id} className={selectedBrand === brand.id ? 'selected-row' : ''}>
                            <td>{brand.id}</td>
                            <td>{brand.name}</td>
                            <td>
                              <div className="admin-actions">
                                <button
                                  className="admin-btn admin-btn-sm admin-btn-secondary"
                                  onClick={() => setSelectedBrand(brand.id) & fetchModelsForBrand(selectedServiceType, brand.id)}
                                >
                                  View Models
                                </button>
                                <button
                                  className="admin-btn admin-btn-sm admin-btn-danger"
                                  onClick={() => handleDeleteBrand(brand.id)}
                                  disabled={saving}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          <div className="admin-col-6">
            <div className="admin-card mb-4">
              <div className="admin-card-header">
                <h3 className="admin-card-title">
                  Manage Models
                  {selectedBrand && brands.length > 0 && (
                    <span> for {brands.find(b => b.id === selectedBrand)?.name}</span>
                  )}
                </h3>
              </div>
              <div className="admin-card-body">
                {!selectedBrand ? (
                  <div className="admin-alert admin-alert-info">
                    Please select a brand to manage its models
                  </div>
                ) : (
                  <>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Model ID</label>
                        <input
                          type="text"
                          value={newModel.id}
                          onChange={(e) => setNewModel({...newModel, id: e.target.value})}
                          placeholder="e.g., galaxy-s24-ultra"
                          className="admin-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <label>Model Name</label>
                        <input
                          type="text"
                          value={newModel.name}
                          onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                          placeholder="e.g., Galaxy S24 Ultra"
                          className="admin-input"
                        />
                      </div>
                      <div className="admin-form-group">
                        <button
                          className="admin-btn admin-btn-primary"
                          onClick={handleAddModel}
                          disabled={saving}
                        >
                          {saving ? 'Adding...' : 'Add Model'}
                        </button>
                      </div>
                    </div>
                    
                    <div className="admin-table-container mt-4">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {models.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="admin-no-data">
                                No models found for this brand. Add a model to get started.
                              </td>
                            </tr>
                          ) : (
                            models.map(model => (
                              <tr key={model.id}>
                                <td>{model.id}</td>
                                <td>{model.name}</td>
                                <td>
                                  <div className="admin-actions">
                                    <button
                                      className="admin-btn admin-btn-sm admin-btn-danger"
                                      onClick={() => handleDeleteModel(model.id)}
                                      disabled={saving}
                                    >
                                      <i className="fas fa-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDevicesManager; 