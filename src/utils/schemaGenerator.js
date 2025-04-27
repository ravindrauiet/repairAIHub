/**
 * Generates Organization Schema for JSON-LD structured data
 * @returns {Object} Organization schema object
 */
export const generateOrganizationSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'CallMiBro',
    'url': 'https://www.callmibro.com',
    'logo': 'https://www.callmibro.com/logo.png',
    'sameAs': [
      'https://www.facebook.com/callmibro',
      'https://twitter.com/callmibro',
      'https://www.linkedin.com/company/callmibro',
      'https://www.instagram.com/callmibro'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+1-800-123-4567',
      'contactType': 'customer service',
      'areaServed': 'Worldwide',
      'availableLanguage': ['English', 'Hindi']
    },
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '123 Repair Street',
      'addressLocality': 'Mumbai',
      'postalCode': '400001',
      'addressCountry': 'IN'
    }
  };
};

/**
 * Generates LocalBusiness Schema for JSON-LD structured data
 * @returns {Object} LocalBusiness schema object
 */
export const generateLocalBusinessSchema = () => {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://www.callmibro.com',
    'name': 'CallMiBro Repair Services',
    'image': 'https://www.callmibro.com/images/storefront.jpg',
    'url': 'https://www.callmibro.com',
    'telephone': '+1-800-123-4567',
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '123 Repair Street',
      'addressLocality': 'Mumbai',
      'postalCode': '400001',
      'addressCountry': 'IN'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '19.0760',
      'longitude': '72.8777'
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        'opens': '09:00',
        'closes': '18:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Saturday'],
        'opens': '10:00',
        'closes': '17:00'
      }
    ],
    'sameAs': [
      'https://www.facebook.com/callmibro',
      'https://twitter.com/callmibro',
      'https://www.linkedin.com/company/callmibro',
      'https://www.instagram.com/callmibro'
    ]
  };
};

/**
 * Generates Service Schema for JSON-LD structured data
 * @param {Object} service - The service object
 * @returns {Object} Service schema object
 */
export const generateServiceSchema = (service) => {
  if (!service) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': service.title,
    'description': service.description || service.shortDescription,
    'provider': {
      '@type': 'Organization',
      'name': 'CallMiBro',
      'url': 'https://www.callmibro.com'
    },
    'serviceType': service.category || 'Repair Service',
    'areaServed': 'Worldwide',
    'audience': {
      '@type': 'Audience',
      'audienceType': 'Consumers'
    },
    'offers': {
      '@type': 'Offer',
      'price': service.pricingPlans?.[0]?.price?.slice(1) || '99',
      'priceCurrency': 'INR'
    }
  };
};

/**
 * Generates Product Schema for JSON-LD structured data
 * @param {Object} product - The product object
 * @returns {Object} Product schema object
 */
export const generateProductSchema = (product) => {
  if (!product) return null;
  
  // Handle different price formats
  let price = '0';
  if (product.price) {
    if (typeof product.price === 'string') {
      price = product.price.replace(/[^\d.]/g, '');
    } else if (typeof product.price === 'object') {
      const firstPrice = Object.values(product.price)[0];
      price = firstPrice.replace(/[^\d.]/g, '');
    }
  }
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.title,
    'image': product.image,
    'description': product.description,
    'brand': {
      '@type': 'Brand',
      'name': product.brand || 'CallMiBro'
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://www.callmibro.com/products/${product.id}`,
      'priceCurrency': 'INR',
      'price': price,
      'availability': 'https://schema.org/InStock'
    },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': product.rating || '4.5',
      'reviewCount': product.reviewCount || '10'
    }
  };
};

/**
 * Generates FAQ Schema for JSON-LD structured data
 * @param {Array} faqs - Array of FAQ objects with questions and answers
 * @returns {Object} FAQ schema object
 */
export const generateFAQSchema = (faqs) => {
  if (!faqs || !faqs.length) return null;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer
      }
    }))
  };
}; 