import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Breadcrumb from '../components/common/Breadcrumb';
import '../styles/diy-guides.css';

const DiyGuidesPage = () => {
  const [guides, setGuides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/guides');
        setGuides(response.data.guides || []);
        
        // Extract unique categories
        if (response.data.guides && response.data.guides.length > 0) {
          const uniqueCategories = [...new Set(response.data.guides.map(guide => guide.category))];
          setCategories(uniqueCategories);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Failed to load DIY guides. Please try again later.');
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  // Fallback data if API fails
  const fallbackGuides = [
    {
      id: 1,
      title: 'How to Replace an iPhone Screen',
      category: 'smartphones',
      difficulty: 'Intermediate',
      duration: '45 minutes',
      thumbnail: '/images/guides/iphone-screen-repair.jpg',
      description: 'A step-by-step guide to replacing a cracked iPhone screen at home.',
      slug: 'how-to-replace-iphone-screen'
    },
    {
      id: 2,
      title: 'Laptop Battery Replacement Guide',
      category: 'laptops',
      difficulty: 'Easy',
      duration: '15 minutes',
      thumbnail: '/images/guides/laptop-battery.jpg',
      description: 'Learn how to safely replace your laptop battery and extend your device lifespan.',
      slug: 'laptop-battery-replacement'
    },
    {
      id: 3,
      title: 'Fix Washing Machine Not Draining',
      category: 'appliances',
      difficulty: 'Intermediate',
      duration: '60 minutes',
      thumbnail: '/images/guides/washing-machine.jpg',
      description: 'Troubleshoot and fix common issues with washing machines not draining properly.',
      slug: 'fix-washing-machine-not-draining'
    },
    {
      id: 4,
      title: 'Samsung Galaxy Screen Replacement',
      category: 'smartphones',
      difficulty: 'Advanced',
      duration: '60 minutes',
      thumbnail: '/images/guides/samsung-screen.jpg',
      description: 'Complete guide to replacing a damaged screen on Samsung Galaxy devices.',
      slug: 'samsung-galaxy-screen-replacement'
    },
    {
      id: 5,
      title: 'How to Clean a Desktop PC',
      category: 'computers',
      difficulty: 'Easy',
      duration: '30 minutes',
      thumbnail: '/images/guides/clean-pc.jpg',
      description: 'Learn how to properly clean your desktop PC to improve performance and reduce overheating.',
      slug: 'clean-desktop-pc'
    },
    {
      id: 6,
      title: 'Refrigerator Not Cooling Repair',
      category: 'appliances',
      difficulty: 'Intermediate',
      duration: '45 minutes',
      thumbnail: '/images/guides/refrigerator.jpg',
      description: 'Diagnose and fix common cooling issues with your refrigerator.',
      slug: 'refrigerator-not-cooling'
    },
    {
      id: 7,
      title: 'Replace MacBook Pro Keyboard',
      category: 'laptops',
      difficulty: 'Advanced',
      duration: '90 minutes',
      thumbnail: '/images/guides/macbook-keyboard.jpg',
      description: 'Complete disassembly and replacement guide for MacBook Pro keyboards.',
      slug: 'replace-macbook-pro-keyboard'
    },
    {
      id: 8,
      title: 'Fix Smart TV Connection Issues',
      category: 'tvs',
      difficulty: 'Easy',
      duration: '20 minutes',
      thumbnail: '/images/guides/smart-tv.jpg',
      description: 'Troubleshoot and fix common WiFi and connectivity issues with Smart TVs.',
      slug: 'fix-smart-tv-connection'
    }
  ];

  // Set fallback categories if API fails
  useEffect(() => {
    if (guides.length === 0 && !loading) {
      setGuides(fallbackGuides);
      const uniqueCategories = [...new Set(fallbackGuides.map(guide => guide.category))];
      setCategories(uniqueCategories);
    }
  }, [guides, loading]);

  // Filter guides based on category and search term
  const filteredGuides = guides.filter(guide => {
    // Filter by category
    const categoryMatch = activeCategory === 'all' || guide.category === activeCategory;
    
    // Filter by search term
    const searchMatch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return categoryMatch && searchMatch;
  });

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'guide-difficulty-easy';
      case 'intermediate': return 'guide-difficulty-intermediate';
      case 'advanced': return 'guide-difficulty-advanced';
      default: return '';
    }
  };

  return (
    <div className="diy-guides-page">
      <div className="page-banner">
        <div className="container">
          <h1>DIY Repair Guides</h1>
          <Breadcrumb items={[
            { label: 'Home', path: '/' },
            { label: 'DIY Guides', path: '/diy-guides' }
          ]} />
        </div>
      </div>

      <div className="container section-padding">
        <div className="section-intro">
          <h2>Do-It-Yourself Repair Guides</h2>
          <p>Our detailed step-by-step guides will help you fix common issues with your devices and appliances. Save money and learn new skills!</p>
        </div>
        
        <div className="guides-tools">
          <div className="guides-search">
            <input 
              type="text" 
              placeholder="Search guides..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn">
              <i className="material-icons">search</i>
            </button>
          </div>
          
          <div className="guides-filter">
            <button 
              className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              All
            </button>
            {categories.map((category, index) => (
              <button 
                key={index} 
                className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading guides...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <i className="material-icons">error</i>
            <p>{error}</p>
          </div>
        ) : filteredGuides.length === 0 ? (
          <div className="no-results">
            <i className="material-icons">search_off</i>
            <h3>No guides found</h3>
            <p>Try changing your search terms or filters</p>
          </div>
        ) : (
          <div className="guides-grid">
            {filteredGuides.map((guide) => (
              <div className="guide-card" key={guide.id}>
                <div className="guide-image">
                  <img 
                    src={guide.thumbnail || `https://via.placeholder.com/300x200?text=${guide.title}`} 
                    alt={guide.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/300x200?text=DIY+Guide`;
                    }}
                  />
                  <div className="guide-category">{guide.category}</div>
                </div>
                <div className="guide-content">
                  <h3>{guide.title}</h3>
                  <p>{guide.description}</p>
                  <div className="guide-meta">
                    <div className={`guide-difficulty ${getDifficultyColor(guide.difficulty)}`}>
                      <i className="material-icons">build</i>
                      <span>{guide.difficulty}</span>
                    </div>
                    <div className="guide-duration">
                      <i className="material-icons">schedule</i>
                      <span>{guide.duration}</span>
                    </div>
                  </div>
                  <Link to={`/diy-guides/${guide.slug}`} className="btn btn-primary">
                    View Guide
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="guides-cta">
          <div className="cta-content">
            <h3>Need Professional Help?</h3>
            <p>If you prefer to leave repairs to the experts, our professional technicians are ready to help.</p>
            <Link to="/book-service" className="btn btn-secondary">Book a Repair</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiyGuidesPage; 