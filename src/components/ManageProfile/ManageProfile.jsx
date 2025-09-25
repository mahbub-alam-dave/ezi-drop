// src/components/ManageProfile/ManageProfile.jsx
"use client";

import { useState } from 'react';

export default function ManageProfile({ role }) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Sample data for different roles
  const profileData = {
   
    admin: {
      name: 'Michael Rodriguez',
      role: 'System Administrator',
      email: 'mrodriguez@deliverypro.com',
      phone: '+1 (555) 123-4567',
      company: 'DeliveryPro Inc.',
      joinDate: 'January 10, 2019',
      birthDate: '1985-05-15',
      employmentType: 'Full-Time',
      status: 'Active',
      department: 'IT Management',
      accessLevel: 'Super Admin',
      systemStats: {
        totalUsers: 1547,
        activeRiders: 89,
        pendingIssues: 12
      },
      upcomingDeliveries: [
        { 
          date: 'July 24, 2020', 
          time: '9:00 AM — 11:00 AM', 
          type: 'System maintenance', 
          address: 'Data Center - Server Room A',
          status: 'Scheduled',
          priority: 'Critical'
        },
        { 
          date: 'July 25, 2020', 
          time: '3:00 PM — 5:00 PM', 
          type: 'Team meeting', 
          address: 'Conference Room A - HQ',
          status: 'Confirmed',
          priority: 'Medium'
        }
      ],
      tasks: [
        { task: 'Review rider performance', assigned: 'System Admin', due: '07/24/2020', attachments: 'performance.zip', completed: true },
        { task: 'Update delivery zones', assigned: 'System Admin', due: '07/24/2020', attachments: 'zones.zip', completed: false },
        { task: 'Monthly report generation', assigned: 'Finance Team', due: '07/24/2020', attachments: 'reports.zip', completed: false },
        { task: 'Security audit', assigned: 'Security Team', due: '07/24/2020', attachments: 'audit.zip', completed: true }
      ]
    },
    rider: {
      name: 'David Chen',
      role: 'Senior Delivery Rider',
      email: 'dchen@deliverypro.com',
      phone: '+1 (555) 987-6543',
      company: 'DeliveryPro Inc.',
      joinDate: 'March 22, 2020',
      birthDate: '1992-08-30',
      employmentType: 'Full-Time',
      status: 'On Duty',
      vehicleType: 'Motorcycle',
      licensePlate: 'RIDER2020',
      riderStats: {
        deliveriesToday: 8,
        rating: 4.8,
        earnings: '$127.50'
      },
      upcomingDeliveries: [
        { 
          date: 'July 24, 2020', 
          time: '8:30 AM — 9:30 AM', 
          type: 'Food delivery', 
          address: '789 Pizza Place, Downtown',
          status: 'Ready for Pickup',
          priority: 'High'
        },
        { 
          date: 'July 24, 2020', 
          time: '10:00 AM — 11:00 AM', 
          type: 'Package delivery', 
          address: '321 Elm Street, Westside',
          status: 'Scheduled',
          priority: 'Medium'
        }
      ],
      tasks: [
        { task: 'Vehicle maintenance check', assigned: 'Fleet Manager', due: '07/24/2020', attachments: 'checklist.zip', completed: true },
        { task: 'Route optimization', assigned: 'Dispatch Team', due: '07/24/2020', attachments: 'routes.zip', completed: true },
        { task: 'Safety protocol review', assigned: 'Safety Officer', due: '07/24/2020', attachments: 'safety.zip', completed: false },
        { task: 'Customer feedback review', assigned: 'Quality Team', due: '07/24/2020', attachments: 'feedback.zip', completed: false }
      ]
    }
  };

  // Get data based on role prop
  const data = profileData[role] || profileData.user;

  // Role-based configuration
  const roleConfig = {
    user: {
      title: 'User Profile',
      icon: '📦',
      stats: data.deliveryStats,
      statTitle: 'Delivery Statistics',
      formFields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'company', label: 'Company', type: 'text' },
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
        { name: 'address', label: 'Delivery Address', type: 'textarea' },
        { name: 'deliveryPreferences', label: 'Delivery Preferences', type: 'select', options: ['Morning', 'Afternoon', 'Evening', 'Anytime'] },
        { name: 'notificationEmail', label: 'Email Notifications', type: 'checkbox' },
        { name: 'notificationSMS', label: 'SMS Notifications', type: 'checkbox' }
      ]
    },
    admin: {
      title: 'Admin Profile',
      icon: '⚙️',
      stats: data.systemStats,
      statTitle: 'System Overview',
      formFields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'department', label: 'Department', type: 'text', required: true },
        { name: 'accessLevel', label: 'Access Level', type: 'select', options: ['View Only', 'Standard Admin', 'Super Admin'] },
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
        { name: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-Time', 'Part-Time', 'Contract'] }
      ]
    },
    rider: {
      title: 'Rider Profile',
      icon: '🚴',
      stats: data.riderStats,
      statTitle: 'Today\'s Performance',
      formFields: [
        { name: 'name', label: 'Full Name', type: 'text', required: true },
        { name: 'email', label: 'Email Address', type: 'email', required: true },
        { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Motorcycle', 'Bicycle', 'Car', 'Scooter'] },
        { name: 'licensePlate', label: 'License Plate', type: 'text' },
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
        { name: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-Time', 'Part-Time', 'Contract'] }
      ]
    }
  };

  const config = roleConfig[role] || roleConfig.user;

  // Initialize form data when modal opens
  const openEditModal = () => {
    setFormData(data);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setFormData({});
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Profile updated:', formData);
      // Here you would typically make an API call to update the profile
      alert('Profile updated successfully!');
      closeEditModal();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render form field based on type
  const renderFormField = (field) => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="input-style"
            rows={3}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      
      case 'select':
        return (
          <select
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="input-style"
          >
            <option value="">Select {field.label}</option>
            {field.options.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      
      case 'checkbox':
        return (
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name={field.name}
              checked={formData[field.name] || false}
              onChange={handleInputChange}
              className="w-4 h-4 background-color-primary rounded focus:ring-blue-500"
            />
            <span className="text-color text-sm">Enable {field.label}</span>
          </label>
        );
      
      default:
        return (
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name] || ''}
            onChange={handleInputChange}
            className="input-style"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
    }
  };

  return (
    <div className="min-h-screen background-color text-color p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-color flex items-center gap-3">
              <span>{config.icon}</span>
              {config.title}
            </h1>
            <p className="text-color-soft mt-2">Manage your delivery profile and preferences</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`px-4 py-2 rounded-full text-sm font-medium ${
              data.status === 'Active' || data.status === 'On Duty' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
            }`}>
              {data.status}
            </div>
            <button 
              onClick={openEditModal}
              className="background-color-primary text-white py-2 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-color-border dark:border-gray-700 p-6">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-20 h-20 background-color-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {data.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-color">{data.name}</h2>
                  <p className="text-color-soft">{data.role}</p>
                  <p className="text-color-soft text-sm mt-1">{data.company}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-color-border dark:border-gray-700">
                  <span className="text-color-soft">Email:</span>
                  <span className="text-color font-medium">{data.email}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-color-border dark:border-gray-700">
                  <span className="text-color-soft">Phone:</span>
                  <span className="text-color font-medium">{data.phone}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-color-soft">Join Date:</span>
                  <span className="text-color font-medium">{data.joinDate}</span>
                </div>
              </div>
            </div>

            {/* Statistics Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-color-border dark:border-gray-700 p-6">
              <h3 className="font-semibold text-lg text-color mb-4">{config.statTitle}</h3>
              <div className="space-y-4">
                {Object.entries(config.stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-color-soft capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                    <span className="text-color font-semibold">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-color-border dark:border-gray-700 p-6">
              <h3 className="font-semibold text-lg text-color mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button 
                  onClick={openEditModal}
                  className="w-full background-color-primary text-white py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Edit Profile
                </button>
                <button className="w-full border border-color-border dark:border-gray-700 text-color py-2 px-4 rounded-lg hover:background-color-primary hover:text-white transition-all">
                  Notification Settings
                </button>
                {role === 'rider' && (
                  <button className="w-full border border-color-border dark:border-gray-700 text-color py-2 px-4 rounded-lg hover:background-color-primary hover:text-white transition-all">
                    Update Availability
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Upcoming Deliveries/Events */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-color-border dark:border-gray-700 p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-xl text-color">
                  {role === 'user' ? 'Upcoming Deliveries' : 
                   role === 'rider' ? 'Today\'s Schedule' : 'System Events'}
                </h3>
                <button className="text-color-primary dark:text-color-primary-dark text-sm font-medium">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {data.upcomingDeliveries.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-color-border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="background-color-primary text-white p-3 rounded-lg min-w-[70px] text-center">
                        <div className="text-sm font-medium">{item.date.split(' ')[0]}</div>
                        <div className="text-xs">{item.date.split(' ')[1]}</div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-color">{item.type}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            item.priority === 'High' || item.priority === 'Critical' 
                              ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {item.priority}
                          </span>
                        </div>
                        <p className="text-color-soft text-sm">{item.time}</p>
                        <p className="text-color-soft text-sm">{item.address}</p>
                        <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                          item.status === 'Scheduled' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                    <button className="background-color-primary text-white py-2 px-4 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity mt-3 sm:mt-0 sm:ml-4">
                      Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Tasks Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Tasks/Onboarding */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-color-border dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-xl text-color">
                    {role === 'user' ? 'Onboarding Progress' : 
                     role === 'rider' ? 'Daily Tasks' : 'Administrative Tasks'}
                  </h3>
                  <span className="text-color-soft text-sm">
                    {data.tasks.filter(t => t.completed).length} of {data.tasks.length} completed
                  </span>
                </div>
                
                <div className="space-y-3">
                  {data.tasks.map((task, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-color-border dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          task.completed 
                            ? 'border-green-500 bg-green-500 text-white' 
                            : 'border-color-border dark:border-gray-600'
                        }`}>
                          {task.completed && '✓'}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-color text-sm">{task.task}</h4>
                          <p className="text-color-soft text-xs">Assigned: {task.assigned}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-color-soft text-xs">{task.due}</p>
                        <button className="text-color-primary dark:text-color-primary-dark text-xs font-medium">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-color-border dark:border-gray-700 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-semibold text-xl text-color">July 2020 Schedule</h3>
                  <div className="flex space-x-2">
                    <button className="p-1 rounded background-color-primary text-white">
                      ←
                    </button>
                    <button className="p-1 rounded background-color-primary text-white">
                      →
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-1 text-center mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="font-medium text-color-soft text-sm py-2">{day}</div>
                  ))}
                  
                  {/* Calendar days */}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <div 
                      key={day} 
                      className={`p-2 rounded-lg text-sm ${
                        day === 24 
                          ? 'background-color-primary text-white font-medium' 
                          : 'text-color hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-color-border dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 background-color-primary rounded"></div>
                    <span className="text-color-soft text-sm">Today</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-color-soft text-sm">Deliveries</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-color-soft text-sm">Events</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-color-border dark:border-gray-700 p-6">
              <h3 className="font-semibold text-xl text-color mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 background-color-primary rounded-full"></div>
                  <div>
                    <p className="text-color text-sm">New delivery scheduled for July 26</p>
                    <p className="text-color-soft text-xs">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 background-color-secondary rounded-full"></div>
                  <div>
                    <p className="text-color text-sm">Profile information updated</p>
                    <p className="text-color-soft text-xs">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-color text-sm">Payment method verified</p>
                    <p className="text-color-soft text-xs">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-color-border dark:border-gray-700">
              <h2 className="text-2xl font-bold text-color">Edit Profile</h2>
              <button 
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {config.formFields.map((field) => (
                  <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="block text-color text-sm font-medium mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {renderFormField(field)}
                  </div>
                ))}
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-color-border dark:border-gray-700">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-6 py-2 border border-color-border dark:border-gray-600 text-color rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 background-color-primary text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}