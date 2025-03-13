import { Link } from 'react-router-dom';

const Hero = ({ 
  title = "Expert Repair Services for All Your Needs", 
  subtitle = "We fix your TVs, mobile phones, AC units, refrigerators, and RO systems with quality and care.", 
  ctaText = "Book a Service Now",
  ctaLink = "/book-service",
  backgroundImage = "/images/hero-bg.jpg"
}) => {
  
  const heroStyle = {
    background: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };
  
  return (
    <div className="hero" style={heroStyle}>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>
          <Link to={ctaLink} className="hero-cta">
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero; 