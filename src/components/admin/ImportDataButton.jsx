import React, { useState } from 'react';
import importServices from '../../scripts/importServices';

const ImportDataButton = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  
  const handleImport = async () => {
    if (loading) return;
    
    if (!window.confirm('Are you sure you want to import services data to Firebase? This may create duplicate entries if run multiple times.')) {
      return;
    }
    
    setLoading(true);
    setStatus('Importing services data...');
    
    try {
      // Import data to Firebase
      await importServices();
      setStatus('Services data imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      setStatus(`Import failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="admin-card mb-4">
      <div className="admin-card-header">
        <h3 className="admin-card-title">Import Data</h3>
      </div>
      <div className="admin-card-body">
        <p className="mb-3">
          Import services data from the static JavaScript file to Firebase Firestore.
        </p>
        <div className="admin-alert admin-alert-warning mb-3">
          <i className="fas fa-exclamation-triangle"></i>
          This action will add all services from the static data file to Firebase.
          Use with caution as it may create duplicate entries if run multiple times.
        </div>
        
        {status && (
          <div className={`admin-alert ${status.includes('failed') ? 'admin-alert-danger' : 'admin-alert-success'} mb-3`}>
            {status}
          </div>
        )}
        
        <button 
          className="admin-btn admin-btn-primary" 
          onClick={handleImport}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
              Importing...
            </>
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt mr-2"></i>
              Import Services Data
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ImportDataButton; 