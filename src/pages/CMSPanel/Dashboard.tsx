import React, { useEffect, useState } from 'react';
import { FiUsers, FiDollarSign, FiActivity, FiSettings, FiServer, FiPlus, FiFileText, FiCreditCard, FiCheckCircle, FiClock } from 'react-icons/fi';

interface PriceChange {
  plan: string;
  field: string;
  oldPrice: number;
  newPrice: number;
  timestamp: string;
}

interface Invoice {
  id: string;
  customer: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'upcoming';
  date: string;
  dueDate?: string;
}

const Dashboard = () => {
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([
    {
      id: 'INV-001',
      customer: 'John Doe',
      amount: 299.99,
      status: 'paid',
      date: '2024-03-15'
    },
    {
      id: 'INV-002',
      customer: 'Jane Smith',
      amount: 199.99,
      status: 'pending',
      date: '2024-03-14'
    },
    {
      id: 'INV-003',
      customer: 'Mike Johnson',
      amount: 499.99,
      status: 'overdue',
      date: '2024-03-10'
    }
  ]);

  const [upcomingInvoices, setUpcomingInvoices] = useState<Invoice[]>([
    {
      id: 'INV-004',
      customer: 'Sarah Wilson',
      amount: 299.99,
      status: 'upcoming',
      date: '2024-03-20',
      dueDate: '2024-04-20'
    },
    {
      id: 'INV-005',
      customer: 'David Brown',
      amount: 399.99,
      status: 'upcoming',
      date: '2024-03-25',
      dueDate: '2024-04-25'
    }
  ]);

  useEffect(() => {
    const fetchChanges = () => {
      const history = JSON.parse(localStorage.getItem('priceChangeHistory') || '[]');
      setPriceChanges(history);
    };
    fetchChanges();
    const interval = setInterval(fetchChanges, 5000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'overdue':
        return 'text-red-600';
      case 'upcoming':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="relative p-6 min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000 z-0" />
      <div className="relative z-10">
        <h1 className="text-3xl font-bold text-[#774A67] mb-6">Dashboard</h1>
        
        {/* Quick Stats - Now in rectangular tiles with 3D effect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#774A67]/20 hover:-translate-y-1">
            <div className="p-4 bg-[#774A67]/10 rounded-xl">
              <FiUsers className="text-3xl text-[#774A67]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>
              <p className="text-2xl font-bold text-[#774A67]">1,234</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#774A67]/20 hover:-translate-y-1">
            <div className="p-4 bg-[#774A67]/10 rounded-xl">
              <FiCheckCircle className="text-3xl text-[#774A67]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Subscriptions</h2>
              <p className="text-2xl font-bold text-[#774A67]">567</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-[#774A67]/20 hover:-translate-y-1">
            <div className="p-4 bg-[#774A67]/10 rounded-xl">
              <FiFileText className="text-3xl text-[#774A67]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Invoices</h2>
              <p className="text-2xl font-bold text-[#774A67]">89</p>
            </div>
          </div>
        </div>

        {/* Current Invoices */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Current Invoices</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
              <FiPlus /> New Invoice
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2">Invoice ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2 font-semibold">{invoice.id}</td>
                    <td className="px-4 py-2">{invoice.customer}</td>
                    <td className="px-4 py-2">﷼{invoice.amount.toFixed(2)}</td>
                    <td className={`px-4 py-2 ${getStatusColor(invoice.status)}`}>
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </td>
                    <td className="px-4 py-2">{invoice.date}</td>
                    <td className="px-4 py-2">
                      <button className="text-[#774A67] hover:text-[#5e3752]">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Invoices */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Invoices</h2>
            <div className="flex items-center gap-2 text-gray-500">
              <FiClock className="text-lg" />
              <span>Next 30 days</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="px-4 py-2">Invoice ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Due Date</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {upcomingInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b last:border-b-0">
                    <td className="px-4 py-2 font-semibold">{invoice.id}</td>
                    <td className="px-4 py-2">{invoice.customer}</td>
                    <td className="px-4 py-2">﷼{invoice.amount.toFixed(2)}</td>
                    <td className="px-4 py-2">{invoice.dueDate}</td>
                    <td className="px-4 py-2">
                      <button className="text-[#774A67] hover:text-[#5e3752]">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity - Kept unchanged */}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <button className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center aspect-square hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-[#774A67]/10 rounded-full mb-4">
              <FiPlus className="text-2xl text-[#774A67]" />
            </div>
            <span className="text-gray-700 font-semibold">Add Feature</span>
          </button>
          <button className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center aspect-square hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-[#774A67]/10 rounded-full mb-4">
              <FiDollarSign className="text-2xl text-[#774A67]" />
            </div>
            <span className="text-gray-700 font-semibold">Edit Pricing</span>
          </button>
          <button className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center aspect-square hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-[#774A67]/10 rounded-full mb-4">
              <FiUsers className="text-2xl text-[#774A67]" />
            </div>
            <span className="text-gray-700 font-semibold">User Management</span>
          </button>
          <button className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center aspect-square hover:bg-gray-50 transition-colors">
            <div className="p-3 bg-[#774A67]/10 rounded-full mb-4">
              <FiCreditCard className="text-2xl text-[#774A67]" />
            </div>
            <span className="text-gray-700 font-semibold">Billing</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 