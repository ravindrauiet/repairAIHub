import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllCategories, 
  deleteCategory 
} from '../../services/firestoreService';
import { toast } from 'react-toastify';
import './CategoriesList.css';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllCategories();
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      setLoading(false);
    }
  };
  
  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
    setDeleteError(null);
  };
  
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
    setDeleteError(null);
    setIsDeleting(false);
  };
  
  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    
    try {
      setIsDeleting(true);
      setDeleteError(null);
      
      await deleteCategory(categoryToDelete.id);
      
      // Update categories list
      setCategories(categories.filter(cat => cat.id !== categoryToDelete.id));
      closeDeleteModal();
      
      toast.success(`Category "${categoryToDelete.name}" deleted successfully`);
    } catch (err) {
      console.error('Error deleting category:', err);
      setDeleteError('Failed to delete category. Please try again.');
      setIsDeleting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="admin-error-container">
        <p>{error}</p>
        <button onClick={fetchCategories} className="admin-btn admin-btn-primary">
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="admin-categories-list">
      <div className="admin-header-actions">
        <h2 className="admin-section-title">Categories</h2>
        <Link to="/admin/categories/new" className="admin-btn admin-btn-primary">
          <i className="fas fa-plus"></i> Add New Category
        </Link>
      </div>
      
      {categories.length === 0 ? (
        <div className="admin-empty-state">
          <i className="fas fa-list admin-empty-icon"></i>
          <p>No categories found</p>
          <Link to="/admin/categories/new" className="admin-btn admin-btn-primary">
            Add Your First Category
          </Link>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Products</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>
                        {category.description
                          ? category.description.length > 100
                            ? `${category.description.substring(0, 100)}...`
                            : category.description
                          : 'No description'}
                      </td>
                      <td>{category.productCount || 0}</td>
                      <td>
                        <div className="admin-table-actions">
                          <Link
                            to={`/admin/categories/edit/${category.id}`}
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                          >
                            <i className="fas fa-edit"></i>
                          </Link>
                          <button
                            onClick={() => openDeleteModal(category)}
                            className="admin-btn admin-btn-sm admin-btn-danger"
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
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h3>Confirm Delete</h3>
              <button onClick={closeDeleteModal} className="admin-modal-close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              {deleteError && <div className="admin-error-alert">{deleteError}</div>}
              <p>
                Are you sure you want to delete the category "{categoryToDelete?.name}"?
              </p>
              <p className="admin-modal-warning">
                <i className="fas fa-exclamation-triangle"></i> This action cannot be undone.
              </p>
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
                onClick={handleDeleteCategory}
                className="admin-btn admin-btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <div className="spinner-small"></div> Deleting...
                  </>
                ) : (
                  'Delete Category'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesList; 