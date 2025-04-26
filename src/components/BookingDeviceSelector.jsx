import React, { useState, useEffect, useCallback } from "react";
import * as firestoreService from "../services/firestoreService";
import "../styles/bookingDeviceSelector.css";
import { toast } from "react-toastify";

const BookingDeviceSelector = ({ serviceType, onDeviceSelect, showTitle = true }) => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [isLoadingBrands, setIsLoadingBrands] = useState(true);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [brandsError, setBrandsError] = useState(null);
  const [modelsError, setModelsError] = useState(null);

  const fetchDeviceBrands = useCallback(async () => {
    if (!serviceType) return;
    
    setIsLoadingBrands(true);
    setBrandsError(null);
    
    try {
      const deviceData = await firestoreService.getBookingDevice(serviceType);
      
      if (!deviceData || !deviceData.brands || deviceData.brands.length === 0) {
        setBrandsError(`No brands found for ${serviceType}. Please try a different service type.`);
        setBrands([]);
      } else {
        setBrands(deviceData.brands);
        setSelectedBrand('');
        setSelectedModel('');
        setModels([]);
      }
    } catch (error) {
      console.error('Error fetching device brands:', error);
      setBrandsError(`Failed to load brands. ${error.message}`);
      setBrands([]);
    } finally {
      setIsLoadingBrands(false);
    }
  }, [serviceType]);

  const loadModelsForBrand = useCallback(async (brandId) => {
    if (!serviceType || !brandId) return;
    
    setIsLoadingModels(true);
    setModelsError(null);
    
    try {
      const modelsData = await firestoreService.getBookingDeviceModels(serviceType, brandId);
      
      if (!modelsData || modelsData.length === 0) {
        setModelsError(`No models found for this brand. You can enter a custom model below.`);
        setModels([]);
      } else {
        setModels(modelsData);
        setSelectedModel('');
      }
    } catch (error) {
      console.error('Error loading models:', error);
      setModelsError(`Failed to load models. ${error.message}`);
      setModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  }, [serviceType]);

  useEffect(() => {
    fetchDeviceBrands();
  }, [fetchDeviceBrands]);

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    
    if (brandId) {
      loadModelsForBrand(brandId);
    } else {
      setModels([]);
      setSelectedModel('');
    }
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
    setCustomModel('');
  };

  const handleCustomModelChange = (e) => {
    setCustomModel(e.target.value);
    setSelectedModel('');
  };

  const handleRetryBrands = () => {
    fetchDeviceBrands();
  };

  const handleRetryModels = () => {
    if (selectedBrand) {
      loadModelsForBrand(selectedBrand);
    }
  };

  const getSelectedBrandName = () => {
    const brand = brands.find(b => b.id === selectedBrand);
    return brand ? brand.name : '';
  };

  const getSelectedModelName = () => {
    if (customModel) return customModel;
    const model = models.find(m => m.id === selectedModel);
    return model ? model.name : '';
  };

  const isDeviceSelected = () => {
    return selectedBrand && (selectedModel || customModel);
  };

  useEffect(() => {
    if (isDeviceSelected()) {
      const deviceInfo = {
        brandId: selectedBrand,
        brandName: getSelectedBrandName(),
        modelId: selectedModel || 'custom',
        modelName: getSelectedModelName()
      };
      onDeviceSelect(deviceInfo);
    }
  }, [selectedBrand, selectedModel, customModel]);

  return (
    <div className="booking-device-selector">
      {showTitle && <h3 className="selector-title">Select Your Device</h3>}
      
      {brandsError && (
        <div className="error-message">
          {brandsError}
          <button onClick={handleRetryBrands} className="retry-button">Retry</button>
        </div>
      )}
      
      {isLoadingBrands ? (
        <div className="loading-spinner">Loading device brands...</div>
      ) : (
        <div className="selection-container">
          <div className="select-group">
            <label htmlFor="brand-select">Select Brand</label>
            {brands.length > 0 ? (
              <select 
                id="brand-select"
                className="select-input"
                value={selectedBrand} 
                onChange={handleBrandChange}
              >
                <option value="">-- Select a brand --</option>
                {brands.map(brand => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            ) : !brandsError && (
              <p className="no-options-message">No brands available for this service type.</p>
            )}
          </div>
          
          {selectedBrand && (
            <>
              {modelsError && (
                <div className="error-message">
                  {modelsError}
                  <button onClick={handleRetryModels} className="retry-button">Retry</button>
                </div>
              )}
              
              {isLoadingModels ? (
                <div className="loading-spinner">Loading models...</div>
              ) : (
                <>
                  <div className="select-group">
                    <label htmlFor="model-select">Select Model</label>
                    {models.length > 0 ? (
                      <select 
                        id="model-select"
                        className="select-input"
                        value={selectedModel} 
                        onChange={handleModelChange}
                        disabled={!!customModel}
                      >
                        <option value="">-- Select a model --</option>
                        {models.map(model => (
                          <option key={model.id} value={model.id}>
                            {model.name}
                          </option>
                        ))}
                      </select>
                    ) : !modelsError && (
                      <p className="no-options-message">No models available for this brand.</p>
                    )}
                  </div>
                  
                  <div className="custom-model-input">
                    <label htmlFor="custom-model">Or enter your model manually:</label>
                    <input
                      id="custom-model"
                      type="text"
                      className="input-field"
                      placeholder="Enter your device model"
                      value={customModel}
                      onChange={handleCustomModelChange}
                      disabled={!!selectedModel}
                    />
                  </div>
                </>
              )}
            </>
          )}
          
          {isDeviceSelected() && (
            <div className="selected-info">
              <h4>Selected Device:</h4>
              <p>{getSelectedBrandName()} {getSelectedModelName()}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingDeviceSelector; 