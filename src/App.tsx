import { cn } from "@utils/index";
import { lazy, Suspense, useEffect, useState } from "react";
import { rootStore } from "./store";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import 'react-phone-input-2/lib/style.css';

import "./App.css";
import TrialBanner from '@components/sections/TrialBanner';
import Promises from './components/sections/Promises';
import WhyAlphaX from './components/sections/WhyAlphaX';
import Module from './components/sections/Module';
import Industries from './components/sections/Industries';
import CTABanner from './components/CTABanner';
import ContactPage from './pages/ContactPage';
//import ChatGPTInterface from './components/ChatGPT/ChatGPTInterface';
//import ChatGPTModal from './components/ChatGPT/ChatGPTModal';
//import { FiMessageCircle } from 'react-icons/fi';
import SubscriptionPlan from './pages/SubscriptionPlan';

const Divider = lazy(() => import("@components/common/Divider"));
const Navbar = lazy(() => import("@components/sections/Navbar"));
const Hero = lazy(() => import("@components/sections/Hero"));
const Features = lazy(() => import("@components/sections/Features"));
const Testimonials = lazy(() => import("@components/sections/Testimonials"));
const Pricing = lazy(() => import("@components/sections/Pricing"));
const Footer = lazy(() => import("@components/sections/Footer"));
const GetStartedModal = lazy(
  () => import("@components/sections/GetStartedModal")
);
const CreateSiteModal = lazy(
  () => import("@components/sections/CreateSiteModal")
);
const PaymentModal = lazy(
  () => import("@components/sections/PaymentModal")
);
const ClientDashboard = lazy(() => import("./pages/ClientDashboard/index"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const PricinglistPage = lazy(() => import("./pages/PricinglistPage"));
const PaymentDetailsPage = lazy(() => import("./pages/PaymentDetailsPage"));

// Sales pages
const Sales = lazy(() => import("./pages/Sales/Sales"));
const Invoicing = lazy(() => import("./pages/Sales/Invoicing"));
const POS = lazy(() => import("./pages/Sales/POS"));
const Offers = lazy(() => import("./pages/Sales/Offers"));
const Installments = lazy(() => import("./pages/Sales/Installments"));
const SalesCommission = lazy(() => import("./pages/Sales/SalesCommission"));
const InsuranceManagement = lazy(() => import("./pages/Sales/InsuranceManagement"));

// Inventory pages
const InventoryManagement = lazy(() => import("./pages/Inventory/InventoryManagement"));
const ProductManagement = lazy(() => import("./pages/Inventory/ProductManagement"));
const Purchases = lazy(() => import("./pages/Inventory/Purchases"));
const Requisitions = lazy(() => import("./pages/Inventory/Requisitions"));
const Suppliers = lazy(() => import("./pages/Inventory/Suppliers"));
const Stocktaking = lazy(() => import("./pages/Inventory/Stocktaking"));
const PurchaseCycle = lazy(() => import("./pages/Inventory/PurchaseCycle"));
const ManufacturingManagementSoftware = lazy(() => import("./pages/Inventory/ManufacturingManagementSoftware"));
const ManufacturingOrdersManagementSoftware = lazy(() => import("./pages/Inventory/ManufacturingOrdersManagementSoftware"));

// Accounting pages
const GeneralAccounting = lazy(() => import("./pages/Accounting/GeneralAccounting"));
const ChartOfAccounts = lazy(() => import("./pages/Accounting/ChartOfAccounts"));
const AssetManagement = lazy(() => import("./pages/Accounting/AssetManagement"));
const CostCenters = lazy(() => import("./pages/Accounting/CostCenters"));
const ChequeCycle = lazy(() => import("./pages/Accounting/ChequeCycle"));
const Expenses = lazy(() => import("./pages/Accounting/Expenses"));

// HRM pages
const HumanResourcesManagement = lazy(() => import("./pages/HRM/HumanResourcesManagement"));
const OrganizationalStructure = lazy(() => import("./pages/HRM/OrganizationalStructure"));
const AttendanceAndLeaveManagement = lazy(() => import("./pages/HRM/AttendanceAndLeaveManagement"));
const Contracts = lazy(() => import("./pages/HRM/Contracts"));
const Payroll = lazy(() => import("./pages/HRM/Payroll"));
const Requests = lazy(() => import("./pages/HRM/Requests"));

// Operations pages
const Operations = lazy(() => import("./pages/Operations/Operations"));
const WorkOrders = lazy(() => import("./pages/Operations/WorkOrders"));
const BookingManagement = lazy(() => import("./pages/Operations/BookingManagement"));
const RentalAndUnitManagement = lazy(() => import("./pages/Operations/RentalAndUnitManagement"));
const TimeTracking = lazy(() => import("./pages/Operations/TimeTracking"));

// Clients pages
const ClientManagement = lazy(() => import("./pages/Clients/ClientManagement"));
const ClientFollowUp = lazy(() => import("./pages/Clients/ClientFollowUp"));
const LoyaltyPoints = lazy(() => import("./pages/Clients/LoyaltyPoints"));
const PointsAndCredits = lazy(() => import("./pages/Clients/PointsAndCredits"));
const Memberships = lazy(() => import("./pages/Clients/Memberships"));

// CMS Panel
const CMSPanel = lazy(() => import("./pages/CMSPanel"));

// Landing page component
const LandingPage = () => {
  const isStarting = rootStore(({ data }) => data.isStarting);

  useEffect(() => {
    const rootBody = document.getElementById("root-body");
    if (rootBody) {
      if (isStarting) {
        rootBody.style.overflow = "hidden";
      } else {
        rootBody.style.overflow = "auto";
      }
    }
  }, [isStarting]);

  return (
    <>
      <Navbar />
      <Hero />
      <Divider />
      <Features />
      <TrialBanner />
      <Promises />
      <WhyAlphaX />
      <Testimonials />
      {/* <Pricing />  // Commented out for now */}
      <Divider />
      <Footer />
    </>
  );
};

// CTA Banner page component
const CTABannerPage = () => {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <CTABanner />
      </div>
      <Footer />
    </>
  );
};

function App() {
  const handleClientLogout = rootStore(({ handleClientLogout }) => handleClientLogout);
  const isLoggedIn = rootStore(({ data }) => data.isIn);
  const isModulesOpen = rootStore(({ data }) => data.isModulesOpen);
  const toggleModules = rootStore(({ toggleModules }) => toggleModules);
  const toggleIndustries = rootStore(({ toggleIndustries }) => toggleIndustries);
  const { data } = rootStore();
  const { isStarting, isSignUp, isIn, isConfigSite, isPayment, confirmPayment, isIndustriesOpen } = data;

  const [isChatGPTModalOpen, setIsChatGPTModalOpen] = useState(false);

  // Rehydrate Zustand store from localStorage on app load
  useEffect(() => {
    const isIn = localStorage.getItem("in") === "true";
    const tk = localStorage.getItem("tk") || "";
    if (isIn) {
      rootStore.getState().handleClientLogin(tk);
    }
  }, []);

  return (
    <BrowserRouter>
      <main className={cn("dark:bg-[#020303] relative max-w-[110rem] mx-auto h-auto")}>
        <Suspense fallback={<></>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/pricinglist" element={<PricinglistPage />} />
            <Route path="/cta-banner" element={<CTABannerPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/payment-details" element={<PaymentDetailsPage />} />
            
            {/* Sales Routes */}
            <Route path="/Sales/Sales" element={<Sales />} />
            <Route path="/Sales/Invoicing" element={<Invoicing />} />
            <Route path="/Sales/POS" element={<POS />} />
            <Route path="/Sales/Offers" element={<Offers />} />
            <Route path="/Sales/Installments" element={<Installments />} />
            <Route path="/Sales/SalesCommission" element={<SalesCommission />} />
            <Route path="/Sales/InsuranceManagement" element={<InsuranceManagement />} />

            {/* Inventory Routes */}
            <Route path="/Inventory/InventoryManagement" element={<InventoryManagement />} />
            <Route path="/Inventory/ProductManagement" element={<ProductManagement />} />
            <Route path="/Inventory/Purchases" element={<Purchases />} />
            <Route path="/Inventory/Requisitions" element={<Requisitions />} />
            <Route path="/Inventory/Suppliers" element={<Suppliers />} />
            <Route path="/Inventory/Stocktaking" element={<Stocktaking />} />
            <Route path="/Inventory/PurchaseCycle" element={<PurchaseCycle />} />
            <Route path="/Inventory/ManufacturingManagementSoftware" element={<ManufacturingManagementSoftware />} />
            <Route path="/Inventory/ManufacturingOrdersManagementSoftware" element={<ManufacturingOrdersManagementSoftware />} />

            {/* Accounting Routes */}
            <Route path="/Accounting/GeneralAccounting" element={<GeneralAccounting />} />
            <Route path="/Accounting/ChartOfAccounts" element={<ChartOfAccounts />} />
            <Route path="/Accounting/AssetManagement" element={<AssetManagement />} />
            <Route path="/Accounting/CostCenters" element={<CostCenters />} />
            <Route path="/Accounting/ChequeCycle" element={<ChequeCycle />} />
            <Route path="/Accounting/Expenses" element={<Expenses />} />

            {/* HRM Routes */}
            <Route path="/HRM/HumanResourcesManagement" element={<HumanResourcesManagement />} />
            <Route path="/HRM/OrganizationalStructure" element={<OrganizationalStructure />} />
            <Route path="/HRM/AttendanceAndLeaveManagement" element={<AttendanceAndLeaveManagement />} />
            <Route path="/HRM/Contracts" element={<Contracts />} />
            <Route path="/HRM/Payroll" element={<Payroll />} />
            <Route path="/HRM/Requests" element={<Requests />} />

            {/* Operations Routes */}
            <Route path="/Operations/Operations" element={<Operations />} />
            <Route path="/Operations/WorkOrders" element={<WorkOrders />} />
            <Route path="/Operations/BookingManagement" element={<BookingManagement />} />
            <Route path="/Operations/RentalAndUnitManagement" element={<RentalAndUnitManagement />} />
            <Route path="/Operations/TimeTracking" element={<TimeTracking />} />

            {/* Clients Routes */}
            <Route path="/Clients/ClientManagement" element={<ClientManagement />} />
            <Route path="/Clients/ClientFollowUp" element={<ClientFollowUp />} />
            <Route path="/Clients/LoyaltyPoints" element={<LoyaltyPoints />} />
            <Route path="/Clients/PointsAndCredits" element={<PointsAndCredits />} />
            <Route path="/Clients/Memberships" element={<Memberships />} />

            <Route
              path="/clientLogin"
              element={
                isLoggedIn ? (
                  <ClientDashboard />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* CMS Panel Route */}
            <Route
              path="/cms-panel"
              element={
                localStorage.getItem("isSuperAdmin") ? (
                  <CMSPanel />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            <Route
              path="/subscription-plan"
              element={
                isLoggedIn ? (
                  <SubscriptionPlan />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
          </Routes>
        </Suspense>
        <GetStartedModal />
        <CreateSiteModal />
        {/* <PaymentModal /> Removed to prevent always showing the payment modal */}
        {/*
        <button
          className="fixed bottom-8 right-8 bg-[#10a37f] text-white p-4 rounded-full shadow-lg hover:bg-[#0d8c6d] transition-all duration-200 flex items-center gap-2 z-[999]"
          onClick={() => setIsChatGPTModalOpen(true)}
          aria-label="Open ChatGPT Chat"
        >
          <FiMessageCircle className="w-6 h-6" />
        </button>
        <ChatGPTModal 
          isOpen={isChatGPTModalOpen} 
          onClose={() => setIsChatGPTModalOpen(false)} 
        />
        */}
        {isModulesOpen && (
          <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 my-8 overflow-auto max-h-[90vh]">
              <button
                className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 z-10"
                onClick={toggleModules}
                aria-label="Close Modules"
              >
                &times;
              </button>
              <Module />
            </div>
          </div>
        )}
        {isIndustriesOpen && (
          <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
            <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full mx-4 my-8 overflow-auto max-h-[90vh]">
              <button
                className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 z-10"
                onClick={toggleIndustries}
                aria-label="Close Industries"
              >
                &times;
              </button>
              <Industries />
            </div>
          </div>
        )}
      </main>
    </BrowserRouter>
  );
}

export default App;
