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

// Define model-specific products
export const modelProducts = {
  // Mobile phone model products
  'galaxy-s24-ultra': [
    {
      id: 's24-ultra-screen',
      title: 'Galaxy S24 Ultra Screen Replacement',
      description: 'Replace cracked or damaged screen of Samsung Galaxy S24 Ultra with original display.',
      price: '₹25,000 - ₹35,000',
      image: '/images/products/s24-ultra-screen.jpg',
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
      image: '/images/products/s24-ultra-battery.jpg',
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
      image: '/images/products/iphone-15-pro-max-screen.jpg',
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
      image: '/images/products/voltas-pcb.jpg',
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
      { id: 'vivo-mobile', name: 'Vivo' }
    ],
    models: {
      'samsung-mobile': [
        { id: 'samsung-mobile-1', name: 'Galaxy S21' },
        { id: 'samsung-mobile-2', name: 'Galaxy S20' },
        { id: 'samsung-mobile-3', name: 'Galaxy Note 20' }
      ],
      'apple-mobile': [
        { id: 'apple-mobile-1', name: 'iPhone 13' },
        { id: 'apple-mobile-2', name: 'iPhone 12' },
        { id: 'apple-mobile-3', name: 'iPhone 11' }
      ],
      'xiaomi-mobile': [
        { id: 'xiaomi-mobile-1', name: 'Mi 11' },
        { id: 'xiaomi-mobile-2', name: 'Redmi Note 10' },
        { id: 'xiaomi-mobile-3', name: 'POCO F3' }
      ],
      'oppo-mobile': [
        { id: 'oppo-mobile-1', name: 'Find X3' },
        { id: 'oppo-mobile-2', name: 'Reno 6' },
        { id: 'oppo-mobile-3', name: 'A54' }
      ],
      'vivo-mobile': [
        { id: 'vivo-mobile-1', name: 'X60' },
        { id: 'vivo-mobile-2', name: 'V21' },
        { id: 'vivo-mobile-3', name: 'Y72' }
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

export default products; 