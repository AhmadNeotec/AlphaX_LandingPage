import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import Logo from '../../components/Logo';

interface CMSNavbarProps {
  onLogout: () => void;
}

const CMSNavbar: React.FC<CMSNavbarProps> = ({ onLogout }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#774A67]/60 via-[#a0849d]/40 to-[#e7d6e0]/30 shadow-lg z-20 flex items-center px-6 justify-between">
      <div className="flex items-center gap-3">
        <Logo className="text-white" />
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#774A67] hover:text-white hover:bg-[#774A67] rounded-lg transition-colors"
      >
        <FiLogOut /> Logout
      </button>
    </nav>
  );
};

export default CMSNavbar; 