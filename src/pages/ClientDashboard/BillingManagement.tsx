import React, { useState, useRef } from 'react';
import { plans } from '../PricingPage';
import RiyalSymbol from '../../images/Saudi_Riyal_Symbol.png';
import DashboardNavbar from './DashboardNavbar';
import { useNavigate } from 'react-router-dom';
import { rootStore } from '@store/index';
import PaymentDetailsModal from '../PaymentDetailsModal';
import { useUserCards, PaymentDetail } from '../../hooks/useUserCards';
import PricinglistPage from '../PricinglistPage'; // For reference only, not used directly

type PlanType = typeof plans[number];

// Copy module list from PricinglistPage.tsx
const moduleList = [
  'Accounting',
  'Sales (B2B)',
  'Purchase/Procurement',
  'POS (B2C)'
];

// Copy pricingData from PricinglistPage.tsx for module pricing
const modulePricingData = {
  monthly: [
    { module: 'Accounting', price: 440 },
    { module: 'Sales (B2B)', price: 386 },
    { module: 'Purchase/Procurement', price: 386 },
    { module: 'POS (B2C)', price: 386 },
  ],
  yearly: [
    { module: 'Accounting', price: 375 },
    { module: 'Sales (B2B)', price: 321 },
    { module: 'Purchase/Procurement', price: 321 },
    { module: 'POS (B2C)', price: 321 },
  ],
};

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

  const handleSubscribeClick = (plan: PlanType) => {
    setSelectedPlan(plan);
    setShowModuleModal(true); // Show module selection first
  };

  // After module selection, proceed to card logic
  const handleModuleSelectionContinue = () => {
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
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 my-8 p-8">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 z-10"
              onClick={() => setShowModuleModal(false)}
              aria-label="Close Module Selection"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-[#774A67]">Select Modules</h2>
            <div className="space-y-4 mb-6">
              {modulePricingData[tab].map(({ module, price }) => (
                <label key={module} className="flex items-center gap-3 text-lg justify-between">
                  <span className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedModules.includes(module)}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedModules([...selectedModules, module]);
                        } else {
                          setSelectedModules(selectedModules.filter(m => m !== module));
                        }
                      }}
                    />
                    <span>{module}</span>
                  </span>
                  <span className="font-semibold text-[#2563eb]">SAR {price} / {tab === 'monthly' ? 'Month' : 'Year'}</span>
                </label>
              ))}
            </div>
            <button
              className="px-6 py-2 bg-gradient-to-r from-[#774A67] to-[#5e3752] text-white rounded-xl font-semibold shadow hover:from-[#5e3752] hover:to-[#774A67] transition-all duration-300"
              onClick={handleModuleSelectionContinue}
              disabled={selectedModules.length === 0}
            >
              Continue
            </button>
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