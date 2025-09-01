import React, { useEffect, useState, useRef } from 'react';
import { withApiAuthHeaders } from '@api/authHeaders';
import { motion } from 'framer-motion';
import { FiDownload } from 'react-icons/fi';
import DashboardNavbar from './DashboardNavbar';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PurchaseOrder {
  name: string;
  supplier: string;
  transaction_date: string;
  status: string;
  grand_total: number;
}

const PurchaseOrders: React.FC = () => {
  // Navbar state (copied from ClientDashboard)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showPaymentList, setShowPaymentList] = useState(false);
  const daysLeft = 5;
  const userEmail = localStorage.getItem('user') || 'User';
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = (path: string) => window.location.assign(path);
  const handleClientLogout = () => {
    localStorage.removeItem('user');
    window.location.assign('/');
  };

  useEffect(() => {
    if (!isProfileOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileOpen]);

  // Purchase Orders logic
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userId = localStorage.getItem('user');

  useEffect(() => {
    const fetchPurchaseOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.purchase_orders.get_user_purchase_orders', {
          method: 'POST',
          headers: withApiAuthHeaders(),
          credentials: 'include',
          body: JSON.stringify({}),
        });
        if (!res.ok) throw new Error('Failed to fetch purchase orders');
        const data = await res.json();
        if (data.message && data.message.status === 'success') {
          setOrders(data.message.data || []);
        } else {
          setError((data.message && data.message.message) || 'Unknown error');
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchPurchaseOrders();
    else setError('User not found in localStorage');
  }, [userId]);

  // Download PDF functionality
  const handleDownloadPDF = () => {
    if (!orders.length) return;
    const doc = new jsPDF();
    const tableColumn = ['Order Name', 'Supplier', 'Transaction Date', 'Status', 'Grand Total'];
    const tableRows = orders.map(order => [order.name, order.supplier, order.transaction_date, order.status, order.grand_total]);
    autoTable(doc, { head: [tableColumn], body: tableRows, styles: { fontSize: 10 } });
    doc.save('purchase_orders.pdf');
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c] overflow-hidden">
      {/* Animated SVG blobs */}
      <svg className="absolute -top-24 -left-24 w-80 h-80 opacity-20 z-0 animate-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute top-1/3 right-0 w-64 h-64 opacity-10 z-0 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-0 left-1/4 w-56 h-56 opacity-15 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      {/* Navbar */}
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
      />
      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="w-full max-w-5xl mx-auto rounded-3xl bg-white/60 dark:bg-[#23232a]/70 shadow-2xl border border-white/60 dark:border-[#774A67]/30 backdrop-blur-xl p-8 md:p-12 flex flex-col items-center text-center animate-fadein relative"
          style={{ boxShadow: '0 8px 40px 0 rgba(119,74,103,0.10), 0 1.5px 8px 0 rgba(119,74,103,0.10)' }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black dark:text-white bg-gradient-to-r from-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent drop-shadow-md">
             Purchase Orders
          </h2>
          {loading && <div className="py-12 text-lg text-gray-600 dark:text-gray-300">Loading...</div>}
          {error && <div className="text-red-600 mb-4">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto w-full mt-2">
              <table className="min-w-full bg-white/80 dark:bg-[#18181c]/80 border-2 border-[#774A67] dark:border-[#8b5cf6] rounded-2xl shadow-xl overflow-hidden">
                <thead className="bg-gradient-to-r from-[#f7f8fa] to-[#e9eaf3] dark:from-[#23232a] dark:to-[#18181c]">
                  <tr>
                    <th className="px-6 py-4 border-b-2 border-[#774A67] dark:border-[#8b5cf6] text-lg font-bold text-[#774A67] dark:text-[#8b5cf6]">Order Name</th>
                    <th className="px-6 py-4 border-b-2 border-[#774A67] dark:border-[#8b5cf6] text-lg font-bold text-[#774A67] dark:text-[#8b5cf6]">Supplier</th>
                    <th className="px-6 py-4 border-b-2 border-[#774A67] dark:border-[#8b5cf6] text-lg font-bold text-[#774A67] dark:text-[#8b5cf6]">Transaction Date</th>
                    <th className="px-6 py-4 border-b-2 border-[#774A67] dark:border-[#8b5cf6] text-lg font-bold text-[#774A67] dark:text-[#8b5cf6]">Status</th>
                    <th className="px-6 py-4 border-b-2 border-[#774A67] dark:border-[#8b5cf6] text-lg font-bold text-[#774A67] dark:text-[#8b5cf6]">Grand Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500 text-lg">No purchase orders found.</td>
                    </tr>
                  ) : (
                    orders.map((order, idx) => (
                      <motion.tr
                        key={order.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="hover:bg-gradient-to-r hover:from-[#f7e6f7] hover:to-[#e9eaf3] dark:hover:from-[#23232a] dark:hover:to-[#18181c] transition-colors duration-200"
                      >
                        <td className="px-6 py-4 border-b border-[#774A67] dark:border-[#8b5cf6] font-semibold text-gray-900 dark:text-white">{order.name}</td>
                        <td className="px-6 py-4 border-b border-[#774A67] dark:border-[#8b5cf6] text-gray-700 dark:text-gray-300">{order.supplier}</td>
                        <td className="px-6 py-4 border-b border-[#774A67] dark:border-[#8b5cf6] text-gray-700 dark:text-gray-300">{order.transaction_date}</td>
                        <td className="px-6 py-4 border-b border-[#774A67] dark:border-[#8b5cf6]">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'To Receive and Bill' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>{order.status}</span>
                        </td>
                        <td className="px-6 py-4 border-b border-[#774A67] dark:border-[#8b5cf6] text-gray-900 dark:text-white font-bold">{order.grand_total}</td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
        {/* Download Button - fixed at bottom right of screen */}
        <button
          onClick={handleDownloadPDF}
          className="fixed bottom-8 right-8 z-50 flex items-center justify-center p-4 bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white rounded-full shadow-xl hover:shadow-2xl hover:from-[#8b5cf6] hover:to-[#774A67] transition-all duration-300 transform hover:scale-110"
          title="Download PDF"
        >
          <FiDownload className="w-7 h-7" />
        </button>
      </div>
    </div>
  );
};

export default PurchaseOrders; 