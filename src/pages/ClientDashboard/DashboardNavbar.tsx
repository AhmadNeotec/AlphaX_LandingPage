import React, { useState, useEffect } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { createPortal } from 'react-dom';
import PaymentDetailsList from './PaymentDetailsList';
import { withApiAuthHeaders } from '@api/authHeaders';

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
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ userEmail, daysLeft, isNotificationOpen, setIsNotificationOpen, isProfileOpen, setIsProfileOpen, profileDropdownRef, handleClientLogout, navigate }) => {
  const [showPaymentList, setShowPaymentList] = useState(false);
  const [displayEmail, setDisplayEmail] = useState<string>(userEmail || '');

  // Derive and fetch user info after login
  useEffect(() => {
    const ensureEmail = (): string => {
      const stored = localStorage.getItem('user') || '';
      console.log('[Navbar] localStorage user:', stored);
      return stored;
    };

    const fetchUserCreationInfo = async (email: string) => {
      try {
        if (!email) {
          console.warn('[Navbar] No email available to fetch user info');
          return;
        }
        const url = new URL('https://test.neotec.ai/api/method/alphax_erp.api.user_info.get_user_creation_info');
        url.searchParams.set('userId', email);
        console.log('[Navbar] Fetching user creation info:', url.toString());
        const res = await fetch(url.toString(), {
          method: 'GET',
          headers: withApiAuthHeaders(),
          credentials: 'include',
        });
        console.log('[Navbar] Response status:', res.status);
        if (!res.ok) {
          const t = await res.text();
          console.error('[Navbar] Non-OK response:', t);
          return;
        }
        const data = await res.json();
        console.log('[Navbar] Parsed API response:', data);
        const apiEmail = data?.message?.data?.email;
        if (apiEmail && typeof apiEmail === 'string') {
          setDisplayEmail(apiEmail);
          // Do not overwrite localStorage unless different and definitely correct
          if (apiEmail !== localStorage.getItem('user')) {
            try { localStorage.setItem('user', apiEmail); } catch {}
          }
        }
      } catch (err) {
        console.error('[Navbar] Fetch error:', err);
      }
    };

    const initialEmail = ensureEmail();
    console.log('[Navbar] Initial email resolved from storage:', initialEmail || '(empty)');
    if (initialEmail) setDisplayEmail(initialEmail);
    fetchUserCreationInfo(initialEmail);
  }, [userEmail]);

  return (
    <nav className="backdrop-blur-md bg-white/70 dark:bg-[#23232a]/80 border-b border-[#e9eaf3] dark:border-[#23232a] shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <img src="/alpha-Photoroom.png" alt="logo" className="h-12 w-auto sm:h-14 md:h-16 drop-shadow-lg" />
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Chat Button */}
            <button
              onClick={() => navigate('/clientLogin/chat')}
              className="px-4 py-2 rounded-lg bg-[#4f46e5] text-white font-semibold hover:bg-[#3730a3] transition-colors"
            >
              Chat
            </button>
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-2 rounded-full bg-[#8b5cf6]/20 hover:bg-[#774A67]/30 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-[#774A67] flex items-center justify-center text-white font-bold text-lg uppercase">
                  {(displayEmail || 'U').charAt(0)}
                </div>
              </button>
              {/* Profile Dropdown Menu */}
              {isProfileOpen && createPortal(
                <div
                  ref={profileDropdownRef}
                  className="fixed top-20 right-8 w-56 bg-white/90 dark:bg-[#23232a]/90 rounded-2xl shadow-2xl border border-[#8b5cf6]/30 backdrop-blur-xl py-2 z-[9999] animate-fadein"
                >
                  <div className="px-4 py-2 border-b border-[#8b5cf6]/20 text-sm font-semibold text-[#774A67] truncate bg-gradient-to-r from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c] rounded-t-2xl">
                    {displayEmail || 'User'}
                  </div>

                  <a
                    href="#"
                    className="block px-4 py-2 text-base font-semibold text-[#774A67] hover:bg-[#f3f4f8] dark:hover:bg-[#2d2d36] rounded transition-colors duration-200"
                    onClick={e => {
                      e.preventDefault();
                      setShowPaymentList(true);
                    }}
                  >
                    Card Details
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-base font-semibold text-[#774A67] hover:bg-[#f3f4f8] dark:hover:bg-[#2d2d36] rounded transition-colors duration-200"
                    onClick={e => {
                      e.preventDefault();
                      setIsProfileOpen(false);
                      navigate('/clientLogin/profile');
                    }}
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-base font-semibold text-red-600 hover:bg-[#f3f4f8] dark:hover:bg-[#2d2d36] rounded transition-colors duration-200"
                    onClick={e => {
                      e.preventDefault();
                      // Clear auth state and force a full reload to home
                      handleClientLogout();
                      try {
                        localStorage.removeItem('user');
                        localStorage.removeItem('isSuperAdmin');
                        localStorage.setItem('loginSuccess', 'false');
                      } catch {}
                      window.location.replace('/');
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
      {/* PaymentDetailsList Modal */}
      {showPaymentList && createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 my-8 p-8">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 z-10"
              onClick={() => setShowPaymentList(false)}
              aria-label="Close Payment List"
            >
              &times;
            </button>
            <PaymentDetailsList />
          </div>
        </div>,
        document.body
      )}
    </nav>
  );
};

export default DashboardNavbar; 