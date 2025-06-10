import { motion } from 'framer-motion';
import { FiUsers, FiSettings, FiBell, FiDatabase, FiUser, FiLogOut, FiAlertTriangle } from 'react-icons/fi';
import { useState } from 'react';

// Subscription Management Component
const SubscriptionManagement = () => {
  // Simulate user subscription state
  const [hasSubscription, setHasSubscription] = useState(true); // Change to false to test no subscription
  const [showAddOns, setShowAddOns] = useState(false);
  const [action, setAction] = useState('');

  if (!hasSubscription) {
    return (
      <div className="flex flex-col items-start gap-4">
        <button
          className="px-4 py-2 bg-[#774A67] text-white rounded-md hover:bg-[#613a55] transition-all"
          onClick={() => setHasSubscription(true)}
        >
          Select New Plan
        </button>
      </div>
    );
  }

  // If user has a subscription
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          onClick={() => setAction('extend')}
        >
          Extend
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all"
          onClick={() => setAction('cancel')}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-all"
          onClick={() => setAction('switchBilling')}
        >
          Switch Billing
        </button>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
          onClick={() => setShowAddOns(true)}
        >
          Add or Remove Add-ons
        </button>
      </div>
      {showAddOns && (
        <div className="mt-2 flex gap-2">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => { setShowAddOns(false); setAction('addOnExtend'); }}
          >
            Extend
          </button>
          <button
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            onClick={() => { setShowAddOns(false); setAction('addOnCancel'); }}
          >
            Cancel
          </button>
        </div>
      )}
      {action && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded">
          <span className="font-semibold text-gray-800 dark:text-gray-200">Action:</span> {action}
        </div>
      )}
      <button
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all"
        onClick={() => setAction('showPlan')}
      >
        Show current plan and pricing
      </button>
    </div>
  );
};

const ClientDashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const daysLeft = 5; // This would typically come from your backend/state management
  const showPlanExpiryBanner = daysLeft <= 5;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#774A67]/10 via-[#774A67]/20 to-[#774A67]/30 dark:from-[#774A67]/30 dark:via-[#774A67]/25 dark:to-[#774A67]/20">
      {/* Main Content with Scroll */}
      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Navigation Bar */}
        <nav className="backdrop-blur-sm bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20">
              <div className="flex items-center">
                <img src="src/images/alpha-Photoroom.png" alt="logo" className="h-12 w-auto sm:h-14 md:h-16" />
              </div>
              
              {/* Right side navigation items */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  >
                    <FiBell className="h-5 w-5" />
                    {daysLeft <= 5 && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                      </div>
                      {daysLeft <= 5 && (
                        <div className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <div className="flex items-start">
                            <div className="flex-shrink-0">
                              <FiBell className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div className="ml-3 w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Subscription Reminder
                              </p>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Your plan ends in {daysLeft} days. <a href="#" className="font-medium text-[#774A67] hover:text-[#613a55]">Renew now</a>
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <div className="h-8 w-8 rounded-full bg-[#774A67] flex items-center justify-center">
                      <FiUser className="h-5 w-5 text-white" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200">John Doe</span>
                  </button>

                  {/* Profile Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Your Profile
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Settings
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        Reset Password
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <div className="flex items-center">
                          <FiLogOut className="mr-2" />
                          Sign out
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white drop-shadow-lg">Dashboard</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Active Users Card */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-[0_8px_40px_rgba(119,74,103,0.6)] transform hover:scale-105 transition-all duration-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-full"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg shadow-inner transform hover:scale-110 transition-transform duration-300">
                    <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600 dark:text-gray-400">Active Users</h3>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      5 / 10 <span className="text-green-500 text-sm">Trial Plan</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ERPNext Instance Card */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-[0_8px_40px_rgba(119,74,103,0.6)] transform hover:scale-105 transition-all duration-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="h-full"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg shadow-inner transform hover:scale-110 transition-transform duration-300">
                    <FiDatabase className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600 dark:text-gray-400">AlphaX Instance</h3>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">
                      Site.AlphaX
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Current Plan Card */}
            <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-[0_8px_40px_rgba(119,74,103,0.6)] transform hover:scale-105 transition-all duration-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="h-full"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg shadow-inner transform hover:scale-110 transition-transform duration-300">
                    <FiSettings className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-600 dark:text-gray-400">Current Plan</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xl font-semibold text-gray-900 dark:text-white mb-0">
                        Business <span className="text-green-500 text-sm">14 days left</span>
                      </p>
                      <button className="px-3 py-1.5 bg-[#774A67] text-white rounded-md hover:bg-[#613a55] transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-[#774A67]/50 text-xs font-semibold">
                        Upgrade Plan
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 drop-shadow-lg">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* ERPNext Settings */}
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-[0_8px_40px_rgba(119,74,103,0.6)] transform hover:scale-105 transition-all duration-300">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="h-full cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg shadow-inner transform hover:scale-110 transition-transform duration-300">
                      <FiDatabase className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">AlphaX Settings</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Configure your AlphaX instance, domains, and integration preferences.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* User Management */}
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-[0_8px_40px_rgba(119,74,103,0.6)] transform hover:scale-105 transition-all duration-300">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="h-full cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-purple-100 dark:bg-purple-900 rounded-lg shadow-inner transform hover:scale-110 transition-transform duration-300">
                      <FiUsers className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">User Management</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Add or remove users, manage roles and permissions.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Notifications */}
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-[0_8px_40px_rgba(119,74,103,0.6)] transform hover:scale-105 transition-all duration-300">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="h-full cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow-inner transform hover:scale-110 transition-transform duration-300">
                      <FiBell className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Notifications</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Configure email notifications and system alerts.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Account Settings */}
              <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg hover:shadow-[0_8px_40px_rgba(119,74,103,0.6)] transform hover:scale-105 transition-all duration-300">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="h-full cursor-pointer"
                >
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg shadow-inner transform hover:scale-110 transition-transform duration-300">
                      <FiSettings className="w-7 h-7 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">Account Settings</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Manage your account, billing and subscription details.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Subscription Management Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 drop-shadow-lg">Subscription Management</h2>
            <SubscriptionManagement />
          </section>

          {/* Recent Activity Section */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 drop-shadow-lg">Recent Activity</h2>
            <div className="rounded-xl bg-white dark:bg-gray-800 shadow-lg overflow-hidden">
              {/* Activity Items */}
              {[1, 2, 3].map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(119,74,103,0.4)] transform hover:scale-[1.02] cursor-pointer"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full shadow-inner transform hover:scale-110 transition-transform duration-300">
                    <FiUsers className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">New user added</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      John Doe (john@example.com) was added to the system
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</span>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard; 