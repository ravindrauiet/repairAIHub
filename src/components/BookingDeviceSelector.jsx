import { useState, useEffect } from 'react';
import * as firestoreService from '../services/firestoreService';
import '../styles/bookingDeviceSelector.css';

const BookingDeviceSelector = ({ category, onSelectionChange }) => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModel, setCustomModel] = useState('');
  const [isOtherModelSelected, setIsOtherModelSelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch brands for the selected category when component mounts or category changes
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get booking device data for this service category
        const bookingDevice = await firestoreService.getBookingDevice(category);
        
        if (bookingDevice && bookingDevice.brands) {
          setBrands(bookingDevice.brands);
        } else {
          // If no data is found, set empty array and show an error
          setBrands([]);
          setError(`No device data found for ${category}. Please contact support.`);
        }
        
        // Reset selections when category changes
        setSelectedBrand('');
        setSelectedModel('');
        setCustomModel('');
        setIsOtherModelSelected(false);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching brands:', err);
        setError('Failed to load device brands. Please try again later.');
        setBrands([]);
        setLoading(false);
      }
    };
    
    if (category) {
      fetchBrands();
    }
  }, [category]);

  // Fetch models when a brand is selected
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedBrand) {
        setModels([]);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Get models for this brand from Firestore
        const modelsData = await firestoreService.getBookingDeviceModels(category, selectedBrand);
        
        if (modelsData) {
          setModels(modelsData);
        } else {
          setModels([]);
          setError(`No models found for ${selectedBrand}. Please try another brand.`);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError('Failed to load device models. Please try again later.');
        setModels([]);
        setLoading(false);
      }
    };
    
    if (selectedBrand && category) {
      fetchModels();
      // Reset model selection when brand changes
      setSelectedModel('');
      setCustomModel('');
      setIsOtherModelSelected(false);
    }
  }, [selectedBrand, category]);

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    setSelectedModel('');
    setCustomModel('');
    setIsOtherModelSelected(false);
    
    // Find the selected brand object
    const selectedBrandObj = brands.find(b => b.id === brandId);
    if (onSelectionChange && selectedBrandObj) {
      onSelectionChange({ 
        brand: selectedBrandObj, 
        model: null 
      });
    }
  };

  const handleModelChange = (e) => {
    const modelId = e.target.value;
    setSelectedModel(modelId);
    
    // Check if "other" option is selected
    if (modelId === 'other') {
      setIsOtherModelSelected(true);
      setCustomModel('');
      
      // Find the selected brand object
      const selectedBrandObj = brands.find(b => b.id === selectedBrand);
      
      if (onSelectionChange && selectedBrandObj) {
        onSelectionChange({ 
          brand: selectedBrandObj, 
          model: null 
        });
      }
    } else {
      setIsOtherModelSelected(false);
      
      // Find the selected brand and model objects
      const selectedBrandObj = brands.find(b => b.id === selectedBrand);
      const selectedModelObj = models.find(m => m.id === modelId);
      
      if (onSelectionChange && selectedBrandObj && selectedModelObj) {
        onSelectionChange({ 
          brand: selectedBrandObj, 
          model: selectedModelObj 
        });
      }
    }
  };
  
  const handleCustomModelChange = (e) => {
    const modelName = e.target.value;
    setCustomModel(modelName);
    
    // Find the selected brand object
    const selectedBrandObj = brands.find(b => b.id === selectedBrand);
    
    if (onSelectionChange && selectedBrandObj && modelName.trim()) {
      onSelectionChange({ 
        brand: selectedBrandObj, 
        model: { 
          id: 'custom', 
          name: modelName.trim() 
        } 
      });
    }
  };

  if (loading && !brands.length) {
    return <div className="loading-spinner">Loading device options...</div>;
  }

  return (
    <div className="booking-device-selector">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="selection-container">
        <div className="select-group">
          <label htmlFor="brand">Select Brand</label>
          <select
            id="brand"
            value={selectedBrand}
            onChange={handleBrandChange}
            className="select-input"
            disabled={brands.length === 0}
          >
            <option value="">Choose a brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          {brands.length === 0 && !loading && !error && (
            <p className="help-text">No brands available for this device type.</p>
          )}
        </div>

        <div className="select-group">
          <label htmlFor="model">Select Model</label>
          <select
            id="model"
            value={selectedModel}
            onChange={handleModelChange}
            className="select-input"
            disabled={!selectedBrand || models.length === 0}
          >
            <option value="">Choose a model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
            <option value="other">Other (not in list)</option>
          </select>
          {selectedBrand && models.length === 0 && !loading && !error && (
            <p className="help-text">No models available for this brand.</p>
          )}
        </div>
        
        {isOtherModelSelected && (
          <div className="select-group custom-model-input">
            <label htmlFor="customModel">Enter Your Model Name</label>
            <input
              type="text"
              id="customModel"
              value={customModel}
              onChange={handleCustomModelChange}
              placeholder="Type your device model name"
              className="input-field"
            />
          </div>
        )}
      </div>

      {selectedBrand && (selectedModel || isOtherModelSelected && customModel) && (
        <div className="selected-info">
          <h4>Selected Device</h4>
          <p>Brand: {brands.find(b => b.id === selectedBrand)?.name}</p>
          <p>Model: {isOtherModelSelected ? customModel : models.find(m => m.id === selectedModel)?.name}</p>
        </div>
      )}
    </div>
  );
};

export default BookingDeviceSelector; 