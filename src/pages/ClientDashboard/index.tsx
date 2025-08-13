import { motion } from 'framer-motion';
import { FiUsers, FiSettings, FiBell, FiDatabase, FiUser, FiLogOut, FiAlertTriangle, FiRefreshCw, FiShoppingCart, FiRepeat, FiShoppingBag, FiCornerUpLeft, FiArrowDownCircle, FiArrowUpCircle, FiCreditCard, FiTrendingDown, FiBox, FiDollarSign } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import PaymentDetailsModal from '../PaymentDetailsModal';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { rootStore } from '@store/index';
import React from 'react';
import DashboardNavbar from './DashboardNavbar';
import RecentActivities from './RecentActivities';
import StockAlert from './StockAlert';
import PurchaseOrders from './PurchaseOrders';

const ClientDashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const daysLeft = 5; // This would typically come from your backend/state management
  
  const [showPaymentList, setShowPaymentList] = useState(false);
  const [showTrialExpiredModal, setShowTrialExpiredModal] = useState(false);
  const userEmail = localStorage.getItem("user") || "User";
  console.log("[Dashboard] Retrieved user email from localStorage:", userEmail);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleClientLogout = rootStore(({ handleClientLogout }) => handleClientLogout);
  const [trialDaysUsed, setTrialDaysUsed] = useState<number | null>(null);
  const [trialExpired, setTrialExpired] = useState(false);
  const [trialLoading, setTrialLoading] = useState(true);
  const [trialError, setTrialError] = useState<string | null>(null);
  const TRIAL_DAYS = 14;

  useEffect(() => {
    if (!isProfileOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    const fetchTrialInfo = async () => {
      setTrialLoading(true);
      setTrialError(null);
      try {
        console.log('[TrialInfo] User email:', userEmail);
        
        const requestBody = { userId: userEmail };
        console.log('[TrialInfo] Request body:', requestBody);
        
        const res = await fetch('https://newhrms.muftaah.com/api/method/alphax_erp.api.user_info.get_user_creation_info', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        });
        
        console.log('[TrialInfo] Response status:', res.status);
        console.log('[TrialInfo] Response headers:', res.headers);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.log('[TrialInfo] Error response:', errorText);
          throw new Error('Failed to fetch user info');
        }
        
        const data = await res.json();
        console.log('[TrialInfo] Response data:', data);
        
        const creation = data.message?.data?.creation;
        const current_datetime = data.message?.data?.current_datetime;
        if (!creation || !current_datetime) throw new Error('Invalid API response');
        
        // Test calculation with the actual data from your API response
        const createdDate = new Date(creation);
        const nowDate = new Date(current_datetime);
        const diffTime = nowDate.getTime() - createdDate.getTime();
        const daysSinceCreation = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        console.log('[TrialInfo] Created date:', createdDate);
        console.log('[TrialInfo] Current date:', nowDate);
        console.log('[TrialInfo] Days since creation:', daysSinceCreation);
        console.log('[TrialInfo] Trial days limit:', TRIAL_DAYS);
        console.log('[TrialInfo] Is trial expired?', daysSinceCreation >= TRIAL_DAYS);
        
        setTrialDaysUsed(daysSinceCreation);
        setTrialExpired(daysSinceCreation >= TRIAL_DAYS);
        
        // If trial has expired (14 days or more), show modal and redirect to billing management
        if (daysSinceCreation >= TRIAL_DAYS) {
          console.log('[TrialInfo] Trial expired, showing modal and redirecting to billing management');
          setShowTrialExpiredModal(true);
          // Redirect to billing management after 3 seconds
          setTimeout(() => {
            setShowTrialExpiredModal(false);
            navigate('/clientLogin/billing-management', { replace: true });
          }, 3000);
        }
        
      } catch (err: any) {
        console.error('[TrialInfo] Error:', err);
        setTrialError(err.message || 'Unknown error');
      } finally {
        setTrialLoading(false);
      }
    };
    if (userEmail) fetchTrialInfo();
  }, [userEmail, navigate]);

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c] overflow-hidden">
      {/* Animated SVG blobs */}
      <svg className="absolute -top-24 -left-24 w-80 h-80 opacity-20 z-0 animate-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute top-1/3 right-0 w-64 h-64 opacity-10 z-0 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-0 left-1/4 w-56 h-56 opacity-15 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      {/* Main Content with Scroll */}
      <div className="relative z-10 flex-1 overflow-x-visible overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Navigation Bar */}
        <DashboardNavbar
          userEmail={userEmail}
          daysLeft={daysLeft}
          isNotificationOpen={isNotificationOpen}
          setIsNotificationOpen={setIsNotificationOpen}
          isProfileOpen={isProfileOpen}
          setIsProfileOpen={setIsProfileOpen}
          profileDropdownRef={profileDropdownRef}
          handleClientLogout={handleClientLogout}
          navigate={navigate}
        />
        {/* Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
          >
            {/* Static Trial Period Notification Banner - always below main heading */}
            {trialLoading ? (
              <div className="w-full my-6 p-4 bg-blue-200 text-blue-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <span>
                  <b>Loading trial information...</b>
                </span>
              </div>
            ) : trialError ? (
              <div className="w-full my-6 p-4 bg-red-200 text-red-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <span>
                  <b>Trial status error:</b> {trialError}
                </span>
              </div>
            ) : trialExpired ? (
              <div className="w-full my-6 p-4 bg-orange-200 text-orange-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <span>
                  <b>Trial Expired!</b> Your trial period of {TRIAL_DAYS} days has ended. Redirecting to billing management...
                </span>
                <button
                  className="mt-4 sm:mt-0 bg-orange-600 text-white px-4 py-2 rounded font-bold sm:ml-4"
                  onClick={() => navigate('/clientLogin/billing-management')}
                >
                  Go to Billing
                </button>
              </div>
            ) : (
              <div className="w-full my-6 p-4 bg-yellow-200 text-yellow-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <span>
                  <b>You are on trial version!</b> Your trial: <b>{trialDaysUsed} / {TRIAL_DAYS} days used</b>
                </span>
                <button
                  className="mt-4 sm:mt-0 bg-yellow-600 text-white px-4 py-2 rounded font-bold sm:ml-4"
                  onClick={() => navigate('/clientLogin/billing-management')}
                >
                  Billing Page
                </button>
              </div>
            )}
          </motion.div>
          {/* Today Summary Tiles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 drop-shadow-lg bg-gradient-to-r from-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent">
              Today Summary 
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Invoice */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl border border-blue-200/50 dark:border-blue-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Invoice</p>
                  </div>
                  <FiCreditCard className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              {/* Subscriptions */}
              <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-xl border border-cyan-200/50 dark:border-cyan-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">0</p>
                    <p className="text-white/80 text-sm font-medium">Subscriptions</p>
                  </div>
                  <FiDatabase className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              {/* Sale Invoices */}
              <div className="rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-xl border border-indigo-200/50 dark:border-indigo-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Sale Invoices</p>
                  </div>
                  <FiShoppingBag className="w-10 h-10 text-white/70" />
                </div>
                <button onClick={() => navigate('/clientDashboard/sales-invoices')} className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              {/* Sites */}
              <div className="rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-xl border border-purple-200/50 dark:border-purple-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">0</p>
                    <p className="text-white/80 text-sm font-medium">Sites</p>
                  </div>
                  <FiSettings className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              {/* Users */}
              <div className="rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-xl border border-green-200/50 dark:border-green-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">0</p>
                    <p className="text-white/80 text-sm font-medium">Users</p>
                  </div>
                  <FiUsers className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
            </div>
          </section>
            {/* Recent Activities Table */}
              <RecentActivities />
              {/* <StockAlert /> */}
          
        </div>
      </div>

      {/* Render the PaymentDetailsList page as a modal or page */}
      {showPaymentList && (
        <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 my-8 p-8">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 z-10"
              onClick={() => setShowPaymentList(false)}
              aria-label="Close Payment List"
            >
              &times;
            </button>
            {/* <PaymentDetailsList /> */}
          </div>
        </div>
      )}

      {/* Trial Expired Modal */}
      {showTrialExpiredModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#23232a] rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiAlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-[#774A67] dark:text-white">Trial Period Expired</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your 14-day trial period has ended. You need to upgrade to continue using the platform.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to billing management in a few seconds...
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="px-6 py-3 bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white rounded-xl shadow-lg hover:shadow-xl hover:from-[#8b5cf6] hover:to-[#774A67] transition-all duration-300 font-semibold"
                onClick={() => {
                  setShowTrialExpiredModal(false);
                  navigate('/clientLogin/billing-management', { replace: true });
                }}
              >
                Go to Billing Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard; 