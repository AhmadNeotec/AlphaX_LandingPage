import React, { useState } from 'react';
import Navbar from '../components/sections/Navbar';
import Footer from '../components/sections/Footer';

const pricingData = {
  monthly: {
    columns: [
      { label: 'Module', key: 'module' },
      { label: '1 Month', key: 'm1' },
      { label: '3 Months', key: 'm3' },
    ],
    rows: [
      { module: 'Accounting', m1: 440, m3: 425 },
      { module: 'Sales (B2B)', m1: 386, m3: 371 },
      { module: 'Purchase/Procurement', m1: 386, m3: 371 },
      { module: 'POS (B2C)', m1: 386, m3: 371 },
    ],
    total: { m1: 1212, m3: 1167 },
  },
  yearly: {
    columns: [
      { label: 'Module', key: 'module' },
      { label: 'Module Price per year (SAR)', key: 'yearPrice' },
      { label: '1 Year', key: 'y1' },
      { label: '2 Years', key: 'y2' },
      { label: '3 Years', key: 'y3' },
      { label: '5 Years', key: 'y5' },
    ],
    rows: [
      { module: 'Accounting', yearPrice: 375, y1: 375, y2: 345, y3: 337.5, y5: 330 },
      { module: 'Sales (B2B)', yearPrice: 321, y1: 321, y2: 235.32, y3: 283.9, y5: 292.48 },
      { module: 'Purchase/Procurement', yearPrice: 321, y1: 321, y2: 295.32, y3: 283.9, y5: 282.48 },
      { module: 'POS (B2C)', yearPrice: 321, y1: 321, y2: 235.32, y3: 283.9, y5: 292.48 },
    ],
    total: { yearPrice: 1338, y1: 1017, y2: 935.64, y3: 915.3, y5: 894.96 },
  },
  longterm: {
    columns: [
      { label: 'Module', key: 'module' },
      { label: '2 Years', key: 'y2' },
      { label: '3 Years', key: 'y3' },
      { label: '5 Years', key: 'y5' },
    ],
    rows: [
      { module: 'Accounting', y2: 345, y3: 337.5, y5: 330 },
      { module: 'Sales (B2B)', y2: 235.32, y3: 283.9, y5: 292.48 },
      { module: 'Purchase/Procurement', y2: 295.32, y3: 283.9, y5: 282.48 },
      { module: 'POS (B2C)', y2: 235.32, y3: 283.9, y5: 292.48 },
    ],
    total: { y2: 935.64, y3: 915.3, y5: 894.96 },
  },
};

const tabOptions = [
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
  { key: 'longterm', label: 'Long-term' },
];

const PricinglistPage: React.FC = () => {
  const [tab, setTab] = useState<'monthly' | 'yearly' | 'longterm'>('monthly');
  const { columns, rows, total } = pricingData[tab];

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
                onClick={() => setTab(t.key as any)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="overflow-x-auto rounded-lg">
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
                  <tr key={row.module} className={`text-[#232F3E] dark:text-white text-base font-medium ${idx % 2 === 1 ? 'bg-[#f4f6fa] dark:bg-[#23232a]' : 'bg-white dark:bg-[#23232a]'}`}>
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4 font-semibold">
                        {(row as any)[col.key] !== undefined ? (row as any)[col.key] : '-'}
                      </td>
                    ))}
                  </tr>
                ))}
                {/* Total row */}
                <tr className="bg-[#232F3E] dark:bg-[#18181b] text-white font-bold">
                  <td className="px-6 py-4">TOTAL Cost</td>
                  {columns.slice(1).map((col) => (
                    <td key={col.key} className="px-6 py-4">
                      {(total as any)[col.key] !== undefined ? (total as any)[col.key] : '-'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </section>
  );
};

export default PricinglistPage; 