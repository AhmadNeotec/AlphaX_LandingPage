import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import CMSNavbar from './CMSNavbar';
import CMSSidebar, { SidebarSection } from './CMSSidebar';
import Dashboard from './Dashboard';
import FeaturesManagement from './FeaturesManagement';
import NavbarManagement from './NavbarManagement';
import UserManagement from './UserManagement';
import { FiSave, FiEdit2 } from 'react-icons/fi';
import ModulePricingManagement from './ModulePricingManagement';

const PLAN_NAMES = ['Basic', 'Advanced', 'Premium'];

interface PricingAmounts {
  [plan: string]: {
    monthly: number;
    yearly: number;
    yearlyTotal: number;
  };
}

const defaultPricing: PricingAmounts = {
  Basic: { monthly: 14.95, yearly: 9.99, yearlyTotal: 120 },
  Advanced: { monthly: 24.99, yearly: 19.95, yearlyTotal: 239 },
  Premium: { monthly: 49.95, yearly: 40.0, yearlyTotal: 480 },
};

const CMSPanel = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [pricing, setPricing] = useState<PricingAmounts>(defaultPricing);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');

  useEffect(() => {
    const isSuperAdmin = localStorage.getItem("isSuperAdmin");
    if (!isSuperAdmin) navigate("/");
    const saved = localStorage.getItem('pricingAmounts');
    if (saved) setPricing(JSON.parse(saved));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isSuperAdmin");
    localStorage.setItem("loginSuccess", "false");
    navigate("/");
  };

  const handleChange = (plan: string, key: string, value: string) => {
    setPricing(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [key]: parseFloat(value) || 0,
      },
    }));
  };

  const handleSave = () => {
    localStorage.setItem('pricingAmounts', JSON.stringify(pricing));
    enqueueSnackbar('Pricing amounts saved successfully!', { variant: 'success' });
    setIsEditing(false);
  };

  // Main content switcher
  let mainContent = null;
  if (activeSection === 'dashboard') {
    mainContent = <Dashboard />;
  } else if (activeSection === 'pricing') {
    mainContent = (
      <>
              <ModulePricingManagement />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Pricing Management</h2>
            <div className="flex gap-4">
              {isEditing ? (
                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
                  <FiSave /> Save Changes
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
                  <FiEdit2 /> Edit Pricing
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLAN_NAMES.map(plan => (
              <div key={plan} className="border rounded-lg p-6 bg-white shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{plan}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pricing[plan].monthly}
                      onChange={e => handleChange(plan, 'monthly', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#774A67] focus:ring-[#774A67] disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yearly Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pricing[plan].yearly}
                      onChange={e => handleChange(plan, 'yearly', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#774A67] focus:ring-[#774A67] disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yearly Total</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pricing[plan].yearlyTotal}
                      onChange={e => handleChange(plan, 'yearlyTotal', e.target.value)}
                      disabled={!isEditing}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#774A67] focus:ring-[#774A67] disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
    );
  } else if (activeSection === 'features') {
    mainContent = <FeaturesManagement />;
  } else if (activeSection === 'navbar') {
    mainContent = <NavbarManagement />;
  } else if (activeSection === 'users') {
    mainContent = <UserManagement />;
  } else {
    mainContent = (
      <div className="flex items-center justify-center h-full text-2xl text-gray-400 font-semibold">
        Coming Soon...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000 z-0" />
      <div className="relative z-10">
        <CMSNavbar onLogout={handleLogout} />
        <CMSSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((prev) => !prev)}
        />
        <main className={`pt-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
          {mainContent}
        </main>
      </div>
    </div>
  );
};

export default CMSPanel; 