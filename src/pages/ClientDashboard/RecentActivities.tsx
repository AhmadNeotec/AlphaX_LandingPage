import React, { useState } from 'react';

const TABS = [
  { label: 'Invoices' },
  { label: 'Purchases' },
  { label: 'Expenses' },
  { label: 'Transactions' },
];

const INVOICES_DATA = [
  {
    invoiceNo: 'AP-6',
    invoiceDate: '2nd Dec, 2024',
    client: 'Reed Montoya',
    subtotal: '﷼37450.00',
    netTotal: '﷼28836.50',
    totalDue: '﷼0',
    status: 'Active',
    link: '#',
  },
  {
    invoiceNo: 'AP-5',
    invoiceDate: '2nd Dec, 2024',
    client: 'Walking Customer',
    subtotal: '﷼18725.00',
    netTotal: '﷼22408.25',
    totalDue: '﷼2408.25',
    status: 'Active',
    link: '#',
  },
  {
    invoiceNo: 'AP-4',
    invoiceDate: '2nd Dec, 2024',
    client: 'Ruth Miles',
    subtotal: '﷼18725.00',
    netTotal: '﷼16478.00',
    totalDue: '﷼16478.00',
    status: 'Active',
    link: '#',
  },
  {
    invoiceNo: 'AP-3',
    invoiceDate: '2nd Nov, 2024',
    client: 'Troy Walker',
    subtotal: '﷼18725.00',
    netTotal: '﷼20597.50',
    totalDue: '﷼20597.50',
    status: 'Active',
    link: '#',
  },
  {
    invoiceNo: 'AP-2',
    invoiceDate: '2nd Oct, 2024',
    client: 'Ciaran Buck',
    subtotal: '﷼18725.00',
    netTotal: '﷼20597.50',
    totalDue: '﷼20597.50',
    status: 'Active',
    link: '#',
  },
  {
    invoiceNo: 'AP-1',
    invoiceDate: '2nd Sep, 2024',
    client: 'Troy Walker',
    subtotal: '﷼18725.00',
    netTotal: '﷼20597.50',
    totalDue: '﷼5597.50',
    status: 'Active',
    link: '#',
  },
];

const PURCHASES_DATA = [
  {
    purchaseNo: 'AP-5',
    date: '20th Apr, 2022',
    supplier: 'Carla Bender',
    subtotal: '﷼58600.00',
    netTotal: '﷼64460.00',
    totalDue: '﷼64460.00',
    status: 'Active',
    link: '#',
  },
  {
    purchaseNo: 'AP-4',
    date: '2nd Dec, 2024',
    supplier: 'Carla Bender',
    subtotal: '﷼31377.50',
    netTotal: '﷼31377.50',
    totalDue: '﷼0',
    status: 'Active',
    link: '#',
  },
  {
    purchaseNo: 'AP-3',
    date: '2nd Nov, 2024',
    supplier: 'Quyn Erickson',
    subtotal: '﷼31250.00',
    netTotal: '﷼34675.00',
    totalDue: '﷼4675.00',
    status: 'Active',
    link: '#',
  },
  {
    purchaseNo: 'AP-2',
    date: '2nd Oct, 2024',
    supplier: 'Amir Vega',
    subtotal: '﷼29800.00',
    netTotal: '﷼16390.00',
    totalDue: '﷼0',
    status: 'Active',
    link: '#',
  },
  {
    purchaseNo: 'AP-1',
    date: '2nd Sep, 2024',
    supplier: 'Jemima Hoffman',
    subtotal: '﷼29800.00',
    netTotal: '﷼26724.00',
    totalDue: '﷼26724.00',
    status: 'Active',
    link: '#',
  },
];

const EXPENSES_DATA = [
  {
    subCategory: 'Office Rent [AES-1]',
    expenseReason: 'April Office Rent',
    expenseReasonLink: '#',
    amount: '﷼20000.00',
    account: 'Islami Bank Bangladesh Ltd[IBBL-0002]',
    date: '2nd Dec, 2024',
    status: 'Active',
  },
  {
    subCategory: 'Office Stationary [AES-2]',
    expenseReason: 'Sticky Notes Purchase',
    expenseReasonLink: '#',
    amount: '﷼1000.00',
    account: 'Cash[CASH-0001]',
    date: '2nd Dec, 2024',
    status: 'Active',
  },
];

