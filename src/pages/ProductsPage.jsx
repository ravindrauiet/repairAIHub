import { useState, useEffect } from 'react';
import Hero from '../components/common/Hero';
import { Link } from 'react-router-dom';

const ProductsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Sample product data - In a real app, this would come from an API or database
  const products = [
    {
      id: 1,
      category: 'mobile',
      brand: 'Samsung',
      model: 'Galaxy S21',
      partName: 'Display Screen',
      price: 12999,
      imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Original Samsung Galaxy S21 AMOLED display screen replacement part.',
      specifications: {
        type: 'AMOLED',
        resolution: '1080 x 2400 pixels',
        size: '6.2 inches',
        compatibility: 'Galaxy S21 only',
        warranty: '6 months manufacturer warranty'
      },
      compatibility: ['Galaxy S21', 'Galaxy S21 5G'],
      inStock: true
    },
    {
      id: 2,
      category: 'mobile',
      brand: 'Apple',
      model: 'iPhone 13',
      partName: 'Battery',
      price: 3999,
      imageUrl: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Genuine Apple iPhone 13 battery replacement with installation tools.',
      specifications: {
        capacity: '3240 mAh',
        type: 'Li-Ion',
        voltage: '3.83 V',
        includes: 'Installation tools and adhesive',
        warranty: '6 months manufacturer warranty'
      },
      compatibility: ['iPhone 13', 'iPhone 13 Pro'],
      inStock: true
    },
    {
      id: 3,
      category: 'ac',
      brand: 'Daikin',
      model: 'FTKF35',
      partName: 'Compressor',
      price: 15999,
      imageUrl: 'https://images.unsplash.com/photo-1621619856624-42fd193a0661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Original Daikin compressor unit with 1-year warranty.',
      specifications: {
        type: 'Rotary',
        capacity: '1.5 Ton',
        refrigerant: 'R32',
        energyEfficiency: '5 Star Rating',
        warranty: '1 year manufacturer warranty'
      },
      compatibility: ['Daikin FTKF35', 'Daikin FTKF35XV'],
      inStock: true
    },
    {
      id: 4,
      category: 'refrigerator',
      brand: 'Samsung',
      model: 'RT42M5538BS',
      partName: 'Cooling Fan',
      price: 4999,
      imageUrl: 'https://images.unsplash.com/photo-1536353284924-9220c464e262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Genuine Samsung cooling fan for double-door refrigerators.',
      specifications: {
        type: 'Axial Fan',
        diameter: '120mm',
        voltage: '12V DC',
        airflow: '52 CFM',
        warranty: '6 months manufacturer warranty'
      },
      compatibility: ['Samsung RT42M5538BS', 'Samsung RT42M5538BS/HL'],
      inStock: true
    },
    {
      id: 5,
      category: 'tv',
      brand: 'LG',
      model: 'OLED55C1',
      partName: 'Power Supply Board',
      price: 8999,
      imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      description: 'Original LG power supply board for OLED TVs.',
      specifications: {
        partNumber: 'EAY64948701',
        inputVoltage: '100-240V',
        outputVoltage: 'Multi-output',
        compatible: 'LG 2019-2021 OLED models',
        warranty: '6 months manufacturer warranty'
      },
      compatibility: ['LG OLED55C1', 'LG OLED65C1'],
      inStock: false
    }
  ];

  const categories = [
    { value: 'mobile', label: 'Mobile Phones' },
    { value: 'ac', label: 'Air Conditioners' },
    { value: 'refrigerator', label: 'Refrigerators' },
    { value: 'ro', label: 'RO Systems' },
    { value: 'tv', label: 'Televisions' }
  ];

  // Store products in localStorage when component mounts
  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, []);

  // Filter products based on selected filters and search query
  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedBrand) {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    if (selectedModel) {
      filtered = filtered.filter(product => product.model === selectedModel);
    }

    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.partName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedBrand, selectedModel, searchQuery]);

  // Get unique brands based on selected category
  const getBrands = () => {
    const categoryProducts = products.filter(p => !selectedCategory || p.category === selectedCategory);
    return [...new Set(categoryProducts.map(p => p.brand))];
  };

  // Get unique models based on selected brand
  const getModels = () => {
    const brandProducts = products.filter(p => !selectedBrand || p.brand === selectedBrand);
    return [...new Set(brandProducts.map(p => p.model))];
  };

  return (
    <div className="products-page">
      <Hero 
        title="Repair Parts & Products" 
        subtitle="Find genuine replacement parts for your devices"
        backgroundImage="https://images.unsplash.com/photo-1581092921461-39b9d08ed889?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
      />

      <section className="section">
        <div className="container">
          <div className="products-filters">
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="filter-group">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedBrand('');
                  setSelectedModel('');
                }}
                className="filter-select"
              >
                <option value="">Select Device Type</option>
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedBrand}
                onChange={(e) => {
                  setSelectedBrand(e.target.value);
                  setSelectedModel('');
                }}
                className="filter-select"
                disabled={!selectedCategory}
              >
                <option value="">Select Brand</option>
                {getBrands().map(brand => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>

              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="filter-select"
                disabled={!selectedBrand}
              >
                <option value="">Select Model</option>
                {getModels().map(model => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <Link to={`/products/${product.id}`} key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.imageUrl} alt={product.partName} />
                  {!product.inStock && <span className="out-of-stock">Out of Stock</span>}
                </div>
                <div className="product-details">
                  <h3>{product.partName}</h3>
                  <p className="product-info">
                    {product.brand} {product.model}
                  </p>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price">₹{product.price.toLocaleString()}</div>
                  <button className="product-btn">View Details</button>
                </div>
              </Link>
            ))}
            
            {filteredProducts.length === 0 && (
              <div className="no-products">
                <p>No products found matching your criteria. Please try different filters.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage; 