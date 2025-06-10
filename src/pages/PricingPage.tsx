import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/sections/Navbar';
import RiyalSymbol from '../images/Saudi_Riyal_Symbol.png';

const plans = [
  {
    name: 'Basic',
    color: 'text-[#232F3E]',
    price: { monthly: 14.95, yearly: 9.99, yearlyTotal: 120 },
    features: {
      invoices: '100 /month',
      cloudPOS: true,
      priceList: false,
      offers: false,
      targetCommissions: false,
      installments: false,
      loyaltyPoints: false,
      offlinePOSTerminals: '1',
      extraTerminals: '10',
      clients: '100',
      followUpClients: true,
      membership: false,
      sms: false,
      unlimitedProducts: true,
      purchases: true,
      suppliersManagement: true,
      trackStock: true,
      stocktaking: true,
      trackSerialLotExpiryDate: true,
      bundles: false,
      purchaseCycle: false,
      expensesDistribution: false,
      manufacturing: false,
      expensesIncomes: true,
      chartOfAccounts: true,
      autoJournalEntries: true,
      costCenters: false,
      assetsDepreciation: true,
      ledgerReports: true,
      chequesCycle: true,
      treasuriesBanks: '2',
      financialStatements: true,
      employees: 'ر.س2.2 /month/per each',
      payroll: true,
      attendanceManagement: true,
      contracts: true,
      organizationStructure: true,
      workflow: false,
      extraUsers: 'ر.س6 /month/per extra',
      extraBranches: false,
    },
  },
  {
    name: 'Advanced',
    color: 'text-[#2563eb]',
    price: { monthly: 24.99, yearly: 19.95, yearlyTotal: 239 },
    features: {
      invoices: '500 /month',
      cloudPOS: true,
      priceList: true,
      offers: true,
      targetCommissions: false,
      installments: false,
      loyaltyPoints: false,
      offlinePOSTerminals: '3',
      extraTerminals: '10',
      clients: '300',
      followUpClients: true,
      membership: true,
      sms: false,
      unlimitedProducts: true,
      purchases: true,
      suppliersManagement: true,
      trackStock: true,
      stocktaking: true,
      trackSerialLotExpiryDate: true,
      bundles: true,
      purchaseCycle: false,
      expensesDistribution: false,
      manufacturing: false,
      expensesIncomes: true,
      chartOfAccounts: true,
      autoJournalEntries: true,
      costCenters: true,
      assetsDepreciation: true,
      ledgerReports: true,
      chequesCycle: true,
      treasuriesBanks: '5',
      financialStatements: true,
      employees: 'ر.س2.2 /month/per each',
      payroll: true,
      attendanceManagement: true,
      contracts: true,
      organizationStructure: true,
      workflow: false,
      extraUsers: 'ر.س6 /month/per extra',
      extraBranches: 'ر.س20 /month/per extra',
    },
  },
  {
    name: 'Premium',
    color: 'text-[#40B93C]',
    price: { monthly: 49.95, yearly: 40.0, yearlyTotal: 480 },
    features: {
      invoices: 'Unlimited',
      cloudPOS: true,
      priceList: true,
      offers: true,
      targetCommissions: true,
      installments: true,
      loyaltyPoints: true,
      offlinePOSTerminals: '5',
      extraTerminals: '10',
      clients: 'Unlimited',
      followUpClients: true,
      membership: true,
      sms: true,
      unlimitedProducts: true,
      purchases: true,
      suppliersManagement: true,
      trackStock: true,
      stocktaking: true,
      trackSerialLotExpiryDate: true,
      bundles: true,
      purchaseCycle: true,
      expensesDistribution: true,
      manufacturing: true,
      expensesIncomes: true,
      chartOfAccounts: true,
      autoJournalEntries: true,
      costCenters: true,
      assetsDepreciation: true,
      ledgerReports: true,
      chequesCycle: true,
      treasuriesBanks: 'Unlimited',
      financialStatements: true,
      employees: 'ر.س2.2 /month/per each',
      payroll: true,
      attendanceManagement: true,
      contracts: true,
      organizationStructure: true,
      workflow: true,
      extraUsers: 'ر.س6 /month/per extra',
      extraBranches:'ر.س20 /month/per extra',
    },
  },
  {
    name: 'Enterprise',
    color: 'text-[#774A67]',
    price: { monthly: '', yearly: '', yearlyTotal: '' },
    features: {
      invoices: '',
      cloudPOS: '',
      priceList: '',
      offers: '',
      targetCommissions: '',
      installments: '',
      loyaltyPoints: '',
      offlinePOSTerminals: '',
      extraTerminals: '',
      clients: '',
      followUpClients: '',
      membership: '',
      sms: '',
      unlimitedProducts: '',
      purchases: '',
      suppliersManagement: '',
      trackStock: '',
      stocktaking: '',
      trackSerialLotExpiryDate: '',
      bundles: '',
      purchaseCycle: '',
      expensesDistribution: '',
      manufacturing: '',
      expensesIncomes: '',
      chartOfAccounts: '',
      autoJournalEntries: '',
      costCenters: '',
      assetsDepreciation: '',
      ledgerReports: '',
      chequesCycle: '',
      treasuriesBanks: '',
      financialStatements: '',
      employees: '',
      payroll: '',
      attendanceManagement: '',
      contracts: '',
      organizationStructure: '',
      workflow: '',
      extraUsers: '',
      extraBranches: '',
      contact: true,
    },
  },
];

