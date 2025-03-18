const services = [
  {
    id: "tv-repair",
    title: "TV/LED Repair",
    category: "Electronics",
    icon: "tv",
    shortDescription: "Professional repair services for all types of televisions including LED, LCD, OLED, and Plasma TVs.",
    priceRange: "₹500 - ₹8,000",
    image: "/images/services/tv-repair.jpg",
    features: [
      "Screen replacement",
      "Power supply repair",
      "Backlight replacement",
      "Board-level repairs",
      "Software updates"
    ],
    longDescription: "Our TV repair service covers all brands and models, from traditional CRT televisions to the latest OLED and QLED displays. Our technicians are trained to diagnose and fix a wide range of issues including display problems, audio issues, power supply failures, and smart TV software errors. We use genuine replacement parts to ensure the longevity of your repaired television.",
    faqs: [
      {
        question: "How long does a typical TV repair take?",
        answer: "Most TV repairs are completed within 24-48 hours. However, complex issues or repairs requiring special parts may take 3-5 business days. We'll provide you with an estimated timeline when you book the service."
      },
      {
        question: "Do you offer on-site TV repair services?",
        answer: "Yes, we offer on-site repair for most issues. Our technicians come equipped with common replacement parts and tools. For more complex repairs, we may need to take your TV to our service center."
      },
      {
        question: "What are the most common TV problems you repair?",
        answer: "The most common issues we address include: no picture but sound works, power-related problems, screen flickering or lines, HDMI port failures, backlight issues, and smart TV software problems."
      },
      {
        question: "How much does TV repair typically cost?",
        answer: "TV repair costs depend on the issue and model. Simple repairs may cost as little as ₹500-1,500, while screen replacements can range from ₹8,000-60,000 depending on the TV model and screen size. We provide a free diagnosis and quote before proceeding with repairs."
      },
      {
        question: "Do you repair all TV brands?",
        answer: "Yes, our technicians are trained to repair all major brands including Samsung, LG, Sony, OnePlus, MI, Vu, Panasonic, and others."
      },
      {
        question: "Is it worth repairing my old TV?",
        answer: "It depends on your TV's age, model, and the repair cost. As a general rule, if the repair cost exceeds 50% of a new TV's price, replacement might be more economical. Our technicians can help you make an informed decision."
      },
      {
        question: "What warranty do you provide on TV repairs?",
        answer: "All our TV repairs come with a 90-day warranty covering both parts and labor. For premium services, we offer extended warranty options up to 12 months."
      },
      {
        question: "How can I prevent common TV problems?",
        answer: "To extend your TV's life: ensure proper ventilation, avoid extreme temperatures, use surge protectors, clean regularly (when powered off), update software regularly, and avoid leaving static images on screen for extended periods."
      }
    ]
  },
  {
    id: "mobile-repair",
    title: "Mobile Phone Repair",
    category: "Electronics",
    icon: "mobile-alt",
    shortDescription: "Fast and reliable repairs for all smartphone brands",
    imageUrl: "https://images.unsplash.com/photo-1580795479207-9e71b48c2a53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    priceRange: "₹299 - ₹15,000",
    features: [
      "Screen replacement",
      "Battery replacement",
      "Charging port repair",
      "Water damage recovery",
      "Camera repair"
    ],
    longDescription: "Our mobile repair experts can fix screens, batteries, charging ports and more for all major smartphone brands. We use only genuine parts and offer warranty on all repairs."
  },
  {
    id: "ac-repair",
    title: "AC Repair Services",
    category: "Home Appliances",
    icon: "wind",
    shortDescription: "Complete air conditioner repair, maintenance and installation services.",
    imageUrl: "https://images.unsplash.com/photo-1614181680133-e9a8fcb50c05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRange: "₹800 - ₹5,000",
    features: [
      "Cooling efficiency restoration",
      "Gas refilling",
      "Filter cleaning/replacement",
      "Compressor repair",
      "Annual maintenance"
    ],
    longDescription: "Our comprehensive AC repair service covers everything from routine maintenance to major repairs. We service all types of air conditioners including split, window, and central AC systems. Our certified technicians can diagnose and fix issues like inadequate cooling, strange noises, water leakage, and electrical problems."
  },
  {
    id: "refrigerator-repair",
    title: "Refrigerator Repair",
    category: "Home Appliances",
    icon: "snowflake",
    shortDescription: "Reliable repair solutions for all refrigerator models",
    imageUrl: "https://images.unsplash.com/photo-1659607423251-3e46c9d0ca7a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRange: "₹700 - ₹4,500",
    features: [
      "Cooling system repairs",
      "Compressor replacement",
      "Thermostat calibration",
      "Ice maker repair",
      "Door seal replacement"
    ],
    longDescription: "We offer comprehensive refrigerator repair services for all types including side-by-side, double-door, single-door, and bottom freezer models. Our technicians can fix cooling issues, ice maker problems, water dispensers, and more."
  },
  {
    id: "ro-repair",
    title: "RO System Repair",
    category: "Home Appliances",
    icon: "tint",
    shortDescription: "Complete water purifier repair and maintenance services",
    imageUrl: "https://images.unsplash.com/photo-1607465227100-276c3dd6bf08?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRange: "₹350 - ₹2,500",
    features: [
      "Complete RO system servicing",
      "Filter replacement and cleaning",
      "UV lamp replacement",
      "Motor and pump repairs",
      "TDS controller adjustment",
      "Leakage and low pressure fixes"
    ],
    longDescription: "Our RO repair services ensure your water purifier functions optimally. We service all brands including Kent, Aquaguard, Pureit, and more to provide safe and clean drinking water for your family."
  },
  {
    id: "washing-machine-repair",
    title: "Washing Machine Repair",
    category: "Home Appliances",
    icon: "washing-machine",
    shortDescription: "Expert washing machine repair for all major brands and common issues.",
    imageUrl: "https://images.unsplash.com/photo-1626806787461-102c1a6f2864?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
    priceRange: "₹500 - ₹4,000",
    features: [
      "Motor replacement",
      "Drum repairs",
      "Control board fixes",
      "Water inlet/drain issues",
      "Noise problem solutions"
    ],
    longDescription: "Our washing machine repair service covers all major brands including Samsung, LG, Whirlpool, and Bosch. We can diagnose and fix most common issues from water leaks to strange noises and spin cycle problems. All our repairs come with a service guarantee."
  },
  {
    id: "geyser-repair",
    title: "Geyser Repair Services",
    category: "Home Appliances",
    icon: "hot-tub",
    shortDescription: "Fast and reliable geyser and water heater repair services.",
    imageUrl: "https://images.unsplash.com/photo-1585670209793-8b9eecf3fa12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    priceRange: "₹400 - ₹3,000",
    features: [
      "Heating element replacement",
      "Thermostat repair",
      "Leak fixing",
      "Pressure valve replacement",
      "Complete installation"
    ],
    longDescription: "Keep your hot water running with our professional geyser and water heater repair services. Our certified technicians can diagnose and fix all types of water heater problems, from no hot water to leaks and strange noises. We work with all brands and models of electric, gas, and solar water heaters."
  },
  {
    id: "laptop-repair",
    title: "Laptop Repair",
    category: "Electronics",
    icon: "laptop",
    shortDescription: "Expert laptop repair and upgrade services for all brands.",
    imageUrl: "/images/services/laptop-repair.jpg",
    priceRange: "₹500 - ₹12,000",
    features: [
      "Screen replacement",
      "Keyboard replacement",
      "Battery replacement",
      "Hardware upgrades",
      "Data recovery"
    ],
    longDescription: "Our laptop repair services cover all major brands including Dell, HP, Lenovo, Apple, Asus, and more. We can diagnose and fix issues like screen problems, keyboard failures, battery issues, overheating, and software problems. We also provide hardware upgrades to improve performance."
  },
  {
    id: "microwave-repair",
    title: "Microwave Repair",
    category: "Home Appliances",
    icon: "radiation",
    shortDescription: "Fast and reliable microwave oven repair services.",
    imageUrl: "/images/services/microwave-repair.jpg",
    priceRange: "₹350 - ₹2,500",
    features: [
      "Heating element repair",
      "Door switch replacement",
      "Turntable motor fixing",
      "Control panel repair",
      "Magnetron replacement"
    ],
    longDescription: "Our microwave repair services cover both countertop and built-in models of all brands. Our technicians can fix common issues like heating problems, turntable malfunctions, unusual noises, and display errors. We provide quick service with quality replacement parts."
  },
  {
    id: "computer-repair",
    title: "Desktop Computer Repair",
    category: "Electronics",
    icon: "desktop",
    shortDescription: "Complete desktop computer repair, upgrade and maintenance services.",
    imageUrl: "/images/services/computer-repair.jpg",
    priceRange: "₹500 - ₹10,000",
    features: [
      "Hardware troubleshooting",
      "Component upgrades",
      "Virus removal",
      "Operating system reinstallation",
      "Custom PC building"
    ],
    longDescription: "Our desktop computer repair services include hardware diagnostics, component replacement, performance upgrades, virus removal, and data recovery. We service all brands and configurations. Whether you need a simple RAM upgrade or a complete system overhaul, our technicians can help get your computer running at its best."
  },
  {
    id: "printer-repair",
    title: "Printer Repair",
    category: "Electronics",
    icon: "print",
    shortDescription: "Professional printer repair for inkjet, laser, and all-in-one models.",
    imageUrl: "/images/services/printer-repair.jpg",
    priceRange: "₹400 - ₹3,500",
    features: [
      "Paper jam resolution",
      "Print quality improvement",
      "Cartridge system repair",
      "Connectivity issues",
      "Printhead cleaning"
    ],
    longDescription: "Our printer repair services cover all major brands including HP, Canon, Epson, and Brother. We can fix common issues like paper jams, poor print quality, connectivity problems, and error messages. Our technicians are experienced with both inkjet and laser printer technologies."
  },
  {
    id: "camera-repair",
    title: "Camera Repair",
    category: "Electronics",
    icon: "camera",
    shortDescription: "Professional repair services for DSLR, mirrorless and digital cameras.",
    imageUrl: "/images/services/camera-repair.jpg",
    priceRange: "₹600 - ₹15,000",
    features: [
      "Lens repair",
      "Sensor cleaning",
      "Shutter mechanism fixes",
      "Button/dial replacement",
      "Water damage recovery"
    ],
    longDescription: "Our camera repair specialists can fix issues with DSLR, mirrorless, and compact digital cameras from brands like Canon, Nikon, Sony, and Fujifilm. We provide services for lens problems, sensor issues, shutter failures, and electronic malfunctions. All repairs are performed by experienced technicians using proper tools and quality parts."
  },
  {
    id: "gaming-console-repair",
    title: "Gaming Console Repair",
    category: "Electronics",
    icon: "gamepad",
    shortDescription: "Expert repair services for PlayStation, Xbox, Nintendo and other gaming consoles.",
    imageUrl: "/images/services/console-repair.jpg",
    priceRange: "₹500 - ₹8,000",
    features: [
      "HDMI port repair",
      "Disc drive replacement",
      "Overheating solutions",
      "Controller repair",
      "System error fixing"
    ],
    longDescription: "We provide professional repair services for all gaming consoles including PlayStation, Xbox, and Nintendo systems. Our technicians can fix common issues like HDMI port failures, disc reading problems, overheating, controller malfunctions, and various error codes. Get your gaming system back in action with our fast and reliable service."
  }
];

export default services;

export const getServiceById = (id) => {
  return services.find(service => service.id === id) || null;
};

export const getAllServices = () => {
  return services;
};

export const getServicesByCategory = (category) => {
  return services.filter(service => service.category === category);
};

export const getAllServiceCategories = () => {
  const categories = services.map(service => service.category);
  return [...new Set(categories)];
}; 