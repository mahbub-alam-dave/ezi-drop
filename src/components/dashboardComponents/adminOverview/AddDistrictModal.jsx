"use client"
import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddDistrictModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    districtName: '',
    districtId: '',
    subDistricts: '',
    warehouseAddress: '',
    warehouseEmail: '',
    coordsLat: '',
    coordsLon: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const generateDistrictId = (name) => {
    if (!name) return '';
    return `ezi-drop-${name.toLowerCase().replace(/\s+/g, '-')}-01`;
  };

  const handleDistrictNameChange = (e) => {
    const name = e.target.value;
    setFormData({
      ...formData,
      districtName: name,
      districtId: generateDistrictId(name)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // Parse sub-districts (comma-separated)
      const subDistrictsArray = formData.subDistricts
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      if (subDistrictsArray.length === 0) {
        setError('Please enter at least one sub-district');
        setIsSubmitting(false);
        return;
      }

      // Prepare coords
      const coords = [
        parseFloat(formData.coordsLon) || 0,
        parseFloat(formData.coordsLat) || 0
      ];

      const payload = {
        districtName: formData.districtName,
        districtId: formData.districtId,
        subDistricts: subDistrictsArray,
        warehouseAddress: formData.warehouseAddress,
        warehouseEmail: formData.warehouseEmail,
        coords
      };

      const res = await fetch('/api/add-districts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to add district');
      }

      // Success
      onSuccess();
      handleClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      districtName: '',
      districtId: '',
      subDistricts: '',
      warehouseAddress: '',
      warehouseEmail: '',
      coordsLat: '',
      coordsLon: ''
    });
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Add New District
          </h2>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* District Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-lg">
              District Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                District Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.districtName}
                onChange={handleDistrictNameChange}
                placeholder="e.g., Dhaka"
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                District ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.districtId}
                onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                placeholder="Auto-generated from district name"
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Auto-generated, but you can edit it
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Sub-Districts (Upazilas) <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.subDistricts}
                onChange={(e) => setFormData({ ...formData, subDistricts: e.target.value })}
                placeholder="Enter sub-districts separated by commas (e.g., Batiaghata, Dacope, Dumuria)"
                required
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Separate multiple sub-districts with commas
              </p>
            </div>
          </div>

          {/* Warehouse Information */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-700 dark:text-slate-300 text-lg">
              Warehouse Information
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Warehouse Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.warehouseAddress}
                onChange={(e) => setFormData({ ...formData, warehouseAddress: e.target.value })}
                placeholder="e.g., Warehouse Rd, Tejgaon, Dhaka"
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Contact Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.warehouseEmail}
                onChange={(e) => setFormData({ ...formData, warehouseEmail: e.target.value })}
                placeholder="e.g., agent@ezidrop.com"
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordsLat}
                  onChange={(e) => setFormData({ ...formData, coordsLat: e.target.value })}
                  placeholder="23.8103"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.coordsLon}
                  onChange={(e) => setFormData({ ...formData, coordsLon: e.target.value })}
                  placeholder="90.4125"
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-gray-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Optional: Enter coordinates for warehouse location (defaults to 0,0 if not provided)
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Adding...' : 'Add District'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDistrictModal;