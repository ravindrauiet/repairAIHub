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

// Define device models for various brands
export const deviceModels = {
  // Mobile phone models
  'mi': [
    { id: 'redmi-a3', name: 'Redmi A3', category: 'mobile' },
    { id: 'redmi-note-13-pro-plus', name: 'Redmi Note 13 Pro+', category: 'mobile' },
    { id: 'redmi-note-13-pro', name: 'Redmi Note 13 Pro', category: 'mobile' },
    { id: 'redmi-note-13-5g', name: 'Redmi Note 13 5G', category: 'mobile' },
    { id: 'redmi-13c', name: 'Redmi 13C', category: 'mobile' },
    { id: 'redmi-12', name: 'Redmi 12', category: 'mobile' },
    { id: 'redmi-a2', name: 'Redmi A2', category: 'mobile' },
    { id: 'redmi-12-5g', name: 'Redmi 12 5G', category: 'mobile' },
    { id: 'redmi-13c-5g', name: 'Redmi 13C 5G', category: 'mobile' }
  ],
  'samsung': [
    { id: 'galaxy-s24-ultra', name: 'Galaxy S24 Ultra', category: 'mobile' },
    { id: 'galaxy-s24-plus', name: 'Galaxy S24+', category: 'mobile' },
    { id: 'galaxy-s24', name: 'Galaxy S24', category: 'mobile' },
    { id: 'galaxy-z-fold5', name: 'Galaxy Z Fold5', category: 'mobile' },
    { id: 'galaxy-z-flip5', name: 'Galaxy Z Flip5', category: 'mobile' },
    { id: 'galaxy-a55-5g', name: 'Galaxy A55 5G', category: 'mobile' },
    { id: 'galaxy-a35-5g', name: 'Galaxy A35 5G', category: 'mobile' },
    { id: 'galaxy-m15', name: 'Galaxy M15', category: 'mobile' }
  ],
  'apple': [
    { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max', category: 'mobile' },
    { id: 'iphone-15-pro', name: 'iPhone 15 Pro', category: 'mobile' },
    { id: 'iphone-15-plus', name: 'iPhone 15 Plus', category: 'mobile' },
    { id: 'iphone-15', name: 'iPhone 15', category: 'mobile' },
    { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max', category: 'mobile' },
    { id: 'iphone-14-pro', name: 'iPhone 14 Pro', category: 'mobile' },
    { id: 'iphone-14-plus', name: 'iPhone 14 Plus', category: 'mobile' },
    { id: 'iphone-14', name: 'iPhone 14', category: 'mobile' },
    { id: 'iphone-13', name: 'iPhone 13', category: 'mobile' },
    { id: 'iphone-12', name: 'iPhone 12', category: 'mobile' },
    { id: 'iphone-11', name: 'iPhone 11', category: 'mobile' }
  ],

  // Laptop models
  'acer': [
    { id: 'acer-travellite-2025', name: 'TravelLite (2025)', category: 'laptop' },
    { id: 'acer-predator-helios-neo-14', name: 'Predator Helios Neo 14', category: 'laptop' },
    { id: 'acer-aspire-7-2024', name: 'Aspire 7 (2024)', category: 'laptop' },
    { id: 'acer-nitro-v-16', name: 'Nitro V 16', category: 'laptop' },
    { id: 'acer-chromebook-plus-15', name: 'Chromebook Plus 15', category: 'laptop' },
    { id: 'acer-alg-gaming-laptop', name: 'ALG Gaming Laptop', category: 'laptop' }
  ],
  'hp': [
    { id: 'hp-spectre-x360', name: 'Spectre x360', category: 'laptop' },
    { id: 'hp-envy-x360', name: 'Envy x360', category: 'laptop' },
    { id: 'hp-pavilion-15', name: 'Pavilion 15', category: 'laptop' },
    { id: 'hp-omen-17', name: 'OMEN 17', category: 'laptop' },
    { id: 'hp-victus-15', name: 'Victus 15', category: 'laptop' }
  ],
  'dell': [
    { id: 'dell-xps-15', name: 'XPS 15', category: 'laptop' },
    { id: 'dell-xps-13', name: 'XPS 13', category: 'laptop' },
    { id: 'dell-inspiron-15', name: 'Inspiron 15', category: 'laptop' },
    { id: 'dell-alienware-m16', name: 'Alienware m16', category: 'laptop' },
    { id: 'dell-g15', name: 'G15 Gaming', category: 'laptop' }
  ],

  // AC models
  'voltas': [
    { id: 'voltas-split-inv-1.5t-5-star', name: 'Split Inverter AC 1.5T INV 5 STAR INV Vogue', category: 'ac' },
    { id: 'voltas-split-inv-1.5t-marble', name: 'Split Inverter AC 1.5T SIC 18VTC3 WZQ MBW IOT Vogue Marble', category: 'ac' },
    { id: 'voltas-split-inv-1.5t-vyq', name: 'Split Inverter AC 1.5T SIC 18DTC3 VYQ IOT', category: 'ac' },
    { id: 'voltas-split-inv-1t', name: 'Split Inverter AC 1T INV 3 STAR', category: 'ac' }
  ],
  'daikin': [
    { id: 'daikin-ftht-inv-1.5t', name: 'FTHT Series 1.5 Ton 5 Star Inverter Split AC', category: 'ac' },
    { id: 'daikin-jtkm-inv-1.5t', name: 'JTKM Series 1.5 Ton 5 Star Inverter Split AC', category: 'ac' },
    { id: 'daikin-ftkf-inv-1t', name: 'FTKF Series 1 Ton 3 Star Inverter Split AC', category: 'ac' }
  ],
  'lg': [
    { id: 'lg-ks-q18ynza', name: 'KS-Q18YNZA 1.5 Ton 5 Star Inverter Split AC', category: 'ac' },
    { id: 'lg-rs-q19ynze', name: 'RS-Q19YNZE 1.5 Ton 5 Star Inverter Split AC', category: 'ac' },
    { id: 'lg-ps-q13ynze', name: 'PS-Q13YNZE 1 Ton 3 Star Inverter Split AC', category: 'ac' }
  ],

  // TV models
  'samsung-tv': [
    { id: 'samsung-neo-qled-8k', name: 'Neo QLED 8K Smart TV', category: 'tv' },
    { id: 'samsung-neo-qled-4k', name: 'Neo QLED 4K Smart TV', category: 'tv' },
    { id: 'samsung-crystal-uhd', name: 'Crystal UHD 4K Smart TV', category: 'tv' },
    { id: 'samsung-the-frame', name: 'The Frame QLED 4K Smart TV', category: 'tv' }
  ],
  'lg-tv': [
    { id: 'lg-oled-c3', name: 'OLED C3 4K Smart TV', category: 'tv' },
    { id: 'lg-oled-g3', name: 'OLED G3 4K Smart TV', category: 'tv' },
    { id: 'lg-qned-mini-led', name: 'QNED MiniLED 4K Smart TV', category: 'tv' },
    { id: 'lg-nanocell', name: 'NanoCell 4K Smart TV', category: 'tv' }
  ]
};

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
    image: '/images/products/tv-screen.jpeg',
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
    image: '/images/products/power-supply.jpeg',
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
    image: '/images/products/main-board.jpeg',
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
    image: '/images/products/backlight.jpeg',
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
    image: '/images/products/software-update.jpeg',
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
    image: '/images/products/mobile-screen.jpeg',
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
    image: '/images/products/mobile-battery.jpeg',
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
    image: '/images/products/charging-port.jpeg',
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
    image: '/images/products/water-damage.jpeg',
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
    image: '/images/products/mobile-motherboard.jpeg',
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
    image: '/images/products/ac-gas.jpeg',
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
    image: '/images/products/ac-pcb.jpeg',
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
    image: '/images/products/washing-motor.jpeg',
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
    image: '/images/products/fridge-compressor.jpeg',
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

// For each product in the products array, add an 'images' array with multiple image URLs
products.forEach(product => {
  // If the product already has an 'images' array, don't override it
  if (!product.images) {
    // Generate image URLs based on product ID
    const baseImage = product.image;
    
    // Create variations of the base image path to simulate multiple product images
    // For example, if base image is '/images/products/tv-screen.jpeg'
    // We'll create '/images/products/tv-screen-1.jpeg', '/images/products/tv-screen-2.jpeg', etc.
    
    const imagePath = baseImage.substring(0, baseImage.lastIndexOf('.'));
    const imageExt = baseImage.substring(baseImage.lastIndexOf('.'));
    
    product.images = [
      baseImage, // Original image as the first one
      `${imagePath}-1${imageExt}`,
      `${imagePath}-2${imageExt}`,
      `${imagePath}-3${imageExt}`
    ];
  }
});

// Find the TV Screen Replacement product and add specific images
const tvScreenReplacementIndex = products.findIndex(product => product.id === 'tv-screen-replacement');
if (tvScreenReplacementIndex !== -1) {
  products[tvScreenReplacementIndex].images = [
    '/images/products/tv-screen-replacement.jpeg',
    '/images/products/tv-screen-replacement-front.jpeg',
    '/images/products/tv-screen-replacement-side.jpeg',
    '/images/products/tv-screen-replacement-detail.jpeg',
    '/images/products/tv-screen-replacement-installed.jpeg'
  ];
}

// Define model-specific products
export const modelProducts = {
  // Mobile phone model products
  'galaxy-s24-ultra': [
    {
      id: 's24-ultra-screen',
      title: 'Galaxy S24 Ultra Screen Replacement',
      description: 'Replace cracked or damaged screen of Samsung Galaxy S24 Ultra with original display.',
      price: '₹25,000 - ₹35,000',
      image: '/images/products/s24-ultra-screen.jpeg',
      rating: 4.8,
      reviewCount: 45,
      features: [
        'Original Samsung display',
        'OLED panel with 120Hz refresh rate',
        'Touch functionality guaranteed',
        '6-month warranty',
        'Expert installation'
      ],
      warranty: '6 Months',
      estimatedTime: '1 hour',
      inStock: true
    },
    {
      id: 's24-ultra-battery',
      title: 'Galaxy S24 Ultra Battery Replacement',
      description: 'Replace the battery of your Samsung Galaxy S24 Ultra for improved performance.',
      price: '₹4,500 - ₹6,000',
      image: '/images/products/s24-ultra-battery.jpeg',
      rating: 4.9,
      reviewCount: 38,
      features: [
        'Original Samsung battery',
        'Improved battery life',
        'Fast charging support',
        '6-month warranty',
        'Quick installation'
      ],
      warranty: '6 Months',
      estimatedTime: '45 minutes',
      inStock: true
    }
  ],
  'iphone-15-pro-max': [
    {
      id: 'iphone-15-pro-max-screen',
      title: 'iPhone 15 Pro Max Screen Replacement',
      description: 'Replace damaged screen of iPhone 15 Pro Max with original display.',
      price: '₹35,000 - ₹45,000',
      image: '/images/products/iphone-15-pro-max-screen.jpeg',
      rating: 4.7,
      reviewCount: 52,
      features: [
        'Original Apple display',
        'ProMotion technology',
        'True Tone support',
        '6-month warranty',
        'Expert installation'
      ],
      warranty: '6 Months',
      estimatedTime: '1 hour',
      inStock: true
    }
  ],
  // AC model products
  'voltas-split-inv-1.5t-5-star': [
    {
      id: 'voltas-1.5t-pcb',
      title: 'Voltas 1.5T Inverter AC PCB Repair',
      description: 'Repair or replace the PCB of your Voltas 1.5T Inverter AC.',
      price: '₹3,500 - ₹5,000',
      image: '/images/products/voltas-pcb.jpeg',
      rating: 4.6,
      reviewCount: 28,
      features: [
        'Original PCB replacement',
        'Inverter technology support',
        'Temperature control fix',
        '6-month warranty',
        'Expert installation'
      ],
      warranty: '6 Months',
      estimatedTime: '1-2 hours',
      inStock: true
    }
  ],
  // Add more model-specific products here...
};

// Helper functions
export const getAllProducts = () => products;

// Function to get products by category
export const getProductsByCategory = (category) => {
  // First check if category is a service ID (like "tv-repair", "mobile-repair", etc.)
  // If so, map it to a product category
  let productCategory = category;
  
  // Map service IDs to product categories
  const serviceToProductMap = {
    'tv-repair': 'tv',
    'mobile-repair': 'mobile',
    'laptop-repair': 'laptop',
    'ac-repair': 'ac',
    'refrigerator-repair': 'refrigerator',
    'washing-machine-repair': 'washing-machine',
    'water-purifier-repair': 'water-purifier'
  };
  
  if (serviceToProductMap[category]) {
    productCategory = serviceToProductMap[category];
  }
  
  return products.filter(product => product.category === productCategory);
};

export const getProductById = (productId) => {
  return products.find(product => product.id === productId);
};

export const getProductsByBrand = (brandId) => {
  return products.filter(product => product.compatibleBrands.includes(brandId));
};

export const getBrandsByCategory = (category) => {
  return brands.filter(brand => brand.categories.includes(category));
};

export const getModelsByBrand = (brandId, category) => {
  if (!deviceModels[brandId]) {
    return [];
  }
  
  return deviceModels[brandId].filter(model => {
    if (!model) {
      return false;
    }
    return model.category === category;
  });
};

export const getProductsByModel = (modelId) => {
  return modelProducts[modelId] || [];
};

export const getProductsByBrandAndCategory = (brandId, category) => {
  const brandModels = getModelsByBrand(brandId, category);
  const allProducts = [];
  
  brandModels.forEach(model => {
    const modelProducts = getProductsByModel(model.id);
    allProducts.push(...modelProducts);
  });
  
  return allProducts;
};

// Add this new object for booking form devices
export const bookingDevices = {
  'tv-repair': {
    brands: [
      { id: 'samsung-tv', name: 'Samsung' },
      { id: 'lg-tv', name: 'LG' },
      { id: 'sony-tv', name: 'Sony' },
      { id: 'tcl-tv', name: 'TCL' },
      { id: 'vizio-tv', name: 'Vizio' }
    ],
    models: {
      'samsung-tv': [
        { id: 'samsung-tv-1', name: 'Samsung 4K Smart TV' },
        { id: 'samsung-tv-2', name: 'Samsung QLED TV' },
        { id: 'samsung-tv-3', name: 'Samsung Crystal UHD' }
      ],
      'lg-tv': [
        { id: 'lg-tv-1', name: 'LG OLED TV' },
        { id: 'lg-tv-2', name: 'LG NanoCell TV' },
        { id: 'lg-tv-3', name: 'LG UHD TV' }
      ],
      'sony-tv': [
        { id: 'sony-tv-1', name: 'Sony Bravia OLED' },
        { id: 'sony-tv-2', name: 'Sony X90J' },
        { id: 'sony-tv-3', name: 'Sony X80J' }
      ],
      'tcl-tv': [
        { id: 'tcl-tv-1', name: 'TCL 4K Roku TV' },
        { id: 'tcl-tv-2', name: 'TCL Android TV' },
        { id: 'tcl-tv-3', name: 'TCL QLED TV' }
      ],
      'vizio-tv': [
        { id: 'vizio-tv-1', name: 'Vizio V-Series' },
        { id: 'vizio-tv-2', name: 'Vizio M-Series' },
        { id: 'vizio-tv-3', name: 'Vizio P-Series' }
      ]
    }
  },
  'mobile-repair': {
    brands: [
      { id: 'samsung-mobile', name: 'Samsung' },
      { id: 'apple-mobile', name: 'Apple' },
      { id: 'xiaomi-mobile', name: 'Xiaomi' },
      { id: 'oppo-mobile', name: 'OPPO' },
      { id: 'vivo-mobile', name: 'Vivo' },
      { id: 'oneplus-mobile', name: 'OnePlus' },
      { id: 'realme-mobile', name: 'Realme' },
      { id: 'motorola-mobile', name: 'Motorola' },
      { id: 'nothing-mobile', name: 'Nothing' },
      { id: 'google-mobile', name: 'Google' },
      { id: 'asus-mobile', name: 'ASUS' },
      { id: 'honor-mobile', name: 'Honor' },
      { id: 'nokia-mobile', name: 'Nokia' }
    ],
    models: {
      'samsung-mobile': [
        { id: 'samsung-s24-ultra', name: 'Galaxy S24 Ultra' },
        { id: 'samsung-s24-plus', name: 'Galaxy S24+' },
        { id: 'samsung-s24', name: 'Galaxy S24' },
        { id: 'samsung-s23-ultra', name: 'Galaxy S23 Ultra' },
        { id: 'samsung-s23-plus', name: 'Galaxy S23+' },
        { id: 'samsung-s23', name: 'Galaxy S23' },
        { id: 'samsung-s22-ultra', name: 'Galaxy S22 Ultra' },
        { id: 'samsung-s22-plus', name: 'Galaxy S22+' },
        { id: 'samsung-s22', name: 'Galaxy S22' },
        { id: 'samsung-s21-ultra', name: 'Galaxy S21 Ultra' },
        { id: 'samsung-s21-plus', name: 'Galaxy S21+' },
        { id: 'samsung-s21', name: 'Galaxy S21' },
        { id: 'samsung-s21-fe', name: 'Galaxy S21 FE' },
        { id: 'samsung-z-fold5', name: 'Galaxy Z Fold5' },
        { id: 'samsung-z-flip5', name: 'Galaxy Z Flip5' },
        { id: 'samsung-z-fold4', name: 'Galaxy Z Fold4' },
        { id: 'samsung-z-flip4', name: 'Galaxy Z Flip4' },
        { id: 'samsung-a54', name: 'Galaxy A54' },
        { id: 'samsung-a53', name: 'Galaxy A53' },
        { id: 'samsung-a34', name: 'Galaxy A34' },
        { id: 'samsung-a23', name: 'Galaxy A23' },
        { id: 'samsung-a14', name: 'Galaxy A14' },
        { id: 'samsung-m34', name: 'Galaxy M34' },
        { id: 'samsung-m14', name: 'Galaxy M14' }
      ],
      'apple-mobile': [
        { id: 'iphone-15-pro-max', name: 'iPhone 15 Pro Max' },
        { id: 'iphone-15-pro', name: 'iPhone 15 Pro' },
        { id: 'iphone-15-plus', name: 'iPhone 15 Plus' },
        { id: 'iphone-15', name: 'iPhone 15' },
        { id: 'iphone-14-pro-max', name: 'iPhone 14 Pro Max' },
        { id: 'iphone-14-pro', name: 'iPhone 14 Pro' },
        { id: 'iphone-14-plus', name: 'iPhone 14 Plus' },
        { id: 'iphone-14', name: 'iPhone 14' },
        { id: 'iphone-13-pro-max', name: 'iPhone 13 Pro Max' },
        { id: 'iphone-13-pro', name: 'iPhone 13 Pro' },
        { id: 'iphone-13', name: 'iPhone 13' },
        { id: 'iphone-13-mini', name: 'iPhone 13 Mini' },
        { id: 'iphone-12-pro-max', name: 'iPhone 12 Pro Max' },
        { id: 'iphone-12-pro', name: 'iPhone 12 Pro' },
        { id: 'iphone-12', name: 'iPhone 12' },
        { id: 'iphone-12-mini', name: 'iPhone 12 Mini' },
        { id: 'iphone-11-pro-max', name: 'iPhone 11 Pro Max' },
        { id: 'iphone-11-pro', name: 'iPhone 11 Pro' },
        { id: 'iphone-11', name: 'iPhone 11' },
        { id: 'iphone-se-2022', name: 'iPhone SE (2022)' },
        { id: 'iphone-se-2020', name: 'iPhone SE (2020)' },
        { id: 'iphone-xr', name: 'iPhone XR' },
        { id: 'iphone-xs-max', name: 'iPhone XS Max' },
        { id: 'iphone-xs', name: 'iPhone XS' }
      ],
      'xiaomi-mobile': [
        { id: 'xiaomi-14-ultra', name: 'Xiaomi 14 Ultra' },
        { id: 'xiaomi-14', name: 'Xiaomi 14' },
        { id: 'xiaomi-13-pro', name: 'Xiaomi 13 Pro' },
        { id: 'xiaomi-13', name: 'Xiaomi 13' },
        { id: 'xiaomi-13t-pro', name: 'Xiaomi 13T Pro' },
        { id: 'xiaomi-13t', name: 'Xiaomi 13T' },
        { id: 'xiaomi-12-pro', name: 'Xiaomi 12 Pro' },
        { id: 'xiaomi-12', name: 'Xiaomi 12' },
        { id: 'xiaomi-12t-pro', name: 'Xiaomi 12T Pro' },
        { id: 'xiaomi-12t', name: 'Xiaomi 12T' },
        { id: 'xiaomi-redmi-note-13-pro-plus', name: 'Redmi Note 13 Pro+' },
        { id: 'xiaomi-redmi-note-13-pro', name: 'Redmi Note 13 Pro' },
        { id: 'xiaomi-redmi-note-13', name: 'Redmi Note 13' },
        { id: 'xiaomi-redmi-note-12-pro-plus', name: 'Redmi Note 12 Pro+' },
        { id: 'xiaomi-redmi-note-12-pro', name: 'Redmi Note 12 Pro' },
        { id: 'xiaomi-redmi-note-12', name: 'Redmi Note 12' },
        { id: 'xiaomi-redmi-12', name: 'Redmi 12' },
        { id: 'xiaomi-redmi-12c', name: 'Redmi 12C' },
        { id: 'xiaomi-poco-f5-pro', name: 'POCO F5 Pro' },
        { id: 'xiaomi-poco-f5', name: 'POCO F5' },
        { id: 'xiaomi-poco-x5-pro', name: 'POCO X5 Pro' },
        { id: 'xiaomi-poco-x5', name: 'POCO X5' }
      ],
      'oppo-mobile': [
        { id: 'oppo-find-x7-ultra', name: 'Find X7 Ultra' },
        { id: 'oppo-find-x7-pro', name: 'Find X7 Pro' },
        { id: 'oppo-find-x7', name: 'Find X7' },
        { id: 'oppo-find-x6-pro', name: 'Find X6 Pro' },
        { id: 'oppo-find-x6', name: 'Find X6' },
        { id: 'oppo-find-x5-pro', name: 'Find X5 Pro' },
        { id: 'oppo-find-x5', name: 'Find X5' },
        { id: 'oppo-reno-11-pro', name: 'Reno 11 Pro' },
        { id: 'oppo-reno-11', name: 'Reno 11' },
        { id: 'oppo-reno-10-pro-plus', name: 'Reno 10 Pro+' },
        { id: 'oppo-reno-10-pro', name: 'Reno 10 Pro' },
        { id: 'oppo-reno-10', name: 'Reno 10' },
        { id: 'oppo-reno-9-pro-plus', name: 'Reno 9 Pro+' },
        { id: 'oppo-reno-9-pro', name: 'Reno 9 Pro' },
        { id: 'oppo-reno-9', name: 'Reno 9' },
        { id: 'oppo-reno-8-pro', name: 'Reno 8 Pro' },
        { id: 'oppo-reno-8', name: 'Reno 8' },
        { id: 'oppo-f23', name: 'F23' },
        { id: 'oppo-f21-pro', name: 'F21 Pro' },
        { id: 'oppo-a78', name: 'A78' },
        { id: 'oppo-a77', name: 'A77' },
        { id: 'oppo-a58', name: 'A58' }
      ],
      'vivo-mobile': [
        { id: 'vivo-x100-pro', name: 'X100 Pro' },
        { id: 'vivo-x100', name: 'X100' },
        { id: 'vivo-x90-pro-plus', name: 'X90 Pro+' },
        { id: 'vivo-x90-pro', name: 'X90 Pro' },
        { id: 'vivo-x90', name: 'X90' },
        { id: 'vivo-x80-pro', name: 'X80 Pro' },
        { id: 'vivo-x80', name: 'X80' },
        { id: 'vivo-v30-pro', name: 'V30 Pro' },
        { id: 'vivo-v30', name: 'V30' },
        { id: 'vivo-v29-pro', name: 'V29 Pro' },
        { id: 'vivo-v29', name: 'V29' },
        { id: 'vivo-v27-pro', name: 'V27 Pro' },
        { id: 'vivo-v27', name: 'V27' },
        { id: 'vivo-v25-pro', name: 'V25 Pro' },
        { id: 'vivo-v25', name: 'V25' },
        { id: 'vivo-t2-pro', name: 'T2 Pro' },
        { id: 'vivo-t2', name: 'T2' },
        { id: 'vivo-t1-pro', name: 'T1 Pro' },
        { id: 'vivo-t1', name: 'T1' },
        { id: 'vivo-y100', name: 'Y100' },
        { id: 'vivo-y78', name: 'Y78' },
        { id: 'vivo-y56', name: 'Y56' }
      ],
      'oneplus-mobile': [
        { id: 'oneplus-12', name: 'OnePlus 12' },
        { id: 'oneplus-12r', name: 'OnePlus 12R' },
        { id: 'oneplus-open', name: 'OnePlus Open' },
        { id: 'oneplus-11', name: 'OnePlus 11' },
        { id: 'oneplus-11r', name: 'OnePlus 11R' },
        { id: 'oneplus-10-pro', name: 'OnePlus 10 Pro' },
        { id: 'oneplus-10t', name: 'OnePlus 10T' },
        { id: 'oneplus-10r', name: 'OnePlus 10R' },
        { id: 'oneplus-9-pro', name: 'OnePlus 9 Pro' },
        { id: 'oneplus-9', name: 'OnePlus 9' },
        { id: 'oneplus-9r', name: 'OnePlus 9R' },
        { id: 'oneplus-9rt', name: 'OnePlus 9RT' },
        { id: 'oneplus-nord-3', name: 'Nord 3' },
        { id: 'oneplus-nord-ce3-lite', name: 'Nord CE3 Lite' },
        { id: 'oneplus-nord-ce3', name: 'Nord CE3' },
        { id: 'oneplus-nord-2t', name: 'Nord 2T' },
        { id: 'oneplus-nord-2', name: 'Nord 2' },
        { id: 'oneplus-nord-ce2', name: 'Nord CE2' }
      ],
      'realme-mobile': [
        { id: 'realme-gt5-pro', name: 'GT5 Pro' },
        { id: 'realme-gt5', name: 'GT5' },
        { id: 'realme-gt3', name: 'GT3' },
        { id: 'realme-gt-neo5', name: 'GT Neo5' },
        { id: 'realme-gt-neo5-se', name: 'GT Neo5 SE' },
        { id: 'realme-gt2-pro', name: 'GT2 Pro' },
        { id: 'realme-gt2', name: 'GT2' },
        { id: 'realme-11-pro-plus', name: '11 Pro+' },
        { id: 'realme-11-pro', name: '11 Pro' },
        { id: 'realme-11', name: '11' },
        { id: 'realme-10-pro-plus', name: '10 Pro+' },
        { id: 'realme-10-pro', name: '10 Pro' },
        { id: 'realme-10', name: '10' },
        { id: 'realme-9-pro-plus', name: '9 Pro+' },
        { id: 'realme-9-pro', name: '9 Pro' },
        { id: 'realme-9', name: '9' },
        { id: 'realme-c55', name: 'C55' },
        { id: 'realme-c53', name: 'C53' },
        { id: 'realme-c33', name: 'C33' }
      ],
      'motorola-mobile': [
        { id: 'motorola-razr-40-ultra', name: 'Razr 40 Ultra' },
        { id: 'motorola-razr-40', name: 'Razr 40' },
        { id: 'motorola-edge-40-pro', name: 'Edge 40 Pro' },
        { id: 'motorola-edge-40', name: 'Edge 40' },
        { id: 'motorola-edge-30-ultra', name: 'Edge 30 Ultra' },
        { id: 'motorola-edge-30-pro', name: 'Edge 30 Pro' },
        { id: 'motorola-edge-30-fusion', name: 'Edge 30 Fusion' },
        { id: 'motorola-edge-30', name: 'Edge 30' },
        { id: 'motorola-g84', name: 'Moto G84' },
        { id: 'motorola-g73', name: 'Moto G73' },
        { id: 'motorola-g72', name: 'Moto G72' },
        { id: 'motorola-g62', name: 'Moto G62' },
        { id: 'motorola-g54', name: 'Moto G54' },
        { id: 'motorola-g53', name: 'Moto G53' },
        { id: 'motorola-g52', name: 'Moto G52' },
        { id: 'motorola-g42', name: 'Moto G42' },
        { id: 'motorola-g32', name: 'Moto G32' },
        { id: 'motorola-g23', name: 'Moto G23' },
        { id: 'motorola-g13', name: 'Moto G13' }
      ],
      'nothing-mobile': [
        { id: 'nothing-phone-2', name: 'Phone (2)' },
        { id: 'nothing-phone-2a', name: 'Phone (2a)' },
        { id: 'nothing-phone-1', name: 'Phone (1)' },
        { id: 'nothing-cmf-phone-1', name: 'CMF Phone 1' }
      ],
      'google-mobile': [
        { id: 'google-pixel-8-pro', name: 'Pixel 8 Pro' },
        { id: 'google-pixel-8', name: 'Pixel 8' },
        { id: 'google-pixel-7a', name: 'Pixel 7a' },
        { id: 'google-pixel-7-pro', name: 'Pixel 7 Pro' },
        { id: 'google-pixel-7', name: 'Pixel 7' },
        { id: 'google-pixel-6a', name: 'Pixel 6a' },
        { id: 'google-pixel-6-pro', name: 'Pixel 6 Pro' },
        { id: 'google-pixel-6', name: 'Pixel 6' },
        { id: 'google-pixel-5', name: 'Pixel 5' },
        { id: 'google-pixel-4a', name: 'Pixel 4a' }
      ],
      'asus-mobile': [
        { id: 'asus-rog-phone-8-pro', name: 'ROG Phone 8 Pro' },
        { id: 'asus-rog-phone-8', name: 'ROG Phone 8' },
        { id: 'asus-rog-phone-7-ultimate', name: 'ROG Phone 7 Ultimate' },
        { id: 'asus-rog-phone-7', name: 'ROG Phone 7' },
        { id: 'asus-rog-phone-6-pro', name: 'ROG Phone 6 Pro' },
        { id: 'asus-rog-phone-6', name: 'ROG Phone 6' },
        { id: 'asus-rog-phone-5-ultimate', name: 'ROG Phone 5 Ultimate' },
        { id: 'asus-rog-phone-5-pro', name: 'ROG Phone 5 Pro' },
        { id: 'asus-rog-phone-5', name: 'ROG Phone 5' },
        { id: 'asus-zenfone-10', name: 'Zenfone 10' },
        { id: 'asus-zenfone-9', name: 'Zenfone 9' },
        { id: 'asus-zenfone-8-flip', name: 'Zenfone 8 Flip' },
        { id: 'asus-zenfone-8', name: 'Zenfone 8' }
      ],
      'honor-mobile': [
        { id: 'honor-magic6-pro', name: 'Magic6 Pro' },
        { id: 'honor-magic6', name: 'Magic6' },
        { id: 'honor-magic-vs2', name: 'Magic Vs2' },
        { id: 'honor-magic-v2', name: 'Magic V2' },
        { id: 'honor-magic5-pro', name: 'Magic5 Pro' },
        { id: 'honor-magic5', name: 'Magic5' },
        { id: 'honor-magic5-lite', name: 'Magic5 Lite' },
        { id: 'honor-magic4-pro', name: 'Magic4 Pro' },
        { id: 'honor-90-pro', name: '90 Pro' },
        { id: 'honor-90', name: '90' },
        { id: 'honor-90-lite', name: '90 Lite' },
        { id: 'honor-80-pro', name: '80 Pro' },
        { id: 'honor-80', name: '80' },
        { id: 'honor-x9b', name: 'X9b' },
        { id: 'honor-x9a', name: 'X9a' },
        { id: 'honor-x8a', name: 'X8a' }
      ],
      'nokia-mobile': [
        { id: 'nokia-xr21', name: 'XR21' },
        { id: 'nokia-xr20', name: 'XR20' },
        { id: 'nokia-g42', name: 'G42' },
        { id: 'nokia-g22', name: 'G22' },
        { id: 'nokia-g21', name: 'G21' },
        { id: 'nokia-g20', name: 'G20' },
        { id: 'nokia-g11', name: 'G11' },
        { id: 'nokia-g10', name: 'G10' },
        { id: 'nokia-c32', name: 'C32' },
        { id: 'nokia-c31', name: 'C31' },
        { id: 'nokia-c22', name: 'C22' },
        { id: 'nokia-c21-plus', name: 'C21 Plus' },
        { id: 'nokia-c21', name: 'C21' },
        { id: 'nokia-c12', name: 'C12' },
        { id: 'nokia-c02', name: 'C02' }
      ]
    }
  },
  'laptop-repair': {
    brands: [
      { id: 'hp-laptop', name: 'HP' },
      { id: 'dell-laptop', name: 'Dell' },
      { id: 'lenovo-laptop', name: 'Lenovo' },
      { id: 'asus-laptop', name: 'ASUS' },
      { id: 'acer-laptop', name: 'Acer' }
    ],
    models: {
      'hp-laptop': [
        { id: 'hp-laptop-1', name: 'HP Pavilion' },
        { id: 'hp-laptop-2', name: 'HP Envy' },
        { id: 'hp-laptop-3', name: 'HP Spectre' }
      ],
      'dell-laptop': [
        { id: 'dell-laptop-1', name: 'Dell XPS' },
        { id: 'dell-laptop-2', name: 'Dell Inspiron' },
        { id: 'dell-laptop-3', name: 'Dell Latitude' }
      ],
      'lenovo-laptop': [
        { id: 'lenovo-laptop-1', name: 'ThinkPad' },
        { id: 'lenovo-laptop-2', name: 'IdeaPad' },
        { id: 'lenovo-laptop-3', name: 'Yoga' }
      ],
      'asus-laptop': [
        { id: 'asus-laptop-1', name: 'ROG' },
        { id: 'asus-laptop-2', name: 'ZenBook' },
        { id: 'asus-laptop-3', name: 'VivoBook' }
      ],
      'acer-laptop': [
        { id: 'acer-laptop-1', name: 'Aspire' },
        { id: 'acer-laptop-2', name: 'Nitro' },
        { id: 'acer-laptop-3', name: 'Swift' }
      ]
    }
  },
  'ac-repair': {
    brands: [
      { id: 'voltas-ac', name: 'Voltas' },
      { id: 'lg-ac', name: 'LG' },
      { id: 'samsung-ac', name: 'Samsung' },
      { id: 'daikin-ac', name: 'Daikin' },
      { id: 'blue-star-ac', name: 'Blue Star' }
    ],
    models: {
      'voltas-ac': [
        { id: 'voltas-ac-1', name: 'Voltas 1.5 Ton' },
        { id: 'voltas-ac-2', name: 'Voltas 2 Ton' },
        { id: 'voltas-ac-3', name: 'Voltas 1 Ton' }
      ],
      'lg-ac': [
        { id: 'lg-ac-1', name: 'LG 1.5 Ton' },
        { id: 'lg-ac-2', name: 'LG 2 Ton' },
        { id: 'lg-ac-3', name: 'LG 1 Ton' }
      ],
      'samsung-ac': [
        { id: 'samsung-ac-1', name: 'Samsung 1.5 Ton' },
        { id: 'samsung-ac-2', name: 'Samsung 2 Ton' },
        { id: 'samsung-ac-3', name: 'Samsung 1 Ton' }
      ],
      'daikin-ac': [
        { id: 'daikin-ac-1', name: 'Daikin 1.5 Ton' },
        { id: 'daikin-ac-2', name: 'Daikin 2 Ton' },
        { id: 'daikin-ac-3', name: 'Daikin 1 Ton' }
      ],
      'blue-star-ac': [
        { id: 'blue-star-ac-1', name: 'Blue Star 1.5 Ton' },
        { id: 'blue-star-ac-2', name: 'Blue Star 2 Ton' },
        { id: 'blue-star-ac-3', name: 'Blue Star 1 Ton' }
      ]
    }
  }
};

// Add specific images for other popular products
const popularProductImages = {
  'mobile-screen-replacement': [
    '/images/products/mobile-screen-replacement.jpeg',
    '/images/products/mobile-screen-replacement-display.jpeg',
    '/images/products/mobile-screen-replacement-components.jpeg',
    '/images/products/mobile-screen-replacement-repair.jpeg',
    '/images/products/mobile-screen-replacement-tools.jpeg'
  ],
  'laptop-keyboard-replacement': [
    '/images/products/laptop-keyboard-replacement.jpeg',
    '/images/products/laptop-keyboard-replacement-top.jpeg',
    '/images/products/laptop-keyboard-replacement-close.jpeg',
    '/images/products/laptop-keyboard-replacement-side.jpeg',
    '/images/products/laptop-keyboard-replacement-detail.jpeg'
  ],
  'ac-gas-refill': [
    '/images/products/ac-gas-refill.jpeg',
    '/images/products/ac-gas-refill-unit.jpeg',
    '/images/products/ac-gas-refill-technician.jpeg',
    '/images/products/ac-gas-refill-gauge.jpeg',
    '/images/products/ac-gas-refill-complete.jpeg'
  ],
  'washing-machine-motor-replacement': [
    '/images/products/washing-machine-motor-replacement.jpeg',
    '/images/products/washing-machine-motor-replacement-parts.jpeg',
    '/images/products/washing-machine-motor-replacement-inside.jpeg',
    '/images/products/washing-machine-motor-replacement-installed.jpeg',
    '/images/products/washing-machine-motor-replacement-close.jpeg'
  ]
};

// Update products with specific images
Object.keys(popularProductImages).forEach(productId => {
  const productIndex = products.findIndex(product => product.id === productId);
  if (productIndex !== -1) {
    products[productIndex].images = popularProductImages[productId];
  }
});

export default products; 