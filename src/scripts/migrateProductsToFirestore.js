import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  setDoc, 
  addDoc, 
  writeBatch 
} from 'firebase/firestore';
import products, { 
  productCategories, 
  deviceModels, 
  brands,
  bookingDevices
} from '../data/products.jsx';

// Migrate all data to Firestore
const migrateProductsToFirestore = async () => {
  console.log("Starting data migration to Firestore...");
  
  try {
    // Use batched writes for better performance and atomicity
    const batch = writeBatch(db);
    
    // 1. Migrate product categories
    console.log("Migrating product categories...");
    for (const category of productCategories) {
      const categoryRef = doc(collection(db, "categories"), category.id);
      batch.set(categoryRef, {
        name: category.name,
        icon: category.icon,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // 2. Migrate brands
    console.log("Migrating brands...");
    for (const brand of brands) {
      const brandRef = doc(collection(db, "brands"), brand.id);
      batch.set(brandRef, {
        name: brand.name,
        categories: brand.categories,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // 3. Migrate device models
    console.log("Migrating device models...");
    for (const [brandId, models] of Object.entries(deviceModels)) {
      for (const model of models) {
        const modelRef = doc(collection(db, "models"));
        batch.set(modelRef, {
          id: model.id,
          name: model.name,
          brandId: brandId,
          category: model.category,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    // Commit the first batch (to avoid exceeding batch size limits)
    await batch.commit();
    console.log("Categories, brands, and models migrated successfully");
    
    // Create a new batch for products
    const productsBatch = writeBatch(db);
    
    // 4. Migrate products
    console.log("Migrating products...");
    for (const product of products) {
      const productRef = doc(collection(db, "products"), product.id);
      // Convert the product object, removing any functions
      const productData = {
        ...product,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      productsBatch.set(productRef, productData);
    }
    
    // Commit the products batch
    await productsBatch.commit();
    console.log("Products migrated successfully");
    
    // 5. Migrate booking devices (for the booking form)
    console.log("Migrating booking devices...");
    const bookingBatch = writeBatch(db);
    
    for (const [serviceType, data] of Object.entries(bookingDevices)) {
      // Store the service type
      const serviceTypeRef = doc(collection(db, "bookingDevices"), serviceType);
      
      // Store brands for this service type
      bookingBatch.set(serviceTypeRef, {
        type: serviceType,
        brands: data.brands,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Store models for each brand
      for (const [brandId, models] of Object.entries(data.models)) {
        const brandModelsRef = doc(collection(db, "bookingDeviceModels"), `${serviceType}_${brandId}`);
        bookingBatch.set(brandModelsRef, {
          serviceType,
          brandId,
          models,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    
    // Commit the booking devices batch
    await bookingBatch.commit();
    console.log("Booking devices migrated successfully");
    
    console.log("Data migration completed successfully!");
    return true;
  } catch (error) {
    console.error("Error migrating data to Firestore:", error);
    return false;
  }
};

export default migrateProductsToFirestore; 