import { useState, useEffect } from 'react';
import { bookingDevices } from '../data/products.jsx';
import '../styles/bookingDeviceSelector.css';

const BookingDeviceSelector = ({ category, onSelectionChange }) => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get brands for the selected category from bookingDevices
    const categoryData = bookingDevices[category];
    if (categoryData) {
      setBrands(categoryData.brands);
      setLoading(false);
    } else {
      console.error('No data found for category:', category);
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    // Get models for the selected brand from bookingDevices
    if (selectedBrand && bookingDevices[category]?.models[selectedBrand]) {
      setModels(bookingDevices[category].models[selectedBrand]);
    } else {
      setModels([]);
    }
  }, [selectedBrand, category]);

  const handleBrandChange = (e) => {
    const brandId = e.target.value;
    setSelectedBrand(brandId);
    setSelectedModel('');
    
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
    
    // Find the selected brand and model objects
    const selectedBrandObj = brands.find(b => b.id === selectedBrand);
    const selectedModelObj = models.find(m => m.id === modelId);
    
    if (onSelectionChange && selectedBrandObj && selectedModelObj) {
      onSelectionChange({ 
        brand: selectedBrandObj, 
        model: selectedModelObj 
      });
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="booking-device-selector">
      <div className="selection-container">
        <div className="select-group">
          <label htmlFor="brand">Select Brand</label>
          <select
            id="brand"
            value={selectedBrand}
            onChange={handleBrandChange}
            className="select-input"
          >
            <option value="">Choose a brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div className="select-group">
          <label htmlFor="model">Select Model</label>
          <select
            id="model"
            value={selectedModel}
            onChange={handleModelChange}
            className="select-input"
            disabled={!selectedBrand}
          >
            <option value="">Choose a model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedBrand && selectedModel && (
        <div className="selected-info">
          <h4>Selected Device</h4>
          <p>Brand: {brands.find(b => b.id === selectedBrand)?.name}</p>
          <p>Model: {models.find(m => m.id === selectedModel)?.name}</p>
        </div>
      )}
    </div>
  );
};

export default BookingDeviceSelector; 