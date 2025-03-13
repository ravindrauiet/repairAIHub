const services = [
  {
    id: "tv-repair",
    title: "TV Repair Services",
    shortDescription: "Professional TV repair services for all brands and models. We fix display issues, sound problems, power failures and more.",
    fullDescription: `
      At RepairAIHub, we offer comprehensive TV repair services for all brands and models. 
      Our team of certified technicians have years of experience diagnosing and fixing a wide range of TV issues.
      
      Whether you're dealing with a blank screen, distorted image, sound problems, or your TV won't turn on at all,
      our experts can identify the issue and provide a cost-effective solution to get your television working perfectly again.
    `,
    benefits: [
      "Expert repair for all major TV brands including Samsung, LG, Sony, and more",
      "Fix for common issues like display problems, sound issues, connectivity problems",
      "Fast, reliable service with genuine parts",
      "Competitive pricing with no hidden fees",
      "In-home service available for most repairs"
    ],
    process: [
      "Initial diagnosis to identify the exact issue",
      "Transparent quote provided before any work begins",
      "Professional repair using high-quality replacement parts when needed",
      "Thorough testing to ensure everything works perfectly",
      "Follow-up support to make sure you're satisfied with the repair"
    ],
    pricing: [
      { service: "Diagnostic Fee", price: "₹499 (waived if repair completed)" },
      { service: "Screen Replacement", price: "Starts at ₹4,999" },
      { service: "Power Supply Repair", price: "Starts at ₹1,499" },
      { service: "Backlight Repair", price: "Starts at ₹2,499" },
      { service: "Motherboard Repair", price: "Starts at ₹3,499" }
    ],
    faqs: [
      {
        question: "How long does a typical TV repair take?",
        answer: "Most TV repairs can be completed in 1-3 days, depending on the issue and availability of parts. Simple repairs may be completed on the same day."
      },
      {
        question: "Do you provide in-home TV repair services?",
        answer: "Yes, we offer in-home repair services for most TV issues. Our technicians will come to your location, diagnose the problem, and often fix it right there."
      },
      {
        question: "What brands of TVs do you repair?",
        answer: "We repair all major TV brands including Samsung, LG, Sony, Vizio, TCL, Hisense, Panasonic, Sharp, Philips, and many others."
      },
      {
        question: "Is there a warranty on your TV repairs?",
        answer: "Yes, all of our TV repairs come with a 90-day warranty on both parts and labor. If you experience the same issue within this period, we'll fix it at no additional cost."
      },
      {
        question: "My TV screen is cracked. Can it be repaired?",
        answer: "Yes, we can replace cracked or damaged screens. The cost varies depending on your TV model and screen size."
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
  },
  {
    id: "mobile-repair",
    title: "Mobile Phone Repair",
    shortDescription: "Fast and reliable repair services for all smartphones. We fix screen damage, battery issues, charging problems and more.",
    fullDescription: `
      RepairAIHub provides comprehensive smartphone repair services for all major brands including iPhone, Samsung, Google Pixel, and more.
      Our certified technicians are experts at diagnosing and fixing a wide variety of smartphone issues quickly and affordably.
      
      From cracked screens and battery replacements to water damage recovery and software issues, we have the tools
      and expertise to get your device working like new again. We use only high-quality replacement parts and offer a warranty on all repairs.
    `,
    benefits: [
      "Expert repair for all major smartphone brands",
      "Quick turnaround times - many repairs completed same day",
      "High-quality replacement parts",
      "Data preservation during repairs",
      "Competitive pricing with transparent quotes"
    ],
    process: [
      "Free diagnostic assessment of your device",
      "Detailed explanation of the issue and repair options",
      "Quick and professional repair using quality parts",
      "Thorough testing to ensure all functions work properly",
      "Final quality check before returning your device"
    ],
    pricing: [
      { service: "Screen Replacement", price: "Starts at ₹1,499" },
      { service: "Battery Replacement", price: "Starts at ₹999" },
      { service: "Charging Port Repair", price: "Starts at ₹899" },
      { service: "Water Damage Treatment", price: "Starts at ₹1,999" },
      { service: "Camera Replacement", price: "Starts at ₹1,299" }
    ],
    faqs: [
      {
        question: "How long does it take to repair a phone screen?",
        answer: "Most screen replacements can be completed within 1-2 hours, depending on the model and our current workload."
      },
      {
        question: "Will I lose my data during the repair?",
        answer: "No, most repairs including screen and battery replacements do not affect your data. However, we always recommend backing up your device before any repair as a precaution."
      },
      {
        question: "Do you use original manufacturer parts?",
        answer: "We offer both original manufacturer parts and high-quality aftermarket parts. Original parts cost more but provide the same experience as a new device. We'll discuss options with you before the repair."
      },
      {
        question: "Can you fix a phone that won't turn on?",
        answer: "Yes, we can diagnose and fix phones that won't power on. This could be due to battery issues, charging port problems, water damage, or motherboard faults."
      },
      {
        question: "Is there a warranty on phone repairs?",
        answer: "Yes, all our mobile repairs come with a 90-day warranty covering both parts and labor for the specific repair performed."
      }
    ],
    imageUrl: "https://images.unsplash.com/photo-1580910051074-3eb694886505?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80"
  },
  {
    id: "ac-repair",
    title: "AC Repair Services",
    shortDescription: "Complete air conditioning repair and maintenance services. We handle cooling issues, strange noises, leaks, and regular servicing.",
    fullDescription: `
      RepairAIHub offers comprehensive air conditioning repair and maintenance services for residential and light commercial units.
      Our HVAC technicians are fully licensed and experienced in working with all major AC brands and models.
      
      Whether your AC isn't cooling properly, is making unusual noises, leaking, or simply needs a tune-up,
      our team provides fast, reliable service to keep your indoor environment comfortable and your energy bills reasonable.
      We specialize in diagnostics, repairs, preventative maintenance, and replacement of air conditioning systems.
    `,
    benefits: [
      "Licensed and certified AC repair technicians",
      "Service for all major air conditioner brands and models",
      "24/7 emergency AC repair service available",
      "Transparent pricing with detailed quotes",
      "Regular maintenance plans to prevent future issues"
    ],
    process: [
      "Comprehensive diagnostic assessment of your AC system",
      "Detailed explanation of issues found and repair options",
      "Professional repair service using quality parts",
      "System testing and optimization after repair",
      "Maintenance recommendations to prevent future problems"
    ],
    pricing: [
      { service: "Diagnostic Service", price: "₹799" },
      { service: "Basic AC Tune-up", price: "₹1,499" },
      { service: "Refrigerant Recharge", price: "Starts at ₹2,499" },
      { service: "Compressor Replacement", price: "Starts at ₹7,999" },
      { service: "Annual Maintenance Plan", price: "₹3,999/year" }
    ],
    faqs: [
      {
        question: "How often should I service my AC unit?",
        answer: "For optimal performance and longevity, we recommend servicing your AC unit at least once a year, preferably before the summer season begins."
      },
      {
        question: "What are signs that my AC needs repair?",
        answer: "Common signs include: insufficient cooling, unusual noises, water leaks, bad odors, high energy bills, and frequent cycling on and off."
      },
      {
        question: "How long does an AC repair typically take?",
        answer: "Most standard AC repairs can be completed within 1-3 hours. More complex issues like compressor replacements may take 4-6 hours or require multiple visits."
      },
      {
        question: "Do you offer emergency AC repair services?",
        answer: "Yes, we offer 24/7 emergency AC repair services for situations where you need immediate assistance, especially during extreme weather conditions."
      },
      {
        question: "What brands of air conditioners do you service?",
        answer: "We service all major brands including Voltas, Blue Star, Daikin, LG, Samsung, Carrier, Hitachi, Mitsubishi, O General, and many others."
      }
    ],
    imageUrl: "https://img.freepik.com/free-photo/checking-conditioner_1098-17787.jpg?t=st=1741893895~exp=1741897495~hmac=3c16309b9a2850b8641149593c8ed2ce6ca16aa9206a5ea197f5060cf406daac&w=1380"
  },
  {
    id: "refrigerator-repair",
    title: "Refrigerator Repair",
    shortDescription: "Expert refrigerator repair services for all brands. We fix cooling problems, ice maker issues, water leaks, and unusual noises.",
    fullDescription: `
      RepairAIHub provides professional refrigerator repair services for all types and brands of refrigerators, including side-by-side, French door, bottom freezer, and top freezer models.
      Our certified technicians have extensive experience diagnosing and fixing a wide range of refrigerator problems.
      
      Whether your refrigerator isn't cooling properly, the ice maker is malfunctioning, you're experiencing water leaks, or hearing unusual noises,
      our team can quickly identify the issue and provide an effective, long-lasting solution. We understand how critical your refrigerator is to your daily life,
      which is why we prioritize fast service and quality repairs.
    `,
    benefits: [
      "Experienced technicians specialized in refrigerator repair",
      "Service for all refrigerator types and major brands",
      "Same-day service often available for urgent issues",
      "Genuine replacement parts for lasting repairs",
      "Affordable service with no hidden costs"
    ],
    process: [
      "Detailed diagnostic assessment of your refrigerator",
      "Clear explanation of the problem and repair options",
      "Efficient repair using quality replacement parts when needed",
      "Thorough testing to ensure proper operation",
      "Tips for maintaining your refrigerator and preventing future issues"
    ],
    pricing: [
      { service: "Diagnostic Fee", price: "₹799 (waived with repair)" },
      { service: "Thermostat Replacement", price: "Starts at ₹1,999" },
      { service: "Compressor Repair/Replace", price: "Starts at ₹4,999" },
      { service: "Ice Maker Repair", price: "Starts at ₹2,499" },
      { service: "Door Seal Replacement", price: "Starts at ₹1,499" }
    ],
    faqs: [
      {
        question: "How long does a refrigerator repair usually take?",
        answer: "Most refrigerator repairs can be completed in a single visit lasting 1-2 hours. More complex issues might take longer or require ordering special parts."
      },
      {
        question: "What are common signs that my refrigerator needs repair?",
        answer: "Common signs include: insufficient cooling, excessive frost buildup, water leaking on the floor, unusual noises, refrigerator cycling too frequently, or food spoiling prematurely."
      },
      {
        question: "Do I need to empty my refrigerator before your repair visit?",
        answer: "It's not always necessary to empty your refrigerator completely, but we recommend removing items from areas that might need to be accessed during the repair. We'll advise you on this when you schedule your appointment."
      },
      {
        question: "How can I maintain my refrigerator to avoid repairs?",
        answer: "Regular maintenance includes: cleaning the condenser coils, checking door seals, keeping the refrigerator at the proper temperature (2-4°C), not overloading it, and ensuring proper ventilation around the unit."
      },
      {
        question: "Is it worth repairing an old refrigerator?",
        answer: "Generally, if your refrigerator is less than 8 years old and the repair cost is less than half the price of a new unit, repair is often worth it. We can help you evaluate the most cost-effective option for your situation."
      }
    ],
    imageUrl: "https://watermark.lovepik.com/photo/20211127/large/lovepik-workers-come-to-repair-refrigerators-picture_501157481.jpg"
  },
  {
    id: "ro-repair",
    title: "RO System Repair",
    shortDescription: "Comprehensive repair and maintenance for all types of RO water purification systems. We fix leaks, low water output, quality issues, and more.",
    fullDescription: `
      RepairAIHub offers specialized repair and maintenance services for all types of Reverse Osmosis (RO) water purification systems.
      Our technicians are trained and certified to work on domestic and commercial RO units from all major manufacturers.
      
      From addressing water quality issues and slow filtration rates to fixing leaks and replacing membranes and filters,
      we provide comprehensive solutions to keep your water purification system operating at peak efficiency.
      We understand the importance of clean, safe drinking water and prioritize quality workmanship and prompt service.
    `,
    benefits: [
      "Specialized technicians for RO system repairs",
      "Service for all major RO brands and models",
      "High-quality replacement filters and membranes",
      "Comprehensive system evaluation",
      "Maintenance plans to ensure continuous clean water"
    ],
    process: [
      "Complete diagnostic assessment of your RO system",
      "Water quality testing to identify potential issues",
      "Professional repair and part replacement as needed",
      "System sanitization and flushing",
      "Post-repair testing to ensure optimal performance"
    ],
    pricing: [
      { service: "System Diagnostic", price: "₹599" },
      { service: "Filter Replacement (Set)", price: "Starts at ₹1,499" },
      { service: "Membrane Replacement", price: "Starts at ₹1,999" },
      { service: "Leak Repair", price: "Starts at ₹899" },
      { service: "Annual Maintenance", price: "₹2,499/year" }
    ],
    faqs: [
      {
        question: "How often should I service my RO system?",
        answer: "For optimal performance and water quality, we recommend servicing your RO system annually, with filter replacements typically needed every 6-12 months depending on usage and water quality."
      },
      {
        question: "What are signs that my RO system needs repair?",
        answer: "Common signs include: reduced water flow, unusual taste or odor in the water, cloudy appearance, leaks around the system, unusual noises from the system, or the system constantly running."
      },
      {
        question: "How long does it take to repair an RO system?",
        answer: "Most RO system repairs can be completed within 1-2 hours. Routine maintenance like filter changes may take as little as 30 minutes."
      },
      {
        question: "Will I need to replace my entire RO system if it's malfunctioning?",
        answer: "In most cases, no. RO systems are designed with replaceable components, so typically only the specific malfunctioning part needs to be replaced, such as a filter, membrane, or pump."
      },
      {
        question: "Can you install water quality monitoring systems?",
        answer: "Yes, we can install TDS (Total Dissolved Solids) monitors and other water quality monitoring systems to help you track your water quality and know exactly when maintenance is needed."
      }
    ],
    imageUrl: "https://media.istockphoto.com/id/1499501309/photo/reverse-osmosis-water-filter-system.jpg?s=612x612&w=0&k=20&c=3I3sknhP_Q4Rf8GXsP2mkrC8yAiXrCZh8ywvus_zMkc="
  }
];

export default services;

export const getServiceById = (id) => {
  return services.find(service => service.id === id) || null;
};

export const getAllServices = () => {
  return services;
}; 