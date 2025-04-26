import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../services/firestoreService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TestBookingData = () => {
  const [loading, setLoading] = useState(true);
  const [bookingDevices, setBookingDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [models, setModels] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllBookingDevices();
  }, []);

  const fetchAllBookingDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const devices = await firestoreService.getAllBookingDevices();
      setBookingDevices(devices);
      
      if (devices.length > 0) {
        // Automatically select the mobile-repair device
        const mobileDevice = devices.find(d => d.type === 'mobile-repair');
        if (mobileDevice) {
          setSelectedDevice(mobileDevice);
          fetchModels(mobileDevice.type, mobileDevice.brands[0]?.id);
        }
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booking devices:', err);
      setError('Failed to load booking devices. Please make sure you have imported data first.');
      setLoading(false);
    }
  };

  const fetchModels = async (serviceType, brandId) => {
    if (!serviceType || !brandId) return;
    
    try {
      setLoading(true);
      
      const modelsData = await firestoreService.getBookingDeviceModels(serviceType, brandId);
      setModels(modelsData || []);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching models:', err);
      setModels([]);
      setLoading(false);
    }
  };

  const handleBrandChange = (e) => {
    if (!selectedDevice) return;
    
    const brandId = e.target.value;
    fetchModels(selectedDevice.type, brandId);
  };

  if (loading && !bookingDevices.length) {
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
        <h2>Test Booking Devices Data</h2>
        <p className="admin-page-subtitle">
          Verify that the booking devices data has been properly imported
        </p>
      </div>
      
      <div className="admin-content-wrapper">
        {error && (
          <div className="admin-alert admin-alert-danger mb-4">
            {error}
          </div>
        )}
        
        {bookingDevices.length === 0 ? (
          <div className="admin-card">
            <div className="admin-card-body">
              <div className="admin-alert admin-alert-warning">
                <p>No booking devices found in the database.</p>
                <p>Please use the Data Importer to import your services data first.</p>
              </div>
              
              <Link to="/admin/data-importer" className="admin-btn admin-btn-primary mt-3">
                Go to Data Importer
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="admin-card mb-4">
              <div className="admin-card-header">
                <h3 className="admin-card-title">Available Booking Devices</h3>
              </div>
              <div className="admin-card-body">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Service Type</th>
                      <th>Brands Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingDevices.map((device) => (
                      <tr key={device.type}>
                        <td>{device.type}</td>
                        <td>{device.brands?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {selectedDevice && (
              <div className="admin-card mb-4">
                <div className="admin-card-header">
                  <h3 className="admin-card-title">Device: {selectedDevice.type}</h3>
                </div>
                <div className="admin-card-body">
                  <div className="admin-form-group">
                    <label>Select Brand</label>
                    <select 
                      className="admin-select" 
                      onChange={handleBrandChange}
                    >
                      <option value="">Select a brand</option>
                      {selectedDevice.brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                          {brand.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="admin-section mt-4">
                    <h4>Available Models</h4>
                    {models.length > 0 ? (
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Model ID</th>
                            <th>Model Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {models.map((model) => (
                            <tr key={model.id}>
                              <td>{model.id}</td>
                              <td>{model.name}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="admin-alert admin-alert-info">
                        Select a brand to view available models
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TestBookingData; 