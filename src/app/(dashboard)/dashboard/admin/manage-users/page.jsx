'use client';
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import Loading from './userloader';

const USER_API_ENDPOINT = '/api/users'; 

export default function ManageRider() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(10);

  // Fetch users data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(USER_API_ENDPOINT);
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Failed to load user data. Please check the API endpoint.');
        setUsers([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, selectedRole, users]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  
  // Get current users for the page
  const currentUsers = useMemo(() => {
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    return filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  }, [currentPage, usersPerPage, filteredUsers]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  // Role labels and colors
  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Admin',
      rider: 'Rider',
      user: 'Customer',
      district_admin: 'District Admin',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'rider': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-emerald-100 text-emerald-800';
      case 'district_admin': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Working status configuration for riders
  const getWorkingStatusConfig = (status) => {
    if (!status) return { text: 'Not Set', color: 'text-gray-600', bg: 'bg-gray-50', icon: '⚪' };
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'on duty':
      case 'duty':
        return { text: 'On Duty', color: 'text-green-600', bg: 'bg-green-50', icon: '🟢' };
      case 'vacation':
        return { text: 'Vacation', color: 'text-yellow-600', bg: 'bg-yellow-50', icon: '🟡' };
      case 'off duty':
        return { text: 'Off Duty', color: 'text-gray-600', bg: 'bg-gray-50', icon: '⚪' };
      default:
        return { text: status, color: 'text-blue-600', bg: 'bg-blue-50', icon: '🔵' };
    }
  };

  // Email verification status
  const getVerificationStatus = (user) => {
    return user.emailVerified ? 
      { text: 'Verified', color: 'text-green-600', bg: 'bg-green-50', icon: '✅' } :
      { text: 'Not Verified', color: 'text-red-600', bg: 'bg-red-50', icon: '❌' };
  };

  // Open modal with user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleUsersPerPageChange = (e) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }
    
    return pageNumbers;
  };

  if (loading) {
    return <Loading/>;
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-base-400 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-base-600 mt-2 max-w-2xl mx-auto sm:mx-0">
            Manage platform users, assign roles, and monitor account status in real time.
          </p>
        </div>

        {/* Controls Card */}
        <div className="bg-base-400 backdrop-blur-sm rounded-2xl shadow-lg p-5 mb-8 border border-base-200/70">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-base-100">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-3 text-base-400 bg-base-400 border border-base-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-base-600 whitespace-nowrap">Filter by Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 text-color bg-base-400 border border-base-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm min-w-[140px]"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="district_admin">District Admin</option>
                <option value="rider">Rider</option>
                <option value="user">Customer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Per Page Selector */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-base-600">Show:</label>
            <select
              value={usersPerPage}
              onChange={handleUsersPerPageChange}
              className="px-3 py-2 text-sm bg-base-400 border border-base-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <span className="text-sm text-base-600">users per page</span>
          </div>
          
          <div className="text-sm text-base-600">
            Showing {((currentPage - 1) * usersPerPage) + 1} to {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-base-400 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-base-200/70 mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-base-200/70">
              <thead className="bg-base-50/90">
                <tr>
                  <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-base-700 uppercase tracking-wide">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-base-700 uppercase tracking-wide">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-base-700 uppercase tracking-wide">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-base-700 uppercase tracking-wide">
                    District
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-base-700 uppercase tracking-wide">
                    Working Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-sm font-semibold text-base-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-base-200/50 bg-base-400">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => {
                    const workingStatusConfig = getWorkingStatusConfig(user.working_status);
                    const verificationConfig = getVerificationStatus(user);
                    
                    return (
                      <tr
                        key={user._id}
                        className="transition-all duration-200 hover:bg-base-50/70 group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                className="h-12 w-12 rounded-full object-cover border-2 border-base-100 shadow-sm"
                                src={user.image || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                                alt={user.name}
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-base-900">{user.name}</div>
                              <div className="text-xs text-base-500 mt-1">ID: #{user._id.slice(-6)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-base-700 font-mono">{user.email}</div>
                          <div className={`px-2 py-1 inline-flex text-xs font-medium rounded-full ${verificationConfig.bg} ${verificationConfig.color} mt-1`}>
                            {verificationConfig.icon} {verificationConfig.text}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-base-700">
                            {user.district || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{workingStatusConfig.icon}</span>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${workingStatusConfig.bg} ${workingStatusConfig.color}`}>
                              {workingStatusConfig.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewUser(user)}
                              className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 group-hover:shadow-sm"
                            >
                              <span>👁️</span>
                              <span className="ml-1 hidden sm:inline">View</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl mb-4 text-base-300">👤</div>
                        <h3 className="text-lg font-medium text-base-900 mb-1">No users found</h3>
                        <p className="text-base-500 max-w-md">
                          Try adjusting your search terms or filter criteria. We couldn't find any matching users.
                        </p>
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setSelectedRole('all');
                          }}
                          className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="text-sm text-base-600">
              Page {currentPage} of {totalPages}
            </div>
            
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {getPageNumbers().map(pageNumber => (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-base-400 text-base-700 hover:bg-base-300'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
              >
                Next
              </button>
            </div>

            <div className="text-sm text-base-600">
              Total: {filteredUsers.length} users
            </div>
          </div>
        )}

        {/* Stats Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-base-600 bg-base-400 backdrop-blur-sm rounded-xl p-4 border border-base-400">
          <div>
            Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
            <span className="font-semibold">{users.length}</span> total users
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span>Riders: {users.filter(u => u.role === 'rider').length}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span>Admins: {users.filter(u => u.role === 'admin').length}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
              <span>District Admins: {users.filter(u => u.role === 'district_admin').length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-lg flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div className="flex items-center space-x-4">
                    <img
                      className="h-16 w-16 rounded-full object-cover border-2 border-gray-200"
                      src={selectedUser.image || selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name)}&background=random`}
                      alt={selectedUser.name}
                    />
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{selectedUser.name}</h4>
                      <p className="text-sm text-gray-500">ID: #{selectedUser._id}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <p className="text-gray-900 font-mono">{selectedUser.email}</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getVerificationStatus(selectedUser).bg} ${getVerificationStatus(selectedUser).color}`}>
                      {getVerificationStatus(selectedUser).icon} {getVerificationStatus(selectedUser).text}
                    </span>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">Role</label>
                    <span className={`px-3 py-1 inline-flex text-sm font-medium rounded-full ${getRoleColor(selectedUser.role)}`}>
                      {getRoleLabel(selectedUser.role)}
                    </span>
                  </div>

                  {selectedUser.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Phone</label>
                      <p className="text-gray-900">{selectedUser.phone}</p>
                    </div>
                  )}

                  {selectedUser.nickName && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nickname</label>
                      <p className="text-gray-900">{selectedUser.nickName}</p>
                    </div>
                  )}
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Additional Information</h3>
                  
                  {selectedUser.district && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">District</label>
                      <p className="text-gray-900">{selectedUser.district}</p>
                    </div>
                  )}

                  {selectedUser.districtId && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">District ID</label>
                      <p className="text-gray-900 font-mono text-sm">{selectedUser.districtId}</p>
                    </div>
                  )}

                  {selectedUser.working_status && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Working Status</label>
                      <div className="flex items-center mt-1">
                        <span className="text-lg mr-2">{getWorkingStatusConfig(selectedUser.working_status).icon}</span>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getWorkingStatusConfig(selectedUser.working_status).bg} ${getWorkingStatusConfig(selectedUser.working_status).color}`}>
                          {getWorkingStatusConfig(selectedUser.working_status).text}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedUser.department && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Department</label>
                      <p className="text-gray-900">{selectedUser.department}</p>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-600">Member Since</label>
                    <p className="text-gray-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>

                  {selectedUser.points !== undefined && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Points</label>
                      <p className="text-gray-900">{selectedUser.points}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Security Information */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="font-medium text-gray-600">Failed Login Attempts</label>
                    <p className="text-gray-900">{selectedUser.failedLoginAttempts || 0}</p>
                  </div>
                  <div>
                    <label className="font-medium text-gray-600">Account Locked</label>
                    <p className="text-gray-900">{selectedUser.lockUntil ? 'Yes' : 'No'}</p>
                  </div>
                  {selectedUser.providers && (
                    <div className="md:col-span-2">
                      <label className="font-medium text-gray-600">Login Providers</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedUser.providers.map((provider, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            {provider.provider}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 pt-6 border-t flex justify-end space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}