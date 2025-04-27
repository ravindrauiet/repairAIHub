// Sitemap generator script
// Run this script during the build process to generate a dynamic sitemap.xml
// Usage: node src/scripts/generateSitemap.js

const fs = require('fs');
const path = require('path');

// Import service and product data
// Note: This is a simplified version. For a real implementation, you might need 
// to adjust imports depending on how your data is structured
let services = [];
let products = [];

try {
  services = require('../data/services').default;
  products = require('../data/products').default.products;
} catch (error) {
  console.error('Warning: Unable to import services or products data. Using empty arrays instead.');
  console.error(error);
}

// Base URL for the website
const baseUrl = 'https://www.callmibro.com';

// Static routes with priorities and change frequencies
const staticRoutes = [
  { url: '/', changefreq: 'weekly', priority: 1.0 },
  { url: '/services', changefreq: 'weekly', priority: 0.9 },
  { url: '/products', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  { url: '/technicians', changefreq: 'weekly', priority: 0.7 },
  { url: '/careers', changefreq: 'monthly', priority: 0.6 },
  { url: '/book-service', changefreq: 'monthly', priority: 0.8 },
  { url: '/brands', changefreq: 'monthly', priority: 0.7 },
  { url: '/diy-guides', changefreq: 'weekly', priority: 0.7 },
  { url: '/login', changefreq: 'yearly', priority: 0.5 },
  { url: '/signup', changefreq: 'yearly', priority: 0.5 },
];

// Service category routes
const serviceCategories = [
  'mobile-repair',
  'tv-repair',
  'laptop-repair',
  'ac-repair',
  'refrigerator-repair',
  'washing-machine-repair',
  'water-purifier-repair',
];

const categoryRoutes = serviceCategories.map(category => ({
  url: `/services/category/${category}`,
  changefreq: 'weekly',
  priority: 0.8
}));

// Dynamic routes for services
const serviceRoutes = Array.isArray(services) ? services.map(service => ({
  url: `/services/${service.id}`,
  changefreq: 'weekly',
  priority: 0.7
})) : [];

// Dynamic routes for products
const productRoutes = Array.isArray(products) ? products.map(product => ({
  url: `/products/${product.id}`,
  changefreq: 'weekly',
  priority: 0.7
})) : [];

// Combine all routes
const allRoutes = [
  ...staticRoutes,
  ...categoryRoutes,
  ...serviceRoutes,
  ...productRoutes
];

// Generate XML sitemap
const generateSitemap = () => {
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  allRoutes.forEach(route => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${route.url}</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += `    <changefreq>${route.changefreq}</changefreq>\n`;
    sitemap += `    <priority>${route.priority}</priority>\n`;
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  
  return sitemap;
};

// Write sitemap to file
const writeSitemap = () => {
  const sitemap = generateSitemap();
  const outputPath = path.resolve(__dirname, '../../public/sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap);
  console.log(`Sitemap generated at: ${outputPath}`);
};

// Execute the script
writeSitemap(); 