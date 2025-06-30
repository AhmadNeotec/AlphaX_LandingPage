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

interface PaymentDetail {
  name: string;
  card_name: string;
  card_number: string;
  expiry: string;
  cvv: string;
  creation: string;
  status?: 'active' | 'inactive';
}

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
      {/*<div className="flex flex-wrap gap-4">
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
      </div>*/}
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

const PaymentDetailsList = () => {
  const [payments, setPayments] = useState<PaymentDetail[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentDetail | null>(null);
  const userId = localStorage.getItem('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch(' http://172.22.60.121:8000/api/method/alphax_erp.api.payment.get_user_payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      const paymentsArr = data.message?.data || [];
      // Add status if not present (default to active), and normalize to lowercase
      const paymentsWithStatus = paymentsArr.map((payment: PaymentDetail) => ({
        ...payment,
        status: (payment.status || 'active').toLowerCase()
      }));
      setPayments(paymentsWithStatus);
    } catch (err) {
      setError('Failed to fetch payment details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [userId]);

  const handleRefresh = () => {
    fetchPayments();
  };

  const handleRemoveCard = async (cardId: string) => {
    const userId = localStorage.getItem('user'); // Ensure userId is always fresh
    console.log("🗑️ Attempting to remove card:", { cardId, userId });
    if (!cardId || !userId) {
      console.error("❌ Missing cardId or userId", { cardId, userId });
      return;
    }
    try {
      // Call API to remove card
      const res = await fetch(' http://172.22.60.121:8000/api/method/alphax_erp.api.payment.remove_user_payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cardName: cardId, userId: userId }),
      });
      
      console.log("📥 Remove card response status:", res.status);
      
      if (res.ok) {
        const result = await res.json();
        console.log("✅ Card removed successfully:", result);
        
        // Remove from local state
        setPayments(prev => {
          const updated = prev.filter(payment => payment.name !== cardId);
          console.log("🔄 Updated payments list after removal:", updated);
          return updated;
        });
        setShowRemoveConfirm(null);
        setSelectedPayment(null); // Close details view if open
        fetchPayments(); // Refresh the list from backend
        console.log("🎯 Removed card from UI, closed confirmation modal, and refreshed list");
      } else {
        const errorData = await res.json();
        console.error("❌ Remove card failed:", errorData);
        throw new Error('Failed to remove card');
      }
    } catch (err) {
      console.error("🚨 Error removing card:", err);
      // You can add a toast notification here
    }
  };

  const handleToggleStatus = async (cardId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log("🔄 Attempting to toggle card status:", { cardId, currentStatus, newStatus });
    
    try {
      // Call API to update card status
      const res = await fetch(' http://172.22.60.121:8000/api/method/alphax_erp.api.payment.update_payment_status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ cardName: cardId, userId: userId, status: newStatus }),
      });
      
      console.log("📥 Update status response status:", res.status);
      
      if (res.ok) {
        const result = await res.json();
        console.log("✅ Card status updated successfully:", result);
        
        // Update local state
        setPayments(prev => {
          const updated = prev.map(payment => 
            payment.name === cardId 
              ? { ...payment, status: newStatus as 'active' | 'inactive' }
              : payment
          );
          console.log("🔄 Updated payments list after status change:", updated);
          return updated;
        });
        
        // Update selected payment if it's the one being toggled
        if (selectedPayment?.name === cardId) {
          setSelectedPayment(prev => {
            const updated = prev ? { ...prev, status: newStatus as 'active' | 'inactive' } : null;
            console.log("🔄 Updated selected payment status:", updated);
            return updated;
          });
        }
        
        console.log("🎯 Status toggle completed successfully");
      } else {
        const errorData = await res.json();
        console.error("❌ Update status failed:", errorData);
        throw new Error('Failed to update card status');
      }
    } catch (err) {
      console.error("🚨 Error updating card status:", err);
      // You can add a toast notification here
    }
  };

  const formatCardNumber = (cardNumber: string) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  const getCardType = (cardNumber: string) => {
    const firstDigit = cardNumber.charAt(0);
    if (firstDigit === '4') return 'Visa';
    if (firstDigit === '5') return 'Mastercard';
    if (firstDigit === '3') return 'American Express';
    return 'Credit Card';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#774A67] mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading your payment methods...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="p-8 text-center">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <FiAlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
        <button 
          onClick={handleRefresh}
          className="mt-3 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  if (selectedPayment) {
    // Show full details in 3D card view
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <motion.button 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6 flex items-center gap-2 text-[#774A67] hover:text-[#5e3752] font-medium transition-colors"
          onClick={() => setSelectedPayment(null)}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Payment Methods
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
        >
          {/* Card Header */}
          <div className="bg-gradient-to-r from-[#774A67] to-[#5e3752] p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedPayment.card_name}</h2>
                <p className="text-[#774A67]/80 font-medium">{getCardType(selectedPayment.card_number)}</p>
              </div>
              <div className="text-right">
                <div className="w-12 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-bold">CARD</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card Details */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Card Number</label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-mono text-lg">
                    {selectedPayment.card_number}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Expiry Date</label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-mono">
                    {selectedPayment.expiry}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">CVV</label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 font-mono">
                    {selectedPayment.cvv}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Added On</label>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                    {formatDate(selectedPayment.creation)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Card Status and Actions */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Card ID: {selectedPayment.name}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedPayment.status === 'active' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                }`}>
                  {selectedPayment.status === 'active' ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleToggleStatus(selectedPayment.name, selectedPayment.status || 'active')}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                    selectedPayment.status === 'active'
                      ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {selectedPayment.status === 'active' ? 'Deactivate Card' : 'Activate Card'}
                </button>
                
                <button
                  onClick={() => setShowRemoveConfirm(selectedPayment.name)}
                  className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Remove Card
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Remove Confirmation Modal */}
        {showRemoveConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Remove Card</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to remove this card? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRemoveConfirm(null)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRemoveCard(showRemoveConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto overflow-y-auto max-h-[80vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#774A67] to-[#5e3752] bg-clip-text text-transparent mb-2">
            Payment Methods
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your saved payment methods and billing information
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-3 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            onClick={handleRefresh}
            title="Refresh payment list"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
          <button
            className="px-6 py-3 bg-gradient-to-r from-[#774A67] to-[#5e3752] text-white rounded-xl shadow-lg hover:shadow-xl hover:from-[#5e3752] hover:to-[#774A67] transition-all duration-300 transform hover:scale-105 font-semibold"
            onClick={() => setShowPaymentModal(true)}
          >
            + Add New Card
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200/50 dark:border-blue-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Cards</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{payments.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">Active Cards</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {payments.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-purple-200/50 dark:border-purple-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Last Updated</p>
              <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                {payments.length > 0 ? formatDate(payments[0].creation) : 'Never'}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

     

      {/* Payment Cards List */}
      {payments.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Payment Methods</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't added any payment methods yet.</p>
          <button
            className="px-6 py-3 bg-gradient-to-r from-[#774A67] to-[#5e3752] text-white rounded-xl shadow-lg hover:shadow-xl hover:from-[#5e3752] hover:to-[#774A67] transition-all duration-300 transform hover:scale-105 font-semibold"
            onClick={() => setShowPaymentModal(true)}
          >
            Add Your First Card
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {payments.map((payment, index) => (
            <motion.div
              key={payment.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer relative"
            >
              <div 
                className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden transform hover:scale-[1.02] transition-all duration-300"
                onClick={() => setSelectedPayment(payment)}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-[#774A67] to-[#5e3752] p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{payment.card_name}</h3>
                      <p className="text-[#774A67]/80 text-sm">{getCardType(payment.card_number)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'active' 
                          ? 'bg-green-500/20 text-green-200'
                          : 'bg-gray-500/20 text-gray-200'
                      }`}>
                        {payment.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      <div className="w-10 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold">CARD</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Card Number</p>
                    <p className="font-mono text-sm font-medium">{formatCardNumber(payment.card_number)}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Expires</p>
                      <p className="font-mono text-sm font-medium">{payment.expiry}</p>
                    </div>
                    <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">CVV</p>
                      <p className="font-mono text-sm font-medium">***</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Added {formatDate(payment.creation)}
                    </span>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#774A67]/10 to-[#5e3752]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
                  <span className="text-[#774A67] font-semibold">Click to view details</span>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowRemoveConfirm(payment.name);
                }}
                className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                title="Remove card"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Remove Confirmation Modal */}
      {showRemoveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Remove Card</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to remove this card? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRemoveConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveCard(showRemoveConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <PaymentDetailsModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={() => {
          setShowPaymentModal(false);
          fetchPayments(); // Refresh the list after adding a card
        }}
      />
    </div>
  );
};

const ClientDashboard = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const daysLeft = 5; // This would typically come from your backend/state management
  const showPlanExpiryBanner = daysLeft <= 5;
  const [showPaymentList, setShowPaymentList] = useState(false);
  const userEmail = localStorage.getItem("user") || "User";
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const handleClientLogout = rootStore(({ handleClientLogout }) => handleClientLogout);

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
          setShowPaymentList={setShowPaymentList}
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
            <div className="w-full my-6 p-4 bg-red-200 text-red-800 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <span>
                <b>You are on trial version!</b> Your trial ends in <b>14 days!</b>
              </span>
              <button
                className="mt-4 sm:mt-0 bg-red-600 text-white px-4 py-2 rounded font-bold sm:ml-4"
                onClick={() => navigate('/billing-page')}
              >
                Billing Page
              </button>
            </div>
          </motion.div>

          {/* Today Summary Tiles */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 drop-shadow-lg bg-gradient-to-r from-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent">
              Today Summary 
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {/* Example summary tiles, replace values with dynamic data as needed */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 shadow-xl border border-blue-200/50 dark:border-blue-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Purchase</p>
                  </div>
                  <FiShoppingCart className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-xl border border-cyan-200/50 dark:border-cyan-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Purchase Return</p>
                  </div>
                  <FiRepeat className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-indigo-400 to-indigo-600 shadow-xl border border-indigo-200/50 dark:border-indigo-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Sales</p>
                  </div>
                  <FiShoppingBag className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Sales Return</p>
                  </div>
                  <FiCornerUpLeft className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-green-400 to-green-600 shadow-xl border border-green-200/50 dark:border-green-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Client Payment</p>
                  </div>
                  <FiArrowDownCircle className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-400 to-purple-600 shadow-xl border border-purple-200/50 dark:border-purple-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Supplier Payment</p>
                  </div>
                  <FiArrowUpCircle className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-red-400 to-red-600 shadow-xl border border-red-200/50 dark:border-red-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Expense</p>
                  </div>
                  <FiTrendingDown className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-sky-900 to-blue-900 shadow-xl border border-blue-900/50 dark:border-blue-900/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">$0</p>
                    <p className="text-white/80 text-sm font-medium">Balance Transfers</p>
                  </div>
                  <FiRefreshCw className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 shadow-xl border border-indigo-200/50 dark:border-indigo-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">66</p>
                    <p className="text-white/80 text-sm font-medium">Total Stock Quantity</p>
                  </div>
                  <FiBox className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-cyan-500 to-cyan-700 shadow-xl border border-cyan-200/50 dark:border-cyan-700/50 p-6 flex flex-col justify-between min-h-[120px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white text-lg font-bold">65682</p>
                    <p className="text-white/80 text-sm font-medium">Total Stock Value</p>
                  </div>
                  <FiDollarSign className="w-10 h-10 text-white/70" />
                </div>
                <button className="mt-4 text-white/80 text-xs font-semibold flex items-center gap-1 hover:underline">More info <span>→</span></button>
              </div>
            </div>
          </section>
            {/* Recent Activities Table */}
      <RecentActivities />


          
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
            <PaymentDetailsList />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard; 