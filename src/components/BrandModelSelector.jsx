import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBrandsByCategory, getModelsByBrand } from '../data/products.jsx';
import '../styles/brandModelSelector.css';

const BrandModelSelector = ({ category }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [productCategory, setProductCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Map service IDs to product categories
    const serviceToProductMap = {
      'tv-repair': 'tv',
      'mobile-repair': 'mobile',
      'laptop-repair': 'laptop',
      'ac-repair': 'ac',
      'refrigerator-repair': 'refrigerator',
      'washing-machine-repair': 'washing-machine',
      'water-purifier-repair': 'water-purifier'
    };
    
    // Determine the actual product category
    const actualCategory = serviceToProductMap[category] || category;
    setProductCategory(actualCategory);
    
    console.log(`Category: ${category}, Mapped category: ${actualCategory}`);
    
    // Get brands for the category
    const categoryBrands = getBrandsByCategory(actualCategory);
    console.log(`Found ${categoryBrands.length} brands for category ${actualCategory}`);
    setBrands(categoryBrands);
    setSelectedBrand(null);
    setSelectedModel(null);
  }, [category]);

  useEffect(() => {
    if (selectedBrand && productCategory) {
      // Get models for the selected brand
      console.log(`Getting models for brand ${selectedBrand.id} and category ${productCategory}`);
      const brandModels = getModelsByBrand(selectedBrand.id, productCategory);
      console.log(`Found ${brandModels.length} models`);
      setModels(brandModels);
      setSelectedModel(null);
    } else {
      setModels([]);
    }
  }, [selectedBrand, productCategory]);

  const handleBrandSelect = (brand) => {
    console.log(`Selected brand: ${brand.name}`);
    setSelectedBrand(brand);
  };

  const handleModelSelect = (model) => {
    console.log(`Selected model: ${model.name}`);
    setSelectedModel(model);
    // Navigate to the model-specific page - using the original category (service ID)
    navigate(`/services/${category}/${selectedBrand.id}/${model.id}`);
  };

  return (
    <div className="brand-model-selector">
      <div className="selector-container">
        <div className="brands-section">
          <h3>Select Brand</h3>
          {brands.length > 0 ? (
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
          ) : (
            <div className="no-brands-message">
              <p>No brands found for this category. Please try a different category.</p>
            </div>
          )}
        </div>

        {selectedBrand && (
          <div className="models-section">
            <h3>Select {selectedBrand.name} Model</h3>
            {models.length > 0 ? (
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
            ) : (
              <div className="no-models-message">
                <p>No models found for this brand. Please select a different brand or contact us for custom options.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandModelSelector; 