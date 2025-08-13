import React, { useState, useRef, useEffect } from 'react';
import { plans } from '../PricingPage';
import RiyalSymbol from '../../images/Saudi_Riyal_Symbol.png';
import DashboardNavbar from './DashboardNavbar';
import { useNavigate } from 'react-router-dom';
import { rootStore } from '@store/index';
import PaymentDetailsModal from '../PaymentDetailsModal';
import { useUserCards, PaymentDetail } from '../../hooks/useUserCards';

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
        const res = await fetch('https://newhrms.muftaah.com/api/method/alphax_erp.api.ModulePricing.get_module_pricing', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
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
    // Placeholder for actual subscription logic
    alert(`Subscribed to ${selectedPlan?.name} with card ending ${card.card_number.slice(-4)}`);
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
        <div className="relative z-10 max-w-5xl mx-auto p-0 md:p-0 mt-10">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#232F3E] dark:text-white">Billing</h1>
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
    </>
  );
};

export default BillingManagement; 