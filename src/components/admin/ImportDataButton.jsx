import React, { useState } from 'react';
import importServices from '../../scripts/importServices';
import migrateProductsToFirestore from '../../scripts/migrateProductsToFirestore';
import { bookingDevices } from '../../data/products.jsx';

const ImportDataButton = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState(null);
  const [migrationStatus, setMigrationStatus] = useState(null);
  const [migrationInProgress, setMigrationInProgress] = useState(false);
  
  const handleImport = async () => {
    if (window.confirm('Are you sure you want to import sample data? This will add test data to your database.')) {
      setLoading(true);
      setStatus('Importing data...');
      
      try {
        // Mock import function - replace with actual import
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setStatus('Data imported successfully!');
        setTimeout(() => {
          setStatus('');
        }, 3000);
      } catch (error) {
        console.error('Error importing data:', error);
        setStatus('Error importing data. Check console for details.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMigrateProducts = async () => {
    if (window.confirm('Are you sure you want to migrate product data from static files to Firestore? This should only be done once.')) {
      setMigrationInProgress(true);
      setMigrationStatus('Migration in progress... This may take a few minutes.');
      
      try {
        const result = await migrateProductsToFirestore();
        
        if (result) {
          setMigrationStatus('Product data successfully migrated to Firestore!');
        } else {
          setMigrationStatus('Migration failed. Check console for details.');
        }
      } catch (error) {
        console.error('Error during migration:', error);
        setMigrationStatus('Migration error: ' + error.message);
      } finally {
        setMigrationInProgress(false);
        setTimeout(() => {
          setMigrationStatus(null);
        }, 5000);
      }
    }
  };

  const handleMigrateBookingDevices = async () => {
    if (window.confirm('Are you sure you want to migrate booking devices data from static files to Firestore? This should only be done once.')) {
      setMigrationInProgress(true);
      setMigrationStatus('Migrating booking devices... This may take a few minutes.');
      
      try {
        const result = await migrateBookingDevicesToFirestore();
        
        if (result) {
          setMigrationStatus('Booking devices data successfully migrated to Firestore!');
        } else {
          setMigrationStatus('Migration failed. Check console for details.');
        }
      } catch (error) {
        console.error('Error during booking devices migration:', error);
        setMigrationStatus('Migration error: ' + error.message);
      } finally {
        setMigrationInProgress(false);
        setTimeout(() => {
          setMigrationStatus(null);
        }, 5000);
      }
    }
  };

  const migrateBookingDevicesToFirestore = async () => {
    try {
      // Import Firebase and Firestore
      const { db } = await import('../../firebase/config');
      const { collection, doc, setDoc } = await import('firebase/firestore');
      
      // Migrate booking devices
      console.log("Migrating booking devices data...");
      
      for (const [serviceType, data] of Object.entries(bookingDevices)) {
        // Store the service type and brands
        const serviceTypeRef = doc(collection(db, "bookingDevices"), serviceType);
        await setDoc(serviceTypeRef, {
          type: serviceType,
          brands: data.brands,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        // Store models for each brand
        for (const [brandId, models] of Object.entries(data.models)) {
          const brandModelsRef = doc(collection(db, "bookingDeviceModels"), `${serviceType}_${brandId}`);
          await setDoc(brandModelsRef, {
            serviceType,
            brandId,
            models,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }
      
      console.log("Booking devices migrated successfully");
      return true;
    } catch (error) {
      console.error("Error migrating booking devices to Firestore:", error);
      return false;
    }
  };

  return (
    <div className="admin-data-tools">
      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Import Sample Data</h3>
        </div>
        <div className="admin-card-body">
          <p className="mb-3">
            Import sample data into the database for testing purposes.
          </p>
          <button 
            className="admin-primary-btn"
            onClick={handleImport}
            disabled={loading}
          >
            {loading ? 'Importing...' : 'Import Sample Data'}
          </button>
          {status && (
            <div className="admin-status-message mt-3">
              {status}
            </div>
          )}
        </div>
      </div>

      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Migrate Products to Firestore</h3>
        </div>
        <div className="admin-card-body">
          <p className="mb-3">
            Migrate all product data from the static files to Firestore. This should only be 
            run once when setting up the database. This will migrate categories, brands, models, 
            products, and booking devices.
          </p>
          <button 
            className="admin-primary-btn"
            onClick={handleMigrateProducts}
            disabled={migrationInProgress}
          >
            {migrationInProgress ? 'Migrating...' : 'Migrate Products to Firestore'}
          </button>
          {migrationStatus && (
            <div className="admin-status-message mt-3">
              {migrationStatus}
            </div>
          )}
        </div>
      </div>

      <div className="admin-card mb-4">
        <div className="admin-card-header">
          <h3 className="admin-card-title">Migrate Booking Devices to Firestore</h3>
        </div>
        <div className="admin-card-body">
          <p className="mb-3">
            Migrate only the booking devices data from static files to Firestore. This should only be 
            run once when setting up the database or if booking devices data is missing.
          </p>
          <button 
            className="admin-primary-btn"
            onClick={handleMigrateBookingDevices}
            disabled={migrationInProgress}
          >
            {migrationInProgress ? 'Migrating...' : 'Migrate Booking Devices'}
          </button>
          {migrationStatus && (
            <div className="admin-status-message mt-3">
              {migrationStatus}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportDataButton; 