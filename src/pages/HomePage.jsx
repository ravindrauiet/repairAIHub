import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import services from '../data/services';
import products from '../data/products';
import { getBrandsByCategory } from '../data/products';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import SEO from '../components/common/SEO';
import { generateOrganizationSchema, generateLocalBusinessSchema } from '../utils/schemaGenerator';
import '../styles/homePage.css';

const HomePage = () => {
  const [popularBrands, setPopularBrands] = useState([]);
  const [popularModels, setPopularModels] = useState([]);
  const [serviceAreas, setServiceAreas] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [diyVideos, setDiyVideos] = useState([]);
  
  // Create schemas for structured data
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const combinedSchema = [organizationSchema, localBusinessSchema];
  
  // Refs for sliders
  const servicesSliderRef = useRef(null);
  const brandsSliderRef = useRef(null);
  const modelsSliderRef = useRef(null);
  const techniciansSliderRef = useRef(null);
  const videosSliderRef = useRef(null);

  // Slider navigation functions
  const scrollSlider = (sliderRef, direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' 
        ? -sliderRef.current.offsetWidth * 0.8 
        : sliderRef.current.offsetWidth * 0.8;
      
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Load popular brands
    const loadPopularBrands = async () => {
      // Get unique brands from multiple categories
      const mobileBrands = await getBrandsByCategory('mobile');
      const laptopBrands = await getBrandsByCategory('laptop');
      const tvBrands = await getBrandsByCategory('tv');
      
      // Combine and filter for top brands
      const allBrands = [...mobileBrands, ...laptopBrands, ...tvBrands];
      const uniqueBrands = allBrands.filter((brand, index, self) =>
        index === self.findIndex((b) => b.id === brand.id)
      ).slice(0, 8); // Get top 8 brands
      
      setPopularBrands(uniqueBrands);
    };
    
    // Load popular models
    const loadPopularModels = () => {
      // Get popular models across categories
      const allDeviceModels = products.deviceModels;
      const popularModelsList = [
        // Mobile phones
        { id: 'iphone-13', name: 'iPhone 13', category: 'mobile', brand: 'Apple', image: '/images/models/iphone13.jpg' },
        { id: 'samsung-s21', name: 'Samsung S21', category: 'mobile', brand: 'Samsung', image: '/images/models/samsungs21.jpg' },
        // Laptops
        { id: 'macbook-pro', name: 'MacBook Pro', category: 'laptop', brand: 'Apple', image: '/images/models/macbookpro.jpg' },
        { id: 'hp-spectre', name: 'HP Spectre', category: 'laptop', brand: 'HP', image: '/images/models/hpspectre.jpg' },
        // TVs
        { id: 'samsung-qled', name: 'Samsung QLED', category: 'tv', brand: 'Samsung', image: '/images/models/samsungqled.jpg' },
        { id: 'lg-oled', name: 'LG OLED', category: 'tv', brand: 'LG', image: '/images/models/lgoled.jpg' },
      ];
      
      setPopularModels(popularModelsList);
    };
    
    // Load service areas
    const loadServiceAreas = () => {
      const areas = [
        { id: 'mumbai', name: 'Mumbai', count: 240 },
        { id: 'delhi', name: 'Delhi', count: 320 },
        { id: 'bangalore', name: 'Bangalore', count: 280 },
        { id: 'hyderabad', name: 'Hyderabad', count: 210 },
        { id: 'chennai', name: 'Chennai', count: 190 },
        { id: 'kolkata', name: 'Kolkata', count: 170 },
        { id: 'pune', name: 'Pune', count: 150 },
        { id: 'ahmedabad', name: 'Ahmedabad', count: 130 },
      ];
      
      setServiceAreas(areas);
    };
    
    // Load technicians
    const loadTechnicians = () => {
      const techniciansList = [
        { id: 'tech1', name: 'Rajesh Kumar', specialty: 'Mobile Repair', experience: '8+ years', rating: 4.9, image: '/images/technicians/tech1.jpg' },
        { id: 'tech2', name: 'Amit Singh', specialty: 'Laptop Repair', experience: '6+ years', rating: 4.8, image: '/images/technicians/tech2.jpg' },
        { id: 'tech3', name: 'Priya Sharma', specialty: 'TV Repair', experience: '5+ years', rating: 4.7, image: '/images/technicians/tech3.jpg' },
        { id: 'tech4', name: 'Suresh Patel', specialty: 'AC Repair', experience: '7+ years', rating: 4.9, image: '/images/technicians/tech4.jpg' },
      ];
      
      setTechnicians(techniciansList);
    };
    
    // Load DIY repair videos
    const loadDIYVideos = () => {
      const videosList = [
        { id: 'diy1', title: 'How to Replace iPhone Screen', model: 'iPhone 11/12/13', duration: '8:24', views: '124K', thumbnail: '/images/diy/iphone-screen.jpg' },
        { id: 'diy2', title: 'Samsung TV No Display Fix', model: 'Samsung QLED/LED', duration: '12:05', views: '98K', thumbnail: '/images/diy/samsung-tv.jpg' },
        { id: 'diy3', title: 'Laptop Battery Replacement Guide', model: 'HP/Dell/Lenovo', duration: '9:17', views: '76K', thumbnail: '/images/diy/laptop-battery.jpg' },
        { id: 'diy4', title: 'AC Not Cooling Troubleshooting', model: 'All AC Models', duration: '15:32', views: '108K', thumbnail: '/images/diy/ac-repair.jpg' },
      ];
      
      setDiyVideos(videosList);
    };
    
    // Load all data
    loadPopularBrands();
    loadPopularModels();
    loadServiceAreas();
    loadTechnicians();
    loadDIYVideos();
  }, []);

  return (
    <div className="home-page">
      <SEO 
        title="Professional Repair Services - TV, Mobile, AC & More"
        description="CallMiBro - Professional repair services for TV, mobile, AC, refrigerator, washing machine, and water purifier. Expert technicians, genuine parts, and warranty on all repairs."
        keywords="repair services, TV repair, mobile repair, AC repair, refrigerator repair, washing machine repair, water purifier repair, home appliance repair"
        canonicalUrl="/"
        schema={combinedSchema}
      />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Services Categories Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Repair Services</h2>
            <p>Professional repair services for all your devices</p>
          </div>
          
          <div className="slider-container">
            <div className="slider-navigation">
              <button 
                className="slider-arrow slider-arrow-left" 
                onClick={() => scrollSlider(servicesSliderRef, 'left')}
              >
                <span className="material-icons">chevron_left</span>
              </button>
              <button 
                className="slider-arrow slider-arrow-right" 
                onClick={() => scrollSlider(servicesSliderRef, 'right')}
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
            
            <div className="slider-wrapper">
              <div className="slider-content" ref={servicesSliderRef}>
                {services.map(service => (
                  <div className="slider-item" key={service.id}>
                    <ServiceCard service={service} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Popular Brands Section */}
      <section className="brands-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Brands We Support</h2>
            <p>We offer repair services for all major brands</p>
          </div>
          
          <div className="slider-container">
            <div className="slider-navigation">
              <button 
                className="slider-arrow slider-arrow-left" 
                onClick={() => scrollSlider(brandsSliderRef, 'left')}
              >
                <span className="material-icons">chevron_left</span>
              </button>
              <button 
                className="slider-arrow slider-arrow-right" 
                onClick={() => scrollSlider(brandsSliderRef, 'right')}
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
            
            <div className="slider-wrapper">
              <div className="slider-content brands-slider" ref={brandsSliderRef}>
                {popularBrands.map(brand => (
                  <div className="slider-item brand-slider-item" key={brand.id}>
                    <div className="brand-item">
                      <div className="brand-logo">
                        <img src={`/images/brands/${brand.id}.png`} alt={brand.name} />
                      </div>
                      <div className="brand-name">{brand.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="view-more-container">
            <Link to="/brands" className="view-more-btn">View All Brands</Link>
          </div>
        </div>
      </section>
      
      {/* Popular Models Section */}
      <section className="models-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Models</h2>
            <p>Most frequently repaired devices</p>
          </div>
          
          <div className="slider-container">
            <div className="slider-navigation">
              <button 
                className="slider-arrow slider-arrow-left" 
                onClick={() => scrollSlider(modelsSliderRef, 'left')}
              >
                <span className="material-icons">chevron_left</span>
              </button>
              <button 
                className="slider-arrow slider-arrow-right" 
                onClick={() => scrollSlider(modelsSliderRef, 'right')}
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
            
            <div className="slider-wrapper">
              <div className="slider-content" ref={modelsSliderRef}>
                {popularModels.map(model => (
                  <div className="slider-item" key={model.id}>
                    <div className="model-card">
                      <div className="model-image">
                        <img src={model.image} alt={model.name} />
                      </div>
                      <div className="model-info">
                        <h3>{model.name}</h3>
                        <p className="model-brand">{model.brand}</p>
                        <Link to={`/services/${model.category}-repair/${model.brand.toLowerCase()}/${model.id}`} className="repair-link">
                          View Repair Options
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How Our Service Works</h2>
            <p>Quick and easy steps to get your device repaired</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-icon">
                <span className="material-icons">smartphone</span>
              </div>
              <h3>Book a Service</h3>
              <p>Choose your device and tell us what's wrong</p>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <span className="material-icons">engineering</span>
              </div>
              <h3>Expert Diagnosis</h3>
              <p>Our technician will diagnose the issue</p>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <span className="material-icons">build</span>
              </div>
              <h3>Quick Repair</h3>
              <p>We'll repair your device with quality parts</p>
            </div>
            
            <div className="step">
              <div className="step-icon">
                <span className="material-icons">check_circle</span>
              </div>
              <h3>Return & Warranty</h3>
              <p>Get your device back with warranty</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Service Areas Section */}
      <section className="service-areas-section">
        <div className="container">
          <div className="section-header">
            <h2>Areas We Serve</h2>
            <p>Available in major cities across India</p>
          </div>
          
          <div className="areas-grid">
            {serviceAreas.map(area => (
              <div className="area-card" key={area.id}>
                <h3>{area.name}</h3>
                <p>{area.count}+ Technicians</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Expert Technicians Section */}
      <section className="technicians-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Expert Technicians</h2>
            <p>Skilled professionals to fix your devices</p>
          </div>
          
          <div className="slider-container">
            <div className="slider-navigation">
              <button 
                className="slider-arrow slider-arrow-left" 
                onClick={() => scrollSlider(techniciansSliderRef, 'left')}
              >
                <span className="material-icons">chevron_left</span>
              </button>
              <button 
                className="slider-arrow slider-arrow-right" 
                onClick={() => scrollSlider(techniciansSliderRef, 'right')}
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
            
            <div className="slider-wrapper">
              <div className="slider-content" ref={techniciansSliderRef}>
                {technicians.map(tech => (
                  <div className="slider-item" key={tech.id}>
                    <div className="technician-card">
                      {/* <div className="technician-image">
                        <img src={tech.image} alt={tech.name} />
                      </div> */}
                      <div className="technician-info">
                        <h3>{tech.name}</h3>
                        <p className="specialty">{tech.specialty}</p>
                        <p className="experience">{tech.experience} Experience</p>
                        <div className="rating">
                          ★ {tech.rating} Rating
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* DIY Repair Videos Section */}
      <section className="diy-videos-section">
        <div className="container">
          <div className="section-header">
            <h2>DIY Repair Guides</h2>
            <p>Learn how to fix minor issues yourself</p>
          </div>
          
          <div className="slider-container">
            <div className="slider-navigation">
              <button 
                className="slider-arrow slider-arrow-left" 
                onClick={() => scrollSlider(videosSliderRef, 'left')}
              >
                <span className="material-icons">chevron_left</span>
              </button>
              <button 
                className="slider-arrow slider-arrow-right" 
                onClick={() => scrollSlider(videosSliderRef, 'right')}
              >
                <span className="material-icons">chevron_right</span>
              </button>
            </div>
            
            <div className="slider-wrapper">
              <div className="slider-content" ref={videosSliderRef}>
                {diyVideos.map(video => (
                  <div className="slider-item" key={video.id}>
                    <div className="video-card">
                      <div className="video-thumbnail">
                        <img src={video.thumbnail} alt={video.title} />
                        <span className="duration">{video.duration}</span>
                      </div>
                      <div className="video-info">
                        <h3>{video.title}</h3>
                        <p className="model">{video.model}</p>
                        <p className="views">{video.views} views</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="view-more-container">
            <Link to="/diy-guides" className="view-more-btn">View All Guides</Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>What Our Customers Say</h2>
            <p>Trusted by thousands of satisfied customers</p>
          </div>
          
          <div className="testimonials-slider">
            <div className="testimonial">
              <div className="quote">
                "My iPhone was repaired in just 2 hours. The service was excellent and very professional."
              </div>
              <div className="customer">
                <div className="customer-info">
                  <h4>Priya Mehta</h4>
                  <div className="rating">★★★★★</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="quote">
                "They fixed my laptop when others couldn't. Very knowledgeable technicians and reasonable prices."
              </div>
              <div className="customer">
                <div className="customer-info">
                  <h4>Rahul Sharma</h4>
                  <div className="rating">★★★★★</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="quote">
                "Quick service, transparent pricing, and great customer support. Highly recommended!"
              </div>
              <div className="customer">
                <div className="customer-info">
                  <h4>Anjali Patel</h4>
                  <div className="rating">★★★★★</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call To Action Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Need Your Device Fixed?</h2>
            <p>Book a repair service today and get back to using your device</p>
            <Link to="/services" className="cta-button">Book a Repair</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;