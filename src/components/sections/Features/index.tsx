import { motion } from 'framer-motion';
import { FaChartLine, FaMoneyCheckAlt, FaBoxes, FaUsers, FaCogs, FaHandshake, FaFileInvoice, FaCashRegister, FaTags, FaUserFriends, FaBullseye, FaShieldAlt, FaUserCheck, FaCalendarCheck, FaIdBadge, FaCoins, FaTruck, FaClipboardList, FaWarehouse, FaUserTie, FaFileContract, FaCheckSquare, FaClock } from 'react-icons/fa';
import React, { useState } from 'react';
import CTABanner from '../../CTABanner';

const BUSINESS_APPS = [
  {
    icon: <FaChartLine className="text-purple-500 text-3xl drop-shadow-lg" />,
    title: 'Sales',
    desc: 'Invoicing, POS, Sales Commission, Insurance Management, Offers, Installments',
    color: 'from-purple-200 to-purple-400',
    features: [
      { icon: <FaFileInvoice />, text: 'Professional Invoicing' },
      { icon: <FaCashRegister />, text: 'Cloud POS System' },
      { icon: <FaTags />, text: 'Dynamic Pricing' },
      { icon: <FaUserFriends />, text: 'Installment Plans' },
      { icon: <FaBullseye />, text: 'Sales Targets' },
      { icon: <FaShieldAlt />, text: 'Insurance Integration' }
    ]
  },
  {
    icon: <FaMoneyCheckAlt className="text-green-500 text-3xl drop-shadow-lg" />,
    title: 'Accounting',
    desc: 'Expenses, Tax, Treasuries, Cheque Cycle, Chart of Accounts, Journals, Assets, Cost Centers, General Ledger, Financial Reports',
    color: 'from-green-200 to-green-400',
    features: [
      { icon: <FaFileInvoice />, text: 'Chart of Accounts' },
      { icon: <FaMoneyCheckAlt />, text: 'Expense Tracking' },
      { icon: <FaBoxes />, text: 'Asset Management' },
      { icon: <FaCogs />, text: 'Cost Centers' },
      { icon: <FaCoins />, text: 'Financial Reports' },
      { icon: <FaCheckSquare />, text: 'Tax Management' }
    ]
  },
  {
    icon: <FaBoxes className="text-pink-500 text-3xl drop-shadow-lg" />,
    title: 'Inventory',
    desc: 'Stock Tracking, Barcode, Purchases, Suppliers, Warehouses, Stocktaking, Requisitions, Price Lists',
    color: 'from-pink-200 to-pink-400',
    features: [
      { icon: <FaTruck />, text: 'Stock Tracking' },
      { icon: <FaClipboardList />, text: 'Barcode System' },
      { icon: <FaWarehouse />, text: 'Warehouse Management' },
      { icon: <FaBoxes />, text: 'Purchase Orders' },
      { icon: <FaUserTie />, text: 'Supplier Portal' },
      { icon: <FaCheckSquare />, text: 'Stocktaking' }
    ]
  },
  {
    icon: <FaUsers className="text-orange-400 text-3xl drop-shadow-lg" />,
    title: 'Human Resource',
    desc: 'Employee Database, Payroll, Contracts, Attendance & Leave Management, Multi-Shifts, Requests, Loans',
    color: 'from-orange-100 to-orange-300',
    features: [
      { icon: <FaUserCheck />, text: 'Employee Database' },
      { icon: <FaMoneyCheckAlt />, text: 'Payroll System' },
      { icon: <FaFileContract />, text: 'Contract Management' },
      { icon: <FaCalendarCheck />, text: 'Attendance Tracking' },
      { icon: <FaIdBadge />, text: 'Multi-Shift Support' },
      { icon: <FaCheckSquare />, text: 'Leave Management' }
    ]
  },
  {
    icon: <FaCogs className="text-blue-500 text-3xl drop-shadow-lg" />,
    title: 'Operations',
    desc: 'Work Orders, Project Management, Online Booking Management, Time Tracking',
    color: 'from-blue-200 to-blue-400',
    features: [
      { icon: <FaClipboardList />, text: 'Work Orders' },
      { icon: <FaCalendarCheck />, text: 'Project Management' },
      { icon: <FaUserCheck />, text: 'Booking System' },
      { icon: <FaClock />, text: 'Time Tracking' },
      { icon: <FaCogs />, text: 'Process Automation' },
      { icon: <FaCheckSquare />, text: 'Resource Planning' }
    ]
  },
  {
    icon: <FaHandshake className="text-teal-500 text-3xl drop-shadow-lg" />,
    title: 'CRM',
    desc: 'Contact Management, Appointment Assignment, Memberships, Points & Credits, Client Follow-Up, Client Attendance',
    color: 'from-teal-200 to-teal-400',
    features: [
      { icon: <FaUserFriends />, text: 'Contact Management' },
      { icon: <FaCalendarCheck />, text: 'Appointment System' },
      { icon: <FaIdBadge />, text: 'Membership Plans' },
      { icon: <FaCoins />, text: 'Loyalty Points' },
      { icon: <FaUserCheck />, text: 'Client Follow-up' },
      { icon: <FaCheckSquare />, text: 'Attendance Tracking' }
    ]
  },
];

