import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getCategoryById, 
  updateCategory, 
  addCategory 
} from '../../services/firestoreService';
import { toast } from 'react-toastify';
import './CategoryForm.css';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  
  const [formData, setFormData] = useState({
    name: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  
  // Fetch category details if editing
  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (!isEditing) return;
      
      setLoading(true);
      try {
        const category = await getCategoryById(id);
        
        if (category) {
          setFormData({
            name: category.name || ''
          });
        } else {
          setErrorMessage('Category not found');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching category details:', err);
        setErrorMessage('Failed to load category details from Firestore');
        setLoading(false);
      }
    };
    
    fetchCategoryDetails();
  }, [id, isEditing]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSaveLoading(true);
    
    try {
      // Prepare category data
      const categoryData = {
        name: formData.name.trim()
      };
      
      if (isEditing) {
        // Update existing category
        await updateCategory(id, categoryData);
        toast.success('Category updated successfully');
      } else {
        // Create new category
        await addCategory(categoryData);
        toast.success('Category added successfully');
      }
      
      setSaveLoading(false);
      
      // Redirect to categories list on success
      navigate('/admin/categories');
    } catch (err) {
      console.error('Error saving category:', err);
      setErrorMessage('Failed to save category to Firestore. Please try again.');
      setSaveLoading(false);
      toast.error('Failed to save category');
    }
  };
  
  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Loading category details...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-category-form">
      <div className="admin-section-header">
        <h2 className="admin-section-title">{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
      </div>
      
      {errorMessage && (
        <div className="admin-alert admin-alert-danger">
          <i className="fas fa-exclamation-circle"></i> {errorMessage}
          <button
            className="admin-alert-close"
            onClick={() => setErrorMessage('')}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="admin-card">
        <div className="admin-card-body">
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="name" className="admin-label">Category Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`admin-input ${errors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
              />
              {errors.name && <div className="admin-error-msg">{errors.name}</div>}
            </div>
            
            <div className="admin-form-buttons">
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => navigate('/admin/categories')}
                disabled={saveLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="admin-btn admin-btn-primary"
                disabled={saveLoading}
              >
                {saveLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                    Saving...
                  </>
                ) : (
                  'Save Category'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm; 