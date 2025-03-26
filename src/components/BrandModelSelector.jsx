import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBrandsByCategory, getModelsByBrand } from '../data/products.jsx';
import '../styles/brandModelSelector.css';

const BrandModelSelector = ({ category }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get brands for the category
    const categoryBrands = getBrandsByCategory(category);
    setBrands(categoryBrands);
    setSelectedBrand(null);
    setSelectedModel(null);
  }, [category]);

  useEffect(() => {
    if (selectedBrand) {
      // Get models for the selected brand
      const brandModels = getModelsByBrand(selectedBrand.id, category);
      setModels(brandModels);
      setSelectedModel(null);
    } else {
      setModels([]);
    }
  }, [selectedBrand, category]);

  const handleBrandSelect = (brand) => {
    setSelectedBrand(brand);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    // Navigate to the model-specific page
    navigate(`/services/${category}/${selectedBrand.id}/${model.id}`);
  };

  return (
    <div className="brand-model-selector">
      <div className="selector-container">
        <div className="brands-section">
          <h3>Select Brand</h3>
          <div className="brands-grid">
            {brands.map(brand => (
              <div 
                key={brand.id} 
                className={`brand-card ${selectedBrand?.id === brand.id ? 'selected' : ''}`}
                onClick={() => handleBrandSelect(brand)}
              >
                <img 
                  src={`/images/brands/${brand.id}.png`} 
                  alt={brand.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder-brand.png';
                  }}
                />
                <span>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>

        {selectedBrand && models.length > 0 && (
          <div className="models-section">
            <h3>Select {selectedBrand.name} Model</h3>
            <div className="models-grid">
              {models.map(model => (
                <div 
                  key={model.id} 
                  className={`model-card ${selectedModel?.id === model.id ? 'selected' : ''}`}
                  onClick={() => handleModelSelect(model)}
                >
                  <img 
                    src={`/images/models/${model.id}.png`} 
                    alt={model.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder-model.png';
                    }}
                  />
                  <span>{model.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandModelSelector; 