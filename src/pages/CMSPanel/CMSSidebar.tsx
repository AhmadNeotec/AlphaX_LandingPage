import React from 'react';
import { FiHome, FiDollarSign, FiUsers, FiGrid, FiChevronLeft, FiChevronRight, FiMenu } from 'react-icons/fi';

export type SidebarSection = 'dashboard' | 'pricing' | 'users' | 'features' | 'navbar';

interface CMSSidebarProps {
  activeSection: SidebarSection;
  onSectionChange: (section: SidebarSection) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const sections = [
  { key: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
  { key: 'pricing', label: 'Pricing', icon: <FiDollarSign /> },
  { key: 'users', label: 'Users', icon: <FiUsers /> },
  { key: 'features', label: 'Features', icon: <FiGrid /> },
  { key: 'navbar', label: 'Navbar', icon: <FiMenu /> },
] as const;

const CMSSidebar: React.FC<CMSSidebarProps> = ({ activeSection, onSectionChange, collapsed, onToggle }) => {
  return (
    <aside className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-gradient-to-b from-[#774A67]/40 via-[#a0849d]/30 to-[#e7d6e0]/20 shadow-xl z-10 transition-all duration-300 ${collapsed ? 'w-16' : 'w-56'}`}>
      <div className="flex flex-col h-full">
        <button
          className="flex items-center justify-center h-12 w-full text-gray-800 hover:bg-[#e7d6e0]/60 transition-colors"
          onClick={onToggle}
        >
          {collapsed ? <FiChevronRight size={22} /> : <FiChevronLeft size={22} />}
        </button>
        <nav className="flex-1 flex flex-col gap-1 mt-2">
          {sections.map(section => (
            <button
              key={section.key}
              onClick={() => onSectionChange(section.key as SidebarSection)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-bold text-base
                ${activeSection === section.key ? 'bg-[#774A67] text-white shadow-md' : 'text-gray-800 hover:bg-[#e7d6e0]/60'}
                ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <span className="text-xl">{section.icon}</span>
              {!collapsed && <span>{section.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default CMSSidebar; 