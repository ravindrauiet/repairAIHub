import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory, brands, deviceModels } from '../data/products.jsx';
import '../styles/modelService.css';

const ModelServicePage = () => {
  const { category, brandId, modelId } = useParams();
  const [loading, setLoading] = useState(true);
  const [brand, setBrand] = useState(null);
  const [model, setModel] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [modelInfo, setModelInfo] = useState({
    description: '',
    repairProcess: '',
    videoId: '',
    commonIssues: [],
    diyGuides: {},
    parts: []
  });

  useEffect(() => {
    // Get brand info
    const brandInfo = brands.find(b => b.id === brandId);
    setBrand(brandInfo);

    // Get model info for this brand
    let allModels = [];
    if (deviceModels[brandId]) {
      allModels = deviceModels[brandId];
    }
    const modelData = allModels.find(m => m.id === modelId);
    setModel(modelData);

    // Get products for this category
    const categoryProducts = getProductsByCategory(category);
    setProducts(categoryProducts);

    // Set model-specific repair information (demo data)
    setModelInfo(getModelSpecificInfo(brandId, modelId, category));

    setLoading(false);
  }, [category, brandId, modelId]);

  const getModelSpecificInfo = (brand, model, category) => {
    // This would be fetched from backend in a real app
    // For now, we'll return demo content based on brand + model + category
    
    const defaultVideo = {
      mobile: 'xRH9zNCJZIY', // Generic mobile repair video
      'tv-repair': 'c9NhDl_rnMI',     // Generic TV repair video
      'laptop-repair': 'HWvJ5tXJkxk',  // Generic laptop repair video
      'ac-repair': 'jZMXQCgkL_I',     // Generic AC repair video
      'washing-machine-repair': '34DjkM5r90I', // Generic washing machine repair
      'refrigerator-repair': '8YHQtQVhQO4' // Generic refrigerator repair
    };

    // Create common issues based on category
    const getCommonIssues = (category) => {
      // Default common issues
      const defaultIssues = [
        {
          title: 'Power Issues',
          description: `Problems with the device not turning on, randomly shutting down, or having power-related malfunctions.`,
          possibleCauses: [
            'Faulty power supply',
            'Battery/power connection issues',
            'Internal component failure',
            'Software/firmware problems'
          ],
          diyDifficulty: 'Medium to High'
        },
        {
          title: 'Performance Problems',
          description: `Slow operation, freezing, or unresponsive behavior.`,
          possibleCauses: [
            'Outdated software/firmware',
            'Hardware limitations',
            'Component failure',
            'Overheating issues'
          ],
          diyDifficulty: 'Medium'
        }
      ];

      // Category-specific issues
      const categoryIssues = {
        'tv-repair': [
          {
            title: 'Screen Display Issues',
            description: 'Problems with the display such as black screen, distorted colors, flickering, or dead pixels.',
            possibleCauses: [
              'Faulty T-Con board',
              'Damaged display panel',
              'Power supply board issues',
              'Loose cable connections'
            ],
            diyDifficulty: 'Medium to High'
          },
          {
            title: 'Sound Problems',
            description: 'No audio, distorted sound, or buzzing noises coming from speakers.',
            possibleCauses: [
              'Faulty speakers',
              'Audio board failure',
              'Software glitches',
              'Incorrect audio settings'
            ],
            diyDifficulty: 'Medium'
          },
          {
            title: 'Smart TV Features Not Working',
            description: 'Apps not loading, WiFi connectivity issues, or streaming problems.',
            possibleCauses: [
              'Software bugs',
              'Network connectivity issues',
              'Outdated firmware',
              'Main board problems'
            ],
            diyDifficulty: 'Low to Medium'
          }
        ],
        'laptop-repair': [
          {
            title: 'Screen Display Issues',
            description: 'Problems with the display such as black screen, distorted colors, flickering, or cracked screen.',
            possibleCauses: [
              'Damaged LCD/LED panel',
              'Faulty display cable',
              'Graphics card failure',
              'Motherboard issues'
            ],
            diyDifficulty: 'Medium to High'
          },
          {
            title: 'Battery Problems',
            description: 'Battery not charging, quick drainage, or swelling.',
            possibleCauses: [
              'Worn out battery',
              'Charging port issues',
              'Power adapter failure',
              'Motherboard charging circuit problems'
            ],
            diyDifficulty: 'Low to Medium'
          },
          {
            title: 'Keyboard/Touchpad Malfunctions',
            description: 'Keys not working, touchpad unresponsive, or erratic cursor movement.',
            possibleCauses: [
              'Liquid damage',
              'Dust accumulation',
              'Driver issues',
              'Hardware failure'
            ],
            diyDifficulty: 'Medium'
          }
        ],
        'mobile': [
          {
            title: 'Screen Issues',
            description: 'Cracked screen, touch response problems, or display discoloration.',
            possibleCauses: [
              'Physical damage',
              'Loose connections',
              'Display controller failure',
              'Software glitches'
            ],
            diyDifficulty: 'High'
          },
          {
            title: 'Battery Problems',
            description: 'Quick battery drain, overheating, or not charging properly.',
            possibleCauses: [
              'Aged battery',
              'Charging port damage',
              'Software optimization issues',
              'Moisture damage'
            ],
            diyDifficulty: 'Medium'
          },
          {
            title: 'Camera Not Working',
            description: 'Blurry photos, camera app crashing, or black screen when opening camera.',
            possibleCauses: [
              'Software bugs',
              'Physical damage to lens',
              'Camera module failure',
              'Loose connections'
            ],
            diyDifficulty: 'High'
          }
        ],
        'ac-repair': [
          {
            title: 'Not Cooling Properly',
            description: 'AC running but not lowering temperature or weak airflow.',
            possibleCauses: [
              'Refrigerant leak',
              'Dirty filters',
              'Compressor issues',
              'Thermostat problems'
            ],
            diyDifficulty: 'Medium to High'
          },
          {
            title: 'Strange Noises',
            description: 'Grinding, squealing, or rattling sounds during operation.',
            possibleCauses: [
              'Loose parts',
              'Fan blade issues',
              'Compressor problems',
              'Debris in unit'
            ],
            diyDifficulty: 'Medium'
          },
          {
            title: 'Water Leakage',
            description: 'Water dripping from indoor unit or pooling around outdoor unit.',
            possibleCauses: [
              'Clogged drain line',
              'Dirty filters',
              'Low refrigerant',
              'Installation issues'
            ],
            diyDifficulty: 'Low to Medium'
          }
        ]
      };

      // Return category-specific issues if available, otherwise return default issues
      return (categoryIssues[category] || []).concat(defaultIssues);
    };

    // Get DIY guides based on category
    const getDiyGuides = (category) => {
      const defaultGuides = {
        diagnostics: `
          <h4>General Diagnostic Steps</h4>
          <ol>
            <li>
              <strong>Power Cycling:</strong> Turn off the device, unplug it, wait for 60 seconds, and plug it back in. This simple step can resolve many software-related issues.
            </li>
            <li>
              <strong>Check Connections:</strong> Ensure all cables are properly connected and not damaged.
            </li>
            <li>
              <strong>Factory Reset:</strong> If your device is functioning but having software issues, try performing a reset following the manufacturer's instructions.
            </li>
            <li>
              <strong>Check for Visible Damage:</strong> Look for any physical damage that might be causing problems.
            </li>
          </ol>
        `
      };

      const categoryGuides = {
        'tv-repair': {
          screenRepair: `
            <h4>Screen Issues Troubleshooting</h4>
            <p>Before attempting any physical repair:</p>
            <ol>
              <li>Check if the issue appears on all inputs and channels</li>
              <li>Test with different source devices to isolate the problem</li>
              <li>Look for visible damage on the screen</li>
              <li>Check for loose ribbon cables if you open the TV</li>
            </ol>
            <div class="warning-box">
              <strong>Warning:</strong> TV screens contain high-voltage components. Only attempt repairs if you have the proper knowledge and tools. Always unplug the TV and discharge capacitors before working inside.
            </div>
          `,
          powerIssues: `
            <h4>Fixing Power Problems</h4>
            <p>Power issues are often related to the power supply board. Here's how to diagnose:</p>
            <ol>
              <li>Check if the standby light turns on</li>
              <li>Listen for clicking sounds when attempting to power on</li>
              <li>Test the wall outlet with another device</li>
              <li>Inspect the power cord for damage</li>
              <li>If you have the proper tools and experience, you can open the TV to check for blown capacitors or burnt components on the power board</li>
            </ol>
            <p>Common components that fail:</p>
            <ul>
              <li>Electrolytic capacitors (look for bulging or leaking)</li>
              <li>Power transistors</li>
              <li>Fuses</li>
            </ul>
          `
        },
        'laptop-repair': {
          screenRepair: `
            <h4>Screen Issues Troubleshooting</h4>
            <p>Before attempting any physical repair:</p>
            <ol>
              <li>Connect an external monitor to check if the issue is with the display or graphics card</li>
              <li>Update graphics drivers and check display settings</li>
              <li>Examine the laptop screen hinge and connections</li>
              <li>Look for any visible damage to the screen</li>
            </ol>
            <div class="warning-box">
              <strong>Warning:</strong> Laptop screens are delicate and can be easily damaged during repair. Only attempt to replace the screen if you have experience with electronic repairs.
            </div>
          `,
          batteryIssues: `
            <h4>Battery Problem Solutions</h4>
            <p>If your laptop battery is not performing well:</p>
            <ol>
              <li>Check battery health through system settings or manufacturer software</li>
              <li>Calibrate the battery (fully discharge then charge to 100%)</li>
              <li>Clean battery contacts if accessible</li>
              <li>Consider replacing the battery if it's more than 2-3 years old</li>
            </ol>
            <p>For battery replacement:</p>
            <ul>
              <li>Purchase a compatible battery for your specific model</li>
              <li>Power off the laptop completely before replacement</li>
              <li>Follow manufacturer guidelines for battery removal</li>
              <li>Properly dispose of the old battery at a recycling center</li>
            </ul>
          `
        },
        'mobile': {
          screenRepair: `
            <h4>Screen Replacement Guide</h4>
            <p>Before attempting to replace a phone screen:</p>
            <ol>
              <li>Back up all data on your device</li>
              <li>Power off the phone completely</li>
              <li>Gather proper tools: heat gun/hair dryer, plastic pry tools, screwdrivers</li>
              <li>Purchase the correct replacement screen for your exact model</li>
            </ol>
            <div class="warning-box">
              <strong>Warning:</strong> Phone screen replacement is complex and risks damaging other components. Modern phones often have screens glued to the frame with strong adhesive, making DIY repairs challenging. Consider professional repair services.
            </div>
          `,
          batteryReplacement: `
            <h4>Battery Replacement Tips</h4>
            <p>If your phone battery needs replacement:</p>
            <ol>
              <li>Back up your data and power off the device</li>
              <li>For phones with removable batteries, simply remove the back cover</li>
              <li>For non-removable battery phones, you'll need to open the device carefully</li>
              <li>Disconnect the battery connector before removing the old battery</li>
              <li>Never puncture or bend the battery during removal</li>
            </ol>
            <div class="warning-box">
              <strong>Warning:</strong> Lithium-ion batteries can catch fire if damaged. Handle with extreme care and never use metal tools directly on the battery.
            </div>
          `
        }
      };

      // Merge default guides with category-specific guides
      return {...defaultGuides, ...(categoryGuides[category] || {})};
    };

    // Get replacement parts based on category and brand/model
    const getReplacementParts = (category, brand, model) => {
      // Custom parts for Samsung Galaxy S24 Ultra
      if (brand === 'samsung' && model === 'galaxy-s24-ultra') {
        return [
          // Display & Screens
          {
            name: 'Display Combo Folder (Maxbhi)',
            id: 'samsung-s24u-display-combo',
            price: '$299.99',
            category: 'display',
            image: '/images/parts/displays/s24-display.jpg',
            description: 'Complete display assembly with touch functionality and frame for Samsung Galaxy S24 Ultra. Genuine Maxbhi part.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-display-combo-001'
          },
          {
            name: 'Front Glass Only (Maxbhi)',
            id: 'samsung-s24u-front-glass',
            price: '$89.99',
            category: 'display',
            image: '/images/parts/displays/s24-glass.jpg',
            description: 'Replacement front glass for Samsung Galaxy S24 Ultra. Does not include LCD or touch functionality. Genuine Maxbhi part.',
            installDifficulty: 'Very High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-front-glass-001'
          },
          
          // Body & Housings
          {
            name: 'Back Cover Panel (Maxbhi)',
            id: 'samsung-s24u-back-cover',
            price: '$69.99',
            category: 'body',
            image: '/images/parts/body/s24-back-cover.jpg',
            description: 'Original replacement back cover panel for Samsung Galaxy S24 Ultra with premium glass finish. Supplied by Maxbhi.',
            installDifficulty: 'Medium',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-back-cover-001'
          },
          {
            name: 'LCD Frame Middle Chassis',
            id: 'samsung-s24u-middle-frame',
            price: '$59.99',
            category: 'body',
            image: '/images/parts/body/s24-middle-frame.jpg',
            description: 'Middle frame housing for structural integrity and component mounting.',
            installDifficulty: 'Very High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-middle-frame-001'
          },
          {
            name: 'Volume Button Outer',
            id: 'samsung-s24u-volume-button',
            price: '$9.99',
            category: 'body',
            image: '/images/parts/body/s24-volume-button.jpg',
            description: 'External volume button replacement that matches the original finish.',
            installDifficulty: 'Medium',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-volume-button-001'
          },
          {
            name: 'Camera Lens',
            id: 'samsung-s24u-camera-lens',
            price: '$34.99',
            category: 'body',
            image: '/images/parts/body/s24-camera-lens.jpg',
            description: 'Replacement camera lens cover for the rear camera module.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-camera-lens-001'
          },
          
          // Battery
          {
            name: 'Battery',
            id: 'samsung-s24u-battery',
            price: '$49.99',
            category: 'battery',
            image: '/images/parts/battery/s24-battery.jpg',
            description: 'Original capacity replacement battery for Samsung Galaxy S24 Ultra (5000mAh).',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-battery-001'
          },
          
          // Internal Components
          {
            name: 'Front Camera (Maxbhi)',
            id: 'samsung-s24u-front-camera',
            price: '$49.99',
            category: 'internal',
            image: '/images/parts/internal/s24-front-camera.jpg',
            description: '12MP front camera module with same specifications as original. Genuine Maxbhi part.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-front-camera-001'
          },
          {
            name: 'Camera Motor (Maxbhi)',
            id: 'samsung-s24u-camera-motor',
            price: '$39.99',
            category: 'internal',
            image: '/images/parts/internal/s24-camera-motor.jpg',
            description: 'Camera focusing motor mechanism. Vendor: Maxbhi',
            installDifficulty: 'Very High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-camera-motor-001'
          },
          {
            name: 'Charging Connector Flex PCB Board',
            id: 'samsung-s24u-charging-connector-board',
            price: '$29.99',
            category: 'internal',
            image: '/images/parts/internal/s24-charging-board.jpg',
            description: 'Charging port connector flex board for reliable charging connection.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-charging-board-001'
          },
          {
            name: 'Main Board Flex Cable (Maxbhi)',
            id: 'samsung-s24u-main-flex',
            price: '$19.99',
            category: 'internal',
            image: '/images/parts/internal/s24-main-flex.jpg',
            description: 'Flexible cable connecting main components to motherboard. Genuine Maxbhi part.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-main-flex-001'
          },
          {
            name: 'LCD Flex Cable (Maxbhi)',
            id: 'samsung-s24u-lcd-flex',
            price: '$24.99',
            category: 'internal',
            image: '/images/parts/internal/s24-lcd-flex.jpg',
            description: 'Display connection cable for reliable screen operation. Supplied by Maxbhi.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-lcd-flex-001'
          },
          {
            name: 'Sim Tray Holder',
            id: 'samsung-s24u-sim-tray',
            price: '$12.99',
            category: 'internal',
            image: '/images/parts/internal/s24-sim-tray.jpg',
            description: 'Replacement SIM card and microSD card tray.',
            installDifficulty: 'Low',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-sim-tray-001'
          },
          {
            name: 'Camera Elevator (Maxbhi)',
            id: 'samsung-s24u-camera-elevator',
            price: '$44.99',
            category: 'internal',
            image: '/images/parts/internal/s24-camera-elevator.jpg',
            description: 'Camera module adjustment mechanism. Vendor: Maxbhi',
            installDifficulty: 'Very High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-camera-elevator-001'
          },
          {
            name: 'Power Button Outer',
            id: 'samsung-s24u-power-button',
            price: '$9.99',
            category: 'internal',
            image: '/images/parts/internal/s24-power-button.jpg',
            description: 'External power button that matches original finish and feel.',
            installDifficulty: 'Medium',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-power-button-001'
          },
          {
            name: 'Ear Speaker (Maxbhi)',
            id: 'samsung-s24u-ear-speaker',
            price: '$19.99',
            category: 'internal',
            image: '/images/parts/internal/s24-ear-speaker.jpg',
            description: 'Replacement earpiece speaker for clear call audio. Supplied by Maxbhi.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-ear-speaker-001'
          },
          {
            name: 'Ringer (Maxbhi)',
            id: 'samsung-s24u-ringer',
            price: '$22.99',
            category: 'internal',
            image: '/images/parts/internal/s24-ringer.jpg',
            description: 'Loudspeaker module for ringtones and media playback. Vendor: Maxbhi',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-ringer-001'
          },
          {
            name: 'Power Button Flex Cable',
            id: 'samsung-s24u-power-flex',
            price: '$24.99',
            category: 'internal',
            image: '/images/parts/internal/s24-power-flex.jpg',
            description: 'Power button connection cable with on/off functionality.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-power-flex-001'
          },
          {
            name: 'Fingerprint Sensor Flex Cable',
            id: 'samsung-s24u-fingerprint-flex',
            price: '$34.99',
            category: 'internal',
            image: '/images/parts/internal/s24-fingerprint-flex.jpg',
            description: 'Under-display fingerprint sensor connection module.',
            installDifficulty: 'Very High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-fingerprint-flex-001'
          },
          {
            name: 'Speaker Jaali Anti Dust Net Rubber',
            id: 'samsung-s24u-speaker-net',
            price: '$6.99',
            category: 'internal',
            image: '/images/parts/internal/s24-speaker-net.jpg',
            description: 'Protective mesh cover for speaker to prevent dust entry.',
            installDifficulty: 'Medium',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-speaker-net-001'
          },
          {
            name: 'LCD Connector (Maxbhi)',
            id: 'samsung-s24u-lcd-connector',
            price: '$14.99',
            category: 'internal',
            image: '/images/parts/internal/s24-lcd-connector.jpg',
            description: 'Display connection port on the motherboard side. Genuine Maxbhi part.',
            installDifficulty: 'Very High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-lcd-connector-001'
          },
          {
            name: 'Signal Cable (Maxbhi)',
            id: 'samsung-s24u-signal-cable',
            price: '$17.99',
            category: 'internal',
            image: '/images/parts/internal/s24-signal-cable.jpg',
            description: 'Antenna connection cables for network reception. Supplied by Maxbhi.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-signal-cable-001'
          },
          {
            name: 'Charging Connector',
            id: 'samsung-s24u-charging-connector',
            price: '$22.99',
            category: 'internal',
            image: '/images/parts/internal/s24-charging-connector.jpg',
            description: 'USB-C charging port component with fast charging capability.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-charging-connector-001'
          },
          {
            name: 'Volume Button Flex Cable',
            id: 'samsung-s24u-volume-flex',
            price: '$19.99',
            category: 'internal',
            image: '/images/parts/internal/s24-volume-flex.jpg',
            description: 'Volume control button connection cable.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-volume-flex-001'
          },
          {
            name: 'Battery Connector',
            id: 'samsung-s24u-battery-connector',
            price: '$14.99',
            category: 'internal',
            image: '/images/parts/internal/s24-battery-connector.jpg',
            description: 'Battery connection port on the motherboard.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-battery-connector-001'
          },
          {
            name: 'Microphone',
            id: 'samsung-s24u-microphone',
            price: '$12.99',
            category: 'internal',
            image: '/images/parts/internal/s24-microphone.jpg',
            description: 'Replacement microphone for clear voice capture.',
            installDifficulty: 'High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-microphone-001'
          },
          {
            name: 'Back Camera',
            id: 'samsung-s24u-back-camera',
            price: '$129.99',
            category: 'internal',
            image: '/images/parts/internal/s24-back-camera.jpg',
            description: 'Complete camera module with 200MP main + 50MP + 10MP + 12MP sensors.',
            installDifficulty: 'Very High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-back-camera-001'
          },
          {
            name: 'Board Connector',
            id: 'samsung-s24u-board-connector',
            price: '$16.99',
            category: 'internal',
            image: '/images/parts/internal/s24-board-connector.jpg',
            description: 'Various connectors for main motherboard components.',
            installDifficulty: 'Very High',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'samsung-s24u-board-connector-001'
          },
          
          // Repairing Tools
          {
            name: 'Glue for LCD and Touch',
            id: 'tool-lcd-glue-s24',
            price: '$12.99',
            category: 'tools',
            image: '/images/parts/tools/lcd-glue.jpg',
            description: 'Special adhesive for securing display and touch panel.',
            installDifficulty: 'N/A',
            compatibility: 'Universal',
            productId: 'repair-tool-lcd-glue-s24-001'
          },
          {
            name: 'Opening Tool Set (Maxbhi)',
            id: 'tool-opening-set-s24',
            price: '$15.99',
            category: 'tools',
            image: '/images/parts/tools/opening-set.jpg',
            description: 'Complete set of plastic pry tools for safe device opening. Supplied by Maxbhi.',
            installDifficulty: 'N/A',
            compatibility: 'Universal',
            productId: 'repair-tool-opening-set-s24-001'
          },
          {
            name: '32 Pcs Screw Driver Set',
            id: 'tool-screwdriver-set-s24',
            price: '$29.99',
            category: 'tools',
            image: '/images/parts/tools/screwdriver-set.jpg',
            description: 'Professional screwdriver kit with precision bits for mobile repair.',
            installDifficulty: 'N/A',
            compatibility: 'Universal',
            productId: 'repair-tool-screwdriver-set-s24-001'
          },
          {
            name: 'Suction Cup Tool (Maxbhi)',
            id: 'tool-suction-cup-s24',
            price: '$7.99',
            category: 'tools',
            image: '/images/parts/tools/suction-cup.jpg',
            description: 'Strong suction cup for lifting screens and back covers. Genuine Maxbhi tool.',
            installDifficulty: 'N/A',
            compatibility: 'Universal',
            productId: 'repair-tool-suction-cup-s24-001'
          },
          
          // Accessories
          {
            name: 'Wall Charger (Maxbhi)',
            id: 'acc-wall-charger-s24',
            price: '$24.99',
            category: 'accessories',
            image: '/images/parts/accessories/wall-charger.jpg',
            description: '45W fast charger compatible with Samsung Galaxy S24 Ultra. Supplied by Maxbhi.',
            installDifficulty: 'N/A',
            compatibility: 'Works with Samsung Galaxy S24 Ultra',
            productId: 'accessory-wall-charger-s24-001'
          },
          {
            name: 'Tempered Glass',
            id: 'acc-tempered-glass-s24',
            price: '$14.99',
            category: 'accessories',
            image: '/images/parts/accessories/tempered-glass.jpg',
            description: 'Premium screen protector with 9H hardness for Samsung Galaxy S24 Ultra.',
            installDifficulty: 'Easy',
            compatibility: 'Specific to Samsung Galaxy S24 Ultra',
            productId: 'accessory-tempered-glass-s24-001'
          },
          {
            name: 'Earphone',
            id: 'acc-earphone-s24',
            price: '$19.99',
            category: 'accessories',
            image: '/images/parts/accessories/earphone.jpg',
            description: 'High-quality USB-C earphones with mic and volume control.',
            installDifficulty: 'N/A',
            compatibility: 'Works with Samsung Galaxy S24 Ultra',
            productId: 'accessory-earphone-s24-001'
          },
          {
            name: '6 Port USB Multi Charger 20 watt',
            id: 'acc-multi-charger-s24',
            price: '$34.99',
            category: 'accessories',
            image: '/images/parts/accessories/multi-charger.jpg',
            description: '20W multi-port charger for simultaneous charging of multiple devices.',
            installDifficulty: 'N/A',
            compatibility: 'Universal',
            productId: 'accessory-multi-charger-s24-001'
          },
          {
            name: 'Lazy Mobile Holder (Maxbhi)',
            id: 'acc-mobile-holder-s24',
            price: '$16.99',
            category: 'accessories',
            image: '/images/parts/accessories/mobile-holder.jpg',
            description: 'Flexible gooseneck mobile holder for hands-free viewing. Genuine Maxbhi accessory.',
            installDifficulty: 'N/A',
            compatibility: 'Universal',
            productId: 'accessory-mobile-holder-s24-001'
          },
          {
            name: 'Selfie Flash Light',
            id: 'acc-selfie-light-s24',
            price: '$11.99',
            category: 'accessories',
            image: '/images/parts/accessories/selfie-light.jpg',
            description: 'Clip-on selfie ring light with multiple brightness levels.',
            installDifficulty: 'N/A',
            compatibility: 'Universal',
            productId: 'accessory-selfie-light-s24-001'
          },
          {
            name: 'Collar Clip On Mic',
            id: 'acc-clip-mic-s24',
            price: '$21.99',
            category: 'accessories',
            image: '/images/parts/accessories/clip-mic.jpg',
            description: 'Professional lapel microphone for clear audio recording.',
            installDifficulty: 'N/A',
            compatibility: 'Works with USB-C port',
            productId: 'accessory-clip-mic-s24-001'
          },
          {
            name: 'Car Mount',
            id: 'acc-car-mount-s24',
            price: '$19.99',
            category: 'accessories',
            image: '/images/parts/accessories/car-mount.jpg',
            description: 'Dashboard/windshield car mount for secure phone holding.',
            installDifficulty: 'N/A',
            compatibility: 'Universal',
            productId: 'accessory-car-mount-s24-001'
          },
          {
            name: '3 in 1 Charging Kit',
            id: 'acc-charging-kit-s24',
            price: '$39.99',
            category: 'accessories',
            image: '/images/parts/accessories/charging-kit.jpg',
            description: 'Complete charging kit with wall charger, car charger and cable.',
            installDifficulty: 'N/A',
            compatibility: 'Works with Samsung Galaxy S24 Ultra',
            productId: 'accessory-charging-kit-s24-001'
          }
        ];
      }
      
      // Special case for Vivo V15 Pro to provide specific parts
      if (brand === 'vivo' && model === 'v15-pro') {
        return [
          // Display & Screens
          {
            name: 'Display Combo Folder',
            id: 'vivo-v15-display-combo',
            price: '$79.99',
            category: 'display',
            image: '/images/parts/displays/vivo-display.jpg',
            description: 'Complete display assembly with touch functionality and frame for Vivo V15 Pro.',
            installDifficulty: 'High',
            compatibility: 'Specific to Vivo V15 Pro',
            productId: 'vivo-v15-display-combo-001'
          },
          // ... other Vivo parts would be here ...
        ];
      }
      
      // Default parts for other models/brands
      return [];
    };

    // Get repair process info based on category
    const getRepairProcess = (category, brand, model) => {
      const defaultProcess = `
        <h4>Common Issues with ${brand} ${model?.replace(/-/g, ' ')}</h4>
        <ul>
          <li>Power and performance problems</li>
          <li>Physical damage and wear</li>
          <li>Component failures</li>
          <li>Software and firmware issues</li>
        </ul>
        
        <h4>Our Repair Process</h4>
        <ol>
          <li><strong>Diagnosis:</strong> Our technicians perform a thorough inspection to identify all issues with your device.</li>
          <li><strong>Quotation:</strong> We provide a transparent quote with no hidden fees.</li>
          <li><strong>Repair:</strong> Our experts use genuine parts to fix your device with precision.</li>
          <li><strong>Quality Check:</strong> Every device undergoes a comprehensive quality check before handover.</li>
          <li><strong>Warranty:</strong> We provide warranty on all repairs for your peace of mind.</li>
        </ol>
        
        <h4>DIY Repair Tips</h4>
        <p>If you're considering fixing your device yourself, here are some important tips:</p>
        <ul>
          <li>Always power off your device and unplug it before any repair attempt.</li>
          <li>Use the correct tools to avoid damaging components.</li>
          <li>Keep track of all screws and small parts during disassembly.</li>
          <li>Follow the video tutorial below for guidance.</li>
          <li>If you're unsure at any point, contact our professionals for assistance.</li>
        </ul>
      `;

      const categoryProcess = {
        'tv-repair': `
          <h4>Common Issues with ${brand} ${model?.replace(/-/g, ' ')} TV</h4>
          <ul>
            <li>Screen damage and display issues</li>
            <li>Power supply problems</li>
            <li>Audio and speaker malfunctions</li>
            <li>Smart TV features not working</li>
            <li>Remote control problems</li>
          </ul>
          
          <h4>Our TV Repair Process</h4>
          <ol>
            <li><strong>Diagnosis:</strong> Our technicians perform a thorough inspection to identify all issues with your TV.</li>
            <li><strong>Quotation:</strong> We provide a transparent quote with no hidden fees.</li>
            <li><strong>Repair:</strong> Our experts use genuine parts to fix your TV with precision.</li>
            <li><strong>Quality Check:</strong> Every TV undergoes a comprehensive quality check before handover.</li>
            <li><strong>Warranty:</strong> We provide warranty on all repairs for your peace of mind.</li>
          </ol>
          
          <h4>DIY TV Repair Tips</h4>
          <p>If you're considering fixing your TV yourself, here are some important tips:</p>
          <ul>
            <li>Always power off your TV and unplug it before any repair attempt.</li>
            <li>Discharge capacitors if you're working with power components.</li>
            <li>Use the correct tools to avoid damaging screws or delicate components.</li>
            <li>Keep track of all screws and small parts during disassembly.</li>
            <li>Follow the video tutorial below for guidance.</li>
            <li>If you're unsure at any point, contact our professionals for assistance.</li>
          </ul>
        `,
        'laptop-repair': `
          <h4>Common Issues with ${brand} ${model?.replace(/-/g, ' ')} Laptop</h4>
          <ul>
            <li>Screen/display problems</li>
            <li>Battery not charging</li>
            <li>Keyboard or touchpad malfunctions</li>
            <li>Overheating issues</li>
            <li>Performance slowdowns</li>
          </ul>
          
          <h4>Our Laptop Repair Process</h4>
          <ol>
            <li><strong>Diagnosis:</strong> Free diagnostic assessment to identify hardware and software issues.</li>
            <li><strong>Data Backup:</strong> Optional data backup service before repair begins.</li>
            <li><strong>Repair:</strong> Component-level repair or replacement with genuine parts.</li>
            <li><strong>Testing:</strong> Comprehensive testing of all functions.</li>
            <li><strong>Quality Assurance:</strong> Final inspection and performance verification.</li>
          </ol>
          
          <h4>DIY Laptop Repair Considerations</h4>
          <p>Before attempting laptop repairs yourself:</p>
          <ul>
            <li>Always backup your important data before any repair</li>
            <li>Power off completely and remove the battery if possible</li>
            <li>Use proper tools to avoid damaging sensitive components</li>
            <li>Follow manufacturer guidelines or repair tutorials</li>
            <li>Be careful with ribbon cables and delicate connectors</li>
          </ul>
        `,
        'mobile': `
          <h4>Common Issues with ${brand} ${model?.replace(/-/g, ' ')} Phone</h4>
          <ul>
            <li>Cracked or unresponsive screen</li>
            <li>Battery draining quickly</li>
            <li>Charging problems</li>
            <li>Camera not working properly</li>
            <li>Software freezing or crashing</li>
          </ul>
          
          <h4>Our Phone Repair Process</h4>
          <ol>
            <li><strong>Inspection:</strong> Initial diagnosis of your device's issues.</li>
            <li><strong>Data Protection:</strong> We ensure your data remains secure during repairs.</li>
            <li><strong>Repair:</strong> Skilled technicians fix your phone using quality parts.</li>
            <li><strong>Quality Testing:</strong> Comprehensive testing of all functions.</li>
            <li><strong>Cleanup:</strong> Device cleaning and final inspection before return.</li>
          </ol>
          
          <h4>Phone DIY Repair Warnings</h4>
          <p>If considering self-repair:</p>
          <ul>
            <li>Modern phones are challenging to repair without proper tools and experience</li>
            <li>Always backup your data before attempting any repair</li>
            <li>Be extremely careful with batteries - they can catch fire if punctured</li>
            <li>Small components and adhesives make reassembly difficult</li>
            <li>Water-resistant seals may be compromised during DIY repairs</li>
          </ul>
        `
      };

      // Return category-specific process or default if not available
      return categoryProcess[category] || defaultProcess;
    };
    
    return {
      description: `The ${brand} ${model?.replace(/-/g, ' ')} is one of the popular models that we service frequently. We provide comprehensive repair solutions for all ${brand} ${category.replace(/-/g, ' ')} models, including this specific model.`,
      repairProcess: getRepairProcess(category, brand, model),
      videoId: defaultVideo[category] || 'c9NhDl_rnMI',
      commonIssues: getCommonIssues(category),
      diyGuides: getDiyGuides(category),
      parts: getReplacementParts(category, brand, model)
    };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading model information...</p>
      </div>
    );
  }

  if (!brand || !model) {
    return (
      <div className="error-container">
        <h2>Model not found</h2>
        <p>The brand or model you're looking for doesn't exist.</p>
        <Link to={`/services/${category}`} className="btn-primary">
          Browse All {category.charAt(0).toUpperCase() + category.slice(1)} Services
        </Link>
      </div>
    );
  }

  return (
    <div className="model-service-page">
      <div className="model-header">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/services">Services</Link> {' > '}
            <Link to={`/services/${category}`}>{category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</Link> {' > '}
            <Link to={`/services/${category}/${brandId}`}>{brand.name}</Link> {' > '}
            <span>{model.name}</span>
          </div>
          
          <div className="model-title">
            <div className="brand-logo">
              <img 
                src={`/images/brands/${brandId}.png`} 
                alt={brand.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder-brand.png';
                }}
              />
            </div>
            <h1>{brand.name} {model.name} Repair Services</h1>
          </div>
          
          <p className="model-description">
            Expert repair solutions for all {brand.name} {model.name} issues. 
            We offer same-day service with genuine parts and warranties.
          </p>
        </div>
      </div>

      <div className="container">
        <div className="model-content">
          <section className="model-info-section">
            <div className="tabs">
              <button 
                className={`tab-button ${selectedTab === 'overview' ? 'active' : ''}`}
                onClick={() => setSelectedTab('overview')}
              >
                Overview
              </button>
              <button 
                className={`tab-button ${selectedTab === 'services' ? 'active' : ''}`}
                onClick={() => setSelectedTab('services')}
              >
                Available Services
              </button>
              <button 
                className={`tab-button ${selectedTab === 'repairs' ? 'active' : ''}`}
                onClick={() => setSelectedTab('repairs')}
              >
                DIY Repairs
              </button>
              <button 
                className={`tab-button ${selectedTab === 'parts' ? 'active' : ''}`}
                onClick={() => setSelectedTab('parts')}
              >
                Replacement Parts
              </button>
            </div>

            <div className="tab-content">
              {selectedTab === 'overview' && (
                <div className="overview-tab">
                  <div className="model-image-container">
                    <img 
                      src={`/images/models/${category}/${model.id}.jpg`} 
                      alt={`${brand.name} ${model.name}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/images/model-placeholder.jpg';
                      }}
                    />
                  </div>
                  <div className="model-details">
                    <h2>{brand.name} {model.name} Overview</h2>
                    <p>{modelInfo.description}</p>
                    
                    <div className="service-highlights">
                      <div className="highlight-item">
                        <i className="fas fa-clock"></i>
                        <div>
                          <h4>Same-Day Service</h4>
                          <p>Most repairs completed within 24 hours</p>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <i className="fas fa-shield-alt"></i>
                        <div>
                          <h4>Warranty Included</h4>
                          <p>Up to 6 months warranty on all repairs</p>
                        </div>
                      </div>
                      <div className="highlight-item">
                        <i className="fas fa-home"></i>
                        <div>
                          <h4>In-Home Service</h4>
                          <p>Doorstep repair service available</p>
                        </div>
                      </div>
                    </div>
                    
                    <div dangerouslySetInnerHTML={{ __html: modelInfo.repairProcess }} />
                    
                    <div className="cta-buttons">
                      <Link to="/book-service" className="btn-primary">Book a Repair Service</Link>
                      <button 
                        className="btn-secondary"
                        onClick={() => setSelectedTab('repairs')}
                      >
                        View DIY Guides
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'services' && (
                <div className="services-tab">
                  <h2>Available Services for {brand.name} {model.name}</h2>
                  <p>Choose from our range of professional repair services specifically for your {brand.name} {model.name}:</p>
                  
                  <div className="services-grid">
                    {products.map(product => (
                      <div key={product.id} className="service-card">
                        <div className="service-image">
                          <img 
                            src={product.image} 
                            alt={product.title}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/images/service-placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="service-details">
                          <h3>{product.title}</h3>
                          <div className="model-badge">{brand.name} {model.name}</div>
                          <p>{product.description.substring(0, 100)}...</p>
                          <div className="service-meta">
                            <div className="service-price">{Object.values(product.price)[0]}</div>
                            <div className="service-rating">
                              <i className="fas fa-star"></i> {product.rating} ({product.reviewCount})
                            </div>
                          </div>
                          <div className="service-features">
                            <div className="feature"><i className="fas fa-check"></i> {product.estimatedTime} service</div>
                            <div className="feature"><i className="fas fa-check"></i> {product.warranty} warranty</div>
                          </div>
                          <div className="service-actions">
                            <Link to={`/products/${product.id}`} className="view-details-btn">
                              View Details
                            </Link>
                            <button className="add-to-cart-btn">
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedTab === 'repairs' && (
                <div className="repairs-tab">
                  <h2>DIY Repair Guides for {brand.name} {model.name}</h2>
                  <p>Follow our step-by-step guides to troubleshoot and fix common issues with your {brand.name} {model.name}:</p>
                  
                  <div className="video-tutorial">
                    <h3>Video Repair Tutorial</h3>
                    <div className="video-container">
                      <iframe 
                        width="100%" 
                        height="500" 
                        src={`https://www.youtube.com/embed/${modelInfo.videoId}`}
                        title={`${brand.name} ${model.name} Repair Tutorial`}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    </div>
                    <p className="video-description">
                      This tutorial shows you how to diagnose and repair common issues with your {brand.name} {model.name}. 
                      Follow along for step-by-step instructions, or contact our professionals for expert assistance.
                    </p>
                  </div>
                  
                  <div className="common-issues">
                    <h3>Common Issues and Solutions</h3>
                    
                    {modelInfo.commonIssues.map((issue, index) => (
                      <div key={index} className="issue-card">
                        <h4>{issue.title}</h4>
                        <p>{issue.description}</p>
                        
                        <div className="issue-details">
                          <div className="detail-item">
                            <h5>Possible Causes:</h5>
                            <ul>
                              {issue.possibleCauses.map((cause, idx) => (
                                <li key={idx}>{cause}</li>
                              ))}
                            </ul>
                          </div>
                          <div className="detail-item">
                            <h5>DIY Difficulty:</h5>
                            <div className="difficulty-badge">{issue.diyDifficulty}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="diy-guides">
                    <h3>Detailed Repair Guides</h3>
                    
                    <div className="guide-item">
                      <h4>Diagnostic Steps</h4>
                      <div dangerouslySetInnerHTML={{ __html: modelInfo.diyGuides.diagnostics || '' }} />
                    </div>
                    
                    <div className="guide-item">
                      <h4>Screen Repair Guide</h4>
                      <div dangerouslySetInnerHTML={{ __html: modelInfo.diyGuides.screenRepair || '' }} />
                    </div>
                    
                    <div className="guide-item">
                      <h4>Power Issues Troubleshooting</h4>
                      <div dangerouslySetInnerHTML={{ __html: modelInfo.diyGuides.powerIssues || '' }} />
                    </div>
                  </div>
                  
                  <div className="repair-disclaimer">
                    <h4>Safety Disclaimer</h4>
                    <p>
                      Attempting to repair your TV yourself may void the manufacturer's warranty. 
                      These guides are provided for educational purposes. Always prioritize safety and 
                      consult a professional technician if you're uncertain about any procedure.
                    </p>
                    <div className="cta-buttons">
                      <Link to="/book-service" className="btn-primary">Book a Professional Repair</Link>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'parts' && (
                <div className="parts-tab">
                  <h2>Replacement Parts for {brand.name} {model.name}</h2>
                  <p>Browse genuine replacement parts compatible with your {brand.name} {model.name}:</p>
                  
                  {/* Parts category navigation */}
                  <div className="parts-categories">
                    <h3>Categories</h3>
                    <div className="category-buttons">
                      {Object.entries(modelInfo.parts.reduce((categories, part) => {
                        // Count items in each category
                        if (!categories[part.category]) {
                          categories[part.category] = 0;
                        }
                        categories[part.category]++;
                        return categories;
                      }, {})).map(([category, count]) => {
                        // Define user-friendly category names
                        const categoryNames = {
                          'display': 'Display & Screens',
                          'body': 'Body & Housings',
                          'battery': 'Battery',
                          'internal': 'Internal Components',
                          'tools': 'Repairing Tools',
                          'accessories': 'Accessories',
                          'others': 'Others'
                        };
                        
                        return (
                          <button 
                            key={category} 
                            className="category-button"
                            onClick={() => {
                              // Scroll to category section
                              document.getElementById(`category-${category}`).scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                              });
                            }}
                          >
                            {categoryNames[category] || category} ({count})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Group parts by category */}
                  {Object.entries(modelInfo.parts.reduce((groups, part) => {
                    // Group parts by category
                    if (!groups[part.category]) {
                      groups[part.category] = [];
                    }
                    groups[part.category].push(part);
                    return groups;
                  }, {})).map(([category, parts]) => {
                    // Define user-friendly category names
                    const categoryNames = {
                      'display': 'Display & Screens',
                      'body': 'Body & Housings',
                      'battery': 'Battery',
                      'internal': 'Internal Components',
                      'tools': 'Repairing Tools',
                      'accessories': 'Accessories',
                      'others': 'Others'
                    };
                    
                    return (
                      <div key={category} id={`category-${category}`} className="parts-category-section">
                        <h3 className="category-title">{categoryNames[category] || category}</h3>
                        <div className="parts-grid">
                          {parts.map((part, index) => (
                            <div key={index} className="part-card">
                              <div className="part-image">
                                <img 
                                  src={part.image} 
                                  alt={part.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = '/images/parts/placeholder.jpg';
                                  }}
                                />
                              </div>
                              <div className="part-details">
                                <h4>
                                  <Link to={`/products/${part.productId || part.id}`}>
                                    {part.name}
                                  </Link>
                                </h4>
                                <div className="part-meta">
                                  <span className="part-code">{part.id}</span>
                                  <span className="part-price">{part.price}</span>
                                </div>
                                <p className="part-description">{part.description}</p>
                                <div className="part-compatibility">
                                  <span>Compatibility:</span> {part.compatibility}
                                </div>
                                <div className="part-difficulty">
                                  <span>Installation Difficulty:</span>
                                  <div className="difficulty-badge">{part.installDifficulty}</div>
                                </div>
                                <Link to={`/products/${part.productId || part.id}`} className="view-details-btn">
                                  View Details
                                </Link>
                                <button className="add-to-cart-btn">Add to Cart</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  
                  <div className="parts-note">
                    <p>
                      All parts come with installation instructions. For professional installation, 
                      you can book a repair service with our technicians.
                    </p>
                    <Link to="/contact" className="btn-secondary">
                      Need help finding the right part?
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ModelServicePage; 