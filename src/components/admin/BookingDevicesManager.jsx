import React, { useState, useEffect } from 'react';
import * as firestoreService from '../../services/firestoreService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BookingDevicesManager = () => {
  // State variables
  const [serviceTypes, setServiceTypes] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState('mobile-repair'); // Default to mobile-repair
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
  // New brand and model form
  const [newBrand, setNewBrand] = useState({ id: '', name: '' });
  const [newModel, setNewModel] = useState({ id: '', name: '' });
  
  // Fetch initial data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Set initial service type to mobile-repair
        setSelectedServiceType('mobile-repair');
        
        // Get booking device data for mobile-repair - exactly like BookingDeviceSelector
        const bookingDevice = await firestoreService.getBookingDevice('mobile-repair');
        
        if (bookingDevice && bookingDevice.brands) {
          setBrands(bookingDevice.brands);
          
          // If oppo-mobile exists, select it
          const oppoBrand = bookingDevice.brands.find(b => b.id === 'oppo-mobile');
          if (oppoBrand) {
            setSelectedBrand('oppo-mobile');
            
            // Fetch models for oppo-mobile
            const modelsData = await firestoreService.getBookingDeviceModels('mobile-repair', 'oppo-mobile');
            if (modelsData) {
              setModels(modelsData);
            } else {
              setModels([]);
            }
          }
        } else {
          // If no data is found, set empty arrays
          setBrands([]);
          setError(`No device data found for mobile-repair. Please import data using the Data Importer tool.`);
        }
        
        // Load categories for service types dropdown
        const categories = await firestoreService.getAllCategories();
        const serviceTypesList = categories
          .filter(cat => cat.id.includes('repair') || cat.name.toLowerCase().includes('repair'))
          .map(cat => ({
            id: cat.id,
            name: cat.name
          }));
        
        // Make sure mobile-repair is included
        if (!serviceTypesList.some(t => t.id === 'mobile-repair')) {
          serviceTypesList.push({ id: 'mobile-repair', name: 'Mobile Repair' });
        }
        
        setServiceTypes(serviceTypesList);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try using the Data Importer first.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Fetch brands when service type changes
  useEffect(() => {
    if (selectedServiceType) {
      fetchBookingDevicesForServiceType(selectedServiceType);
    }
  }, [selectedServiceType]);
  
  // Fetch all booking devices for a service type
  const fetchBookingDevicesForServiceType = async (serviceType) => {
    try {
      setLoading(true);
      setError(null);
      
      // Get booking device data for this service category
      const bookingDevice = await firestoreService.getBookingDevice(serviceType);
      
      if (bookingDevice && bookingDevice.brands) {
        setBrands(bookingDevice.brands);
      } else {
        // If no data is found, set empty array and show an error
        setBrands([]);
        setError(`No device data found for ${serviceType}. Please try another service type or use the Data Importer.`);
      }
      
      // Reset selections when service type changes
      setSelectedBrand('');
      setModels([]);
      
      setLoading(false);
    } catch (err) {
      console.error(`Error fetching booking devices for ${serviceType}:`, err);
      setError(`Failed to load booking devices for ${serviceType}`);
      setBrands([]);
      setLoading(false);
    }
  };
  
  // Fetch models for a specific brand
  const fetchModelsForBrand = async (serviceType, brandId) => {
    if (!brandId) {
      setModels([]);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get models for this brand from Firestore
      const modelsData = await firestoreService.getBookingDeviceModels(serviceType, brandId);
      
      if (modelsData) {
        setModels(modelsData);
      } else {
        setModels([]);
        setError(`No models found for ${brandId}. Please add some models.`);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching models:', err);
      setError('Failed to load device models. Please try again later.');
      setModels([]);
      setLoading(false);
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
      
      // Reload models from Firestore to ensure we have the latest data
      await fetchModelsForBrand(selectedServiceType, selectedBrand);
      
      // Reset new model form
      setNewModel({ id: '', name: '' });
      
      toast.success('Model added successfully');
      setSaving(false);
    } catch (err) {
      console.error('Error adding model:', err);
      toast.error('Failed to add model');
      setSaving(false);
    }
  };
  
  // Handle adding a special "Other" option
  const handleAddOtherOption = async () => {
    try {
      setSaving(true);
      
      // Check if the "Other" option already exists
      const otherOption = models.find(model => model.id === 'other');
      
      if (otherOption) {
        toast.info('An "Other" option already exists for this brand');
        setSaving(false);
        return;
      }
      
      // Create the "Other" option model
      const otherModel = { 
        id: 'other', 
        name: 'Other (not in list)',
        isCustomOption: true 
      };
      
      // Create updated models array with the Other option
      const updatedModels = [...models, otherModel];
      
      // Update the booking device models document
      await firestoreService.saveBookingDeviceModels(selectedServiceType, selectedBrand, updatedModels);
      
      // Reload models from Firestore to ensure we have the latest data
      await fetchModelsForBrand(selectedServiceType, selectedBrand);
      
      toast.success('Other option added successfully');
      setSaving(false);
    } catch (err) {
      console.error('Error adding Other option:', err);
      toast.error('Failed to add Other option');
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
            setSelectedBrand('');
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
  
  // Loading indicator
  if (loading && !brands.length) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading booking devices...</p>
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
        {error && (
          <div className="admin-alert admin-alert-danger mb-4">
            {error}
            <div className="mt-2">
              <button 
                className="admin-btn admin-btn-primary"
                onClick={() => window.location.href = '/admin/data-importer'}
              >
                Go to Data Importer
              </button>
            </div>
          </div>
        )}
        
        <div className="admin-card mb-4">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Select Service Type</h3>
          </div>
          <div className="admin-card-body">
            <div className="admin-form-group">
              <label>Service Type</label>
              <div className="admin-form-row">
                <select
                  value={selectedServiceType}
                  onChange={handleServiceTypeChange}
                  className="admin-select"
                  disabled={loading}
                >
                  {serviceTypes.length === 0 && (
                    <option value="">No service types found</option>
                  )}
                  {serviceTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
                
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    setSelectedServiceType('mobile-repair');
                    fetchBookingDevicesForServiceType('mobile-repair');
                  }}
                  disabled={loading || saving}
                >
                  Use Mobile Repair
                </button>
              </div>
              
              {serviceTypes.length === 0 && (
                <p className="admin-alert admin-alert-warning mt-2">
                  No service types found. Make sure you have imported data using the Data Importer.
                </p>
              )}
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
                    <label>Select Brand</label>
                    <select
                      value={selectedBrand}
                      onChange={handleBrandChange}
                      className="admin-select"
                      disabled={brands.length === 0 || loading}
                    >
                      <option value="">Choose a brand</option>
                      {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                    {brands.length === 0 && !loading && !error && (
                      <p className="admin-help-text">No brands available for this service type.</p>
                    )}
                  </div>
                </div>

                <div className="admin-form-row mt-4">
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
                    
                    <div className="admin-form-row mt-3">
                      <div className="admin-form-group">
                        <button
                          className="admin-btn admin-btn-secondary"
                          onClick={handleAddOtherOption}
                          disabled={saving || models.some(model => model.id === 'other')}
                        >
                          {saving ? 'Adding...' : 'Add "Other" Option'}
                        </button>
                        <small className="admin-help-text mt-1">
                          This adds an "Other" option that allows users to enter custom model names
                        </small>
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
        
        <div className="admin-card mb-4">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Import Tools</h3>
          </div>
          <div className="admin-card-body">
            <p className="mb-3">
              Having problems with data? Use these buttons to access data tools:
            </p>
            <div className="admin-form-row">
              <button
                className="admin-btn admin-btn-primary"
                onClick={() => window.location.href = '/admin/data-importer'}
              >
                Go to Data Importer
              </button>
              
              <button
                className="admin-btn admin-btn-secondary ml-2"
                onClick={() => window.location.href = '/admin/test-booking-data'}
              >
                Test Booking Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDevicesManager; 