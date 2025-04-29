import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/homePage.css';
import SEO from '../components/common/SEO';
import Hero from '../components/Hero';
import { generateOrganizationSchema, generateLocalBusinessSchema } from '../utils/schemaGenerator';
import BannerRow from '../components/home/BannerRow';
import NewAndNoteworthy from '../components/home/NewAndNoteworthy';
import MostBookedServices from '../components/home/MostBookedServices';
import CategorySection from '../components/home/CategorySection';

// Placeholder data for demo
const banners = [
  {
    title: 'Deep clean with foam-jet AC service',
    subtitle: 'AC service & repair',
    cta: 'Book now',
    image: '/images/banner-ac.jpg',
    link: '/services/ac-repair',
  },
  {
    title: 'Transform your space with wall panels',
    subtitle: 'Starts at ₹9,999 only',
    cta: 'Book now',
    image: '/images/banner-wallpanel.jpg',
    link: '/services/wall-panels',
  },
  {
    title: 'Camera. Doorbell connect. All in one.',
    cta: 'Buy now',
    image: '/images/banner-doorbell.jpg',
    link: '/products/smart-locks',
  },
];

const noteworthy = [
  { title: 'Insta Help', image: '/images/noteworthy-instahelp.jpg', tag: 'NEW' },
  { title: 'Wall Panels', image: '/images/noteworthy-wallpanel.jpg' },
  { title: 'Native Water Purifier', image: '/images/noteworthy-water.jpg' },
  { title: 'Native Smart Locks', image: '/images/noteworthy-lock.jpg' },
  { title: 'Kitchen Cleaning', image: '/images/noteworthy-kitchen.jpg' },
];

const mostBooked = [
  { title: 'Foam-jet AC service', rating: 4.79, reviews: '1.4M', price: '₹599', image: '/images/mostbooked-ac.jpg' },
  { title: 'At-home consultation', rating: 4.80, reviews: '3K', price: '₹49', image: '/images/mostbooked-consult.jpg' },
  { title: 'Pest control (includes utensil removal)', rating: 4.79, reviews: '104K', price: '₹1,098', image: '/images/mostbooked-pest.jpg' },
  { title: 'Apartment pest control (includes utensil removal)', rating: 4.80, reviews: '34K', price: '₹1,498', image: '/images/mostbooked-apartmentpest.jpg' },
  { title: 'Apartment termite control', rating: 4.83, reviews: '15K', price: '₹3,999', image: '/images/mostbooked-termite.jpg' },
];

const cleaning = [
  { title: 'Full Home Cleaning', image: '/images/cleaning-home.jpg' },
  { title: 'Sofa & Carpet Cleaning', image: '/images/cleaning-sofa.jpg' },
  { title: 'Cockroach, Ant & General Pest Control', image: '/images/cleaning-pest.jpg' },
  { title: 'Bathroom Cleaning', image: '/images/cleaning-bathroom.jpg' },
  { title: 'Kitchen Cleaning', image: '/images/cleaning-kitchen.jpg' },
];

const appliance = [
  { title: 'AC Service & Repair', image: '/images/appliance-ac.jpg' },
  { title: 'Washing Machine', image: '/images/appliance-wm.jpg' },
  { title: 'Television', image: '/images/appliance-tv.jpg' },
  { title: 'Laptop', image: '/images/appliance-laptop.jpg' },
  { title: 'Geyser', image: '/images/appliance-geyser.jpg' },
];

const homeRepair = [
  { title: 'Drill & hang (wall decor)', rating: 4.87, reviews: '10.6K', price: '₹129', image: '/images/repair-drill.jpg' },
  { title: 'Cupboard hinge installation', rating: 4.84, reviews: '6K', price: '₹199', image: '/images/repair-hinge.jpg' },
  { title: 'Door lock repair', rating: 4.85, reviews: '440', price: '₹259', image: '/images/repair-lock.jpg' },
  { title: 'Fan repair (ceiling/exhaust/wall)', rating: 4.82, reviews: '1.1K', price: '₹199', image: '/images/repair-fan.jpg' },
  { title: 'Switch/socket replacement', rating: 4.86, reviews: '610', price: '₹109', image: '/images/repair-switch.jpg' },
];

