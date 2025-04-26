import React, { useState } from 'react';
import importAllData from '../../scripts/importServicesToFirestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataImporter = () => {
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleImport = async () => {
    if (importing) return;

    try {
      setImporting(true);
      setError(null);
      setResults(null);
      
      toast.info('Starting data import process...');
      
      const importResults = await importAllData();
      
      setResults(importResults);
      
      if (importResults.success) {
        toast.success('Data import completed successfully!');
      } else {
        toast.error('Some parts of the data import failed. Check the detailed results.');
      }
      
      setImporting(false);
    } catch (err) {
      console.error('Error during import:', err);
      setError(err.message || 'An unknown error occurred');
      toast.error('Import failed: ' + (err.message || 'Unknown error'));
      setImporting(false);
    }
  };

  const renderResultsSection = () => {
    if (!results) return null;
    
    return (
      <div className="admin-card mt-4">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Import Results</h3>
        </div>
        <div className="admin-card-body">
          <div className="admin-alert admin-alert-info mb-3">
            <strong>Overall Status:</strong> {results.success ? 'Success' : 'Partial Success/Failed'}
          </div>

          {results.services && (
            <div className="admin-section mb-4">
              <h4>Services Import</h4>
              <div className={`admin-alert ${results.services.success ? 'admin-alert-success' : 'admin-alert-danger'}`}>
                {results.services.success
                  ? `Successfully processed ${results.services.results?.length || 0} services`
                  : `Failed to import services: ${results.services.error?.message || 'Unknown error'}`}
              </div>
              {results.services.results && results.services.results.length > 0 && (
                <div className="admin-table-container mt-2">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Service ID</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.services.results.map((service, index) => (
                        <tr key={index}>
                          <td>{service.id}</td>
                          <td>
                            <span className={`admin-badge ${service.status === 'added' ? 'admin-badge-success' : 'admin-badge-info'}`}>
                              {service.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {results.categories && (
            <div className="admin-section mb-4">
              <h4>Categories Import</h4>
              <div className={`admin-alert ${results.categories.success ? 'admin-alert-success' : 'admin-alert-danger'}`}>
                {results.categories.success
                  ? `Successfully processed ${results.categories.results?.length || 0} categories`
                  : `Failed to import categories: ${results.categories.error?.message || 'Unknown error'}`}
              </div>
            </div>
          )}

          {results.bookingDevices && (
            <div className="admin-section">
              <h4>Booking Devices Import</h4>
              <div className={`admin-alert ${results.bookingDevices.success ? 'admin-alert-success' : 'admin-alert-danger'}`}>
                {results.bookingDevices.success
                  ? (results.bookingDevices.alreadyExists
                    ? 'Mobile repair booking device already exists in database'
                    : 'Successfully created mobile repair booking device with brands and models')
                  : `Failed to setup booking devices: ${results.bookingDevices.error?.message || 'Unknown error'}`}
              </div>
              
              {results.bookingDevices.data && (
                <div className="mt-2">
                  <strong>Brands initialized:</strong> {results.bookingDevices.data.brands?.length || 0}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-page-container">
      <ToastContainer position="top-right" autoClose={5000} />
      
      <div className="admin-page-header">
        <h2>Data Importer</h2>
        <p className="admin-page-subtitle">
          Import services, categories, and booking devices data to Firestore
        </p>
      </div>
      
      <div className="admin-content-wrapper">
        <div className="admin-card">
          <div className="admin-card-header">
            <h3 className="admin-card-title">Data Import</h3>
          </div>
          <div className="admin-card-body">
            <p className="mb-4">
              This tool will import data from your static services.js file into Firestore, 
              create categories from services, and initialize booking devices data for mobile repair.
            </p>
            
            <div className="admin-alert admin-alert-warning mb-4">
              <strong>Warning:</strong> Running this import multiple times will update existing records, 
              but will not delete any existing data. It's recommended to run this only once when setting up your database.
            </div>
            
            {error && (
              <div className="admin-alert admin-alert-danger mb-4">
                <strong>Error:</strong> {error}
              </div>
            )}
            
            <button
              className="admin-btn admin-btn-primary"
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? 'Importing...' : 'Import Data to Firestore'}
            </button>
            
            <div className="admin-help-text mt-2">
              This process may take a few minutes. Please don't close this page until it completes.
            </div>
          </div>
        </div>
        
        {renderResultsSection()}
      </div>
    </div>
  );
};

export default DataImporter; 