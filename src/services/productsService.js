import { db } from '../firebase/config';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  limit as firestoreLimit,
  orderBy
} from 'firebase/firestore';

// Get all products from Firestore
export const getAllProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get a product by ID
export const getProductById = async (productId) => {
  try {
    const docRef = doc(db, 'products', productId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error getting product ${productId}:`, error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (category) => {
  try {
    // Map service IDs to product categories if needed
    const serviceToProductMap = {
      'tv-repair': 'tv',
      'mobile-repair': 'mobile',
      'laptop-repair': 'laptop',
      'ac-repair': 'ac',
      'refrigerator-repair': 'refrigerator',
      'washing-machine-repair': 'washing-machine',
      'water-purifier-repair': 'water-purifier'
    };
    
    const productCategory = serviceToProductMap[category] || category;
    
    const q = query(
      collection(db, 'products'),
      where('category', '==', productCategory)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting products by category ${category}:`, error);
    throw error;
  }
};

// Get products by brand
export const getProductsByBrand = async (brandId) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('compatibleBrands', 'array-contains', brandId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting products by brand ${brandId}:`, error);
    throw error;
  }
};

// Get all product categories
export const getAllCategories = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'categories'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

// Get all brands
export const getAllBrands = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'brands'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting brands:', error);
    throw error;
  }
};

// Get brands by category
export const getBrandsByCategory = async (category) => {
  try {
    const q = query(
      collection(db, 'brands'),
      where('categories', 'array-contains', category)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting brands by category ${category}:`, error);
    throw error;
  }
};

// Get models by brand and category
export const getModelsByBrand = async (brandId, category) => {
  try {
    const q = query(
      collection(db, 'models'),
      where('brandId', '==', brandId),
      where('category', '==', category)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting models for brand ${brandId} and category ${category}:`, error);
    throw error;
  }
};

// Get booking device brands
export const getBookingDeviceBrands = async (serviceType) => {
  try {
    const docRef = doc(db, 'bookingDevices', serviceType);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().brands || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error getting booking device brands for ${serviceType}:`, error);
    throw error;
  }
};

// Get booking device models
export const getBookingDeviceModels = async (serviceType, brandId) => {
  try {
    const docRef = doc(db, 'bookingDeviceModels', `${serviceType}_${brandId}`);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().models || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error getting booking device models for ${serviceType} and brand ${brandId}:`, error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 6) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('featured', '==', true),
      orderBy('price.standard', 'asc'),
      firestoreLimit(limit)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting featured products:`, error);
    throw error;
  }
};

// Get products by brand and category
export const getProductsByBrandAndCategory = async (brandId, category) => {
  try {
    // Map service IDs to product categories if needed
    const serviceToProductMap = {
      'tv-repair': 'tv',
      'mobile-repair': 'mobile',
      'laptop-repair': 'laptop',
      'ac-repair': 'ac',
      'refrigerator-repair': 'refrigerator',
      'washing-machine-repair': 'washing-machine',
      'water-purifier-repair': 'water-purifier'
    };
    
    const productCategory = serviceToProductMap[category] || category;
    
    const q = query(
      collection(db, 'products'),
      where('category', '==', productCategory),
      where('compatibleBrands', 'array-contains', brandId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting products by brand ${brandId} and category ${category}:`, error);
    throw error;
  }
}; 