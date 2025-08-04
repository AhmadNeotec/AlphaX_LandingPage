import React from 'react';

const STOCK_ALERT_DATA = [
  { code: 'AP-000002', name: 'Celeron Silver N5030 15.6"', quantity: '21 Pcs', alert: '10 Pcs' },
  { code: 'AP-000001', name: 'Pentium Silver N5030 15.6"', quantity: '22 Pcs', alert: '10 Pcs' },
  { code: 'AP-000003', name: 'Inspiron 15 3510 Intel Celeron', quantity: '23 Pcs', alert: '10 Pcs' },
];

const StockAlert: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-[#23232a] rounded-2xl shadow-xl border border-gray-200 dark:border-[#774A67]/30 p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Stock Alert</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-[#23232a] rounded-xl overflow-hidden">
          <thead className="bg-gray-100 dark:bg-[#18181c]">
            <tr>
              <th className="px-4 py-2 border-b font-bold text-gray-700 dark:text-gray-200 text-center">#</th>
              <th className="px-4 py-2 border-b font-bold text-gray-700 dark:text-gray-200 text-left">Code</th>
              <th className="px-4 py-2 border-b font-bold text-gray-700 dark:text-gray-200 text-left">Name</th>
              <th className="px-4 py-2 border-b font-bold text-gray-700 dark:text-gray-200 text-center">Quantity</th>
              <th className="px-4 py-2 border-b font-bold text-gray-700 dark:text-gray-200 text-center">Alert Quantity</th>
            </tr>
          </thead>
          <tbody>
            {STOCK_ALERT_DATA.map((row, idx) => (
              <tr key={row.code} className="hover:bg-gray-50 dark:hover:bg-[#23232a]/60 transition-colors">
                <td className="px-4 py-2 border-b text-center">{idx + 1}</td>
                <td className="px-4 py-2 border-b font-semibold">{row.code}</td>
                <td className="px-4 py-2 border-b text-blue-600 dark:text-blue-400 font-medium">
                  <a href="#" className="hover:underline">{row.name}</a>
                </td>
                <td className="px-4 py-2 border-b text-center">{row.quantity}</td>
                <td className="px-4 py-2 border-b text-center">{row.alert}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockAlert; 