// Script to import services data from the static JS file to Firebase
import { importInitialServices } from '../firebase/serviceAPI';
import services from '../data/services';
import { enrichServicesData } from './serviceDataEnricher';

// Function to import services
const importServices = async () => {
  try {
    console.log('Starting services import...');
    
    // Enrich the services data with additional fields
    const enrichedServices = enrichServicesData(services);
    console.log(`Enriched ${enrichedServices.length} services with additional data`);
    
    // Add all services to Firebase
    const result = await importInitialServices(enrichedServices);
    
    if (result) {
      console.log('Services imported successfully!');
    } else {
      console.error('Service import failed.');
    }
  } catch (error) {
    console.error('Error importing services:', error);
  }
};

// Export function to be called from a component
export default importServices; 