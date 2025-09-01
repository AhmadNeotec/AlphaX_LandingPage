import React, { useState, useEffect } from 'react';
import { withApiAuthHeaders } from '@api/authHeaders';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';

const tabOptions = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
  { key: 'longterm', label: 'Long-term' },
];

type TabKey = 'monthly' | 'yearly' | 'longterm';

const columnsConfig: Record<TabKey, { label: string; key: string }[]> = {
  monthly: [
    { label: 'Module', key: 'module_name' },
    { label: '1 Month', key: 'm1' },
    { label: '3 Months', key: 'm3' },
  ],
  yearly: [
    { label: 'Module', key: 'module_name' },
    { label: 'Module Price per year (SAR)', key: 'year_price' },
    { label: '1 Year', key: 'y1' },
    { label: '2 Years', key: 'y2' },
    { label: '3 Years', key: 'y3' },
    { label: '5 Years', key: 'y5' },
  ],
  longterm: [
    { label: 'Module', key: 'module_name' },
    { label: '2 Years', key: 'y2' },
    { label: '3 Years', key: 'y3' },
    { label: '5 Years', key: 'y5' },
  ],
};

const PricinglistPage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('monthly');
  const [pricingRows, setPricingRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPricing = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.ModulePricing.get_module_pricing', {
          method: 'GET',
          headers: withApiAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch pricing data');
        const data = await res.json();
        // Filter out disabled modules
        const enabledModules = (data.message || []).filter((module: any) => {
          const disabled = module.disabled === 1 || module.disabled === "1" || module.disabled === true || module.disabled === "true";
          return !disabled;
        });
        setPricingRows(enabledModules);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  // Calculate totals for each tab
  const getTotals = (rows: any[], tab: TabKey) => {
    const keys = columnsConfig[tab].slice(1).map((col: { label: string; key: string }) => col.key);
    const totals: Record<string, number> = {};
    keys.forEach((key: string) => {
      totals[key] = rows.reduce((sum, row) => {
        const val = parseFloat(row[key]);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);
    });
    return totals;
  };

  const columns = columnsConfig[tab];
  const rows = pricingRows;
  const total = getTotals(rows, tab);

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated SVG blobs */}
      <svg className="absolute top-0 -left-20 w-96 h-96 opacity-20 z-0 animate-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-0 -right-20 w-96 h-96 opacity-20 z-0 animate-blob animation-delay-2000" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#60A5FA" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute top-1/4 -right-20 w-96 h-96 opacity-20 z-0 animate-blob animation-delay-4000" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-1/4 -left-20 w-96 h-96 opacity-20 z-0 animate-blob animation-delay-6000" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#60A5FA" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center relative z-10">
        <div className="w-full max-w-6xl bg-white dark:bg-[#23232a] rounded-2xl shadow-lg p-6 md:p-10 mt-20">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-[#232F3E] dark:text-white">Module Pricing</h1>
          <div className="flex gap-3 mb-8 justify-center">
            {tabOptions.map((t) => (
              <button
                key={t.key}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 focus:outline-none ring-2 ${tab === t.key ? 'bg-[#2563eb] text-white ring-[#2563eb] scale-105 shadow' : 'bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#2a2a33]'}`}
                onClick={() => setTab(t.key as TabKey)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg">
            {loading ? (
              <div className="text-center py-8 text-lg font-semibold">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600 font-semibold">{error}</div>
            ) : (
              <table className="min-w-full text-left border border-gray-200 dark:border-gray-700 border-separate border-spacing-0 bg-white dark:bg-[#23232a] rounded-xl shadow-lg">
                <thead>
                  <tr className="text-[#232F3E] dark:text-white text-base font-bold">
                    {columns.map((col) => (
                      <th key={col.key} className="px-6 py-4 whitespace-nowrap">{col.label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, idx) => (
                    <tr key={row.module_name} className={`text-[#232F3E] dark:text-white text-base font-medium ${idx % 2 === 1 ? 'bg-[#f4f6fa] dark:bg-[#23232a]' : 'bg-white dark:bg-[#23232a]'}`}>
                      {columns.map((col) => (
                        <td key={col.key} className="px-6 py-4 font-semibold">
                          {row[col.key] !== undefined && row[col.key] !== null ? row[col.key] : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Total row */}
                  <tr className="bg-[#232F3E] dark:bg-[#18181b] text-white font-bold">
                    <td className="px-6 py-4">TOTAL Cost</td>
                    {columns.slice(1).map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        {total[col.key] !== undefined ? total[col.key].toFixed(2) : '-'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
};

export default PricinglistPage; 