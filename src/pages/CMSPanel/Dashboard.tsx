import React, { useEffect, useState } from 'react';
import { FiUsers, FiDollarSign, FiActivity, FiSettings, FiServer, FiPlus } from 'react-icons/fi';

interface PriceChange {
  plan: string;
  field: string;
  oldPrice: number;
  newPrice: number;
  timestamp: string;
}

const Dashboard = () => {
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);

  useEffect(() => {
    const fetchChanges = () => {
      const history = JSON.parse(localStorage.getItem('priceChangeHistory') || '[]');
      setPriceChanges(history);
    };
    fetchChanges();
    const interval = setInterval(fetchChanges, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative p-6 min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000 z-0" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-[#774A67] mb-6">Dashboard</h1>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="p-3 bg-[#774A67]/10 rounded-full">
              <FiUsers className="text-2xl text-[#774A67]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
              <p className="text-2xl font-bold text-[#774A67]">1,234</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="p-3 bg-[#774A67]/10 rounded-full">
              <FiDollarSign className="text-2xl text-[#774A67]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Total Subscriptions</h2>
              <p className="text-2xl font-bold text-[#774A67]">567</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4">
            <div className="p-3 bg-[#774A67]/10 rounded-full">
              <FiActivity className="text-2xl text-[#774A67]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
              <p className="text-2xl font-bold text-[#774A67]">$12,345</p>
            </div>
          </div>
        </div>

        {/* Recent Price Changes */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Price Changes</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2">Plan</th>
                  <th className="px-4 py-2">Field</th>
                  <th className="px-4 py-2">Old Price</th>
                  <th className="px-4 py-2">New Price</th>
                  <th className="px-4 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {priceChanges.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-gray-400">No price changes yet.</td></tr>
                ) : (
                  priceChanges.slice(0, 10).map((change, idx) => (
                    <tr key={idx} className="border-b last:border-b-0">
                      <td className="px-4 py-2 font-semibold">{change.plan}</td>
                      <td className="px-4 py-2">{change.field}</td>
                      <td className="px-4 py-2 text-red-600">{change.oldPrice}</td>
                      <td className="px-4 py-2 text-green-600">{change.newPrice}</td>
                      <td className="px-4 py-2 text-xs text-gray-500">{new Date(change.timestamp).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#774A67]/10 rounded-full">
                <FiUsers className="text-[#774A67]" />
              </div>
              <div>
                <p className="text-gray-700">New user registered: <span className="font-semibold">John Doe</span></p>
                <p className="text-sm text-gray-500">2 minutes ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#774A67]/10 rounded-full">
                <FiDollarSign className="text-[#774A67]" />
              </div>
              <div>
                <p className="text-gray-700">Pricing updated: <span className="font-semibold">Premium Plan</span></p>
                <p className="text-sm text-gray-500">1 hour ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features Management */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features Management</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#774A67]/10 rounded-full">
                  <FiSettings className="text-[#774A67]" />
                </div>
                <div>
                  <p className="text-gray-700">14-Day Risk-Free Trial</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#774A67]/10 rounded-full">
                  <FiSettings className="text-[#774A67]" />
                </div>
                <div>
                  <p className="text-gray-700">Flexible Subscription</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Website Sections Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Website Sections Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#774A67]/10 rounded-full">
                  <FiSettings className="text-[#774A67]" />
                </div>
                <div>
                  <p className="text-gray-700">Navbar Management</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
                Edit
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#774A67]/10 rounded-full">
                  <FiSettings className="text-[#774A67]" />
                </div>
                <div>
                  <p className="text-gray-700">Features Section</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Health</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#774A67]/10 rounded-full">
                <FiServer className="text-[#774A67]" />
              </div>
              <div>
                <p className="text-gray-700">Server Status: <span className="font-semibold text-green-600">Healthy</span></p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#774A67]/10 rounded-full">
                <FiServer className="text-[#774A67]" />
              </div>
              <div>
                <p className="text-gray-700">Last Backup: <span className="font-semibold">2023-10-01 12:00 PM</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
              <FiPlus /> Add New Feature
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
              <FiDollarSign /> Edit Pricing

            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
              <FiUsers /> User Management
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 