const SectionHeader = ({ title, right, children }) => (
  <div className="section-header-row">
    <h2>{title}</h2>
    {right && <div>{right}</div>}
    {children}
  </div>
);

const HorizontalScroll = ({ children }) => (
  <div className="horizontal-scroll">{children}</div>
);

const HomePage = () => {
  // For SEO structured data
  const organizationSchema = generateOrganizationSchema();
  const localBusinessSchema = generateLocalBusinessSchema();
  const combinedSchema = [organizationSchema, localBusinessSchema];

  return (
    <div className="home-page">
      <SEO 
        title="Professional Repair Services - TV, Mobile, AC & More"
        description="CallMiBro - Professional repair services for TV, mobile, AC, refrigerator, washing machine, and water purifier. Expert technicians, genuine parts, and warranty on all repairs."
        keywords="repair services, TV repair, mobile repair, AC repair, refrigerator repair, washing machine repair, water purifier repair, home appliance repair"
        canonicalUrl="/"
        schema={combinedSchema}
      />
      <Hero />
      <BannerRow />
      <NewAndNoteworthy />
      <MostBookedServices />
      <CategorySection title="Cleaning & pest control" items={cleaning} seeAllLink="/services/cleaning" />
      <CategorySection title="Appliance Service & Repair" items={appliance} seeAllLink="/services/appliance" />
      <CategorySection title="Home repair & installation" items={homeRepair} cardType="service" seeAllLink="/services/repair" />

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
            {/* Example static data, replace with dynamic if needed */}
            {[
              { id: 'mumbai', name: 'Mumbai', count: 240 },
              { id: 'delhi', name: 'Delhi', count: 320 },
              { id: 'bangalore', name: 'Bangalore', count: 280 },
              { id: 'hyderabad', name: 'Hyderabad', count: 210 },
              { id: 'chennai', name: 'Chennai', count: 190 },
              { id: 'kolkata', name: 'Kolkata', count: 170 },
              { id: 'pune', name: 'Pune', count: 150 },
              { id: 'ahmedabad', name: 'Ahmedabad', count: 130 },
            ].map(area => (
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
            <div className="slider-wrapper">
              <div className="slider-content">
                {/* Example static data, replace with dynamic if needed */}
                {[
                  { id: 'tech1', name: 'Rajesh Kumar', specialty: 'Mobile Repair', experience: '8+ years', rating: 4.9 },
                  { id: 'tech2', name: 'Amit Singh', specialty: 'Laptop Repair', experience: '6+ years', rating: 4.8 },
                  { id: 'tech3', name: 'Priya Sharma', specialty: 'TV Repair', experience: '5+ years', rating: 4.7 },
                  { id: 'tech4', name: 'Suresh Patel', specialty: 'AC Repair', experience: '7+ years', rating: 4.9 },
                ].map(tech => (
                  <div className="slider-item" key={tech.id}>
                    <div className="technician-card">
                      <div className="technician-info">
                        <h3>{tech.name}</h3>
                        <p className="specialty">{tech.specialty}</p>
                        <p className="experience">{tech.experience} Experience</p>
                        <div className="rating">★ {tech.rating} Rating</div>
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
            <div className="slider-wrapper">
              <div className="slider-content">
                {/* Example static data, replace with dynamic if needed */}
                {[
                  { id: 'diy1', title: 'How to Replace iPhone Screen', model: 'iPhone 11/12/13', duration: '8:24', views: '124K', thumbnail: '/images/diy/iphone-screen.jpg' },
                  { id: 'diy2', title: 'Samsung TV No Display Fix', model: 'Samsung QLED/LED', duration: '12:05', views: '98K', thumbnail: '/images/diy/samsung-tv.jpg' },
                  { id: 'diy3', title: 'Laptop Battery Replacement Guide', model: 'HP/Dell/Lenovo', duration: '9:17', views: '76K', thumbnail: '/images/diy/laptop-battery.jpg' },
                  { id: 'diy4', title: 'AC Not Cooling Troubleshooting', model: 'All AC Models', duration: '15:32', views: '108K', thumbnail: '/images/diy/ac-repair.jpg' },
                ].map(video => (
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