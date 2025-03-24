// Define product categories
export const productCategories = [
  { id: 'tv', name: 'TV/LED', icon: 'fa-tv' },
  { id: 'mobile', name: 'Mobile Phones', icon: 'fa-mobile-alt' },
  { id: 'ac', name: 'ACs', icon: 'fa-wind' },
  { id: 'refrigerator', name: 'Refrigerators', icon: 'fa-snowflake' },
  { id: 'washing-machine', name: 'Washing Machines', icon: 'fa-tshirt' },
  { id: 'laptop', name: 'Laptops', icon: 'fa-laptop' },
  { id: 'desktop', name: 'Desktops', icon: 'fa-desktop' },
  { id: 'printer', name: 'Printers', icon: 'fa-print' },
  { id: 'microwave', name: 'Microwaves', icon: 'fa-radiation' },
  { id: 'water-purifier', name: 'Water Purifiers', icon: 'fa-tint' },
  { id: 'geyser', name: 'Geysers', icon: 'fa-hot-tub' }
];

// Define brands for product filters
export const brands = [
  // TV Brands
  { id: 'samsung', name: 'Samsung', categories: ['tv', 'mobile', 'refrigerator', 'ac', 'washing-machine', 'microwave'] },
  { id: 'lg', name: 'LG', categories: ['tv', 'refrigerator', 'ac', 'washing-machine', 'microwave'] },
  { id: 'sony', name: 'Sony', categories: ['tv', 'mobile'] },
  { id: 'mi', name: 'Mi', categories: ['tv', 'mobile'] },
  { id: 'oneplus', name: 'OnePlus', categories: ['tv', 'mobile'] },
  { id: 'vu', name: 'Vu', categories: ['tv'] },
  { id: 'tcl', name: 'TCL', categories: ['tv', 'ac'] },
  
  // Mobile Brands
  { id: 'apple', name: 'Apple', categories: ['mobile', 'laptop'] },
  { id: 'nokia', name: 'Nokia', categories: ['mobile'] },
  { id: 'oppo', name: 'Oppo', categories: ['mobile'] },
  { id: 'vivo', name: 'Vivo', categories: ['mobile'] },
  { id: 'realme', name: 'Realme', categories: ['mobile'] },
  { id: 'motorola', name: 'Motorola', categories: ['mobile'] },
  
  // AC Brands
  { id: 'daikin', name: 'Daikin', categories: ['ac'] },
  { id: 'hitachi', name: 'Hitachi', categories: ['ac', 'refrigerator'] },
  { id: 'voltas', name: 'Voltas', categories: ['ac'] },
  { id: 'carrier', name: 'Carrier', categories: ['ac'] },
  { id: 'bluestar', name: 'Blue Star', categories: ['ac'] },
  
  // Refrigerator Brands
  { id: 'whirlpool', name: 'Whirlpool', categories: ['refrigerator', 'washing-machine', 'microwave'] },
  { id: 'godrej', name: 'Godrej', categories: ['refrigerator'] },
  { id: 'haier', name: 'Haier', categories: ['refrigerator', 'washing-machine', 'ac'] },
  
  // Washing Machine Brands
  { id: 'bosch', name: 'Bosch', categories: ['washing-machine'] },
  { id: 'ifb', name: 'IFB', categories: ['washing-machine', 'microwave'] },
  
  // Laptop Brands
  { id: 'hp', name: 'HP', categories: ['laptop', 'desktop', 'printer'] },
  { id: 'dell', name: 'Dell', categories: ['laptop', 'desktop'] },
  { id: 'lenovo', name: 'Lenovo', categories: ['laptop', 'desktop'] },
  { id: 'asus', name: 'Asus', categories: ['laptop'] },
  { id: 'acer', name: 'Acer', categories: ['laptop', 'desktop'] },
  
  // Water Purifier Brands
  { id: 'kent', name: 'Kent', categories: ['water-purifier'] },
  { id: 'pureit', name: 'Pureit', categories: ['water-purifier'] },
  { id: 'aquaguard', name: 'Aquaguard', categories: ['water-purifier'] },
  
  // Geyser Brands
  { id: 'bajaj', name: 'Bajaj', categories: ['geyser'] },
  { id: 'racold', name: 'Racold', categories: ['geyser'] },
  { id: 'venus', name: 'Venus', categories: ['geyser'] },
  
  // Printer Brands
  { id: 'canon', name: 'Canon', categories: ['printer'] },
  { id: 'epson', name: 'Epson', categories: ['printer'] },
  { id: 'brother', name: 'Brother', categories: ['printer'] }
];