// Add a type for features
interface FeatureRow {
  label: string;
  key: string;
  isEnterpriseContact?: boolean;
}

const featureRows: { section: string; features: FeatureRow[] }[] = [
  {
    section: 'Sales Management',
    features: [
      { label: 'Invoices & Quotes', key: 'invoices' },
      { label: 'Cloud POS', key: 'cloudPOS' },
      { label: 'Price List', key: 'priceList' },
      { label: 'Offers', key: 'offers' },
      { label: 'Target & commissions', key: 'targetCommissions' },
      { label: 'Installments Management', key: 'installments' },
      { label: 'Loyalty Points', key: 'loyaltyPoints' },
      { label: 'Offline POS Terminals', key: 'offlinePOSTerminals' },
    ],
  },
  {
    section: 'Customer Relationship Management',
    features: [
      { label: 'Clients', key: 'clients' },
      { label: 'Follow Up Clients', key: 'followUpClients' },
      { label: 'Membership Management', key: 'membership' },
      { label: 'SMS Integration', key: 'sms' },
    ],
  },
  {
    section: 'Inventory And Purchases Management',
    features: [
      { label: 'Unlimited Products Count', key: 'unlimitedProducts' },
      { label: 'Purchases Management', key: 'purchases' },
      { label: 'Suppliers Management', key: 'suppliersManagement' },
      { label: 'Track Stock', key: 'trackStock' },
      { label: 'Stocktaking', key: 'stocktaking' },
      { label: 'Track Serial / Lot / Expiry Date', key: 'trackSerialLotExpiryDate' },
      { label: 'Bundles', key: 'bundles' },
      { label: 'Purchase Cycle', key: 'purchaseCycle' },
    ],
  },
  {
    section: 'Accounting Management',
    features: [
      { label: 'Expenses & Incomes', key: 'expensesIncomes' },
      { label: 'Chart of accounts', key: 'chartOfAccounts' },
      { label: 'Auto Journal Entries', key: 'autoJournalEntries' },
      { label: 'Cost Centers', key: 'costCenters' },
      { label: 'Assets & Depreciation', key: 'assetsDepreciation' },
      { label: 'Ledger Reports', key: 'ledgerReports' },
      { label: 'Cheques Cycle', key: 'chequesCycle' },
      { label: 'Treasuries & Banks', key: 'treasuriesBanks' },
      { label: 'Financial Statements', key: 'financialStatements' },
    ],
  },
  {
    section: 'Human Resources Management',
    features: [
      { label: 'Employees', key: 'employees' },
      { label: 'Payroll', key: 'payroll' },
      { label: 'Attendance Management', key: 'attendanceManagement' },
      { label: 'Contracts', key: 'contracts' },
      { label: 'Organization Structure', key: 'organizationStructure' },
    ],
  },
  {
    section: 'Operation Management',
    features: [
      { label: 'Workflow', key: 'workflow' },
    ],
  },
  {
    section: 'General',
    features: [
      { label: 'Extra Users', key: 'extraUsers' },
      { label: 'Extra Branches', key: 'extraBranches' },
    ],
  },
];