const TRANSACTIONS_DATA = [
  {
    reason: '[DBBL-0001] Loan Payment sent from [DBBL-0003]',
    date: '22nd Apr, 2022',
    type: 'Debit',
    account: 'Dutch Bangla Bank[DBBL-0003]',
    amount: '﷼4522.73',
    status: 'Active',
  },
  {
    reason: '[DBBL-0001] Loan Payment sent from [DBBL-0003]',
    date: '17th Feb, 2022',
    type: 'Debit',
    account: 'Dutch Bangla Bank[DBBL-0003]',
    amount: '﷼4522.73',
    status: 'Active',
  },
  {
    reason: '[DBBL-0001] Loan Payment sent from [DBBL-0003]',
    date: '17th Feb, 2022',
    type: 'Debit',
    account: 'Dutch Bangla Bank[DBBL-0003]',
    amount: '﷼4522.73',
    status: 'Active',
  },
  {
    reason: '[DBBL-0001] Loan Payment sent from [DBBL-0003]',
    date: '28th Jan, 2022',
    type: 'Debit',
    account: 'Dutch Bangla Bank[DBBL-0003]',
    amount: '﷼4522.73',
    status: 'Active',
  },
  {
    reason: '[IBBL-0001] Loan added to [IBBL-0002]',
    date: '9th Mar, 2022',
    type: 'Credit',
    account: 'Islami Bank Bangladesh Ltd[IBBL-0002]',
    amount: '﷼100000.00',
    status: 'Active',
  },
  {
    reason: '[DBBL-0001] Loan added to [DBBL-0003]',
    date: '2nd Dec, 2024',
    type: 'Credit',
    account: 'Dutch Bangla Bank[DBBL-0003]',
    amount: '﷼100000.00',
    status: 'Active',
  },
];

const RecentActivities: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  // For now, only Invoices tab is implemented with mock data
  const renderTable = () => {
    if (activeTab === 0) {
      return (
        <div key="invoices">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Invoice No</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Invoice Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Client</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Subtotal</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Net Total</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Total Due</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {INVOICES_DATA.map((row, idx) => (
                  <tr key={`invoices-${row.invoiceNo}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <a href={row.link} className="text-[#774A67] font-semibold hover:underline">{row.invoiceNo}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.invoiceDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.client}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.subtotal}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.netTotal}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.totalDue}</td>
                    <td className="px-4 py-3 text-sm">
                      {parseFloat(row.totalDue.replace(/[^\d.-]/g, '')) === 0 ? (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Paid</span>
                      ) : (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Unpaid</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (activeTab === 1) {
      return (
        <div key="purchases">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Purchase No</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Supplier</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Subtotal</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Net Total</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Total Due</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {PURCHASES_DATA.map((row, idx) => (
                  <tr key={`purchases-${row.purchaseNo}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm">
                      <a href={row.link} className="text-[#774A67] font-semibold hover:underline">{row.purchaseNo}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.date}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.supplier}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.subtotal}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.netTotal}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.totalDue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (activeTab === 2) {
      return (
        <div key="expenses">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Sub Category</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Expense Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Account</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {EXPENSES_DATA.map((row, idx) => (
                  <tr key={`expenses-${row.subCategory}-${row.expenseReason}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.subCategory}</td>
                    <td className="px-4 py-3 text-sm">
                      <a href={row.expenseReasonLink} className="text-[#774A67] font-semibold hover:underline">{row.expenseReason}</a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.amount}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.account}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    if (activeTab === 3) {
      return (
        <div key="transactions">
          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm mt-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">#</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Account</th>
                  <th className="px-4 py-3 text-left text-xs font-bold text-gray-700">Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {TRANSACTIONS_DATA.map((row, idx) => (
                  <tr key={`transactions-${row.reason}-${row.date}-${row.type}`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{idx + 1}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.reason}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mr-1 ${row.type === 'Debit' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-[#8b5cf6]/10 text-[#774A67] border-[#8b5cf6]/30'}`}>{row.type}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.account}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
    // Placeholder for other tabs
    return (
      <div className="py-12 text-center text-gray-400">No data available for this tab yet.</div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mt-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
      <div className="flex space-x-6 border-b border-gray-200 mb-2">
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            className={`px-2 pb-2 text-base font-semibold transition-colors border-b-2 ${
              activeTab === idx
                ? 'border-[#8b5cf6] text-[#774A67]'
                : 'border-transparent text-gray-500 hover:text-[#774A67]'
            }`}
            onClick={() => setActiveTab(idx)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {renderTable()}
    </div>
  );
};

export default RecentActivities; 