import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryList = () => {
  // State for categories and form
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form state
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
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
      const token = localStorage.getItem('token');
      
      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setCategories(response.data.categories);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
      setLoading(false);
    }
  };
  
  // Validate form
  const validateForm = (data) => {
    const errors = {};
    
    if (!data.name.trim()) {
      errors.name = 'Category name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle input change for new category
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (editingCategory) {
      setEditingCategory({
        ...editingCategory,
        [name]: value
      });
    } else {
      setNewCategory({
        ...newCategory,
        [name]: value
      });
    }
    
    // Clear error if user is correcting it
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!validateForm(newCategory)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.post('http://localhost:5000/api/categories', newCategory, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Reset form and fetch updated categories
      setNewCategory({ name: '', description: '' });
      fetchCategories();
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category. Please try again.');
    }
  };
  
  // Edit category
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormErrors({});
  };
  
  // Update category
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    if (!validateForm(editingCategory)) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(`http://localhost:5000/api/categories/${editingCategory.id}`, editingCategory, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Reset editing state and fetch updated categories
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category. Please try again.');
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
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/categories/${categoryToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Close modal and fetch updated categories
      setShowDeleteModal(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category. Please try again.');
      setShowDeleteModal(false);
    }
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingCategory(null);
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
    <div className="admin-categories">
      <div className="admin-section-header">
        <h2 className="admin-section-title">Categories Management</h2>
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
      
      <div className="admin-grid">
        {/* Category Form */}
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
          </div>
          <div className="admin-card-body">
            <form onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}>
              <div className="admin-form-group">
                <label htmlFor="name" className="admin-label">
                  Category Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={`admin-input ${formErrors.name ? 'has-error' : ''}`}
                  value={editingCategory ? editingCategory.name : newCategory.name}
                  onChange={handleInputChange}
                  placeholder="Enter category name"
                />
                {formErrors.name && <div className="admin-error-msg">{formErrors.name}</div>}
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="description" className="admin-label">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  className="admin-textarea"
                  value={editingCategory ? editingCategory.description : newCategory.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter category description (optional)"
                ></textarea>
              </div>
              
              <div className="admin-form-actions">
                {editingCategory && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
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