// Add this helper function at the top, after imports
function getDynamicPrice(planName: string, type: string, defaultValue: number | string) {
  try {
    const pricingAmounts = JSON.parse(localStorage.getItem('pricingAmounts') || '{}');
    if (pricingAmounts[planName] && pricingAmounts[planName][type] !== undefined) {
      return pricingAmounts[planName][type];
    }
  } catch (e) {}
  return defaultValue;
}

const PricingPage: React.FC = () => {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated/blurred background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      {/* Extra animated SVG blob */}
      <svg className="absolute top-24 left-0 w-60 h-60 opacity-20 z-0 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#8b5cf6" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute top-20 right-0 w-60 h-60 opacity-20 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#3b82f6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
      </svg>
      <Navbar />
      {/* Heading Section */}
      <div className="relative pt-32 pb-10 flex flex-col items-center justify-center text-center bg-transparent z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-[#232F3E] dark:text-white flex items-center justify-center gap-4">
          <span className="hidden md:inline-block relative -left-4">
            <svg width="48" height="48" viewBox="0 0 200 200" className="opacity-40" xmlns="http://www.w3.org/2000/svg">
              <path fill="#774A67" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
            </svg>
          </span>
          Start for <span className="text-[#774A67]">free</span><br className="md:hidden" />Pick a plan later.
          <span className="hidden md:inline-block relative -right-4">
            <svg width="48" height="48" viewBox="0 0 200 200" className="opacity-40" xmlns="http://www.w3.org/2000/svg">
              <path fill="#3b82f6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
            </svg>
          </span>
        </h1>
        <p className="text-lg text-[#232F3E] dark:text-gray-300 mt-2">
          14 Days Trial, Cancel anytime, Upgrade as you grow.
        </p>
      </div>
      {/* Billing Toggle */}
      <div className="flex justify-center items-center gap-6 mb-8">
        <span className={`font-medium ${billing === 'monthly' ? 'text-[#232F3E]' : 'text-gray-400'}`}>Billed Monthly</span>
        <button
          className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${billing === 'yearly' ? 'bg-[#40B93C]' : 'bg-gray-300'}`}
          onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
        >
          <span
            className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${billing === 'yearly' ? 'translate-x-7' : ''}`}
            style={{ transform: billing === 'yearly' ? 'translateX(28px)' : 'translateX(0)' }}
          />
        </button>
        <span className={`font-medium ${billing === 'yearly' ? 'text-[#40B93C]' : 'text-gray-400'}`}>Yearly <span className="font-bold"> (2 Months Free)</span></span>
      </div>
      {/* Pricing Table */}
      <div className="overflow-x-auto px-4 md:px-16 lg:px-32">
        <div className="sticky top-[70px] z-50 bg-white dark:bg-[#18181b] py-6 border-b border-gray-200 dark:border-gray-700">
          <table className="min-w-[900px] w-full border border-gray-200 dark:border-gray-700 border-separate border-spacing-0 bg-white dark:bg-[#18181b] rounded-xl shadow-lg">
            <thead className="sticky top-0 z-50">
              <tr>
                <th className="bg-white dark:bg-[#18181b] text-left px-6 py-6 text-lg font-bold text-[#232F3E] dark:text-white border-b-2 border-gray-200 dark:border-gray-700 border-r border-gray-200 dark:border-gray-700 sticky top-0 z-50"> </th>
                {plans.map((plan, idx) => (
                  <th
                    key={plan.name}
                    className={`bg-white dark:bg-[#18181b] px-6 py-6 text-center border-b-2 border-gray-200 dark:border-gray-700 border-r last:border-r-0 ${plan.color} sticky top-0 z-50`}
                  >
                    <div className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
                      <span className={plan.color}>{plan.name}</span>
                      {plan.name === 'Premium' && <span className="ml-1 text-xs font-semibold text-[#40B93C] bg-[#e6f9e6] px-2 py-1 rounded">Best value</span>}
                    </div>
                    {plan.name === 'Enterprise' && (
                      <div className="mb-3 flex justify-center">
                        <a href="mailto:contact@alphax.com" className="inline-block bg-[#774A67] text-white px-4 py-2 rounded font-semibold hover:bg-[#5e3752] transition">Contact Alphax Team</a>
                      </div>
                    )}
                    <div className="flex items-center justify-center gap-1">
                      {plan.price && typeof plan.price[billing] === 'number' && (
                        <>
                          <img src={RiyalSymbol} alt="SAR" className="w-5 h-5 inline-block" />
                          <span className="text-3xl font-extrabold">
                            {getDynamicPrice(plan.name, billing, plan.price[billing])}
                          </span>
                          <span className="text-base font-medium text-gray-400">/mo</span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {plan.price && typeof plan.price[billing] === 'number' ? (
                        <>Billed <span className="font-bold text-[#2563eb]">{
                          billing === 'monthly'
                            ? (typeof plan.price.monthly === 'number' ? `SAR ${(plan.price.monthly * 12).toFixed(0)}` : '')
                            : (typeof plan.price.yearlyTotal === 'number' ? `SAR ${plan.price.yearlyTotal}` : '')
                        }</span> per year</>
                      ) : null}
                    </div>
                    {/* Upgrade Button - Only show for non-Enterprise plans */}
                    {plan.name !== 'Enterprise' && (
                      <button
                        className="mt-4 mb-1 px-6 py-2 bg-[#774A67] hover:bg-[#5e3752] text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#774A67] focus:ring-offset-2"
                      >
                        Upgrade
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureRows.map((section, sIdx) => (
                <React.Fragment key={section.section}>
                  <tr>
                    <td colSpan={plans.length + 1} className="bg-gray-50 dark:bg-[#232F3E] text-lg font-bold px-6 py-4 border-t border-b border-gray-200 dark:border-gray-700 text-left border-r border-l border-gray-200 dark:border-gray-700">
                      {section.section}
                    </td>
                  </tr>
                  {section.features.map((feature, fIdx) => (
                    <tr key={feature.key} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-6 py-4 text-[#232F3E] dark:text-white font-medium text-left border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b]">
                        {feature.label}
                      </td>
                      {plans.map((plan, pIdx) => {
                        if (feature.isEnterpriseContact && plan.name === 'Enterprise') {
                          return (
                            <td key={plan.name} className="px-6 py-4 text-center border-r last:border-r-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b]">
                              <a href="mailto:contact@alphax.com" className="inline-block bg-[#774A67] text-white px-4 py-2 rounded font-semibold hover:bg-[#5e3752] transition">Contact Alphax Team</a>
                            </td>
                          );
                        } else if (feature.isEnterpriseContact) {
                          return <td key={plan.name} className="px-6 py-4 text-center border-r last:border-r-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b]"></td>;
                        }
                        const value = plan.features[feature.key as keyof typeof plan.features];
                        let display;
                        if (typeof value === 'boolean') {
                          display = value ? <span className="text-[#40B93C] text-2xl font-bold">&#10003;</span> : <span className="text-gray-500 text-2xl font-bold">&#10007;</span>;
                        } else if (typeof value === 'string' && value.includes('ر.س')) {
                          display = <span className="text-[#232F3E] dark:text-white font-semibold"><img src={RiyalSymbol} alt="SAR" className="w-5 h-5 inline-block mr-1" />{value.replace('ر.س', '')}</span>;
                        } else {
                          display = <span className="text-[#232F3E] dark:text-white font-semibold">{value}</span>;
                        }
                        return (
                          <td key={plan.name} className="px-6 py-4 text-center border-r last:border-r-0 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#18181b]">
                            {display}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-12 text-center">
        <p className="text-gray-600 dark:text-gray-300">
          All plans include a 14-day free trial. Cancel anytime, Upgrade as you grow.
        </p>
      </div>
    </section>
  );
};

export default PricingPage; 