const Features = () => {
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      
      {/* Section Title */}
      <div className="relative z-10 max-w-3xl mx-auto text-center mb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-black dark:text-white">
          AlphaX <span className="bg-gradient-to-r from-[#3b82f6] via-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent">Powerful Business Solutions</span>
          </h2>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
            Comprehensive modules that work together seamlessly to streamline your entire business operations.
            Choose the features you need, when you need them.
          </p>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-4">
        {BUSINESS_APPS.map((app, idx) => (
          <motion.div
            key={app.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.7, type: 'spring' }}
            className={`group rounded-3xl bg-white/60 dark:bg-[#23232a]/70 shadow-2xl hover:shadow-[0_8px_40px_rgba(119,74,103,0.18)] border border-white/60 dark:border-[#774A67]/30 backdrop-blur-xl p-8 flex flex-col items-center text-center cursor-pointer transform hover:scale-105 transition-all duration-300 relative overflow-hidden animate-fadein`}
            style={{ boxShadow: '0 8px 40px 0 rgba(119,74,103,0.10), 0 1.5px 8px 0 rgba(119,74,103,0.10)' }}
          >
            <div className={`mb-5 p-4 rounded-full bg-gradient-to-br ${app.color} shadow-xl group-hover:scale-110 transition-transform duration-300`}>{app.icon}</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 drop-shadow-md bg-gradient-to-r from-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent">
              {app.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium leading-relaxed">
              {app.desc}
            </p>
            {/* 3D shine effect */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2 w-2/3 h-10 bg-gradient-to-r from-white/60 via-white/10 to-white/0 rounded-b-full blur-lg opacity-60 pointer-events-none" />
          </motion.div>
        ))}
      </div>
      {/* CTA Banner */}
      <CTABanner />
      {/* Add space after CTA banner */}
      <div className="my-16" />
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-4 py-12 max-w-7xl mx-auto mb-16">
        {/* Left Content */}
        <motion.div
          className="flex-1 max-w-xl animate-fadein"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white drop-shadow-xl">
            Robust Online <span className="text-[#774A67]">Sales</span><br />Management Software
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Cover sales from professional invoicing to estimates and quotations. Track client payments, installments, and set up insurance coverage. Ease client payments by offering multiple payment gateways including online payment. Sell in-person and on-the-go, with cloud POS. Set commission-based sales targets and track your teams' performance.
          </p>
          <ul className="space-y-3 mb-4">
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-200 via-blue-100 to-violet-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaFileInvoice className="text-blue-600 text-2xl drop-shadow" />
              </span>
              Invoicing & Quotations
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-200 via-blue-100 to-blue-300 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaCashRegister className="text-purple-600 text-2xl drop-shadow" />
              </span>
              Point of Sale
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-200 via-violet-100 to-blue-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaTags className="text-pink-500 text-2xl drop-shadow" />
              </span>
              Offers & Price List
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-100 via-yellow-100 to-orange-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaUserFriends className="text-orange-400 text-2xl drop-shadow" />
              </span>
              Installments Management
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-green-200 via-green-100 to-blue-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaBullseye className="text-green-600 text-2xl drop-shadow" />
              </span>
              Sales Targets & Commissions
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-200 via-blue-100 to-violet-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaShieldAlt className="text-blue-500 text-2xl drop-shadow" />
              </span>
              Insurance Management
            </li>
          </ul>
        </motion.div>
        {/* Right Content (Image/Mockup) */}
        <motion.div
          className="flex-1 flex justify-center items-center animate-fadein"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <div className="relative w-[400px] h-[400px] md:w-[440px] md:h-[440px] lg:w-[480px] lg:h-[480px] rounded-3xl bg-gradient-to-br from-[#f7f8fa] via-[#e9eaf3] to-[#774A67]/10 dark:from-[#23232a] dark:to-[#774A67]/20 shadow-2xl flex items-center justify-center backdrop-blur-lg">
            <img
              src="src/images/SalesImage-Photoroom.png"
              alt="Sales Management"
              className="w-full h-full object-contain drop-shadow-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>
      </div>
      {/* Add space between sections */}
      <div className="my-12" />
      {/* New Section: Accounting & Bookkeeping */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-4 py-12 max-w-7xl mx-auto mb-16">
        {/* Left Content: Image */}
        <motion.div
          className="flex-1 flex justify-center items-center animate-fadein"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <div className="relative w-[400px] h-[400px] md:w-[440px] md:h-[440px] lg:w-[480px] lg:h-[480px] rounded-3xl bg-gradient-to-br from-[#f7f8fa] via-[#e9eaf3] to-[#774A67]/10 dark:from-[#23232a] dark:to-[#774A67]/20 shadow-2xl flex items-center justify-center backdrop-blur-lg">
            <img
              src="src/images/Accounting.png"
              alt="Accounting"
              className="w-full h-full object-contain drop-shadow-2xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </motion.div>
        {/* Right Content: Textual Content */}
        <motion.div
          className="flex-1 max-w-xl animate-fadein"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: 'spring' }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white drop-shadow-xl">
            End-to-end <span className="text-[#774A67]">Accounting</span><br />and Bookkeeping
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Find automated, accurate books and journal entries, track transactions, monitor income and expenses. With a ready-made and modifiable chart of accounts; manage finances across branches according to your business structure.<br />
            Elevate your decision-making with real-time income and cash flow statements, general ledger, balance sheet and profit & loss reports.
          </p>
          <ul className="space-y-3 mb-4">
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-200 via-blue-100 to-violet-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaFileInvoice className="text-blue-600 text-2xl drop-shadow" />
              </span>
              Chart of Accounts & Journals Accounting
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-green-200 via-green-100 to-blue-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaMoneyCheckAlt className="text-green-600 text-2xl drop-shadow" />
              </span>
              Finance & Expenses Tracking
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-200 via-violet-100 to-blue-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaBoxes className="text-pink-500 text-2xl drop-shadow" />
              </span>
              Assets Management
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-100 via-yellow-100 to-orange-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaCogs className="text-orange-400 text-2xl drop-shadow" />
              </span>
              Cost Centers
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-200 via-blue-100 to-violet-200 shadow-lg border border-white/60 dark:border-[#774A67]/30">
                <FaCashRegister className="text-blue-500 text-2xl drop-shadow" />
              </span>
              Cheque Cycle
            </li>
          </ul>
        </motion.div>
      </div>
      {/* New Section: CRM Software */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-4 py-12 max-w-7xl mx-auto mb-16">
        {/* Left Content: Textual Content */}
        <div className="flex-1 max-w-xl order-2 lg:order-1">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white drop-shadow-xl">
            Online <span className="text-[#774A67]">CRM</span> Software to<br />Put your Clients first
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Connect with your clients anywhere, anytime and elevate your Sales. Add clients' data, create categorized profiles with our contact management system, follow up with transactions and payments. Offer clients memberships and track their consumption and attendance. Manage client appointments, notify them and set auto-reminders via email or SMS across our various integrated services.
          </p>
          <ul className="space-y-4 mb-4">
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaUserCheck className="text-blue-600 text-2xl" />
              </span>
              Clients Follow-Up
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-green-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaCalendarCheck className="text-green-600 text-2xl" />
              </span>
              Clients Attendance
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaIdBadge className="text-pink-500 text-2xl" />
              </span>
              Membership
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaCoins className="text-yellow-500 text-2xl" />
              </span>
              Points & Credits
            </li>
          </ul>
        </div>
        {/* Right Content: Image */}
        <div className="flex-1 flex justify-center items-center order-1 lg:order-2 relative">
          <div className="relative w-[420px] h-[420px] md:w-[480px] md:h-[480px] lg:w-[520px] lg:h-[520px] rounded-3xl bg-gradient-to-br from-[#f7f8fa] via-[#e9eaf3] to-[#774A67]/10 dark:from-[#23232a] dark:to-[#774A67]/20 shadow-2xl flex items-center justify-center backdrop-blur-lg">
            <img
              src="src/images/crm-Photoroom.png"
              alt="CRM"
              className="w-full h-full object-contain drop-shadow-2xl"
              loading="lazy"
              decoding="async"
            />
            {/* Blob near image (right) */}
            <svg className="absolute -top-10 -right-10 w-32 h-32 opacity-20 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#774A67" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
        {/* Blob near text (left) */}
        <svg className="absolute top-1/2 -left-20 w-40 h-40 opacity-20 z-0 animate-blob4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#3b82f6" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
        </svg>
      </div>
      {/* New Section: Inventory and Suppliers Management Software */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-4 py-12 max-w-7xl mx-auto mb-16">
        {/* Left Content: Image */}
        <div className="flex-1 flex justify-center items-center relative">
          <div className="relative w-[420px] h-[420px] md:w-[480px] md:h-[480px] lg:w-[520px] lg:h-[520px] rounded-3xl bg-gradient-to-br from-[#f7f8fa] via-[#e9eaf3] to-[#774A67]/10 dark:from-[#23232a] dark:to-[#774A67]/20 shadow-2xl flex items-center justify-center backdrop-blur-lg">
            <img
              src="src/images/Inventory-Photoroo.png"
              alt="Inventory Management"
              className="w-full h-full object-contain drop-shadow-2xl"
              loading="lazy"
              decoding="async"
            />
            {/* Blob near image (left) */}
            <svg className="absolute -top-10 -left-10 w-32 h-32 opacity-20 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#3b82f6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
        {/* Right Content: Textual Content */}
        <div className="flex-1 max-w-xl order-2 lg:order-2">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white drop-shadow-xl">
            <span className="text-[#774A67]">Inventory</span> and Suppliers<br />Management Software
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Manage products and services with AlphaX's complete and customizable inventory platform. Track stock level, issue purchase orders, easily replenish stock and always fulfill orders.<br />
            Transfer items and track inventory transactions across multiple warehouses and branches. Run stocktaking reports and take charge of your inventory across warehouses and online.
          </p>
          <ul className="space-y-4 mb-4">
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaBoxes className="text-blue-600 text-2xl" />
              </span>
              Product Management
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-green-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaTruck className="text-green-600 text-2xl" />
              </span>
              Suppliers Management
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaFileInvoice className="text-pink-500 text-2xl" />
              </span>
              Purchases Management
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaClipboardList className="text-yellow-500 text-2xl" />
              </span>
              Requisition Management
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaWarehouse className="text-purple-500 text-2xl" />
              </span>
              Stocktaking
            </li>
          </ul>
        </div>
        {/* Blob near text (right) */}
        <svg className="absolute top-1/2 -right-20 w-40 h-40 opacity-20 z-0 animate-blob4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#8b5cf6" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
        </svg>
      </div>
      {/* New Section: Human Resources Management */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 px-4 py-12 max-w-7xl mx-auto mb-16">
        {/* Left Content: Textual Content */}
        <div className="flex-1 max-w-xl order-2 lg:order-1">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900 dark:text-white drop-shadow-xl">
            Complete Core <span className="text-[#774A67]">Human<br />Resources</span> Management
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-lg mb-6">
            Set up the HRM according to your policy. Customize your own organizational structure, manage employees' records, contracts, attendance, restriction rules and shifts, create your own salary components, generate payroll and payslips automatically using trackable timesheets.<br />
            Monitor staff performance and get insights from a dynamic dedicated HR dashboard and integrated HR reporting.
          </p>
          <ul className="space-y-4 mb-4">
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaUserTie className="text-blue-600 text-2xl" />
              </span>
              Employees Management
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-green-200 to-green-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaCalendarCheck className="text-green-600 text-2xl" />
              </span>
              Attendance Management
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-pink-200 to-pink-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaMoneyCheckAlt className="text-pink-500 text-2xl" />
              </span>
              Payroll
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaFileContract className="text-yellow-500 text-2xl" />
              </span>
              Contracts
            </li>
            <li className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-purple-400 shadow-md border border-white/60 dark:border-[#774A67]/30">
                <FaCheckSquare className="text-purple-500 text-2xl" />
              </span>
              Requests
            </li>
          </ul>
        </div>
        {/* Right Content: Image */}
        <div className="flex-1 flex justify-center items-center order-1 lg:order-2 relative">
          <div className="relative w-[420px] h-[420px] md:w-[480px] md:h-[480px] lg:w-[520px] lg:h-[520px] rounded-3xl bg-gradient-to-br from-[#f7f8fa] via-[#e9eaf3] to-[#774A67]/10 dark:from-[#23232a] dark:to-[#774A67]/20 shadow-2xl flex items-center justify-center backdrop-blur-lg">
            <img
              src="src/images/HR.png"
              alt="HR Management"
              className="w-full h-full object-contain drop-shadow-2xl"
              loading="lazy"
              decoding="async"
            />
            {/* Blob near image (right) */}
            <svg className="absolute -top-10 -right-10 w-32 h-32 opacity-20 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#774A67" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
            </svg>
          </div>
        </div>
        {/* Blob near text (left) */}
        <svg className="absolute top-1/2 -left-20 w-40 h-40 opacity-20 z-0 animate-blob4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#3b82f6" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
        </svg>
      </div>

      <style>
        {`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        `}
      </style>
    </section>
  );
};

export default Features;