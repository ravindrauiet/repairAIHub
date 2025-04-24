import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllCoupons, 
  deactivateCoupon,
  activateCoupon
} from '../../services/firestoreService';

const CouponsList = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalIssued: 0,
    totalRedeemed: 0,
    totalDiscount: 0,
    activeCount: 0,
    inactiveCount: 0,
    globalCount: 0,
    specificCount: 0
  });
  
  useEffect(() => {
    fetchCoupons();
  }, []);
  
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const fetchedCoupons = await getAllCoupons();
      
      // Sort by created date (newest first)
      fetchedCoupons.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      
      setCoupons(fetchedCoupons);
      
      // Calculate stats
      const totalRedeemed = fetchedCoupons.reduce((sum, coupon) => sum + (coupon.usageCount || 0), 0);
      const totalDiscount = fetchedCoupons.reduce((sum, coupon) => sum + (coupon.totalDiscount || 0), 0);
      const activeCount = fetchedCoupons.filter(coupon => coupon.active).length;
      const inactiveCount = fetchedCoupons.filter(coupon => !coupon.active).length;
      const globalCount = fetchedCoupons.filter(coupon => coupon.target === 'global').length;
      const specificCount = fetchedCoupons.filter(coupon => coupon.target === 'specific').length;
      
      setStats({
        totalIssued: fetchedCoupons.length,
        totalRedeemed,
        totalDiscount,
        activeCount,
        inactiveCount,
        globalCount,
        specificCount
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      setError('Failed to load coupons');
      setLoading(false);
    }
  };
  
  const handleActivateToggle = async (coupon) => {
    try {
      if (coupon.active) {
        await deactivateCoupon(coupon.id);
      } else {
        await activateCoupon(coupon.id);
      }
      
      // Update local state
      setCoupons(coupons.map(c => 
        c.id === coupon.id ? { ...c, active: !c.active } : c
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeCount: coupon.active ? prev.activeCount - 1 : prev.activeCount + 1,
        inactiveCount: coupon.active ? prev.inactiveCount + 1 : prev.inactiveCount - 1
      }));
    } catch (err) {
      console.error('Error toggling coupon status:', err);
      setError('Failed to update coupon status');
    }
  };
  
  const filteredCoupons = coupons
    .filter(coupon => {
      if (filter === 'active') return coupon.active;
      if (filter === 'inactive') return !coupon.active;
      if (filter === 'global') return coupon.target === 'global';
      if (filter === 'specific') return coupon.target === 'specific';
      return true;
    })
    .filter(coupon => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        coupon.code.toLowerCase().includes(term) ||
        coupon.description.toLowerCase().includes(term)
      );
    });
  
  if (loading) {
    return <div className="admin-loading">Loading coupons...</div>;
  }
  
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Coupon Codes</h1>
        <p className="admin-page-subtitle">Manage discount coupons for customers</p>
        <Link to="/admin/coupons/add" className="admin-btn-action">
          <i className="fas fa-plus"></i> Create New Coupon
        </Link>
      </div>
      
      {error && (
        <div className="admin-alert error">
          <p>{error}</p>
        </div>
      )}
      
      <div className="admin-stats-cards">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalIssued}</div>
          <div className="admin-stat-label">Total Coupons</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalRedeemed}</div>
          <div className="admin-stat-label">Total Redeemed</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">₹{stats.totalDiscount.toLocaleString()}</div>
          <div className="admin-stat-label">Total Discount</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.activeCount}</div>
          <div className="admin-stat-label">Active Coupons</div>
        </div>
      </div>
      
      <div className="admin-content-wrapper">
        <div className="admin-table-controls">
          <div className="admin-table-search">
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="admin-table-filters">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              Active
            </button>
            <button
              className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => setFilter('inactive')}
            >
              Inactive
            </button>
            <button
              className={`filter-btn ${filter === 'global' ? 'active' : ''}`}
              onClick={() => setFilter('global')}
            >
              Global
            </button>
            <button
              className={`filter-btn ${filter === 'specific' ? 'active' : ''}`}
              onClick={() => setFilter('specific')}
            >
              Specific
            </button>
          </div>
        </div>
        
        {filteredCoupons.length === 0 ? (
          <div className="admin-empty-state">
            <p>No coupons found</p>
            <Link to="/admin/coupons/add" className="admin-btn-action">
              Create your first coupon
            </Link>
          </div>
        ) : (
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Discount</th>
                  <th>Description</th>
                  <th>Target</th>
                  <th>Uses</th>
                  <th>Total Discount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoupons.map(coupon => (
                  <tr key={coupon.id} className={!coupon.active ? 'inactive-row' : ''}>
                    <td><strong>{coupon.code}</strong></td>
                    <td>{coupon.discountPercentage}%</td>
                    <td>{coupon.description}</td>
                    <td>
                      <span className={`badge ${coupon.target}`}>
                        {coupon.target === 'global' ? 'All Users' : 'Specific Users'}
                      </span>
                    </td>
                    <td>{coupon.usageCount || 0}</td>
                    <td>₹{(coupon.totalDiscount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${coupon.active ? 'active' : 'inactive'}`}>
                        {coupon.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn"
                        onClick={() => handleActivateToggle(coupon)}
                        title={coupon.active ? 'Deactivate' : 'Activate'}
                      >
                        <i className={`fas fa-${coupon.active ? 'ban' : 'check'}`}></i>
                      </button>
                      <Link
                        to={`/admin/coupons/edit/${coupon.id}`}
                        className="action-btn"
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponsList; 