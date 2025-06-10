import React, { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiPlus, FiRefreshCw } from 'react-icons/fi';
import { getNavbarConfig, addNavbarLink, updateNavbarLink, deleteNavbarLink, updateNavbarColors, resetNavbarConfig } from '../../api/api';

interface NavbarLink {
  name: string;
  label: string;
  url: string;
}



const NavbarManagement: React.FC = () => {
  const [links, setLinks] = useState<NavbarLink[]>([]);
  const [newLink, setNewLink] = useState<{ label: string; url: string }>({ label: '', url: '' });
  const [editingLink, setEditingLink] = useState<NavbarLink | null>(null);
  const [loginColor, setLoginColor] = useState<string>('');
  const [getStartedColor, setGetStartedColor] = useState<string>('');

  // Load from API on mount
  useEffect(() => {
    const fetchNavbarConfig = async () => {
      try {
        const response = await getNavbarConfig();
        if (response.message.success && response.message.data) {
          setLinks(response.message.data.links);
          setLoginColor(response.message.data.loginColor);
          setGetStartedColor(response.message.data.getStartedColor);
        } else {
          console.error('Error fetching navbar config:', response.message.error);
        }
      } catch (error) {
        console.error('Error fetching navbar config:', error);
      }
    };

    fetchNavbarConfig();
  }, []);

  const handleAddLink = async () => {
    if (newLink.label && newLink.url) {
      try {
        const response = await addNavbarLink(newLink.label, newLink.url);
        if (response.message.success && response.message.data) {
          setLinks(response.message.data.links);
          setNewLink({ label: '', url: '' });
        } else {
          console.error('Error adding navbar link:', response.message.error);
        }
      } catch (error) {
        console.error('Error adding navbar link:', error);
      }
    }
  };

  const handleEditLink = (link: NavbarLink) => {
    setEditingLink(link);
    setNewLink({ label: link.label, url: link.url });
  };

  const handleUpdateLink = async () => {
    if (editingLink) {
      try {
        const response = await updateNavbarLink(editingLink.name, newLink.label, newLink.url);
        if (response.message.success && response.message.data) {
          setLinks(response.message.data.links);
          setEditingLink(null);
          setNewLink({ label: '', url: '' });
        } else {
          console.error('Error updating navbar link:', response.message.error);
        }
      } catch (error) {
        console.error('Error updating navbar link:', error);
      }
    }
  };

  const handleDeleteLink = async (name: string) => {
    try {
      const response = await deleteNavbarLink(name);
      if (response.message.success && response.message.data) {
        setLinks(response.message.data.links);
      } else {
        console.error('Error deleting navbar link:', response.message.error);
      }
    } catch (error) {
      console.error('Error deleting navbar link:', error);
    }
  };

  const handleRefresh = async () => {
    try {
      const response = await resetNavbarConfig();
      if (response.message.success && response.message.data) {
        setLinks(response.message.data.links);
        setNewLink({ label: '', url: '' });
        setEditingLink(null);
        setLoginColor(response.message.data.loginColor);
        setGetStartedColor(response.message.data.getStartedColor);
      } else {
        console.error('Error resetting navbar config:', response.message.error);
      }
    } catch (error) {
      console.error('Error resetting navbar config:', error);
    }
  };

  const handleLoginColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setLoginColor(newColor);
    try {
      const response = await updateNavbarColors(newColor, getStartedColor);
      if (!response.message.success) {
        console.error('Error updating navbar colors:', response.message.error);
      }
    } catch (error) {
      console.error('Error updating navbar colors:', error);
    }
  };

  const handleGetStartedColorChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setGetStartedColor(newColor);
    try {
      const response = await updateNavbarColors(loginColor, newColor);
      if (!response.message.success) {
        console.error('Error updating navbar colors:', response.message.error);
      }
    } catch (error) {
      console.error('Error updating navbar colors:', error);
    }
  };

  return (
    <div className="relative p-6 min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated background elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-blob animation-delay-4000 z-0" />
      <div className="relative z-10">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold text-[#774A67] mr-2">Navbar Management</h1>
          <button onClick={handleRefresh} title="Refresh" className="p-2 rounded-full bg-[#f3f4f8] hover:bg-[#e9eaf3] text-[#774A67] border border-[#e9eaf3] ml-2 transition-colors">
            <FiRefreshCw size={20} />
          </button>
        </div>
        {/* Live Preview */}
        <div className="mb-8 border-2 border-[#e7d6e0] rounded-xl overflow-hidden shadow-lg bg-white p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#774A67] rounded-full flex items-center justify-center text-white font-bold text-xl">A</div>
            <span className="font-bold text-xl text-[#774A67]">AlphaX</span>
          </div>
          <div className="flex-1 flex flex-wrap gap-6 justify-center md:justify-start">
            {links.map(link => (
              <span key={link.name} className="px-4 py-2 rounded-md bg-[#f3f4f8] text-[#774A67] font-semibold text-base shadow-sm border border-[#e7d6e0]">{link.label}</span>
            ))}
          </div>
          <div className="flex gap-4">
            <button
              className="px-6 py-2 border-2 rounded-md text-[15px] font-semibold font-['Outfit'] transition-all duration-300 relative overflow-hidden"
              style={{ color: loginColor, borderColor: loginColor }}
            >
              LOGIN
            </button>
            <button
              className="px-6 py-2 text-white rounded-md text-[15px] font-semibold font-['Outfit'] transition-all duration-300 shadow"
              style={{ backgroundColor: getStartedColor }}
            >
              GET STARTED FOR FREE
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add New Link</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Link Label"
              value={newLink.label}
              onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Link URL"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="w-full p-2 border rounded"
            />
            <button onClick={editingLink ? handleUpdateLink : handleAddLink} className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
              <FiPlus /> {editingLink ? 'Update Link' : 'Add Link'}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Existing Links</h2>
          <div className="space-y-4">
            {links.map(link => (
              <div key={link.name} className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{link.label}</h3>
                  <p className="text-gray-600">{link.url}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEditLink(link)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDeleteLink(link.name)} className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Button Colors</h2>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex items-center gap-3">
              <label className="font-semibold">LOGIN Button Color:</label>
              <input
                type="color"
                value={loginColor}
                onChange={handleLoginColorChange}
                className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
              />
              <span className="ml-2 text-sm">{loginColor}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="font-semibold">GET STARTED Button Color:</label>
              <input
                type="color"
                value={getStartedColor}
                onChange={handleGetStartedColorChange}
                className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer"
              />
              <span className="ml-2 text-sm">{getStartedColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarManagement;