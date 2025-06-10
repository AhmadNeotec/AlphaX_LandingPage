import React from 'react';
import { FaMoneyBillWave, FaFileInvoice, FaCashRegister, FaAd, FaHandHoldingUsd, FaChartLine, FaUserShield, FaFileAlt, FaUsers, FaBoxes, FaBoxOpen, FaShoppingCart, FaSyncAlt, FaTruck, FaClipboardList, FaCogs, FaBook, FaRegListAlt, FaRegBuilding, FaRegClock, FaTasks, FaMoneyCheckAlt, FaRegAddressBook, FaRegCalendarAlt, FaRegCreditCard, FaRegChartBar, FaRegEnvelope, FaFileContract } from 'react-icons/fa';
import { HiOutlineUserGroup, HiOutlineUser, HiOutlineCreditCard, HiOutlineClipboardList } from 'react-icons/hi';
import { rootStore } from '@store/index';
import { Link } from 'react-router-dom';

const modules = [
  [
    {
      title: 'Sales',
      items: [
        { label: 'Sales', icon: <FaMoneyBillWave /> },
        { label: 'Invoicing', icon: <FaFileInvoice /> },
        { label: 'POS', icon: <FaCashRegister /> },
        { label: 'Offers', icon: <FaAd /> },
        { label: 'Installments', icon: <FaHandHoldingUsd /> },
        { label: 'Sales Commission', icon: <FaChartLine /> },
        { label: 'Insurance Management', icon: <FaUserShield /> },
        { label: 'KSA E-Invoice Software', icon: <FaFileAlt /> },
        { label: 'EGP E-Invoice Software', icon: <FaFileAlt /> },
        { label: 'JO E-Invoice Software', icon: <FaFileAlt /> },
      ],
    },
    {
      title: 'Clients',
      items: [
        { label: 'Client Management', icon: <HiOutlineUserGroup /> },
        { label: 'Client Follow-Up', icon: <HiOutlineUser /> },
        { label: 'Loyalty Points', icon: <HiOutlineCreditCard /> },
        { label: 'Points and Credits', icon: <HiOutlineClipboardList /> },
        { label: 'Memberships', icon: <HiOutlineUser /> },
      ],
    },
    {
      title: 'Inventory',
      items: [
        { label: 'Inventory Management', icon: <FaBoxes /> },
        { label: 'Product Management', icon: <FaBoxOpen /> },
        { label: 'Purchases', icon: <FaShoppingCart /> },
        { label: 'Purchase Cycle', icon: <FaSyncAlt /> },
        { label: 'Suppliers', icon: <FaTruck /> },
        { label: 'Requisitions', icon: <FaClipboardList /> },
        { label: 'Stocktaking', icon: <FaCogs /> },
        { label: 'Manufacturing Management Software', icon: <FaCogs /> },
        { label: 'Manufacturing Orders Management Software', icon: <FaCogs /> },
      ],
    },
  ],
  [
    {
      title: 'Accounting',
      items: [
        { label: 'Expenses', icon: <FaMoneyBillWave /> },
        { label: 'General Accounting', icon: <FaBook /> },
        { label: 'Chart of Accounts', icon: <FaRegListAlt /> },
        { label: 'Asset Management', icon: <FaRegBuilding /> },
        { label: 'Cost Centers', icon: <FaRegChartBar /> },
        { label: 'Cheque Cycle', icon: <FaRegCreditCard /> },
      ],
    },
    {
      title: 'HRM',
      items: [
        { label: 'Human Resources Management', icon: <FaUsers /> },
        { label: 'Organizational Structure', icon: <FaRegAddressBook /> },
        { label: 'Attendance and Leave management', icon: <FaRegCalendarAlt /> },
        { label: 'Contracts', icon: <FaFileContract /> },
        { label: 'Payroll', icon: <FaMoneyCheckAlt /> },
        { label: 'Requests', icon: <FaRegEnvelope /> },
      ],
    },
    {
      title: 'Operations',
      items: [
        { label: 'Operations', icon: <FaCogs /> },
        { label: 'Work Orders', icon: <FaTasks /> },
        { label: 'Booking Management', icon: <FaRegCalendarAlt /> },
        { label: 'Rental and Unit Management', icon: <FaRegBuilding /> },
        { label: 'Time Tracking', icon: <FaRegClock /> },
      ],
    },
  ],
];

const sidebarLinks = [
  'Home',
  'Industries',
  'Features',
  'Pricing',
  'Help',
];
const moreLinks = [
 
  'Additional services',
  'About AlphaX',
 
  'Contact Us',
 
];

