const products = [
  // Television/Display Devices
  {
    id: "tv-lg-oled",
    name: "LG OLED TV",
    category: "television",
    brand: "LG",
    marketPrice: "₹89,990 - ₹2,49,990",
    repairCost: {
      screenReplacement: "₹25,000 - ₹60,000",
      powerSupply: "₹3,500 - ₹7,000",
      mainBoard: "₹8,000 - ₹15,000",
      backlightRepair: "₹4,000 - ₹8,000",
      softwareIssues: "₹1,500 - ₹3,000"
    },
    image: "/images/products/lg-oled-tv.jpg",
    description: "LG OLED TVs offer perfect black levels and exceptional color accuracy with stunning contrast. Available in different sizes from 48 to 77 inches."
  },
  {
    id: "tv-samsung-qled",
    name: "Samsung QLED TV",
    category: "television",
    brand: "Samsung",
    marketPrice: "₹69,990 - ₹2,19,990",
    repairCost: {
      screenReplacement: "₹20,000 - ₹50,000",
      powerSupply: "₹3,000 - ₹6,000",
      mainBoard: "₹7,000 - ₹14,000",
      backlightRepair: "₹3,500 - ₹7,000",
      softwareIssues: "₹1,500 - ₹3,000"
    },
    image: "/images/products/samsung-qled-tv.jpg",
    description: "Samsung QLED TVs feature Quantum Dot technology for vibrant colors and high brightness levels. Available in various sizes."
  },
  {
    id: "tv-sony-bravia",
    name: "Sony Bravia TV",
    category: "television",
    brand: "Sony",
    marketPrice: "₹49,990 - ₹2,99,990",
    repairCost: {
      screenReplacement: "₹18,000 - ₹65,000",
      powerSupply: "₹3,200 - ₹6,500",
      mainBoard: "₹7,500 - ₹16,000",
      backlightRepair: "₹4,000 - ₹8,000",
      softwareIssues: "₹1,800 - ₹3,200"
    },
    image: "/images/products/sony-bravia-tv.jpg",
    description: "Sony Bravia TVs are known for superior image processing and authentic picture quality with X1 processors."
  },

  // Mobile Phones
  {
    id: "mobile-iphone-15",
    name: "Apple iPhone 15",
    category: "mobile",
    brand: "Apple",
    marketPrice: "₹79,900 - ₹1,59,900",
    repairCost: {
      screenReplacement: "₹15,000 - ₹28,000",
      batteryReplacement: "₹5,500 - ₹8,000",
      chargingPortRepair: "₹3,500 - ₹6,000",
      backGlassReplacement: "₹8,000 - ₹15,000",
      cameraRepair: "₹6,000 - ₹12,000"
    },
    image: "/images/products/iphone-15.jpg",
    description: "The latest iPhone with A16 Bionic chip, advanced camera system and improved battery life."
  },
  {
    id: "mobile-samsung-s23",
    name: "Samsung Galaxy S23",
    category: "mobile",
    brand: "Samsung",
    marketPrice: "₹74,999 - ₹1,34,999",
    repairCost: {
      screenReplacement: "₹12,000 - ₹25,000",
      batteryReplacement: "₹4,000 - ₹6,000",
      chargingPortRepair: "₹2,500 - ₹4,000",
      backCoverReplacement: "₹5,000 - ₹8,000",
      cameraRepair: "₹5,000 - ₹10,000"
    },
    image: "/images/products/samsung-s23.jpg",
    description: "Samsung's flagship smartphone with Snapdragon 8 Gen 2 processor and advanced camera features."
  },
  {
    id: "mobile-oneplus-11",
    name: "OnePlus 11",
    category: "mobile",
    brand: "OnePlus",
    marketPrice: "₹56,999 - ₹61,999",
    repairCost: {
      screenReplacement: "₹8,000 - ₹12,000",
      batteryReplacement: "₹3,000 - ₹4,500",
      chargingPortRepair: "₹2,000 - ₹3,500",
      backCoverReplacement: "₹3,500 - ₹5,000",
      cameraRepair: "₹4,000 - ₹7,000"
    },
    image: "/images/products/oneplus-11.jpg",
    description: "OnePlus 11 features Hasselblad cameras, Snapdragon 8 Gen 2 processor, and 100W fast charging."
  },

  // Laptops
  {
    id: "laptop-macbook-pro",
    name: "Apple MacBook Pro",
    category: "laptop",
    brand: "Apple",
    marketPrice: "₹1,29,900 - ₹3,49,900",
    repairCost: {
      screenReplacement: "₹35,000 - ₹65,000",
      batteryReplacement: "₹8,000 - ₹15,000",
      keyboardReplacement: "₹12,000 - ₹25,000",
      motherboardRepair: "₹20,000 - ₹45,000",
      storageUpgrade: "₹8,000 - ₹30,000"
    },
    image: "/images/products/macbook-pro.jpg",
    description: "Apple MacBook Pro with M2 Pro/Max chip, stunning display, and exceptional performance for professionals."
  },
  {
    id: "laptop-dell-xps",
    name: "Dell XPS 13/15",
    category: "laptop",
    brand: "Dell",
    marketPrice: "₹99,990 - ₹2,50,000",
    repairCost: {
      screenReplacement: "₹25,000 - ₹45,000",
      batteryReplacement: "₹6,000 - ₹10,000",
      keyboardReplacement: "₹8,000 - ₹15,000",
      motherboardRepair: "₹15,000 - ₹35,000",
      storageUpgrade: "₹5,000 - ₹20,000"
    },
    image: "/images/products/dell-xps.jpg",
    description: "Dell XPS features InfinityEdge display, powerful Intel processors, and premium build quality."
  },
  {
    id: "laptop-hp-spectre",
    name: "HP Spectre x360",
    category: "laptop",
    brand: "HP",
    marketPrice: "₹1,19,999 - ₹1,89,999",
    repairCost: {
      screenReplacement: "₹22,000 - ₹40,000",
      batteryReplacement: "₹5,500 - ₹9,000",
      keyboardReplacement: "₹7,000 - ₹14,000",
      motherboardRepair: "₹16,000 - ₹32,000",
      hingeRepair: "₹4,000 - ₹8,000"
    },
    image: "/images/products/hp-spectre.jpg",
    description: "HP Spectre x360 convertible laptop with premium design, OLED display options, and Intel processors."
  },

  // Air Conditioners
  {
    id: "ac-daikin",
    name: "Daikin Split AC",
    category: "air-conditioner",
    brand: "Daikin",
    marketPrice: "₹35,990 - ₹75,990",
    repairCost: {
      compressorReplacement: "₹8,000 - ₹15,000",
      gasRefill: "₹1,500 - ₹3,000",
      pcbRepair: "₹3,500 - ₹7,000",
      fanMotorReplacement: "₹2,500 - ₹5,000",
      capacitorReplacement: "₹500 - ₹1,200"
    },
    image: "/images/products/daikin-ac.jpg",
    description: "Daikin Split ACs with inverter technology, energy efficiency, and advanced air purification."
  },
  {
    id: "ac-voltas",
    name: "Voltas Split AC",
    category: "air-conditioner",
    brand: "Voltas",
    marketPrice: "₹32,990 - ₹65,990",
    repairCost: {
      compressorReplacement: "₹7,000 - ₹14,000",
      gasRefill: "₹1,400 - ₹2,800",
      pcbRepair: "₹3,000 - ₹6,000",
      fanMotorReplacement: "₹2,200 - ₹4,500",
      capacitorReplacement: "₹400 - ₹1,000"
    },
    image: "/images/products/voltas-ac.jpg",
    description: "Voltas ACs with adjustable cooling, dust filters, and copper condensers for better cooling efficiency."
  },

  // Refrigerators
  {
    id: "fridge-lg-doubleDoor",
    name: "LG Double Door Refrigerator",
    category: "refrigerator",
    brand: "LG",
    marketPrice: "₹25,990 - ₹65,990",
    repairCost: {
      compressorReplacement: "₹6,000 - ₹12,000",
      thermostatReplacement: "₹1,800 - ₹3,500",
      gasRefill: "₹2,000 - ₹4,000",
      doorSealReplacement: "₹1,200 - ₹2,500",
      fanMotorReplacement: "₹1,500 - ₹3,000"
    },
    image: "/images/products/lg-fridge.jpg",
    description: "LG Double Door Refrigerators with smart inverter compressor and multi air flow cooling."
  },
  {
    id: "fridge-samsung-sideBySide",
    name: "Samsung Side by Side Refrigerator",
    category: "refrigerator",
    brand: "Samsung",
    marketPrice: "₹65,990 - ₹1,85,990",
    repairCost: {
      compressorReplacement: "₹8,000 - ₹15,000",
      thermostatReplacement: "₹2,000 - ₹4,000",
      gasRefill: "₹2,500 - ₹5,000",
      iceDispenserRepair: "₹3,000 - ₹6,000",
      displayBoardReplacement: "₹4,000 - ₹8,000"
    },
    image: "/images/products/samsung-fridge.jpg",
    description: "Samsung Side by Side Refrigerators with twin cooling, digital display, and frost-free technology."
  },

  // Washing Machines
  {
    id: "washer-lg-frontLoad",
    name: "LG Front Load Washing Machine",
    category: "washing-machine",
    brand: "LG",
    marketPrice: "₹28,990 - ₹45,990",
    repairCost: {
      motorReplacement: "₹5,000 - ₹10,000",
      drumBearingReplacement: "₹3,500 - ₹7,000",
      pcbRepair: "₹3,000 - ₹6,000",
      doorLockReplacement: "₹1,200 - ₹2,500",
      pumpReplacement: "₹1,500 - ₹3,000"
    },
    image: "/images/products/lg-washer.jpg",
    description: "LG Front Load Washing Machines with steam technology, inverter direct drive motor, and smart diagnosis."
  },
  {
    id: "washer-ifb-topLoad",
    name: "IFB Top Load Washing Machine",
    category: "washing-machine",
    brand: "IFB",
    marketPrice: "₹20,990 - ₹35,990",
    repairCost: {
      motorReplacement: "₹4,000 - ₹8,000",
      agitatorReplacement: "₹1,800 - ₹3,500",
      pcbRepair: "₹2,500 - ₹5,000",
      timerReplacement: "₹1,000 - ₹2,000",
      pumpReplacement: "₹1,200 - ₹2,500"
    },
    image: "/images/products/ifb-washer.jpg",
    description: "IFB Top Load Washing Machines with aqua energie device for water softening and triadic pulsator."
  },

  // Microwave Ovens
  {
    id: "microwave-samsung-convection",
    name: "Samsung Convection Microwave Oven",
    category: "microwave",
    brand: "Samsung",
    marketPrice: "₹12,990 - ₹28,990",
    repairCost: {
      magnetronReplacement: "₹3,500 - ₹7,000",
      touchpadReplacement: "₹2,000 - ₹4,000",
      transformerReplacement: "₹1,800 - ₹3,500",
      doorSwitchRepair: "₹800 - ₹1,500",
      turntableMotorReplacement: "₹600 - ₹1,200"
    },
    image: "/images/products/samsung-microwave.jpg",
    description: "Samsung Convection Microwave Ovens with SlimFry technology, ceramic enamel interior, and multiple cooking modes."
  },

  // Gaming Consoles
  {
    id: "console-sony-ps5",
    name: "Sony PlayStation 5",
    category: "gaming-console",
    brand: "Sony",
    marketPrice: "₹49,990 - ₹54,990",
    repairCost: {
      motherboardRepair: "₹12,000 - ₹20,000",
      powerSupplyReplacement: "₹5,000 - ₹8,000",
      hdmiPortRepair: "₹3,500 - ₹6,000",
      diskDriveReplacement: "₹7,000 - ₹12,000",
      coolingFanReplacement: "₹2,500 - ₹4,000"
    },
    image: "/images/products/ps5.jpg",
    description: "PlayStation 5 with ultra-high-speed SSD, ray tracing, 4K gaming, and haptic feedback controllers."
  },
  {
    id: "console-microsoft-xbox",
    name: "Microsoft Xbox Series X",
    category: "gaming-console",
    brand: "Microsoft",
    marketPrice: "₹49,990 - ₹52,990",
    repairCost: {
      motherboardRepair: "₹10,000 - ₹18,000",
      powerSupplyReplacement: "₹4,500 - ₹7,500",
      hdmiPortRepair: "₹3,000 - ₹5,500",
      diskDriveReplacement: "₹6,000 - ₹10,000",
      coolingFanReplacement: "₹2,000 - ₹3,500"
    },
    image: "/images/products/xbox-series-x.jpg",
    description: "Xbox Series X with 12 teraflops of processing power, 4K gaming at up to 120fps, and quick resume feature."
  }
];

// Function to get all products
export const getAllProducts = () => {
  return products;
};

// Function to get product by ID
export const getProductById = (id) => {
  return products.find(product => product.id === id);
};

// Function to get products by category
export const getProductsByCategory = (category) => {
  return products.filter(product => product.category === category);
};

// Function to get products by brand
export const getProductsByBrand = (brand) => {
  return products.filter(product => product.brand === brand);
};

// Function to get all product categories
export const getAllProductCategories = () => {
  const categories = [...new Set(products.map(product => product.category))];
  return categories;
};

// Function to get all product brands
export const getAllProductBrands = () => {
  const brands = [...new Set(products.map(product => product.brand))];
  return brands;
};

export default products; 