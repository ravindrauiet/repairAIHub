import services from '../data/services';
import * as firestoreService from '../services/firestoreService';

// Function to import all services
export const importAllServices = async () => {
  console.log('Starting services import to Firestore...');
  const results = [];
  
  try {
    for (const service of services) {
      // Check if service already exists
      const existingService = await firestoreService.getServiceById(service.id);
      
      if (existingService) {
        console.log(`Service ${service.id} already exists, updating...`);
        await firestoreService.updateService(service.id, service);
        results.push({ id: service.id, status: 'updated', data: service });
      } else {
        console.log(`Adding new service: ${service.id}`);
        await firestoreService.addService(service);
        results.push({ id: service.id, status: 'added', data: service });
      }
    }
    
    console.log(`Successfully processed ${results.length} services`);
    return { success: true, results };
  } catch (error) {
    console.error('Error importing services:', error);
    return { success: false, error };
  }
};

// Function to import services as categories
export const importServicesAsCategories = async () => {
  console.log('Importing services as categories...');
  const results = [];
  
  try {
    for (const service of services) {
      // Check if category already exists
      const existingCategory = await firestoreService.getCategoryById(service.id);
      
      const categoryData = {
        id: service.id,
        name: service.title,
        description: service.shortDescription,
        icon: service.icon || 'wrench', // Default icon
        imageUrl: service.imageUrl,
        active: true
      };
      
      if (existingCategory) {
        console.log(`Category ${service.id} already exists, updating...`);
        await firestoreService.updateCategory(service.id, categoryData);
        results.push({ id: service.id, status: 'updated', data: categoryData });
      } else {
        console.log(`Adding new category: ${service.id}`);
        await firestoreService.addCategory(categoryData);
        results.push({ id: service.id, status: 'added', data: categoryData });
      }
    }
    
    console.log(`Successfully processed ${results.length} categories`);
    return { success: true, results };
  } catch (error) {
    console.error('Error importing categories:', error);
    return { success: false, error };
  }
};

// Function to initialize booking devices data for mobile repair
export const initializeBookingDevicesForMobileRepair = async () => {
  console.log('Initializing booking devices data for mobile repair...');
  
  try {
    // Check if mobile-repair booking device already exists
    const existingDevice = await firestoreService.getBookingDevice('mobile-repair');
    
    if (existingDevice) {
      console.log('Mobile repair booking device already exists');
      return { success: true, alreadyExists: true, data: existingDevice };
    }
    
    // Create mobile-repair booking device with common brands
    const mobileBookingDevice = {
      type: 'mobile-repair',
      brands: [
        { id: 'samsung-mobile', name: 'Samsung' },
        { id: 'apple-mobile', name: 'Apple' },
        { id: 'xiaomi-mobile', name: 'Xiaomi' },
        { id: 'oppo-mobile', name: 'Oppo' },
        { id: 'vivo-mobile', name: 'Vivo' },
        { id: 'oneplus-mobile', name: 'OnePlus' },
        { id: 'realme-mobile', name: 'Realme' },
        { id: 'nokia-mobile', name: 'Nokia' },
        { id: 'motorola-mobile', name: 'Motorola' },
        { id: 'google-mobile', name: 'Google' },
        { id: 'honor-mobile', name: 'Honor' },
        { id: 'asus-mobile', name: 'Asus' },
        { id: 'other-mobile', name: 'Other' }
      ]
    };
    
    // Save booking device
    await firestoreService.saveBookingDevice('mobile-repair', mobileBookingDevice);
    console.log('Mobile repair booking device created successfully');
    
    // Initialize models for each brand
    for (const brand of mobileBookingDevice.brands) {
      // Only create sample models for a few brands
      if (['samsung-mobile', 'apple-mobile', 'oppo-mobile'].includes(brand.id)) {
        let models = [];
        
        if (brand.id === 'samsung-mobile') {
          models = [
            { id: 'galaxy-s21', name: 'Galaxy S21' },
            { id: 'galaxy-s22', name: 'Galaxy S22' },
            { id: 'galaxy-s23', name: 'Galaxy S23' },
            { id: 'galaxy-s24', name: 'Galaxy S24' },
            { id: 'galaxy-note20', name: 'Galaxy Note 20' },
            { id: 'galaxy-a52', name: 'Galaxy A52' },
            { id: 'galaxy-a53', name: 'Galaxy A53' },
            { id: 'galaxy-a54', name: 'Galaxy A54' }
          ];
        } else if (brand.id === 'apple-mobile') {
          models = [
            { id: 'iphone-12', name: 'iPhone 12' },
            { id: 'iphone-13', name: 'iPhone 13' },
            { id: 'iphone-14', name: 'iPhone 14' },
            { id: 'iphone-15', name: 'iPhone 15' },
            { id: 'iphone-se', name: 'iPhone SE' }
          ];
        } else if (brand.id === 'oppo-mobile') {
          models = [
            { id: 'reno-6', name: 'Reno 6' },
            { id: 'reno-7', name: 'Reno 7' },
            { id: 'reno-8', name: 'Reno 8' },
            { id: 'reno-9', name: 'Reno 9' },
            { id: 'find-x5', name: 'Find X5' },
            { id: 'find-x6', name: 'Find X6' },
            { id: 'a78', name: 'A78' },
            { id: 'f21', name: 'F21' }
          ];
        }
        
        // Save models for this brand
        await firestoreService.saveBookingDeviceModels('mobile-repair', brand.id, models);
        console.log(`Added ${models.length} models for ${brand.name}`);
      } else {
        // For other brands, just initialize with empty array
        await firestoreService.saveBookingDeviceModels('mobile-repair', brand.id, []);
      }
    }
    
    return { 
      success: true, 
      alreadyExists: false, 
      data: mobileBookingDevice 
    };
  } catch (error) {
    console.error('Error initializing booking devices data:', error);
    return { success: false, error };
  }
};

// Main function to run all imports
export const importAllData = async () => {
  try {
    console.log('Starting full data import process...');
    
    // 1. Import services
    const servicesResult = await importAllServices();
    console.log(`Services import ${servicesResult.success ? 'succeeded' : 'failed'}`);
    
    // 2. Import services as categories
    const categoriesResult = await importServicesAsCategories();
    console.log(`Categories import ${categoriesResult.success ? 'succeeded' : 'failed'}`);
    
    // 3. Initialize booking devices for mobile repair
    const bookingDevicesResult = await initializeBookingDevicesForMobileRepair();
    console.log(`Booking devices initialization ${bookingDevicesResult.success ? 'succeeded' : 'failed'}`);
    
    return {
      success: servicesResult.success && categoriesResult.success && bookingDevicesResult.success,
      services: servicesResult,
      categories: categoriesResult,
      bookingDevices: bookingDevicesResult
    };
  } catch (error) {
    console.error('Error in importAllData:', error);
    return { success: false, error };
  }
};

// Export default function
export default importAllData; 