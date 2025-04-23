import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  getAllCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '../../services/firestoreService';

const CategoryList = () => {
  // State for categories and form
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  
  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await getAllCategories();
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again later.');
      toast.error('Failed to load categories. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  // Validate form
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name || data.name.trim() === '') {
      errors.name = 'Category name is required';
    } else if (data.name.length < 2) {
      errors.name = 'Category name must be at least 2 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle input change for new category
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear the specific error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
  };
  
  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      const newCategory = await addCategory(formData);
      
      setCategories(prevCategories => [...prevCategories, newCategory]);
      setFormData({ name: '', description: '' });
      toast.success('Category added successfully!');
    } catch (err) {
      console.error('Error adding category:', err);
      toast.error('Failed to add category. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category.id);
    setFormData({ name: category.name, description: category.description || '' });
  };
  
  // Update category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      const updatedCategory = await updateCategory(editingCategory, formData);
      
      setCategories(prevCategories =>
        prevCategories.map(cat =>
          cat.id === editingCategory ? { ...cat, ...updatedCategory } : cat
        )
      );
      
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      toast.success('Category updated successfully!');
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error('Failed to update category. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Confirm delete
  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };
  
  // Delete category
  const handleDeleteCategory = async () => {
    try {
      setLoading(true);
      await deleteCategory(categoryToDelete.id);
      
      setCategories(prevCategories =>
        prevCategories.filter(cat => cat.id !== categoryToDelete.id)
      );
      
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      toast.success('Category deleted successfully!');
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Failed to delete category. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading categories...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-container">
      <h2 className="admin-page-title">Manage Categories</h2>
      
      {error && <div className="admin-alert admin-alert-danger">{error}</div>}
      
      <div className="admin-grid">
        {/* Category Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            {editingCategory && (
              <button
                className="admin-btn admin-btn-link"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </button>
            )}
          </div>
          <div className="admin-card-body">
            <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
              <div className="admin-form-group">
                <label htmlFor="name">Category Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`admin-form-control ${formErrors.name ? 'admin-is-invalid' : ''}`}
                  disabled={loading}
                />
                {formErrors.name && (
                  <div className="admin-invalid-feedback">{formErrors.name}</div>
                )}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="admin-form-control"
                  rows="3"
                  disabled={loading}
                ></textarea>
              </div>
              
              <div className="admin-form-group">
                {loading && (
                  <div className="admin-spinner-border admin-spinner-border-sm"></div>
                )}
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editingCategory ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Categories List */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Categories List</h3>
          </div>
          <div className="admin-card-body">
            {categories.length === 0 ? (
              <div className="admin-empty-state">
                <i className="fas fa-folder-open"></i>
                <p>No categories found. Add your first category!</p>
              </div>
            ) : (
              <div className="admin-table-responsive">
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
                          {category.description ? (
                            category.description.length > 50 ? (
                              `${category.description.substring(0, 50)}...`
                            ) : (
                              category.description
                            )
                          ) : (
                            <span className="admin-text-muted">No description</span>
                          )}
                        </td>
                        <td>
                          <span className="admin-badge admin-badge-info">
                            {category.products?.length || 0} products
                          </span>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              className="admin-btn admin-btn-sm admin-btn-primary"
                              onClick={() => handleEditCategory(category)}
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="admin-btn admin-btn-sm admin-btn-danger"
                              onClick={() => confirmDelete(category)}
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
            )}
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={() => setShowDeleteModal(false)}></div>
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h3>Confirm Deletion</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <p>
                Are you sure you want to delete the category{' '}
                <strong>{categoryToDelete?.name}</strong>?
              </p>
              <p className="admin-text-danger">
                <i className="fas fa-exclamation-triangle"></i> This action cannot be undone.
                {categoryToDelete?.products?.length > 0 && (
                  <span>
                    {' '}
                    Products in this category will be uncategorized.
                  </span>
                )}
              </p>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-danger"
                onClick={handleDeleteCategory}
              >
                Delete Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryList; 