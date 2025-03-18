import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ title, subtitle, backgroundImage, ctaText, ctaLink }) => {
  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };
  
  return (
    <div className="hero" style={heroStyle}>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">{title}</h1>
          {subtitle && <p className="hero-subtitle">{subtitle}</p>}
          
          {ctaText && ctaLink && (
            <Link to={ctaLink} className="hero-cta">
              {ctaText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero; 