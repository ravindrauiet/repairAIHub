import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  getAllReferrals, 
  deactivateReferral,
  activateReferral
} from '../../services/firestoreService';

const ReferralsList = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Stats
  const [stats, setStats] = useState({
    totalUses: 0,
    totalDiscount: 0,
    totalRevenue: 0,
    activeCount: 0,
    inactiveCount: 0
  });
  
  useEffect(() => {
    fetchReferrals();
  }, []);
  
  const fetchReferrals = async () => {
    try {
      setLoading(true);
      const fetchedReferrals = await getAllReferrals();
      
      // Sort by created date (newest first)
      fetchedReferrals.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB - dateA;
      });
      
      setReferrals(fetchedReferrals);
      
      // Calculate stats
      const totalUses = fetchedReferrals.reduce((sum, ref) => sum + (ref.usageCount || 0), 0);
      const totalDiscount = fetchedReferrals.reduce((sum, ref) => sum + (ref.totalDiscount || 0), 0);
      const totalRevenue = fetchedReferrals.reduce((sum, ref) => sum + (ref.revenue || 0), 0);
      const activeCount = fetchedReferrals.filter(ref => ref.active).length;
      const inactiveCount = fetchedReferrals.filter(ref => !ref.active).length;
      
      setStats({
        totalUses,
        totalDiscount,
        totalRevenue,
        activeCount,
        inactiveCount
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching referrals:', err);
      setError('Failed to load referrals');
      setLoading(false);
    }
  };
  
  const handleActivateToggle = async (referral) => {
    try {
      if (referral.active) {
        await deactivateReferral(referral.id);
      } else {
        await activateReferral(referral.id);
      }
      
      // Update local state
      setReferrals(referrals.map(r => 
        r.id === referral.id ? { ...r, active: !r.active } : r
      ));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        activeCount: referral.active ? prev.activeCount - 1 : prev.activeCount + 1,
        inactiveCount: referral.active ? prev.inactiveCount + 1 : prev.inactiveCount - 1
      }));
    } catch (err) {
      console.error('Error toggling referral status:', err);
      setError('Failed to update referral status');
    }
  };
  
  const filteredReferrals = referrals
    .filter(referral => {
      if (filter === 'active') return referral.active;
      if (filter === 'inactive') return !referral.active;
      return true;
    })
    .filter(referral => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        referral.code.toLowerCase().includes(term) ||
        referral.description.toLowerCase().includes(term)
      );
    });
  
  if (loading) {
    return <div className="admin-loading">Loading referrals...</div>;
  }
  
  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <h1>Referral Codes</h1>
        <p className="admin-page-subtitle">Manage referral codes and view analytics</p>
        <Link to="/admin/referrals/add" className="admin-btn-action">
          <i className="fas fa-plus"></i> Create New Referral
        </Link>
      </div>
      
      {error && (
        <div className="admin-alert error">
          <p>{error}</p>
        </div>
      )}
      
      <div className="admin-stats-cards">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.totalUses}</div>
          <div className="admin-stat-label">Total Uses</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">₹{stats.totalDiscount.toLocaleString()}</div>
          <div className="admin-stat-label">Total Discount</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">₹{stats.totalRevenue.toLocaleString()}</div>
          <div className="admin-stat-label">Generated Revenue</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">{stats.activeCount}</div>
          <div className="admin-stat-label">Active Referrals</div>
        </div>
      </div>
      
      <div className="admin-content-wrapper">
        <div className="admin-table-controls">
          <div className="admin-table-search">
            <input
              type="text"
              placeholder="Search referrals..."
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
          </div>
        </div>
        
        {filteredReferrals.length === 0 ? (
          <div className="admin-empty-state">
            <p>No referrals found</p>
            <Link to="/admin/referrals/add" className="admin-btn-action">
              Create your first referral
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
                  <th>Usage</th>
                  <th>Total Discount</th>
                  <th>Revenue</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map(referral => (
                  <tr key={referral.id} className={!referral.active ? 'inactive-row' : ''}>
                    <td><strong>{referral.code}</strong></td>
                    <td>{referral.discountPercentage}%</td>
                    <td>{referral.description}</td>
                    <td>{referral.usageCount || 0}</td>
                    <td>₹{(referral.totalDiscount || 0).toLocaleString()}</td>
                    <td>₹{(referral.revenue || 0).toLocaleString()}</td>
                    <td>
                      <span className={`status-badge ${referral.active ? 'active' : 'inactive'}`}>
                        {referral.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn"
                        onClick={() => handleActivateToggle(referral)}
                        title={referral.active ? 'Deactivate' : 'Activate'}
                      >
                        <i className={`fas fa-${referral.active ? 'ban' : 'check'}`}></i>
                      </button>
                      <Link
                        to={`/admin/referrals/edit/${referral.id}`}
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

export default ReferralsList; 