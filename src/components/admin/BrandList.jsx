import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllBrands, 
  addBrand, 
  updateBrand, 
  deleteBrand 
} from '../../services/firestoreService';
import { storage } from '../../firebase/config';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { toast } from 'react-toastify';

const BrandList = () => {
  // State for brands and form
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);
  
  const fetchBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllBrands();
      setBrands(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching brands:', err);
      setError('Failed to load brands. Please try again.');
      toast.error('Failed to load brands from database');
      setLoading(false);
    }
  };
  
  // Open delete modal
  const openDeleteModal = (brand) => {
    setBrandToDelete(brand);
    setShowDeleteModal(true);
  };
  
  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBrandToDelete(null);
    setIsDeleting(false);
  };
  
  // Delete brand
  const handleDeleteBrand = async () => {
    if (!brandToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // If the brand has an image, delete it from storage
      if (brandToDelete.imageUrl) {
        try {
          // Extract path from URL
          const imageRef = ref(storage, brandToDelete.imageUrl);
          await deleteObject(imageRef);
        } catch (imageError) {
          console.error('Error deleting image:', imageError);
          // Continue with brand deletion even if image deletion fails
        }
      }
      
      // Delete brand from Firestore
      await deleteBrand(brandToDelete.id);
      
      // Update brands list
      setBrands(brands.filter(brand => brand.id !== brandToDelete.id));
      toast.success(`Brand "${brandToDelete.name}" deleted successfully`);
      
      // Close modal
      closeDeleteModal();
    } catch (err) {
      console.error('Error deleting brand:', err);
      setError('Failed to delete brand. Please try again.');
      toast.error('Failed to delete brand');
      setIsDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading brands...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-brands-list">
      <div className="admin-header-actions">
        <h2 className="admin-section-title">Brands Management</h2>
        <Link to="/admin/brands/new" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Add New Brand
        </Link>
      </div>
      
      {error && (
        <div className="admin-alert admin-alert-danger">
          <i className="fas fa-exclamation-circle"></i> {error}
          <button
            className="admin-alert-close"
            onClick={() => setError(null)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      {brands.length === 0 ? (
        <div className="admin-empty-state">
          <i className="fas fa-tags admin-empty-icon"></i>
          <p>No brands found</p>
          <Link to="/admin/brands/new" className="admin-btn admin-btn-primary">
            Add Your First Brand
          </Link>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {brands.map(brand => (
                    <tr key={brand.id}>
                      <td>
                        {brand.imageUrl ? (
                          <img 
                            src={brand.imageUrl} 
                            alt={brand.name} 
                            className="admin-thumb"
                            width="50"
                          />
                        ) : (
                          <div className="admin-no-image">No Image</div>
                        )}
                      </td>
                      <td>{brand.name}</td>
                      <td>
                        {brand.description
                          ? brand.description.length > 100
                            ? `${brand.description.substring(0, 100)}...`
                            : brand.description
                          : 'No description'}
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <Link
                            to={`/admin/brands/edit/${brand.id}`}
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            title="Edit Brand"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            onClick={() => openDeleteModal(brand)}
                            className="admin-btn admin-btn-sm admin-btn-danger"
                            title="Delete Brand"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={closeDeleteModal}></div>
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>Confirm Delete</h3>
              <button onClick={closeDeleteModal} className="admin-modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to delete the brand "{brandToDelete?.name}"?
              </p>
              <p className="admin-modal-warning">
                <i className="fas fa-exclamation-triangle"></i> This action cannot be undone.
              </p>
              {brandToDelete?.imageUrl && (
                <div className="admin-delete-preview">
                  <img 
                    src={brandToDelete.imageUrl} 
                    alt={brandToDelete.name} 
                    className="admin-delete-image"
                  />
                </div>
              )}
            </div>
            <div className="admin-modal-footer">
              <button
                onClick={closeDeleteModal}
                className="admin-btn admin-btn-secondary"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBrand}
                className="admin-btn admin-btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="spinner-small"></div> Deleting...
                  </>
                ) : (
                  'Delete Brand'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandList; 