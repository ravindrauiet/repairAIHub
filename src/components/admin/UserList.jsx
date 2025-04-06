import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserList = () => {
  // State for users
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filtering and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Edit user state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  
  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  
  // Available user roles
  const userRoles = [
    { value: 'user', label: 'Customer', color: 'info' },
    { value: 'admin', label: 'Administrator', color: 'primary' },
    { value: 'tech', label: 'Technician', color: 'success' }
  ];
  
  // Fetch users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, sortBy, sortDirection, searchTerm]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Construct query parameters
      const params = {
        page: currentPage,
        limit,
        sortBy,
        sortDirection,
      };
      
      if (roleFilter !== 'all') {
        params.role = roleFilter;
      }
      
      if (searchTerm) {
        params.search = searchTerm;
      }
      
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setUsers(response.data.users);
      setTotalPages(Math.ceil(response.data.total / limit));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
      setLoading(false);
    }
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Handle role filter
  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1);
  };
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    // Reset to first page when searching
    setCurrentPage(1);
  };
  
  // Open edit modal
  const openEditModal = (user) => {
    setEditingUser({
      ...user
    });
    setFormErrors({});
    setShowEditModal(true);
  };
  
  // Handle input change for edit form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setEditingUser({
      ...editingUser,
      [name]: value
    });
    
    // Clear error if user is correcting it
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };
  
  // Validate edit form
  const validateForm = () => {
    const errors = {};
    
    if (!editingUser.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!editingUser.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(editingUser.email)) {
      errors.email = 'Email is invalid';
    }
    
    // Only validate password if it's provided (for updates)
    if (editingUser.password && editingUser.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Update user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      // Create update data object (exclude password if empty)
      const updateData = {
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role
      };
      
      if (editingUser.password) {
        updateData.password = editingUser.password;
      }
      
      await axios.put(`http://localhost:5000/api/admin/users/${editingUser.id}`, updateData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      
      // Close modal and refresh users
      setShowEditModal(false);
      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };
  
  // Confirm delete
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  
  // Delete user
  const handleDeleteUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`http://localhost:5000/api/admin/users/${userToDelete.id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Close modal and refresh users
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user. Please try again.');
      setShowDeleteModal(false);
    }
  };
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  // Get role badge color
  const getRoleColor = (role) => {
    const roleObj = userRoles.find(r => r.value === role);
    return roleObj ? roleObj.color : 'secondary';
  };
  
  // Get role label
  const getRoleLabel = (role) => {
    const roleObj = userRoles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  };
  
  // Generate pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;
    
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return (
      <div className="admin-pagination">
        <button
          className="admin-pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        
        {startPage > 1 && (
          <>
            <button
              className="admin-pagination-btn"
              onClick={() => handlePageChange(1)}
            >
              1
            </button>
            {startPage > 2 && <span className="admin-pagination-ellipsis">...</span>}
          </>
        )}
        
        {pageNumbers.map(number => (
          <button
            key={number}
            className={`admin-pagination-btn ${number === currentPage ? 'active' : ''}`}
            onClick={() => handlePageChange(number)}
          >
            {number}
          </button>
        ))}
        
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="admin-pagination-ellipsis">...</span>}
            <button
              className="admin-pagination-btn"
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          className="admin-pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="admin-loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-users-list">
      <div className="admin-section-header">
        <h2 className="admin-section-title">User Management</h2>
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
      
      {/* Filters and Search */}
      <div className="admin-filters">
        <div className="admin-filter-group">
          <label htmlFor="roleFilter" className="admin-filter-label">
            Role:
          </label>
          <select
            id="roleFilter"
            className="admin-select"
            value={roleFilter}
            onChange={handleRoleFilterChange}
          >
            <option value="all">All Roles</option>
            {userRoles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="admin-filter-group">
          <form onSubmit={handleSearch} className="admin-search-form">
            <input
              type="text"
              className="admin-input"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="admin-btn admin-btn-primary">
              <i className="fas fa-search"></i>
            </button>
          </form>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="admin-card">
        <div className="admin-card-body">
          {users.length === 0 ? (
            <div className="admin-empty-state">
              <i className="fas fa-users"></i>
              <p>No users found. Adjust your filters or add new users.</p>
            </div>
          ) : (
            <>
              <div className="admin-table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th 
                        onClick={() => handleSort('id')}
                        className="sortable"
                      >
                        ID 
                        {sortBy === 'id' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('name')}
                        className="sortable"
                      >
                        Name 
                        {sortBy === 'name' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('email')}
                        className="sortable"
                      >
                        Email 
                        {sortBy === 'email' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('role')}
                        className="sortable"
                      >
                        Role 
                        {sortBy === 'role' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th 
                        onClick={() => handleSort('createdAt')}
                        className="sortable"
                      >
                        Joined 
                        {sortBy === 'createdAt' && (
                          <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>
                        )}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`admin-badge admin-badge-${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td>
                          <div className="admin-table-actions">
                            <button
                              className="admin-btn admin-btn-sm admin-btn-primary"
                              onClick={() => openEditModal(user)}
                              title="Edit User"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              className="admin-btn admin-btn-sm admin-btn-danger"
                              onClick={() => confirmDelete(user)}
                              title="Delete User"
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
              
              {/* Pagination */}
              {renderPagination()}
            </>
          )}
        </div>
      </div>
      
      {/* Edit User Modal */}
      {showEditModal && (
        <div className="admin-modal">
          <div className="admin-modal-overlay" onClick={() => setShowEditModal(false)}></div>
          <div className="admin-modal-container">
            <div className="admin-modal-header">
              <h3>Edit User</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowEditModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="admin-modal-body">
              <form onSubmit={handleUpdateUser}>
                <div className="admin-form-group">
                  <label htmlFor="name" className="admin-label">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`admin-input ${formErrors.name ? 'has-error' : ''}`}
                    value={editingUser.name}
                    onChange={handleInputChange}
                    placeholder="Enter name"
                  />
                  {formErrors.name && <div className="admin-error-msg">{formErrors.name}</div>}
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="email" className="admin-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`admin-input ${formErrors.email ? 'has-error' : ''}`}
                    value={editingUser.email}
                    onChange={handleInputChange}
                    placeholder="Enter email"
                  />
                  {formErrors.email && <div className="admin-error-msg">{formErrors.email}</div>}
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="role" className="admin-label">
                    Role <span className="required">*</span>
                  </label>
                  <select
                    id="role"
                    name="role"
                    className="admin-select"
                    value={editingUser.role}
                    onChange={handleInputChange}
                  >
                    {userRoles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="admin-form-group">
                  <label htmlFor="password" className="admin-label">
                    Password (leave blank to keep unchanged)
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`admin-input ${formErrors.password ? 'has-error' : ''}`}
                    value={editingUser.password || ''}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                  />
                  {formErrors.password && <div className="admin-error-msg">{formErrors.password}</div>}
                </div>
              </form>
            </div>
            <div className="admin-modal-footer">
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn-primary"
                onClick={handleUpdateUser}
              >
                Update User
              </button>
            </div>
          </div>
        </div>
      )}
      
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
                Are you sure you want to delete the user <strong>{userToDelete.name}</strong> ({userToDelete.email})?
              </p>
              <p className="admin-text-danger">
                <i className="fas fa-exclamation-triangle"></i> This action cannot be undone.
                All user data, including orders and bookings, will be anonymized but retained in the system.
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
                onClick={handleDeleteUser}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserList; 