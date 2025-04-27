import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords, 
  canonicalUrl, 
  ogType = 'website', 
  ogImage = '/images/logo.png',
  twitterCard = 'summary_large_image',
  schema = null
}) => {
  // Generate full canonical URL
  const baseUrl = 'https://www.callmibro.com';
  const fullCanonicalUrl = canonicalUrl ? `${baseUrl}${canonicalUrl}` : null;
  
  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title ? `${title} | CallMiBro` : 'CallMiBro - Professional Repair Services'}</title>
      <meta name="description" content={description || 'CallMiBro - Your trusted partner for all repair services including electronics, home appliances, and more. Book expert technicians for fast and reliable repairs.'} />
      {keywords && <meta name="keywords" content={keywords} />}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title ? `${title} | CallMiBro` : 'CallMiBro - Professional Repair Services'} />
      <meta property="og:description" content={description || 'CallMiBro - Your trusted partner for all repair services including electronics, home appliances, and more. Book expert technicians for fast and reliable repairs.'} />
      <meta property="og:type" content={ogType} />
      {fullCanonicalUrl && <meta property="og:url" content={fullCanonicalUrl} />}
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:site_name" content="CallMiBro" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title ? `${title} | CallMiBro` : 'CallMiBro - Professional Repair Services'} />
      <meta name="twitter:description" content={description || 'CallMiBro - Your trusted partner for all repair services including electronics, home appliances, and more. Book expert technicians for fast and reliable repairs.'} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      
      {/* Add structured data schema if provided */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO; 