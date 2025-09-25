'use client';
import React, { useState, useMemo } from 'react';

export default function ManageRider() {
  // Fake user data
  const users = [
    {
      id: 1,
      name: 'Rahim Khan',
      email: 'rahim.khan@example.com',
      role: 'rider',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 2,
      name: 'Sadia Akter',
      email: 'sadia.akter@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?img=2',
    },
    {
      id: 3,
      name: 'Karim Hossain',
      email: 'karim.hossain@example.com',
      role: 'user',
      status: 'inactive',
      avatar: 'https://i.pravatar.cc/150?img=3',
    },
    {
      id: 4,
      name: 'Nusrat Jahan',
      email: 'nusrat.j@example.com',
      role: 'rider',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?img=4',
    },
    {
      id: 5,
      name: 'Tareq Mahmud',
      email: 'tareq.m@example.com',
      role: 'rider',
      status: 'suspended',
      avatar: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 6,
      name: 'Fahim Ahmed',
      email: 'fahim.a@example.com',
      role: 'user',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?img=6',
    },
    {
      id: 7,
      name: 'Ayesha Rahman',
      email: 'ayesha.r@example.com',
      role: 'admin',
      status: 'active',
      avatar: 'https://i.pravatar.cc/150?img=7',
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [searchTerm, selectedRole]);

  const getRoleLabel = (role) => {
    const labels = {
      admin: 'Admin',
      rider: 'Rider',
      user: 'Customer',
    };
    return labels[role] || role;
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'rider': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { text: 'Active', color: 'text-green-600', bg: 'bg-green-50', icon: '🟢' };
      case 'inactive':
        return { text: 'Inactive', color: 'text-gray-600', bg: 'bg-gray-50', icon: '⚪' };
      case 'suspended':
        return { text: 'Suspended', color: 'text-red-600', bg: 'bg-red-50', icon: '🔴' };
      default:
        return { text: 'Unknown', color: 'text-gray-600', bg: 'bg-gray-50', icon: '❓' };
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto sm:mx-0">
            Manage platform users, assign roles, and monitor account status in real time.
          </p>
        </div>

        {/* Controls Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-5 mb-8 border border-gray-200/70">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-3 text-gray-800 bg-white/90 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 text-gray-800 bg-white/90 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none shadow-sm min-w-[140px]"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="rider">Rider</option>
                <option value="user">Customer</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200/70">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/70">
              <thead className="bg-gray-50/90">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    User
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/50 bg-white">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const statusConfig = getStatusConfig(user.status);
                    return (
                      <tr
                        key={user.id}
                        className="transition-all duration-200 hover:bg-gray-50/70 group"
                      >
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <img
                                className="h-12 w-12 rounded-full object-cover border-2 border-white shadow-sm"
                                src={user.avatar}
                                alt={user.name}
                                onError={(e) => {
                                  e.target.src = 'https://via.placeholder.com/150?text=User';
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500 mt-1">ID: #{user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="text-sm text-gray-700 font-mono">{user.email}</div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{statusConfig.icon}</span>
                            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.color}`}>
                              {statusConfig.text}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => alert(`View details for ${user.name}`)}
                              className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200 group-hover:shadow-sm"
                            >
                              <span>👁️</span>
                              <span className="ml-1 hidden sm:inline">View</span>
                            </button>
                            <button
                              className="inline-flex items-center px-3.5 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all duration-200 group-hover:shadow-sm"
                            >
                              <span>✏️</span>
                              <span className="ml-1 hidden sm:inline">Edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-5xl mb-4 text-gray-300">👤</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">No users found</h3>
                        <p className="text-gray-500 max-w-md">
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

        {/* Stats Footer */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50">
          <div>
            Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
            <span className="font-semibold">{users.length}</span> users
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
          </div>
        </div>
      </div>
    </div>
  );
}