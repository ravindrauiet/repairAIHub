import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getReferralById, addReferral, updateReferral } from '../../services/firestoreService';

const ReferralForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountPercentage: 10,
    description: '',
    active: true
  });
  
  useEffect(() => {
    // Load existing referral data if editing
    if (id) {
      setLoading(true);
      getReferralById(id)
        .then(referral => {
          if (referral) {
            setFormData({
              code: referral.code || '',
              discountPercentage: referral.discountPercentage || 10,
              description: referral.description || '',
              active: referral.active !== undefined ? referral.active : true
            });
          } else {
            setError('Referral not found');
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Error loading referral:', err);
          setError('Error loading referral data');
          setLoading(false);
        });
    }
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : value
    }));
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.code) {
      errors.code = 'Referral code is required';
    } else if (formData.code.length < 3) {
      errors.code = 'Referral code must be at least 3 characters';
    }
    
    if (!formData.discountPercentage) {
      errors.discountPercentage = 'Discount percentage is required';
    } else if (formData.discountPercentage <= 0 || formData.discountPercentage > 100) {
      errors.discountPercentage = 'Discount percentage must be between 1-100';
    }
    
    if (!formData.description) {
      errors.description = 'Description is required';
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
        await updateReferral(id, data);
      } else {
        await addReferral(data);
      }
      
      navigate('/admin/referrals');
    } catch (err) {
      console.error('Error saving referral:', err);
      setError('Error saving referral. Please try again.');
      setLoading(false);
    }
  };
  
  if (loading && !formData.code) {
    return <div className="admin-loading">Loading referral data...</div>;
  }
  
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>{id ? 'Edit Referral' : 'Create New Referral'}</h1>
        <p className="admin-page-subtitle">
          {id ? 'Modify an existing referral code' : 'Create a new referral code for customers'}
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
              <label htmlFor="code">Referral Code <span className="required">*</span></label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter a unique referral code"
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
              <div className="field-hint">The percentage discount this referral code gives</div>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description <span className="required">*</span></label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter a description for this referral code"
              rows="3"
              required
            ></textarea>
            <div className="field-hint">Describe when and how this referral should be used</div>
          </div>
          
          <div className="form-group checkbox">
            <input
              type="checkbox"
              id="active"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            <label htmlFor="active">Active</label>
            <div className="field-hint">Toggle whether this referral code is currently usable</div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/admin/referrals')}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : id ? 'Update Referral' : 'Create Referral'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReferralForm; 