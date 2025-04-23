// This script enriches the services data with additional fields
// It runs when importing services to Firebase and adds missing fields like ratings

// Function to generate a random rating between 4 and 5
const generateRating = () => {
  // Generate a random number between 4.0 and 5.0 with one decimal place
  return Math.round((4 + Math.random()) * 10) / 10;
};

// Function to enrich service data with additional fields
export const enrichServiceData = (service) => {
  const enrichedService = { ...service };
  
  // Add rating if it doesn't exist
  if (!enrichedService.rating) {
    enrichedService.rating = generateRating();
  }
  
  // Set featured flag if it doesn't exist (make most services featured)
  if (enrichedService.featured === undefined) {
    enrichedService.featured = Math.random() > 0.2; // 80% chance of being featured
  }
  
  // Add additional data for future enhancements
  enrichedService.createdAt = new Date();
  enrichedService.updatedAt = new Date();
  
  return enrichedService;
};

// Function to enrich an array of services
export const enrichServicesData = (services) => {
  return services.map(service => enrichServiceData(service));
}; 