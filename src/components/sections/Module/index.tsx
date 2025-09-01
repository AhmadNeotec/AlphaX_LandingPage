import React, { useState } from 'react';
import {
  FaMoneyBillWave, FaFileInvoice, FaCashRegister, FaAd, FaHandHoldingUsd,
  FaChartLine, FaUserShield, FaFileAlt, FaUsers, FaBoxes, FaBoxOpen,
  FaShoppingCart, FaSyncAlt, FaTruck, FaClipboardList, FaCogs, FaBook,
  FaRegListAlt, FaRegBuilding, FaRegClock, FaTasks, FaMoneyCheckAlt,
  FaRegAddressBook, FaRegCalendarAlt, FaRegCreditCard, FaRegChartBar,
  FaRegEnvelope, FaFileContract
} from 'react-icons/fa';
import {
  HiOutlineUserGroup, HiOutlineUser, HiOutlineCreditCard, HiOutlineClipboardList
} from 'react-icons/hi';
import { rootStore } from '@store/index';
import { Link, useNavigate } from 'react-router-dom';

const Module: React.FC = () => {
  const toggleModules = rootStore(({ toggleModules }) => toggleModules);
  const navigate = useNavigate();
  const [pricingOpen, setPricingOpen] = useState(false);

  // Universal navigation helper:
  // 1) Use react-router navigate
  // 2) Close modules overlay
  // 3) If the path didn't apply (some router setups) fallback to full-page load
  const handleNav = (path: string) => {
    // Normalize path to string starting with '/'
    const normalized = path.startsWith('/') ? path : `/${path}`;
    try {
      // Attempt SPA navigation
      navigate(normalized);
    } catch (e) {
      // if navigate throws for some reason, fallback to full load
      window.location.href = normalized;
      return;
    }

    // Close the modules overlay
    try {
      toggleModules();
    } catch (e) {
      /* ignore if toggleModules not callable */
    }

    // After short delay, if location didn't change (blank route), force reload to the path
    setTimeout(() => {
      // compare lower-case to avoid case issues
      if (window.location.pathname.toLowerCase() !== normalized.toLowerCase()) {
        // fallback: full page load (forces server to serve the path)
        window.location.href = normalized;
      }
    }, 150);
  };

  const sidebarLinks = [
    { label: 'Home', path: '/' },
    // Use routes consistent with your router; try both lowercase and PascalCase if needed.
    { label: 'Industries', path: '/industries' }, // fallback will force full load if SPA route missing
    // Pricing will be handled as dropdown below
    { label: 'Contact Us', path: '/contact' },
  ];

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

      {/* Main content (modules grid) */}
      <div className="flex-1 flex flex-col justify-start items-start h-full relative z-10">
        <div className="w-full h-full overflow-y-auto">
          <div className="grid grid-cols-3 grid-rows-2 gap-y-8 w-full" style={{ minHeight: '600px' }}>
            {/* Sales */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">
                Sales <span className="text-[#774A67]">&rarr;</span>
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaMoneyBillWave /></span>
                  <Link to="/Sales/Sales" onClick={() => handleNav('/Sales/Sales')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Sales</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaFileInvoice /></span>
                  <Link to="/Sales/Invoicing" onClick={() => handleNav('/Sales/Invoicing')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Invoicing</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaCashRegister /></span>
                  <Link to="/Sales/POS" onClick={() => handleNav('/Sales/POS')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">POS</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaAd /></span>
                  <Link to="/Sales/Offers" onClick={() => handleNav('/Sales/Offers')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Offers</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaHandHoldingUsd /></span>
                  <Link to="/Sales/Installments" onClick={() => handleNav('/Sales/Installments')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Installments</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaChartLine /></span>
                  <Link to="/Sales/SalesCommission" onClick={() => handleNav('/Sales/SalesCommission')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Sales Commission</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><FaUserShield /></span>
                  <Link to="/Sales/InsuranceManagement" onClick={() => handleNav('/Sales/InsuranceManagement')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Insurance Management</Link>
                </li>
              </ul>
            </div>

            {/* Clients */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">
                Clients <span className="text-[#774A67]">&rarr;</span>
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineUserGroup /></span>
                  <Link to="/Clients/ClientManagement" onClick={() => handleNav('/Clients/ClientManagement')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Client Management</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineUser /></span>
                  <Link to="/Clients/ClientFollowUp" onClick={() => handleNav('/Clients/ClientFollowUp')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Client Follow-Up</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineCreditCard /></span>
                  <Link to="/Clients/LoyaltyPoints" onClick={() => handleNav('/Clients/LoyaltyPoints')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Loyalty Points</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineClipboardList /></span>
                  <Link to="/Clients/PointsAndCredits" onClick={() => handleNav('/Clients/PointsAndCredits')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Points and Credits</Link>
                </li>
                <li className="flex items-center gap-3">
                  <span className="inline-block w-8 h-8 bg-[#774A67]/10 rounded-lg flex items-center justify-center text-[#774A67] text-xl"><HiOutlineUser /></span>
                  <Link to="/Clients/Memberships" onClick={() => handleNav('/Clients/Memberships')} className="text-base font-medium text-[#232F3E] hover:text-[#774A67]">Memberships</Link>
                </li>
              </ul>
            </div>

            {/* Inventory */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">
                Inventory <span className="text-[#774A67]">&rarr;</span>
              </h2>
              <ul className="space-y-3">
                <li><button onClick={() => handleNav('/Inventory/InventoryManagement')} className="w-full text-left flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaBoxes /> Inventory Management</button></li>
                <li><button onClick={() => handleNav('/Inventory/ProductManagement')} className="w-full text-left flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaBoxOpen /> Product Management</button></li>
                <li><button onClick={() => handleNav('/Inventory/Purchases')} className="w-full text-left flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaShoppingCart /> Purchases</button></li>
                <li><button onClick={() => handleNav('/Inventory/PurchaseCycle')} className="w-full text-left flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaSyncAlt /> Purchase Cycle</button></li>
                <li><button onClick={() => handleNav('/Inventory/Suppliers')} className="w-full text-left flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaTruck /> Suppliers</button></li>
                <li><button onClick={() => handleNav('/Inventory/Requisitions')} className="w-full text-left flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaClipboardList /> Requisitions</button></li>
                <li><button onClick={() => handleNav('/Inventory/Stocktaking')} className="w-full text-left flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaCogs /> Stocktaking</button></li>
                <li><button onClick={() => handleNav('/Inventory/ManufacturingManagement')} className="w-full text-left flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaCogs /> Manufacturing Management</button></li>
                <li><button onClick={() => handleNav('/Inventory/ManufacturingOrdersManagement')} className="w-full text-left flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaCogs /> Manufacturing Orders</button></li>
              </ul>
            </div>

            {/* Accounting */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">
                Accounting <span className="text-[#774A67]">&rarr;</span>
              </h2>
              <ul className="space-y-3">
                <li><button onClick={() => handleNav('/Accounting/Expenses')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaMoneyBillWave /> Expenses</button></li>
                <li><button onClick={() => handleNav('/Accounting/GeneralAccounting')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaBook /> General Accounting</button></li>
                <li><button onClick={() => handleNav('/Accounting/ChartOfAccounts')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegListAlt /> Chart of Accounts</button></li>
                <li><button onClick={() => handleNav('/Accounting/AssetManagement')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegBuilding /> Asset Management</button></li>
                <li><button onClick={() => handleNav('/Accounting/CostCenters')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegChartBar /> Cost Centers</button></li>
                <li><button onClick={() => handleNav('/Accounting/ChequeCycle')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegCreditCard /> Cheque Cycle</button></li>
              </ul>
            </div>

            {/* HRM */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">
                HRM <span className="text-[#774A67]">&rarr;</span>
              </h2>
              <ul className="space-y-3">
                <li><button onClick={() => handleNav('/HRM/HumanResourcesManagement')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaUsers /> Human Resources</button></li>
                <li><button onClick={() => handleNav('/HRM/OrganizationalStructure')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegAddressBook /> Organizational Structure</button></li>
                <li><button onClick={() => handleNav('/HRM/AttendanceAndLeaveManagement')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegCalendarAlt /> Attendance & Leave</button></li>
                <li><button onClick={() => handleNav('/HRM/Contracts')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaFileContract /> Contracts</button></li>
                <li><button onClick={() => handleNav('/HRM/Payroll')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaMoneyCheckAlt /> Payroll</button></li>
                <li><button onClick={() => handleNav('/HRM/Requests')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegEnvelope /> Requests</button></li>
              </ul>
            </div>

            {/* Operations */}
            <div className="p-8 flex flex-col">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-[#232F3E]">
                Operations <span className="text-[#774A67]">&rarr;</span>
              </h2>
              <ul className="space-y-3">
                <li><button onClick={() => handleNav('/Operations/Operations')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaCogs /> Operations</button></li>
                <li><button onClick={() => handleNav('/Operations/WorkOrders')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaTasks /> Work Orders</button></li>
                <li><button onClick={() => handleNav('/Operations/BookingManagement')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegCalendarAlt /> Booking Management</button></li>
                <li><button onClick={() => handleNav('/Operations/RentalAndUnitManagement')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegBuilding /> Rental & Unit Mgmt</button></li>
                <li><button onClick={() => handleNav('/Operations/TimeTracking')} className="flex items-center gap-3 text-base font-medium text-[#232F3E] hover:text-[#774A67]"><FaRegClock /> Time Tracking</button></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-[340px] bg-[#f7f8fa] border-l border-gray-200 p-8 flex flex-col justify-between min-h-full">
        <div>
          <ul className="space-y-4 mb-4">
            {sidebarLinks.map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => handleNav(link.path)}
                  className="text-lg font-bold text-[#232F3E] hover:text-[#774A67] w-full text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}

            {/* Pricing dropdown */}
            <li>
              <div>
                <button
                  onClick={() => setPricingOpen(prev => !prev)}
                  aria-expanded={pricingOpen}
                  className="text-lg font-bold text-[#232F3E] hover:text-[#774A67] w-full text-left flex items-center justify-between"
                >
                  Pricing
                  <span className="ml-2 text-xl">{pricingOpen ? '▴' : '▾'}</span>
                </button>

                {pricingOpen && (
                  <ul className="mt-2 ml-4 space-y-2">
                    <li>
                      <button
                        onClick={() => handleNav('/pricing/module-pricing')}
                        className="text-base text-[#232F3E] hover:text-[#774A67] w-full text-left"
                      >
                        Module Pricing
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => handleNav('/pricing/plan-pricing')}
                        className="text-base text-[#232F3E] hover:text-[#774A67] w-full text-left"
                      >
                        Plan Pricing
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            </li>
          </ul>

          <hr className="my-4 border-gray-300" />

          {/* Optional small footer area — removed "More" section per your request */}
          <div className="text-sm text-gray-500">
            {/* You can put small helpful links, copyright, or nothing */}
          </div>
        </div>

        {/* Close button */}
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