// Define repair product data
const products = [
  // TV/LED Repair Products
  {
    id: 'tv-screen-replacement',
    category: 'tv',
    title: 'TV/LED Screen Replacement',
    description: 'Replace cracked or damaged TV/LED screens with high-quality panels. We support all major brands and screen sizes.',
    compatibleBrands: ['samsung', 'lg', 'sony', 'mi', 'oneplus', 'vu', 'tcl'],
    price: {
      '32inch': '₹7,000 - ₹12,000',
      '40-43inch': '₹15,000 - ₹25,000',
      '49-55inch': '₹25,000 - ₹40,000',
      '65inch-above': '₹40,000 - ₹80,000'
    },
    image: '/images/products/tv-screen.jpg',
    rating: 4.7,
    reviewCount: 148,
    features: [
      'Genuine replacement panels',
      'Excellent color reproduction',
      'Full HD, 4K & 8K options available',
      '1-year warranty on screen',
      'Expert installation'
    ],
    warranty: '1 Year',
    estimatedTime: '2-3 hours',
    inStock: true
  },
  {
    id: 'tv-power-supply',
    category: 'tv',
    title: 'TV Power Supply Board Replacement',
    description: 'Fix power-related issues including TV not turning on, random shutdowns, or standby light problems with our power supply board replacement.',
    compatibleBrands: ['samsung', 'lg', 'sony', 'mi', 'oneplus', 'vu', 'tcl'],
    price: {
      'standard': '₹3,500 - ₹7,000'
    },
    image: '/images/products/power-supply.jpg',
    rating: 4.8,
    reviewCount: 120,
    features: [
      'Resolves power-related issues',
      'Compatible with all major brands',
      'High-quality replacement parts',
      '6-month warranty',
      'Quick installation'
    ],
    warranty: '6 Months',
    estimatedTime: '1-2 hours',
    inStock: true
  },
  {
    id: 'tv-main-board',
    category: 'tv',
    title: 'TV Main Board Replacement',
    description: 'Fix issues like no picture, no sound, distorted images, or frozen screens with our main board/motherboard replacement service.',
    compatibleBrands: ['samsung', 'lg', 'sony', 'mi', 'oneplus', 'vu', 'tcl'],
    price: {
      'standard': '₹8,000 - ₹15,000'
    },
    image: '/images/products/main-board.jpg',
    rating: 4.6,
    reviewCount: 95,
    features: [
      'Original and compatible boards available',
      'Fixes most software and processing issues',
      'Restores smart TV functionality',
      'Includes software installation',
      '6-month warranty'
    ],
    warranty: '6 Months',
    estimatedTime: '1-2 hours',
    inStock: true
  },
  {
    id: 'tv-backlight',
    category: 'tv',
    title: 'TV Backlight Repair',
    description: 'Fix dark or dim screens, uneven lighting, or flickering issues with our comprehensive backlight repair service.',
    compatibleBrands: ['samsung', 'lg', 'sony', 'mi', 'oneplus', 'vu', 'tcl'],
    price: {
      'standard': '₹4,000 - ₹8,000'
    },
    image: '/images/products/backlight.jpg',
    rating: 4.5,
    reviewCount: 75,
    features: [
      'LED strip replacement',
      'Constant current board repair',
      'Fixes dark spots and shadows',
      'Improves screen brightness',
      '6-month warranty'
    ],
    warranty: '6 Months',
    estimatedTime: '2-3 hours',
    inStock: true
  },
  {
    id: 'tv-software',
    category: 'tv',
    title: 'TV Software Update/Repair',
    description: 'Fix smart TV software issues, update firmware, reset factory settings, or restore TV to optimal performance.',
    compatibleBrands: ['samsung', 'lg', 'sony', 'mi', 'oneplus', 'vu', 'tcl'],
    price: {
      'standard': '₹1,500 - ₹3,000'
    },
    image: '/images/products/software-update.jpg',
    rating: 4.9,
    reviewCount: 200,
    features: [
      'Latest firmware installation',
      'App troubleshooting',
      'Smart features restoration',
      'Performance optimization',
      'WiFi connectivity fixes'
    ],
    warranty: '3 Months',
    estimatedTime: '1 hour',
    inStock: true
  },
  
  // Mobile Phone Repair Products
  {
    id: 'mobile-screen-replacement',
    category: 'mobile',
    title: 'Mobile Screen Replacement',
    description: 'Replace cracked, broken or damaged mobile phone screens with high-quality displays. Original and compatible options available.',
    compatibleBrands: ['samsung', 'apple', 'mi', 'oneplus', 'oppo', 'vivo', 'realme', 'nokia', 'motorola'],
    price: {
      'budget': '₹2,000 - ₹4,000',
      'mid-range': '₹4,000 - ₹8,000',
      'premium': '₹8,000 - ₹25,000'
    },
    image: '/images/products/mobile-screen.jpg',
    rating: 4.8,
    reviewCount: 320,
    features: [
      'Original and compatible screens',
      'OLED/AMOLED/LCD options',
      'Full assembly replacement',
      'Touch functionality guaranteed',
      '6-month warranty'
    ],
    warranty: '6 Months',
    estimatedTime: '1 hour',
    inStock: true
  },
  {
    id: 'mobile-battery',
    category: 'mobile',
    title: 'Mobile Battery Replacement',
    description: 'Fix poor battery life, random shutdowns, overheating, or swollen battery issues with our battery replacement service.',
    compatibleBrands: ['samsung', 'apple', 'mi', 'oneplus', 'oppo', 'vivo', 'realme', 'nokia', 'motorola'],
    price: {
      'budget': '₹1,200 - ₹2,000',
      'mid-range': '₹2,000 - ₹3,500',
      'premium': '₹3,500 - ₹8,000'
    },
    image: '/images/products/mobile-battery.jpg',
    rating: 4.9,
    reviewCount: 450,
    features: [
      'Genuine batteries with warranty',
      'Safe installation process',
      'Battery health optimization',
      'Resolves heating issues',
      'Improves device performance'
    ],
    warranty: '6 Months',
    estimatedTime: '30 minutes',
    inStock: true
  },
  {
    id: 'mobile-charging',
    category: 'mobile',
    title: 'Charging Port Repair',
    description: 'Fix loose charging ports, charging issues, or data transfer problems with our charging port repair/replacement service.',
    compatibleBrands: ['samsung', 'apple', 'mi', 'oneplus', 'oppo', 'vivo', 'realme', 'nokia', 'motorola'],
    price: {
      'standard': '₹1,500 - ₹3,500'
    },
    image: '/images/products/charging-port.jpg',
    rating: 4.7,
    reviewCount: 280,
    features: [
      'Original port replacement',
      'Fast charging support retained',
      'Data transfer functionality fixed',
      'Micro-USB/Type-C/Lightning',
      'Clean installation'
    ],
    warranty: '3 Months',
    estimatedTime: '45 minutes',
    inStock: true
  },
  {
    id: 'mobile-water-damage',
    category: 'mobile',
    title: 'Water Damage Repair',
    description: 'Professional water damage recovery service for phones that have been exposed to water, rain, or other liquids.',
    compatibleBrands: ['samsung', 'apple', 'mi', 'oneplus', 'oppo', 'vivo', 'realme', 'nokia', 'motorola'],
    price: {
      'basic': '₹2,000 - ₹5,000',
      'advanced': '₹5,000 - ₹10,000'
    },
    image: '/images/products/water-damage.jpg',
    rating: 4.3,
    reviewCount: 180,
    features: [
      'Ultrasonic cleaning',
      'Component-level repair',
      'Corrosion treatment',
      'Data recovery attempt',
      'Full functionality restoration'
    ],
    warranty: 'Conditional warranty',
    estimatedTime: '24-48 hours',
    inStock: true
  },
  {
    id: 'mobile-motherboard',
    category: 'mobile',
    title: 'Mobile Motherboard Repair',
    description: 'Fix complex issues like phone not turning on, boot loops, performance issues, or hardware faults with our motherboard repair service.',
    compatibleBrands: ['samsung', 'apple', 'mi', 'oneplus', 'oppo', 'vivo', 'realme', 'nokia', 'motorola'],
    price: {
      'chip-level': '₹3,000 - ₹8,000',
      'board-replacement': '₹8,000 - ₹15,000'
    },
    image: '/images/products/mobile-motherboard.jpg',
    rating: 4.6,
    reviewCount: 150,
    features: [
      'Chip level diagnosis',
      'Micro-soldering expertise',
      'IC replacement',
      'Short circuit repair',
      'Logic board restoration'
    ],
    warranty: '3 Months',
    estimatedTime: '1-2 days',
    inStock: true
  },
  
  // AC Repair Products
  {
    id: 'ac-gas-refill',
    category: 'ac',
    title: 'AC Gas Refill/Top-up',
    description: 'Recharge your AC refrigerant for optimal cooling performance. Includes leak detection and pressure testing.',
    compatibleBrands: ['samsung', 'lg', 'daikin', 'hitachi', 'voltas', 'carrier', 'bluestar', 'haier'],
    price: {
      'standard': '₹1,800 - ₹3,500'
    },
    image: '/images/products/ac-gas.jpg',
    rating: 4.8,
    reviewCount: 420,
    features: [
      'Environment-friendly refrigerants',
      'Complete pressure testing',
      'Leak detection included',
      'Optimal cooling restoration',
      'Improves energy efficiency'
    ],
    warranty: '3 Months',
    estimatedTime: '1 hour',
    inStock: true
  },
  {
    id: 'ac-pcb',
    category: 'ac',
    title: 'AC PCB Repair/Replacement',
    description: 'Fix control board issues that cause AC malfunction, display errors, or sensor problems with our PCB repair service.',
    compatibleBrands: ['samsung', 'lg', 'daikin', 'hitachi', 'voltas', 'carrier', 'bluestar', 'haier'],
    price: {
      'repair': '₹2,500 - ₹4,000',
      'replacement': '₹4,000 - ₹8,000'
    },
    image: '/images/products/ac-pcb.jpg',
    rating: 4.7,
    reviewCount: 280,
    features: [
      'Genuine replacement boards',
      'Component-level repairs',
      'Fixes remote control issues',
      'Resolves timer problems',
      'Restores full functionality'
    ],
    warranty: '6 Months',
    estimatedTime: '1-2 hours',
    inStock: true
  },
  
  // Washing Machine Repair Products
  {
    id: 'washing-motor',
    category: 'washing-machine',
    title: 'Washing Machine Motor Replacement',
    description: 'Replace faulty washing machine motors that cause spin issues, loud noises, or machine not operating.',
    compatibleBrands: ['samsung', 'lg', 'whirlpool', 'bosch', 'ifb', 'haier'],
    price: {
      'standard': '₹3,500 - ₹7,000'
    },
    image: '/images/products/washing-motor.jpg',
    rating: 4.6,
    reviewCount: 150,
    features: [
      'High-efficiency motors',
      'Energy-saving options',
      'Reduced noise operation',
      'Compatible with all load types',
      '1-year warranty'
    ],
    warranty: '1 Year',
    estimatedTime: '2-3 hours',
    inStock: true
  },
  
  // Refrigerator Repair Products
  {
    id: 'refrigerator-compressor',
    category: 'refrigerator',
    title: 'Refrigerator Compressor Replacement',
    description: 'Replace faulty compressors that cause cooling issues, noisy operation, or refrigerator not working properly.',
    compatibleBrands: ['samsung', 'lg', 'whirlpool', 'godrej', 'haier', 'hitachi'],
    price: {
      'standard': '₹6,000 - ₹12,000'
    },
    image: '/images/products/fridge-compressor.jpg',
    rating: 4.7,
    reviewCount: 130,
    features: [
      'Energy-efficient compressors',
      'Copper condenser coils',
      'Environmentally friendly refrigerant',
      'Reduced noise operation',
      '1-year warranty'
    ],
    warranty: '1 Year',
    estimatedTime: '3-4 hours',
    inStock: true
  }
];

// Helper functions
export const getAllProducts = () => products;

export const getProductsByCategory = (categoryId) => {
  return products.filter(product => product.category === categoryId);
};

export const getProductById = (productId) => {
  return products.find(product => product.id === productId);
};

export const getProductsByBrand = (brandId) => {
  return products.filter(product => product.compatibleBrands.includes(brandId));
};

export const getBrandsByCategory = (categoryId) => {
  return brands.filter(brand => brand.categories.includes(categoryId));
};

export default products; 