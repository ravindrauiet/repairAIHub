import * as firestoreService from '../services/firestoreService';

// Get all services
export const getAllServices = async () => {
  return firestoreService.getAllServices();
};

// Get service by ID
export const getServiceById = async (serviceId) => {
  return firestoreService.getServiceById(serviceId);
};

// Get services by category
export const getServicesByCategory = async (category) => {
  return firestoreService.getServicesByCategory(category);
};

// Get featured services
export const getFeaturedServices = async (limitCount = 6) => {
  return firestoreService.getFeaturedServices(limitCount);
};

// Get all service categories
export const getAllServiceCategories = async () => {
  const categoriesData = await firestoreService.getAllCategories();
  // Extract category names from the data
  return categoriesData.map(category => category.name);
};

// Add a new service
export const addService = async (serviceData) => {
  return firestoreService.addService(serviceData);
};

// Update a service
export const updateService = async (serviceId, serviceData) => {
  return firestoreService.updateService(serviceId, serviceData);
};

// Delete a service
export const deleteService = async (serviceId) => {
  return firestoreService.deleteService(serviceId);
};

// Import initial services data
export const importInitialServices = async (services) => {
  try {
    // Use our firestoreService to add all services
    const promises = services.map(service => firestoreService.addService(service));
    
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error importing services:', error);
    throw error;
  }
}; 