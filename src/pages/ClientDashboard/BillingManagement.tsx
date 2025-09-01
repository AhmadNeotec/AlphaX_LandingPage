import React, { useState, useRef, useEffect } from 'react';
import { withApiAuthHeaders } from '@api/authHeaders';
import { plans } from '../PricingPage';
import RiyalSymbol from '../../images/Saudi_Riyal_Symbol.png';
import DashboardNavbar from './DashboardNavbar';
import { useNavigate } from 'react-router-dom';
import { rootStore } from '@store/index';
import PaymentDetailsModal from '../PaymentDetailsModal';
import { useUserCards, PaymentDetail } from '../../hooks/useUserCards';
import { motion } from 'framer-motion';
import { FiPlus, FiGlobe, FiSettings, FiUsers, FiArrowLeft } from 'react-icons/fi';
import { createCustomerAccountDocument, validateCustomerAccountCreation } from './CustomerInfo';

type PlanType = typeof plans[number];

interface ModuleData {
  module_name: string;
  m1?: number;
  m3?: number;
  year_price?: number;
  y1?: number;
  y2?: number;
  y3?: number;
  y5?: number;
  disabled?: number | string | boolean;
}

const BillingManagement: React.FC = () => {
  const [tab, setTab] = useState<'monthly' | 'yearly'>('monthly');
  const navigate = useNavigate();

  // Navbar state for DashboardNavbar
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showPaymentList, setShowPaymentList] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const handleClientLogout = rootStore(({ handleClientLogout }) => handleClientLogout) || (() => {});
  const userEmail = localStorage.getItem('user') || 'User';
  const daysLeft = 14;

  // Card logic
  const { cards, loading: cardsLoading, error: cardsError, refresh: refreshCards } = useUserCards(userEmail);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showSelectCardModal, setShowSelectCardModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<null | PlanType>(null);
  const [selectedCard, setSelectedCard] = useState<null | PaymentDetail>(null);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);

  // Site creation modal state
  const [showSiteCreationModal, setShowSiteCreationModal] = useState(false);
  const [isCreatingSite, setIsCreatingSite] = useState(false);

  // Module fetching logic
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError, setModulesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      setModulesLoading(true);
      setModulesError(null);
      try {
        console.log('[BillingManagement] Fetching modules from API...');
        const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.ModulePricing.get_module_pricing', {
          method: 'GET',
          headers: withApiAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch module pricing data');
        const data = await res.json();
        console.log('[BillingManagement] Raw API response:', data);
        
        // Filter out disabled modules
        const enabledModules = (data.message || []).filter((module: ModuleData) => {
          const disabled = module.disabled === 1 || module.disabled === "1" || module.disabled === true || module.disabled === "true";
          return !disabled;
        });
        console.log('[BillingManagement] Enabled modules:', enabledModules);
        setModules(enabledModules);
      } catch (err: any) {
        console.error('[BillingManagement] Error fetching modules:', err);
        setModulesError(err.message || 'Unknown error');
      } finally {
        setModulesLoading(false);
      }
    };
    fetchModules();
  }, []);

  const handleSubscribeClick = (plan: PlanType) => {
    setSelectedPlan(plan);
    setShowModuleModal(true); // Show module selection first
  };

  // After module selection, proceed to card logic
  const handleModuleSelectionContinue = () => {
    console.log('[BillingManagement] Selected modules:', selectedModules);
    console.log('[BillingManagement] Selected plan:', selectedPlan?.name);
    setShowModuleModal(false);
    if (cards.length === 0) {
      setShowAddCardModal(true);
    } else {
      setShowSelectCardModal(true);
    }
  };

  const handleCardSelect = (card: PaymentDetail) => {
    setSelectedCard(card);
    setShowSelectCardModal(false);
    // Show site creation modal instead of just showing an alert
    setShowSiteCreationModal(true);
  };

  // Site creation handler
  const handleCreateSite = async (siteData: any) => {
    console.log('🚀 [BillingManagement] ===== SITE CREATION PROCESS STARTED =====');
    console.log('📋 [BillingManagement] Site Data:', siteData);
    console.log('📋 [BillingManagement] Selected Plan:', selectedPlan);
    console.log('📋 [BillingManagement] Selected Modules:', selectedModules);
    console.log('📋 [BillingManagement] Selected Card:', selectedCard);
    console.log('📋 [BillingManagement] Billing Period (tab):', tab);
    
    setIsCreatingSite(true);
    try {
      console.log('🔍 [BillingManagement] Starting validation...');
      
      // Validate the data before proceeding
      const validation = validateCustomerAccountCreation(
        siteData,
        selectedPlan,
        selectedModules,
        selectedCard
      );
      
      console.log('✅ [BillingManagement] Validation result:', validation);
      
      if (!validation.isValid) {
        console.error('❌ [BillingManagement] Validation failed:', validation.errors);
        alert(`Validation failed:\n${validation.errors.join('\n')}`);
        return;
      }
      
      console.log('✅ [BillingManagement] Validation passed! Proceeding to API call...');
      
      // Create customer site
      console.log('🌐 [BillingManagement] Calling createCustomerSite...');
      const customerSiteResult = await createCustomerAccountDocument(
        siteData,
        selectedPlan,
        selectedModules,
        selectedCard,
        tab,
        selectedPlan?.name
      );
      
      console.log('📡 [BillingManagement] API call completed. Result:', customerSiteResult);
      
      if (customerSiteResult.success) {
        console.log('🎉 [BillingManagement] Customer site created successfully!');
        console.log('📊 [BillingManagement] Response data:', customerSiteResult.data);
        
        // Show success message
        alert(`✅ Site created successfully!\n\n📋 Details:\n• Site: ${siteData.name}.neotec.ai\n• Plan: ${selectedPlan?.name}\n• Modules: ${selectedModules.join(', ')}\n• Payment: ${selectedCard?.card_name}\n• Transaction ID: ${customerSiteResult.data?.transaction_id || 'N/A'}\n\n🎉 Your site is now ready to use!`);
        
        console.log('🔄 [BillingManagement] Resetting states and closing modal...');
        setShowSiteCreationModal(false);
        
        // Reset all states
        setSelectedPlan(null);
        setSelectedModules([]);
        setSelectedCard(null);
        
        // Navigate to Site Management page
        console.log('🔄 [BillingManagement] Navigating to Site Management page...');
        navigate('/clientDashboard/site-management');
        
        console.log('✅ [BillingManagement] ===== SITE CREATION PROCESS COMPLETED SUCCESSFULLY =====');
      } else {
        console.error('❌ [BillingManagement] API call failed:', customerSiteResult.message);
        throw new Error(customerSiteResult.message);
      }
      
    } catch (error: any) {
      console.error('💥 [BillingManagement] Error in site creation flow:', error);
      console.error('💥 [BillingManagement] Error stack:', error.stack);
      alert(`❌ Error creating site: ${error.message}`);
    } finally {
      console.log('🏁 [BillingManagement] Setting isCreatingSite to false');
      setIsCreatingSite(false);
      console.log('🏁 [BillingManagement] ===== SITE CREATION PROCESS ENDED =====');
    }
  };

  // Get module price based on tab
  const getModulePrice = (module: ModuleData) => {
    if (tab === 'monthly') {
      return module.m1 || 0;
    } else {
      return module.year_price || 0;
    }
  };

  return (
    <>
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
        //setShowPaymentList={setShowPaymentList}
      />
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c] p-6 md:p-12">
        {/* Animated SVG blobs */}
        <svg className="absolute top-0 -left-20 w-96 h-96 opacity-20 z-0 animate-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#774A67" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute bottom-0 -right-20 w-96 h-96 opacity-20 z-0 animate-blob animation-delay-2000" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#60A5FA" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
        </svg>
        {/* Header with Back Button and Heading */}
        <div className="relative z-10 max-w-5xl mx-auto p-0 md:p-0">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => { console.log('Back button clicked'); navigate('/clientLogin'); }}
              className="p-2 rounded-lg bg-[#774A67]/10 hover:bg-[#774A67]/20 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5 text-[#774A67]" />
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#232F3E] dark:text-white">Billing</h1>
          </div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto p-0 md:p-0 mt-10">
          <div className="flex gap-3 mb-8 justify-center">
            <button
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 focus:outline-none ring-2 ${tab === 'monthly' ? 'bg-[#2563eb] text-white ring-[#2563eb] scale-105 shadow' : 'bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#2a2a33]'}`}
              onClick={() => setTab('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 focus:outline-none ring-2 ${tab === 'yearly' ? 'bg-[#2563eb] text-white ring-[#2563eb] scale-105 shadow' : 'bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#2a2a33]'}`}
              onClick={() => setTab('yearly')}
            >
              Yearly
            </button>
          </div>
          <p className="mb-10 text-2xl font-bold text-[#232F3E] dark:text-white text-center">Subscribe to a plan below</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {plans.map((plan: PlanType, idx: number) => (
              plan.name === 'Enterprise' ? (
                <div
                  key={plan.name}
                  className="flex flex-col items-center justify-between bg-gradient-to-br from-white via-[#f8f9ff] to-[#e9eaf3] dark:from-[#23232a] dark:via-[#18181c] dark:to-[#23232a] border border-[#e0e7ff] dark:border-[#23232a] rounded-2xl p-14 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#6366f1] hover:-translate-y-2 relative group min-h-[320px]"
                >
                  <h2 className="text-3xl font-bold text-[#232F3E] dark:text-white mb-12">{plan.name}</h2>
                  <button className="bg-[#774A67] text-white px-8 py-3 rounded-lg font-bold text-xl shadow hover:bg-[#613a55] transition group-hover:scale-110 group-hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#774A67]">
                    Contact Us
                  </button>
                </div>
              ) : (
                <div
                  key={plan.name}
                  className="flex flex-col bg-gradient-to-br from-white via-[#f8f9ff] to-[#e9eaf3] dark:from-[#23232a] dark:via-[#18181c] dark:to-[#23232a] border border-[#e0e7ff] dark:border-[#23232a] rounded-2xl p-14 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-[#6366f1] hover:-translate-y-2 cursor-pointer min-h-[320px] relative group"
                >
                  <div className="flex items-center gap-6 mb-8 flex-wrap">
                    <h2 className="text-3xl font-bold text-[#232F3E] dark:text-white flex items-center">
                      {plan.name}
                      {plan.name === 'Premium' && (
                        <span className="ml-3 px-3 py-1 text-sm font-semibold rounded bg-[#e6f9e6] text-[#40B93C] border border-[#40B93C]/30 animate-pulse">Best Value</span>
                      )}
                    </h2>
                    <span className="ml-2 flex items-center gap-1 text-3xl font-extrabold drop-shadow-sm group-hover:animate-pulse whitespace-nowrap min-w-0 text-black dark:text-yellow-400">
                      {plan.price[tab] ? (
                        <>
                          <img src={RiyalSymbol} alt="SAR" className="w-7 h-7 inline-block mb-1" />
                          <span className="truncate">{plan.price[tab]}</span> <span className="text-lg font-semibold ml-1">/ {tab === 'monthly' ? 'Month' : 'Year'}</span>
                        </>
                      ) : 'Contact Us'}
                    </span>
                  </div>
                  {/* Show some key features */}
                  <div className="flex flex-wrap gap-x-10 gap-y-2 text-lg mb-10">
                    <span>Invoices: <span className="text-blue-600 dark:text-blue-400 font-semibold">{plan.features.invoices}</span></span>
                    <span>Clients: <span className="text-blue-600 dark:text-blue-400 font-semibold">{plan.features.clients}</span></span>
                    <span>Offline POS: <span className="text-blue-600 dark:text-blue-400 font-semibold">{plan.features.offlinePOSTerminals}</span></span>
                    <span>Suppliers: <span className="text-blue-600 dark:text-blue-400 font-semibold">{plan.features.suppliersManagement ? 'Yes' : 'No'}</span></span>
                    <span>Stock: <span className="text-blue-600 dark:text-blue-400 font-semibold">{plan.features.trackStock ? 'Yes' : 'No'}</span></span>
                  </div>
                  <div className="mt-auto flex justify-end">
                    <button className="bg-[#774A67] text-white px-8 py-3 rounded-lg font-bold text-xl shadow hover:bg-[#613a55] transition group-hover:scale-110 group-hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#774A67]"
                      onClick={() => handleSubscribeClick(plan)}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>
      {/* Module Selection Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-[#23232a] rounded-3xl shadow-2xl max-w-lg w-full mx-4 my-8 overflow-hidden transform perspective-1000">
            {/* SVG Blobs Background */}
            <div className="absolute inset-0 overflow-hidden">
              <svg className="absolute -top-20 -left-20 w-40 h-40 opacity-10 animate-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#774A67" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
              </svg>
              <svg className="absolute top-1/2 -right-20 w-40 h-40 opacity-10 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#8b5cf6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
              </svg>
              <svg className="absolute -bottom-20 left-1/3 w-40 h-40 opacity-10 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path fill="#60A5FA" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
              </svg>
            </div>
            
            {/* Modal Content */}
            <div className="relative z-10 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent">
                    Select Modules
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                    Choose the modules you want to include in your {selectedPlan?.name} plan
                  </p>
                </div>
                <button
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90"
                  onClick={() => setShowModuleModal(false)}
                  aria-label="Close Module Selection"
                >
                  <svg className="w-4 h-4 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Module Selection */}
              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto custom-scrollbar overflow-x-hidden px-1">
                {modulesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="relative">
                      <div className="w-10 h-10 border-4 border-[#774A67]/20 border-t-[#774A67] rounded-full animate-spin"></div>
                      <div className="mt-3 text-center text-gray-600 dark:text-gray-400 text-sm">Loading modules...</div>
                    </div>
                  </div>
                ) : modulesError ? (
                  <div className="text-center py-6">
                    <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="text-red-600 dark:text-red-400 font-semibold text-sm">{modulesError}</div>
                  </div>
                ) : (
                  modules.map((module, index) => (
                    <div
                      key={module.module_name}
                      className={`group relative bg-gradient-to-r from-white to-gray-50 dark:from-[#2a2a33] dark:to-[#23232a] border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:border-[#774A67] cursor-pointer transform perspective-1000 ${
                        selectedModules.includes(module.module_name) 
                          ? 'border-[#774A67] bg-gradient-to-r from-[#774A67]/5 to-[#8b5cf6]/5 shadow-md' 
                          : ''
                      }`}
                      onClick={() => {
                        if (selectedModules.includes(module.module_name)) {
                          setSelectedModules(selectedModules.filter(m => m !== module.module_name));
                        } else {
                          setSelectedModules([...selectedModules, module.module_name]);
                        }
                      }}
                    >
                      {/* 3D Hover Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#774A67]/10 to-[#8b5cf6]/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {/* Custom Checkbox */}
                          <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-300 ${
                            selectedModules.includes(module.module_name)
                              ? 'border-[#774A67] bg-[#774A67]'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedModules.includes(module.module_name) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                          
                          {/* Module Info */}
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#774A67] transition-colors duration-300">
                              {module.module_name}
                            </h3>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Professional {module.module_name.toLowerCase()} module
                            </p>
                          </div>
                        </div>
                        
                        {/* Price */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-[#774A67] dark:text-[#8b5cf6]">
                            SAR {getModulePrice(module)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            per {tab === 'monthly' ? 'month' : 'year'}
                          </div>
                        </div>
                      </div>
                      
                      {/* Selection Indicator */}
                      {selectedModules.includes(module.module_name) && (
                        <div className="absolute top-3 right-3 w-2 h-2 bg-[#774A67] rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {selectedModules.length > 0 ? (
                    <span className="font-semibold text-[#774A67]">
                      {selectedModules.length} module{selectedModules.length !== 1 ? 's' : ''} selected
                    </span>
                  ) : (
                    "No modules selected"
                  )}
                </div>
                
                <button
                  className={`px-6 py-2 rounded-lg font-semibold text-base transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#774A67]/20 ${
                    selectedModules.length === 0
                      ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white shadow-lg hover:shadow-xl hover:from-[#8b5cf6] hover:to-[#774A67]'
                  }`}
                  onClick={handleModuleSelectionContinue}
                  disabled={selectedModules.length === 0}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Add Card Modal */}
      <PaymentDetailsModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onSuccess={() => {
          setShowAddCardModal(false);
          refreshCards();
        }}
      />
      {/* Select Card Modal */}
      {showSelectCardModal && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 my-8 p-8">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 z-10"
              onClick={() => setShowSelectCardModal(false)}
              aria-label="Close Card Selection"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-[#774A67]">Select a Card</h2>
            {cardsLoading ? (
              <div className="text-center py-8 text-lg text-gray-600 dark:text-gray-300">Loading cards...</div>
            ) : cardsError ? (
              <div className="text-center py-8 text-red-600">{cardsError}</div>
            ) : (
              <div className="space-y-4">
                {cards.map(card => (
                  <div key={card.name} className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="font-semibold text-lg text-[#774A67]">{card.card_name}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">**** **** **** {card.card_number.slice(-4)}</div>
                      <div className="text-xs text-gray-400">Expires {card.expiry}</div>
                    </div>
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-[#774A67] to-[#5e3752] text-white rounded-xl font-semibold shadow hover:from-[#5e3752] hover:to-[#774A67] transition-all duration-300"
                      onClick={() => handleCardSelect(card)}
                    >
                      Select
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Site Creation Modal */}
      {showSiteCreationModal && (
        <CreateSiteModal
          isOpen={showSiteCreationModal}
          onClose={() => setShowSiteCreationModal(false)}
          onCreate={handleCreateSite}
          modules={modules}
          modulesLoading={modulesLoading}
          modulesError={modulesError}
          selectedPlan={selectedPlan}
          selectedModules={selectedModules}
          selectedCard={selectedCard}
          isCreatingSite={isCreatingSite}
          tab={tab}
        />
      )}
    </>
  );
};

// Create Site Modal Component
interface CreateSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (siteData: any) => void;
  modules: ModuleData[];
  modulesLoading: boolean;
  modulesError: string | null;
  selectedPlan: PlanType | null;
  selectedModules: string[];
  selectedCard: PaymentDetail | null;
  isCreatingSite: boolean;
  tab: 'monthly' | 'yearly';
}

const CreateSiteModal: React.FC<CreateSiteModalProps> = ({ 
  isOpen, 
  onClose, 
  onCreate, 
  modules, 
  modulesLoading, 
  modulesError,
  selectedPlan,
  selectedModules,
  selectedCard,
  isCreatingSite,
  tab
}) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    adminPassword: '12345',
    dbPassword: 'P@ss#1234'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(formData);
    setFormData({ 
      name: '', 
      domain: '', 
      adminPassword: '12345',
      dbPassword: 'P@ss#1234'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#23232a] dark:via-[#1a1a1f] dark:to-[#23232a] rounded-3xl shadow-2xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto border border-[#774A67]/10 dark:border-[#774A67]/20 transform perspective-1000 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Site</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiPlus className="w-6 h-6 transform rotate-45" />
          </button>
        </div>

        {/* Selected Plan and Modules Summary */}
        <div className="mb-6 p-6 bg-gradient-to-br from-[#774A67]/5 via-[#8b5cf6]/5 to-[#60A5FA]/5 dark:from-[#774A67]/10 dark:via-[#8b5cf6]/10 dark:to-[#60A5FA]/10 rounded-2xl border border-[#774A67]/20 dark:border-[#774A67]/30 shadow-lg transform perspective-1000 hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-[#774A67] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg">
              <FiGlobe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent">
              Site Configuration
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plan Information */}
            <div className="bg-white/50 dark:bg-[#23232a]/50 rounded-xl p-4 border border-[#774A67]/20 dark:border-[#774A67]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-[#774A67] rounded-lg flex items-center justify-center">
                  <FiSettings className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Plan Details</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Plan:</span>
                  <span className="font-bold text-[#774A67]">{selectedPlan?.name || 'Basic'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Billing:</span>
                  <span className="font-semibold text-[#8b5cf6] capitalize">{tab}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Price:</span>
                  <span className="font-bold text-[#774A67]">
                    SAR {selectedPlan?.price?.[tab] || 'Contact Us'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white/50 dark:bg-[#23232a]/50 rounded-xl p-4 border border-[#774A67]/20 dark:border-[#774A67]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
                  <FiUsers className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Payment Info</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Card:</span>
                  <span className="font-bold text-[#774A67]">{selectedCard?.card_name || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Number:</span>
                  <span className="font-semibold text-[#8b5cf6]">**** {selectedCard?.card_number?.slice(-4) || '****'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Expires:</span>
                  <span className="font-semibold text-[#774A67]">{selectedCard?.expiry || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Selected Modules */}
          <div className="mt-4 bg-white/50 dark:bg-[#23232a]/50 rounded-xl p-4 border border-[#774A67]/20 dark:border-[#774A67]/30 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#60A5FA] rounded-lg flex items-center justify-center">
                <FiSettings className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Selected Modules ({selectedModules.length})</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedModules.map((module, index) => (
                <span
                  key={index}
                  className="inline-flex px-3 py-1 text-xs font-semibold bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {module}
                </span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Provision Section */}
          <div className="bg-gradient-to-br from-[#774A67]/5 via-[#8b5cf6]/5 to-[#60A5FA]/5 dark:from-[#774A67]/10 dark:via-[#8b5cf6]/10 dark:to-[#60A5FA]/10 rounded-2xl p-6 border border-[#774A67]/20 dark:border-[#774A67]/30 shadow-lg transform perspective-1000 hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#774A67] to-[#8b5cf6] rounded-lg flex items-center justify-center shadow-md">
                <FiGlobe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent">
                Company Provision
              </h3>
            </div>
            
            <div className="space-y-6">
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#774A67] transition-colors">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-[#774A67]/20 focus:border-[#774A67] dark:focus:border-[#8b5cf6] bg-white/50 dark:bg-[#23232a]/50 backdrop-blur-sm transition-all duration-300 hover:border-[#774A67]/50 dark:hover:border-[#8b5cf6]/50 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  placeholder="Enter company name"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#774A67] transition-colors">
                  Company Domain
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => {
                      // Only allow lowercase letters, numbers, and hyphens
                      const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setFormData({ ...formData, domain: value });
                    }}
                    className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-l-xl focus:ring-4 focus:ring-[#774A67]/20 focus:border-[#774A67] dark:focus:border-[#8b5cf6] bg-white/50 dark:bg-[#23232a]/50 backdrop-blur-sm transition-all duration-300 hover:border-[#774A67]/50 dark:hover:border-[#8b5cf6]/50 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                    placeholder="mycompany"
                    maxLength={63}
                  />
                  <span className="px-4 py-3 bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white border-2 border-l-0 border-[#774A67] dark:border-[#8b5cf6] rounded-r-xl font-semibold shadow-md">
                    .neotec.ai
                  </span>
                </div>
                
                {/* Domain Preview */}
                <div className="mt-3 p-3 bg-gradient-to-r from-[#774A67]/10 to-[#8b5cf6]/10 dark:from-[#774A67]/20 dark:to-[#8b5cf6]/20 rounded-lg border border-[#774A67]/20 dark:border-[#774A67]/30">
                  <div className="flex items-center gap-2">
                    <FiGlobe className="w-4 h-4 text-[#774A67]" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Preview:</span>
                    <span className="text-sm font-bold text-[#774A67] dark:text-[#8b5cf6]">
                      {formData.domain || 'mycompany'}.neotec.ai
                    </span>
                  </div>
                  {formData.domain && (
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {formData.domain.length < 3 ? (
                        <span className="text-orange-500">Domain should be at least 3 characters</span>
                      ) : formData.domain.length > 63 ? (
                        <span className="text-red-500">Domain too long (max 63 characters)</span>
                      ) : (
                        <span className="text-green-500">✓ Domain looks good!</span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Domain Guidelines */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <p>• Use only lowercase letters, numbers, and hyphens</p>
                  <p>• Must be 3-63 characters long</p>
                  <p>• Cannot start or end with a hyphen</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Access Section */}
          <div className="bg-gradient-to-br from-[#774A67]/5 via-[#8b5cf6]/5 to-[#60A5FA]/5 dark:from-[#774A67]/10 dark:via-[#8b5cf6]/10 dark:to-[#60A5FA]/10 rounded-2xl p-6 border border-[#774A67]/20 dark:border-[#774A67]/30 shadow-lg transform perspective-1000 hover:scale-[1.01] transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#8b5cf6] to-[#60A5FA] rounded-lg flex items-center justify-center shadow-md">
                <FiSettings className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold bg-gradient-to-r from-[#8b5cf6] to-[#60A5FA] bg-clip-text text-transparent">
                Admin Access
              </h3>
            </div>
            
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 group-hover:text-[#8b5cf6] transition-colors">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={formData.adminPassword}
                onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-[#8b5cf6]/20 focus:border-[#8b5cf6] dark:focus:border-[#60A5FA] bg-white/50 dark:bg-[#23232a]/50 backdrop-blur-sm transition-all duration-300 hover:border-[#8b5cf6]/50 dark:hover:border-[#60A5FA]/50 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                placeholder="Enter admin password"
              />
              <p className="text-xs text-gray-500 mt-2 font-medium">
                This will be used to access your site's admin panel
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isCreatingSite}
              className="flex-1 px-6 py-4 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#774A67]/30 dark:hover:border-[#8b5cf6]/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreatingSite}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white rounded-xl hover:from-[#8b5cf6] hover:to-[#774A67] transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold shadow-lg flex items-center justify-center gap-2"
            >
              {isCreatingSite ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Creating Site...</span>
                </>
              ) : (
                <>
                  <FiGlobe className="w-5 h-5" />
                  <span>Create Site</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BillingManagement; 