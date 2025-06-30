import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import { createPortal } from 'react-dom';

export interface DashboardNavbarProps {
  userEmail: string;
  daysLeft: number;
  isNotificationOpen: boolean;
  setIsNotificationOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isProfileOpen: boolean;
  setIsProfileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  profileDropdownRef: React.RefObject<HTMLDivElement>;
  handleClientLogout: () => void;
  navigate: (path: string) => void;
  setShowPaymentList: React.Dispatch<React.SetStateAction<boolean>>;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ userEmail, daysLeft, isNotificationOpen, setIsNotificationOpen, isProfileOpen, setIsProfileOpen, profileDropdownRef, handleClientLogout, navigate, setShowPaymentList }) => (
  <nav className="backdrop-blur-md bg-white/70 dark:bg-[#23232a]/80 border-b border-[#e9eaf3] dark:border-[#23232a] shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-20 items-center">
        <div className="flex items-center">
          <img src="src/images/alpha-Photoroom.png" alt="logo" className="h-12 w-auto sm:h-14 md:h-16 drop-shadow-lg" />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-full bg-[#8b5cf6]/20 hover:bg-[#774A67]/30 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-[#774A67] flex items-center justify-center text-white font-bold text-lg uppercase">
                {userEmail.charAt(0)}
              </div>
            </button>
            {/* Profile Dropdown Menu */}
            {isProfileOpen && createPortal(
              <div
                ref={profileDropdownRef}
                className="fixed top-20 right-8 w-56 bg-white/90 dark:bg-[#23232a]/90 rounded-2xl shadow-2xl border border-[#8b5cf6]/30 backdrop-blur-xl py-2 z-[9999] animate-fadein"
              >
                <div className="px-4 py-2 border-b border-[#8b5cf6]/20 text-sm font-semibold text-[#774A67] truncate bg-gradient-to-r from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c] rounded-t-2xl">
                  {userEmail}
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-semibold text-[#774A67] hover:bg-[#f3f4f8] dark:hover:bg-[#2d2d36] rounded transition-colors duration-200"
                  onClick={() => setShowPaymentList(true)}
                >
                  Card Details
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-semibold text-[#774A67] hover:bg-[#f3f4f8] dark:hover:bg-[#2d2d36] rounded transition-colors duration-200"
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-semibold text-[#774A67] hover:bg-[#f3f4f8] dark:hover:bg-[#2d2d36] rounded transition-colors duration-200"
                >
                  Settings
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-semibold text-[#774A67] hover:bg-[#f3f4f8] dark:hover:bg-[#2d2d36] rounded transition-colors duration-200"
                >
                  Reset Password
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-base font-semibold text-red-600 hover:bg-[#f3f4f8] dark:hover:bg-[#2d2d36] rounded transition-colors duration-200"
                  onClick={e => {
                    e.preventDefault();
                    handleClientLogout();
                    navigate('/');
                  }}
                >
                  <div className="flex items-center">
                    <FiLogOut className="mr-2" />
                    Sign out
                  </div>
                </a>
              </div>,
              document.body
            )}
          </div>
        </div>
      </div>
    </div>
  </nav>
);

export default DashboardNavbar; 