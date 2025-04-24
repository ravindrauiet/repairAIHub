import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCouponById, addCoupon, updateCoupon, getAllUsers } from '../../services/firestoreService';

const CouponForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 10,
    description: '',
    active: true,
    target: 'global',
    targetUsers: []
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Load users for targeting
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        
        // Load existing coupon data if editing
        if (id) {
          const coupon = await getCouponById(id);
          if (coupon) {
            setFormData({
              code: coupon.code || '',
              discountPercentage: coupon.discountPercentage || 10,
              description: coupon.description || '',
              active: coupon.active !== undefined ? coupon.active : true,
              target: coupon.target || 'global',
              targetUsers: coupon.targetUsers || []
            });
          } else {
            setError('Coupon not found');
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Error loading data');
      }
      
      setLoading(false);
    };
    
    fetchData();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
    
    // Reset targetUsers when changing the target type
    if (name === 'target' && value !== 'specific') {
      setFormData(prev => ({
        ...prev,
        targetUsers: []
      }));
    }
  };
  
  const handleUserSelect = (e) => {
    const { options } = e.target;
    const selectedUsers = [];
    
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedUsers.push(options[i].value);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      targetUsers: selectedUsers
    }));
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.code) {
      errors.code = 'Coupon code is required';
    } else if (formData.code.length < 3) {
      errors.code = 'Coupon code must be at least 3 characters';
    }
    
    if (!formData.discountPercentage) {
      errors.discountPercentage = 'Discount percentage is required';
    } else if (formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      errors.discountPercentage = 'Discount percentage must be between 1-100';
    }
    
    if (!formData.description) {
      errors.description = 'Description is required';
    }
    
    if (formData.target === 'specific' && formData.targetUsers.length === 0) {
      errors.targetUsers = 'Select at least one user';
    }
    
    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateForm();
    if (!validation.valid) {
      setError(Object.values(validation.errors)[0]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const data = {
        ...formData,
        usageCount: id ? undefined : 0,
        totalDiscount: id ? undefined : 0,
        revenue: id ? undefined : 0,
        usedBy: id ? undefined : []
      };
      
      if (id) {
        await updateCoupon(id, data);
      } else {
        await addCoupon(data);
      }
      
      navigate('/admin/coupons');
    } catch (err) {
      console.error('Error saving coupon:', err);
      setError('Error saving coupon. Please try again.');
      setLoading(false);
    }
  };
  
  if (loading && !formData.code) {
    return <div className="admin-loading">Loading coupon data...</div>;
  }
  
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>{id ? 'Edit Coupon' : 'Create New Coupon'}</h1>
        <p className="admin-page-subtitle">
          {id ? 'Modify an existing coupon code' : 'Create a new coupon code for customers'}
        </p>
      </div>
      
      {error && (
        <div className="admin-alert error">
          <p>{error}</p>
        </div>
      )}
      
      <div className="admin-content-wrapper">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="code">Coupon Code <span className="required">*</span></label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter a unique coupon code"
                required
              />
              <div className="field-hint">Create a memorable code for customers to use</div>
            </div>
            
            <div className="form-group">
              <label htmlFor="discountPercentage">Discount Percentage <span className="required">*</span></label>
              <input
                type="number"
                id="discountPercentage"
                name="discountPercentage"
                min="1"
                max="100"
                value={formData.discountPercentage}
                onChange={handleChange}
                required
              />
              <div className="field-hint">The percentage discount this coupon code gives</div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description <span className="required">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a description for this coupon code"
              rows="3"
              required
            ></textarea>
            <div className="field-hint">Describe when and how this coupon should be used</div>
          </div>
          
          <div className="form-group">
            <label htmlFor="target">Target <span className="required">*</span></label>
            <select
              id="target"
              name="target"
              value={formData.target}
              onChange={handleChange}
              required
            >
              <option value="global">Global (All Users)</option>
              <option value="specific">Specific Users</option>
            </select>
            <div className="field-hint">Specify who can use this coupon</div>
          </div>
          
          {formData.target === 'specific' && (
            <div className="form-group">
              <label htmlFor="targetUsers">Select Users <span className="required">*</span></label>
              <select
                id="targetUsers"
                name="targetUsers"
                multiple
                value={formData.targetUsers}
                onChange={handleUserSelect}
                className="multi-select"
                size="5"
              >
                {users.map(user => (
                  <option key={user.id} value={user.uid}>
                    {user.name || user.email || user.uid}
                  </option>
                ))}
              </select>
              <div className="field-hint">Hold Ctrl/Cmd to select multiple users</div>
            </div>
          )}
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            <label htmlFor="active">Active</label>
            <div className="field-hint">Toggle whether this coupon code is currently usable</div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin/coupons')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : id ? 'Update Coupon' : 'Create Coupon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouponForm; 