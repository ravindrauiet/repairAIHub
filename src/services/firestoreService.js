import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

// Generic service functions for Firestore collections

// Get all documents from a collection
export const getAllDocuments = async (collectionName) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

// Get a single document by ID
export const getDocumentById = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
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
    console.error(`Error getting document ${docId} from ${collectionName}:`, error);
    throw error;
  }
};

// Add a new document
export const addDocument = async (collectionName, data) => {
  try {
    // Add timestamp
    const documentData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, collectionName), documentData);
    return {
      id: docRef.id,
      ...documentData
    };
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
};

// Update a document
export const updateDocument = async (collectionName, docId, data) => {
  try {
    const docRef = doc(db, collectionName, docId);
    
    // Add updated timestamp
    const updatedData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(docRef, updatedData);
    return {
      id: docId,
      ...updatedData
    };
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (collectionName, docId) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    return { id: docId };
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionName}:`, error);
    throw error;
  }
};

// Query documents by field
export const queryDocuments = async (collectionName, fieldPath, operator, value) => {
  try {
    const q = query(
      collection(db, collectionName),
      where(fieldPath, operator, value)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error querying documents in ${collectionName}:`, error);
    throw error;
  }
};

// Query documents with multiple conditions and sorting
export const advancedQuery = async (collectionName, conditions = [], sortOptions = [], limitCount = null) => {
  try {
    let queryConstraints = [];
    
    // Add where conditions
    if (conditions && conditions.length > 0) {
      conditions.forEach(condition => {
        queryConstraints.push(where(condition.field, condition.operator, condition.value));
      });
    }
    
    // Add sorting
    if (sortOptions && sortOptions.length > 0) {
      sortOptions.forEach(sort => {
        queryConstraints.push(orderBy(sort.field, sort.direction));
      });
    }
    
    // Add limit if provided
    if (limitCount) {
      queryConstraints.push(limit(limitCount));
    }
    
    // Create the query
    const q = query(collection(db, collectionName), ...queryConstraints);
    
    // Execute the query
    const querySnapshot = await getDocs(q);
    
    // Return the results
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error executing advanced query in ${collectionName}:`, error);
    throw error;
  }
};

// Helper to convert a JavaScript Date to Firestore Timestamp
export const dateToTimestamp = (date) => {
  if (!date) return null;
  return Timestamp.fromDate(new Date(date));
};

// Specific service functions for common collections

// Services
export const getAllServices = () => getAllDocuments('services');
export const getServiceById = (id) => getDocumentById('services', id);
export const addService = (data) => addDocument('services', data);
export const updateService = (id, data) => updateDocument('services', id, data);
export const deleteService = (id) => deleteDocument('services', id);
export const getServicesByCategory = (category) => queryDocuments('services', 'category', '==', category);
export const getFeaturedServices = (limit = 6) => {
  return advancedQuery(
    'services',
    [{ field: 'featured', operator: '==', value: true }],
    [{ field: 'title', direction: 'asc' }],
    limit
  );
};

// Products
export const getAllProducts = () => getAllDocuments('products');
export const getProductById = (id) => getDocumentById('products', id);
export const addProduct = (data) => addDocument('products', data);
export const updateProduct = (id, data) => updateDocument('products', id, data);
export const deleteProduct = (id) => deleteDocument('products', id);
export const getProductsByCategory = (categoryId) => queryDocuments('products', 'categoryId', '==', categoryId);
export const getFeaturedProducts = (limit = 6) => {
  return advancedQuery(
    'products',
    [{ field: 'featured', operator: '==', value: true }],
    [{ field: 'name', direction: 'asc' }],
    limit
  );
};

// Orders
export const getAllOrders = () => getAllDocuments('orders');
export const getOrderById = (id) => getDocumentById('orders', id);
export const addOrder = (data) => addDocument('orders', data);
export const updateOrder = (id, data) => updateDocument('orders', id, data);
export const deleteOrder = (id) => deleteDocument('orders', id);
export const updateOrderStatus = (id, status) => {
  return updateDocument('orders', id, { 
    status,
    statusUpdatedAt: serverTimestamp()
  });
};
export const getOrdersByUser = (userId) => queryDocuments('orders', 'userId', '==', userId);

// Bookings
export const getAllBookings = () => getAllDocuments('bookings');
export const getBookingById = (id) => getDocumentById('bookings', id);
export const addBooking = (data) => addDocument('bookings', data);
export const updateBooking = (id, data) => updateDocument('bookings', id, data);
export const deleteBooking = (id) => deleteDocument('bookings', id);
export const updateBookingStatus = (id, status, note) => {
  return updateDocument('bookings', id, { 
    status, 
    statusNote: note,
    statusUpdatedAt: serverTimestamp()
  });
};
export const getBookingsByUser = (userId) => queryDocuments('bookings', 'userId', '==', userId);
export const getBookingsByDate = (date) => {
  const startDate = new Date(date);
  startDate.setHours(0, 0, 0, 0);
  
  const endDate = new Date(date);
  endDate.setHours(23, 59, 59, 999);
  
  return advancedQuery(
    'bookings',
    [
      { field: 'date', operator: '>=', value: dateToTimestamp(startDate) },
      { field: 'date', operator: '<=', value: dateToTimestamp(endDate) }
    ],
    [{ field: 'time', direction: 'asc' }]
  );
};

// Categories
export const getAllCategories = () => getAllDocuments('categories');
export const getCategoryById = (id) => getDocumentById('categories', id);
export const addCategory = (data) => addDocument('categories', data);
export const updateCategory = (id, data) => updateDocument('categories', id, data);
export const deleteCategory = (id) => deleteDocument('categories', id);
export const getCategoriesWithServicesCount = async () => {
  try {
    // Get all categories
    const categories = await getAllCategories();
    
    // Get all services to calculate counts
    const services = await getAllServices();
    
    // Count services for each category
    return categories.map(category => {
      const servicesCount = services.filter(service => service.category === category.name).length;
      return {
        ...category,
        servicesCount
      };
    });
  } catch (error) {
    console.error('Error getting categories with services count:', error);
    throw error;
  }
};

// Brands
export const getAllBrands = () => getAllDocuments('brands');
export const getBrandById = (id) => getDocumentById('brands', id);
export const addBrand = (data) => addDocument('brands', data);
export const updateBrand = (id, data) => updateDocument('brands', id, data);
export const deleteBrand = (id) => deleteDocument('brands', id);
export const getBrandsByCategory = (categoryId) => queryDocuments('brands', 'categoryId', '==', categoryId);

// Models
export const getAllModels = () => getAllDocuments('models');
export const getModelById = (id) => getDocumentById('models', id);
export const addModel = (data) => addDocument('models', data);
export const updateModel = (id, data) => updateDocument('models', id, data);
export const deleteModel = (id) => deleteDocument('models', id);
export const getModelsByBrand = (brandId) => queryDocuments('models', 'brandId', '==', brandId);

// Users
export const getAllUsers = () => getAllDocuments('users');
export const addUser = (data) => addDocument('users', data);
export const getUserById = (id) => getDocumentById('users', id);
export const updateUser = (id, data) => updateDocument('users', id, data);
export const deleteUser = (id) => deleteDocument('users', id);
export const setUserAsAdmin = async (userId) => {
  return updateDocument('users', userId, { role: 'admin' });
};
export const removeUserAsAdmin = async (userId) => {
  return updateDocument('users', userId, { role: 'user' });
}; 