const Module = () => {
  const toggleModules = rootStore(({ toggleModules }) => toggleModules);
  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-row">
      {/* Background gradient and blobs */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <svg className="absolute top-1/3 left-0 w-80 h-80 opacity-20 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#8b5cf6" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute top-1/4 right-10 w-60 h-60 opacity-20 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#3b82f6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div className="flex-1 flex flex-col justify-start items-start h-full relative z-10">
        <div className="w-full h-full overflow-y-auto">
          <div className="grid grid-cols-3 grid-rows-2 gap-y-8 w-full" style={{minHeight: '600px'}}>
            {/* Sales */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">Sales <span className="text-[#774A67]">&rarr;</span></h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaMoneyBillWave /></span><Link to="/Sales/Sales" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Sales</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaFileInvoice /></span><Link to="/Sales/Invoicing" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Invoicing</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaCashRegister /></span><Link to="/Sales/POS" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">POS</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaAd /></span><Link to="/Sales/Offers" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Offers</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaHandHoldingUsd /></span><Link to="/Sales/Installments" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Installments</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaChartLine /></span><Link to="/Sales/SalesCommission" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Sales Commission</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaUserShield /></span><Link to="/Sales/InsuranceManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Insurance Management</Link></li>
              </ul>
            </div>
            {/* Clients */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">Clients <span className="text-[#774A67]">&rarr;</span></h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineUserGroup /></span><Link to="/Clients/ClientManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Client Management</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineUser /></span><Link to="/Clients/ClientFollowUp" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Client Follow-Up</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineCreditCard /></span><Link to="/Clients/LoyaltyPoints" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Loyalty Points</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineClipboardList /></span><Link to="/Clients/PointsAndCredits" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Points and Credits</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineUser /></span><Link to="/Clients/Memberships" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Memberships</Link></li>
              </ul>
            </div>
            {/* Inventory */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">Inventory <span className="text-[#774A67]">&rarr;</span></h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaBoxes /></span><Link to="/Inventory/InventoryManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Inventory Management</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaBoxOpen /></span><Link to="/Inventory/ProductManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Product Management</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaShoppingCart /></span><Link to="/Inventory/Purchases" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Purchases</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaSyncAlt /></span><Link to="/Inventory/PurchaseCycle" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Purchase Cycle</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaTruck /></span><Link to="/Inventory/Suppliers" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Suppliers</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaClipboardList /></span><Link to="/Inventory/Requisitions" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Requisitions</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaCogs /></span><Link to="/Inventory/Stocktaking" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Stocktaking</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaCogs /></span><Link to="/Inventory/ManufacturingManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Manufacturing Management Software</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaCogs /></span><Link to="/Inventory/ManufacturingOrdersManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Manufacturing Orders Management Software</Link></li>
              </ul>
            </div>
            {/* Accounting */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">Accounting <span className="text-[#774A67]">&rarr;</span></h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaMoneyBillWave /></span><Link to="/Accounting/Expenses" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Expenses</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaBook /></span><Link to="/Accounting/GeneralAccounting" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">General Accounting</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegListAlt /></span><Link to="/Accounting/ChartOfAccounts" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Chart of Accounts</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegBuilding /></span><Link to="/Accounting/AssetManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Asset Management</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegChartBar /></span><Link to="/Accounting/CostCenters" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Cost Centers</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegCreditCard /></span><Link to="/Accounting/ChequeCycle" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Cheque Cycle</Link></li>
              </ul>
            </div>
            {/* HRM */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">HRM <span className="text-[#774A67]">&rarr;</span></h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaUsers /></span><Link to="/HRM/HumanResourcesManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Human Resources Management</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegAddressBook /></span><Link to="/HRM/OrganizationalStructure" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Organizational Structure</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegCalendarAlt /></span><Link to="/HRM/AttendanceAndLeaveManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Attendance and Leave management</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaFileContract /></span><Link to="/HRM/Contracts" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Contracts</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaMoneyCheckAlt /></span><Link to="/HRM/Payroll" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Payroll</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegEnvelope /></span><Link to="/HRM/Requests" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Requests</Link></li>
              </ul>
            </div>
            {/* Operations */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">Operations <span className="text-[#774A67]">&rarr;</span></h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaCogs /></span><Link to="/Operations/Operations" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Operations</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaTasks /></span><Link to="/Operations/WorkOrders" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Work Orders</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegCalendarAlt /></span><Link to="/Operations/BookingManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Booking Management</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegBuilding /></span><Link to="/Operations/RentalAndUnitManagement" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Rental and Unit Management</Link></li>
                <li className="flex items-center gap-3"><span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaRegClock /></span><Link to="/Operations/TimeTracking" onClick={toggleModules} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Time Tracking</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[340px] bg-[#f7f8fa] border-l border-gray-200 p-8 flex flex-col justify-between min-h-full">
        <div>
          <ul className="space-y-4 mb-8">
            {sidebarLinks.map((link) => (
              <li key={link} className="text-lg font-bold text-[#232F3E] hover:text-[#774A67] cursor-pointer">{link}</li>
            ))}
          </ul>
          <hr className="my-4 border-gray-300" />
          <div>
            <div className="text-lg font-bold mb-2 text-[#232F3E]">More</div>
            <ul className="space-y-2">
              {moreLinks.map((link) => (
                <li key={link} className="text-base text-[#232F3E] hover:text-[#774A67] cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-[#232F3E] z-10"
          onClick={toggleModules}
          aria-label="Close Modules"
        >
          &times;
        </button>
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob2 {
          0% { transform: scale(1) translateY(0px); }
          50% { transform: scale(1.1) translateY(20px); }
          100% { transform: scale(1) translateY(0px); }
        }
        .animate-blob2 {
          animation: blob2 12s infinite linear;
        }
        @keyframes blob3 {
          0% { transform: scale(1) translateY(0px) rotate(0deg); }
          50% { transform: scale(1.08) translateY(-18px) rotate(8deg); }
          100% { transform: scale(1) translateY(0px) rotate(0deg); }
        }
        .animate-blob3 {
          animation: blob3 14s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default Module; 