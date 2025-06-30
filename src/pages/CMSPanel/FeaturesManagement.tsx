import React, { useState, ChangeEvent } from 'react';
import { FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { FaChartLine, FaMoneyCheckAlt, FaBoxes, FaUsers, FaCogs, FaHandshake, FaFileInvoice, FaCashRegister, FaTags, FaUserFriends, FaBullseye, FaShieldAlt, FaUserCheck, FaCalendarCheck, FaIdBadge, FaCoins, FaTruck, FaClipboardList, FaWarehouse, FaUserTie, FaFileContract, FaCheckSquare, FaClock } from 'react-icons/fa';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: any;
  color: string;
  features: {
    icon: any;
    text: string;
  }[];
}

const FeaturesManagement = () => {
  const [features, setFeatures] = useState<Feature[]>([
    {
      id: 1,
      title: 'Sales',
      description: 'Invoicing, POS, Sales Commission, Insurance Management, Offers, Installments',
      icon: <FaChartLine className="text-purple-500 text-3xl drop-shadow-lg" />,
      color: 'from-purple-200 to-purple-400',
      features: [
        { icon: <FaFileInvoice />, text: 'Professional Invoicing' },
        { icon: <FaCashRegister />, text: 'Cloud POS System' },
        { icon: <FaTags />, text: 'Dynamic Pricing' },
        { icon: <FaUserFriends />, text: 'Installment Plans' },
        { icon: <FaBullseye />, text: 'Sales Targets' },
        { icon: <FaShieldAlt />, text: 'Insurance Integration' }
      ]
    },
    {
      id: 2,
      title: 'Accounting',
      description: 'Expenses, Tax, Treasuries, Cheque Cycle, Chart of Accounts, Journals, Assets, Cost Centers, General Ledger, Financial Reports',
      icon: <FaMoneyCheckAlt className="text-green-500 text-3xl drop-shadow-lg" />,
      color: 'from-green-200 to-green-400',
      features: [
        { icon: <FaFileInvoice />, text: 'Chart of Accounts' },
        { icon: <FaMoneyCheckAlt />, text: 'Expense Tracking' },
        { icon: <FaBoxes />, text: 'Asset Management' },
        { icon: <FaCogs />, text: 'Cost Centers' },
        { icon: <FaCoins />, text: 'Financial Reports' },
        { icon: <FaCheckSquare />, text: 'Tax Management' }
      ]
    },
    {
      id: 3,
      title: 'Inventory',
      description: 'Stock Tracking, Barcode, Purchases, Suppliers, Warehouses, Stocktaking, Requisitions, Price Lists',
      icon: <FaBoxes className="text-pink-500 text-3xl drop-shadow-lg" />,
      color: 'from-pink-200 to-pink-400',
      features: [
        { icon: <FaTruck />, text: 'Stock Tracking' },
        { icon: <FaClipboardList />, text: 'Barcode System' },
        { icon: <FaWarehouse />, text: 'Warehouse Management' },
        { icon: <FaBoxes />, text: 'Purchase Orders' },
        { icon: <FaUserTie />, text: 'Supplier Portal' },
        { icon: <FaCheckSquare />, text: 'Stocktaking' }
      ]
    },
    {
      id: 4,
      title: 'Human Resource',
      description: 'Employee Database, Payroll, Contracts, Attendance & Leave Management, Multi-Shifts, Requests, Loans',
      icon: <FaUsers className="text-orange-400 text-3xl drop-shadow-lg" />,
      color: 'from-orange-100 to-orange-300',
      features: [
        { icon: <FaUserCheck />, text: 'Employee Database' },
        { icon: <FaMoneyCheckAlt />, text: 'Payroll System' },
        { icon: <FaFileContract />, text: 'Contract Management' },
        { icon: <FaCalendarCheck />, text: 'Attendance Tracking' },
        { icon: <FaIdBadge />, text: 'Multi-Shift Support' },
        { icon: <FaCheckSquare />, text: 'Leave Management' }
      ]
    },
    {
      id: 5,
      title: 'Operations',
      description: 'Work Orders, Project Management, Online Booking Management, Time Tracking',
      icon: <FaCogs className="text-blue-500 text-3xl drop-shadow-lg" />,
      color: 'from-blue-200 to-blue-400',
      features: [
        { icon: <FaClipboardList />, text: 'Work Orders' },
        { icon: <FaCalendarCheck />, text: 'Project Management' },
        { icon: <FaUserCheck />, text: 'Booking System' },
        { icon: <FaClock />, text: 'Time Tracking' },
        { icon: <FaCogs />, text: 'Process Automation' },
        { icon: <FaCheckSquare />, text: 'Resource Planning' }
      ]
    },
    {
      id: 6,
      title: 'CRM',
      description: 'Contact Management, Appointment Assignment, Memberships, Points & Credits, Client Follow-Up, Client Attendance',
      icon: <FaHandshake className="text-teal-500 text-3xl drop-shadow-lg" />,
      color: 'from-teal-200 to-teal-400',
      features: [
        { icon: <FaUserFriends />, text: 'Contact Management' },
        { icon: <FaCalendarCheck />, text: 'Appointment System' },
        { icon: <FaIdBadge />, text: 'Membership Plans' },
        { icon: <FaCoins />, text: 'Loyalty Points' },
        { icon: <FaUserCheck />, text: 'Client Follow-up' },
        { icon: <FaCheckSquare />, text: 'Attendance Tracking' }
      ]
    }
  ]);

  const [newFeature, setNewFeature] = useState<Omit<Feature, 'id'>>({
    title: '',
    description: '',
    icon: <FaChartLine className="text-purple-500 text-3xl drop-shadow-lg" />,
    color: 'from-purple-200 to-purple-400',
    features: []
  });

  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [newSubFeature, setNewSubFeature] = useState({ icon: '', text: '' });

  const handleAddFeature = () => {
    if (newFeature.title && newFeature.description) {
      setFeatures([...features, { id: features.length + 1, ...newFeature }]);
      setNewFeature({
        title: '',
        description: '',
        icon: <FaChartLine className="text-purple-500 text-3xl drop-shadow-lg" />,
        color: 'from-purple-200 to-purple-400',
        features: []
      });
    }
  };

  const handleEditFeature = (feature: Feature) => {
    setEditingFeature(feature);
    setNewFeature({
      title: feature.title,
      description: feature.description,
      icon: feature.icon,
      color: feature.color,
      features: feature.features
    });
  };

  const handleUpdateFeature = () => {
    if (editingFeature) {
      setFeatures(features.map(f => f.id === editingFeature.id ? { ...f, ...newFeature } : f));
      setEditingFeature(null);
      setNewFeature({
        title: '',
        description: '',
        icon: <FaChartLine className="text-purple-500 text-3xl drop-shadow-lg" />,
        color: 'from-purple-200 to-purple-400',
        features: []
      });
    }
  };

  const handleDeleteFeature = (id: number) => {
    setFeatures(features.filter(f => f.id !== id));
  };

  const handleAddSubFeature = () => {
    if (newSubFeature.icon && newSubFeature.text) {
      setNewFeature(prev => ({
        ...prev,
        features: [...prev.features, newSubFeature]
      }));
      setNewSubFeature({ icon: '', text: '' });
    }
  };

  const handleDeleteSubFeature = (index: number) => {
    setNewFeature(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const iconOptions = [
    'FaChartLine', 'FaMoneyCheckAlt', 'FaBoxes', 'FaUsers', 
    'FaCogs', 'FaHandshake', 'FaFileInvoice', 'FaCashRegister', 
    'FaTags', 'FaUserFriends', 'FaBullseye', 'FaShieldAlt'
  ];

  const colorOptions = [
    'from-purple-200 to-purple-400',
    'from-green-200 to-green-400',
    'from-pink-200 to-pink-400',
    'from-orange-100 to-orange-300',
    'from-blue-200 to-blue-400',
    'from-teal-200 to-teal-400'
  ];

  return (
    <div className="relative p-6 min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-[#774A67] mb-6">Features Management</h1>
        
        {/* Add/Edit Feature Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingFeature ? 'Edit Feature' : 'Add New Feature'}
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Feature Title"
              value={newFeature.title}
              onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <textarea
              placeholder="Feature Description"
              value={newFeature.description}
              onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <select
              value={newFeature.icon}
              onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
              className="w-full p-2 border rounded"
            >
              {iconOptions.map(icon => (
                <option key={icon} value={icon}>{icon}</option>
              ))}
            </select>
            <select
              value={newFeature.color}
              onChange={(e) => setNewFeature({ ...newFeature, color: e.target.value })}
              className="w-full p-2 border rounded"
            >
              {colorOptions.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </select>

            {/* Sub-features Management */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Sub-features</h3>
              <div className="space-y-2">
                {newFeature.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="flex-1">{feature.text}</span>
                    <button
                      onClick={() => handleDeleteSubFeature(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <select
                    value={newSubFeature.icon}
                    onChange={(e) => setNewSubFeature({ ...newSubFeature, icon: e.target.value })}
                    className="flex-1 p-2 border rounded"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Sub-feature text"
                    value={newSubFeature.text}
                    onChange={(e) => setNewSubFeature({ ...newSubFeature, text: e.target.value })}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={handleAddSubFeature}
                    className="p-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    <FiPlus />
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={editingFeature ? handleUpdateFeature : handleAddFeature}
              className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors"
            >
              <FiPlus /> {editingFeature ? 'Update Feature' : 'Add Feature'}
            </button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="group rounded-3xl bg-white/60 dark:bg-[#23232a]/70 shadow-2xl hover:shadow-[0_8px_40px_rgba(119,74,103,0.18)] border border-white/60 dark:border-[#774A67]/30 backdrop-blur-xl p-8 flex flex-col items-center text-center cursor-pointer transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
            >
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditFeature(feature)}
                  className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                >
                  <FiEdit2 />
                </button>
                <button
                  onClick={() => handleDeleteFeature(feature.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FiTrash2 />
                </button>
              </div>

              {/* Feature Icon */}
              <div className={`mb-5 p-4 rounded-full bg-gradient-to-br ${feature.color} shadow-xl group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>

              {/* Feature Title */}
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 drop-shadow-md bg-gradient-to-r from-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-gray-600 dark:text-gray-300 text-lg font-medium leading-relaxed mb-4">
                {feature.description}
              </p>

              {/* Sub-features */}
              <div className="grid grid-cols-2 gap-2 w-full">
                {feature.features.map((subFeature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="text-[#774A67]">{subFeature.icon}</span>
                    <span>{subFeature.text}</span>
                  </div>
                ))}
              </div>

              {/* 3D shine effect */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2/3 h-10 bg-gradient-to-r from-white/60 via-white/10 to-white/0 rounded-b-full blur-lg opacity-60 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>

      <style>
        {`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        `}
      </style>
    </div>
  );
};

export default FeaturesManagement; 