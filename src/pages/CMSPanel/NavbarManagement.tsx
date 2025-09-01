import React, { useState, useEffect } from 'react';
import { withApiAuthHeaders } from '@api/authHeaders';
import { FiEdit2, FiSave, FiX, FiTrash2, FiPlus, FiRefreshCw, FiToggleRight } from 'react-icons/fi';
import { enqueueSnackbar } from 'notistack';

interface NavbarLink {
  label: string;
  url: string;
  has_dropdown: number;
  position: string;
  idx: number;
  color?: string; // Optional field for custom button color
}

interface LanguageSetting {
  name?: string; // ID from Frappe
  language_code: string;
  language_name: string;
  is_default: number;
}

interface NavbarConfig {
  success: boolean;
  nav_links: NavbarLink[];
  button_colors: {
    login_color: string;
    get_started_color: string;
  };
  logo_settings: {
    logo_url: string | null;
    company_name: string;
  };
  language_settings: LanguageSetting[];
  default_language: string;
  debug_info?: any;
}

const NavbarManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<NavbarConfig | null>(null);
  const [editingLinkIdx, setEditingLinkIdx] = useState<number | null>(null);
  const [linkDraft, setLinkDraft] = useState<NavbarLink>({ 
    label: '', 
    url: '', 
    has_dropdown: 0, 
    position: 'center', 
    idx: 0,
    color: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<NavbarLink>({ 
    label: '', 
    url: '', 
    has_dropdown: 0, 
    position: 'center', 
    idx: 0,
    color: ''
  });
  const [addLoading, setAddLoading] = useState(false);
  
  // Auto-save states
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [lastSavedButtonColors, setLastSavedButtonColors] = useState<string>('');
  const [lastSavedLogoSettings, setLastSavedLogoSettings] = useState<string>('');
  
  // Language management states
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false);
  const [languageForm, setLanguageForm] = useState<LanguageSetting>({ 
    language_code: '', 
    language_name: '', 
    is_default: 0 
  });
  const [editingLanguageIdx, setEditingLanguageIdx] = useState<number | null>(null);
  const [languageDraft, setLanguageDraft] = useState<LanguageSetting>({ 
    language_code: '', 
    language_name: '', 
    is_default: 0 
  });

  // Get token from localStorage
  const token = localStorage.getItem('tk');

  // Helper function to notify navbar to refresh
  const notifyNavbarRefresh = () => {
    // Dispatch a custom event to notify navbar to refresh
    window.dispatchEvent(new CustomEvent('navbar-config-updated'));
  };

  // 1. FETCH - Get navbar configuration
    const fetchNavbarConfig = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.get_navbar_config', {
        method: 'GET',
        headers: withApiAuthHeaders(),
      });
      if (!res.ok) throw new Error('Failed to fetch navbar configuration');
      const response = await res.json();
      console.log('Fetched navbar config:', response);
      
      // Handle the wrapped response format
      if (response.message && response.message.success) {
        setConfig(response.message);
        // Initialize last saved states
        setLastSavedButtonColors(JSON.stringify(response.message.button_colors));
        setLastSavedLogoSettings(JSON.stringify(response.message.logo_settings));
        } else {
        throw new Error(response.message?.error || 'Failed to fetch navbar configuration');
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error');
      console.error('Error fetching navbar config:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNavbarConfig();
  }, [token]);

  // Auto-save effect for button colors
  useEffect(() => {
    if (!config) return;
    
    const currentButtonColors = JSON.stringify(config.button_colors);
    if (currentButtonColors !== lastSavedButtonColors && lastSavedButtonColors !== '') {
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      // Set new timeout for auto-save
      const timeout = setTimeout(() => {
        saveButtonColors();
        setLastSavedButtonColors(currentButtonColors);
      }, 2000); // Auto-save after 2 seconds of no changes
      
      setAutoSaveTimeout(timeout);
    }
    
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [config?.button_colors, lastSavedButtonColors]);

  // Auto-save effect for logo settings
  useEffect(() => {
    if (!config) return;
    
    const currentLogoSettings = JSON.stringify(config.logo_settings);
    if (currentLogoSettings !== lastSavedLogoSettings && lastSavedLogoSettings !== '') {
      // Clear existing timeout
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      // Set new timeout for auto-save
      const timeout = setTimeout(() => {
        saveLogoSettings();
        setLastSavedLogoSettings(currentLogoSettings);
      }, 2000); // Auto-save after 2 seconds of no changes
      
      setAutoSaveTimeout(timeout);
    }
    
    return () => {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
    };
  }, [config?.logo_settings, lastSavedLogoSettings]);

  // 2. ADD - Add new navigation link
  const addNavLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setError(null);
    try {
      const payload = {
        label: addForm.label,
        url: addForm.url,
        has_dropdown: addForm.has_dropdown,
        position: "center",
        order: (config?.nav_links.length || 0) + 1,
        color: addForm.color || ""
      };
      
      console.log('Adding link, payload:', payload);
      
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.add_nav_link', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ link_data: payload }),
      });
      
      console.log('Add link response status:', res.status);
      const result = await res.json();
      console.log('Add link response body:', result);
      
      if (!res.ok || !result.message || !result.message.success) {
        throw new Error('Failed to add navigation link');
      }
      
      // Refresh the config to get updated data
      fetchNavbarConfig();
      setShowAddModal(false);
      setAddForm({ label: '', url: '', has_dropdown: 0, position: 'center', idx: 0, color: '' });
      enqueueSnackbar('Navigation link added successfully!', { variant: 'success' });
      notifyNavbarRefresh(); // Notify navbar to refresh
    } catch (err: any) {
      console.error('Error adding link:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setAddLoading(false);
    }
  };

  // 3. UPDATE - Update existing navigation link
  const startEdit = (idx: number) => {
    setEditingLinkIdx(idx);
    setLinkDraft({ ...config!.nav_links[idx] });
  };

  const cancelEdit = () => {
    setEditingLinkIdx(null);
    setLinkDraft({ label: '', url: '', has_dropdown: 0, position: 'center', idx: 0, color: '' });
  };

  const handleLinkInputChange = (key: string, value: string | number) => {
    setLinkDraft((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateNavLink = async (idx: number) => {
    setSaving(true);
    setError(null);
    try {
      const updatedLinks = [...config!.nav_links];
      updatedLinks[idx] = linkDraft;
      
      console.log('Updating link, payload:', updatedLinks);
      
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.update_nav_links', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ nav_links: updatedLinks }),
      });
      
      console.log('API response status:', res.status);
      const result = await res.json();
      console.log('API response body:', result);
      
      if (!res.ok || !result.message || !result.message.success) {
        throw new Error('Failed to update navigation link');
      }
      
      enqueueSnackbar(`Navigation link updated successfully!`, { variant: 'success' });
      setConfig(prev => prev ? { ...prev, nav_links: updatedLinks } : null);
      setEditingLinkIdx(null);
      setLinkDraft({ label: '', url: '', has_dropdown: 0, position: 'center', idx: 0, color: '' });
      notifyNavbarRefresh(); // Notify navbar to refresh
    } catch (err: any) {
      console.error('Error in updateNavLink:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  // 4. DISABLE - Remove navigation link (disable by deletion)
  const disableNavLink = async (idx: number) => {
    setSaving(true);
    setError(null);
    try {
      const updatedLinks = config!.nav_links.filter((_, i) => i !== idx);
      
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.update_nav_links', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ nav_links: updatedLinks }),
      });
      
      const result = await res.json();
      if (!res.ok || !result.message || !result.message.success) {
        throw new Error('Failed to disable navigation link');
      }
      
      enqueueSnackbar('Navigation link disabled successfully!', { variant: 'success' });
      setConfig(prev => prev ? { ...prev, nav_links: updatedLinks } : null);
      notifyNavbarRefresh(); // Notify navbar to refresh
    } catch (err: any) {
      console.error('Error in disableNavLink:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddInputChange = (key: string, value: string | number) => {
    setAddForm((prev: any) => ({ ...prev, [key]: value }));
  };

  // Helper function to get the appropriate color for a link
  const getColorForLink = (link: NavbarLink) => {
    // If link has a custom color, return it
    if (link.color && link.color.trim() !== '') {
      return link.color;
    }
    
    // If no custom color, use default button colors based on link type
    const label = link.label.toLowerCase();
    
    // Links that typically use the "Get Started" color (green)
    if (label.includes('contact') || label.includes('get started') || label.includes('sign up') || label.includes('register')) {
      return config?.button_colors.get_started_color || '#40B93C';
    }
    
    // Links that typically use the "Login" color (purple/brown)
    if (label.includes('login') || label.includes('sign in')) {
      return config?.button_colors.login_color || '#774A67';
    }
    
    // Default to login color for most navigation links
    return config?.button_colors.login_color || '#774A67';
  };

  // Button colors and logo settings save functions
  const saveButtonColors = async () => {
    setSaving(true);
    setError(null);
    try {
      console.log('Saving button colors:', config?.button_colors);
      
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.update_button_colors', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({
          login_color: config?.button_colors.login_color,
          get_started_color: config?.button_colors.get_started_color
        }),
      });
      
      console.log('Save button colors response status:', res.status);
      const result = await res.json();
      console.log('Save button colors response body:', result);
      
      if (!res.ok || !result.message || !result.message.success) {
        throw new Error('Failed to save button colors');
      }
      
      enqueueSnackbar('Button colors saved successfully!', { variant: 'success' });
      setLastSavedButtonColors(JSON.stringify(config?.button_colors));
      notifyNavbarRefresh(); // Notify navbar to refresh
    } catch (err: any) {
      console.error('Error saving button colors:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const saveLogoSettings = async () => {
    setSaving(true);
    setError(null);
    try {
      console.log('Saving logo settings:', config?.logo_settings);
      
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.update_logo_settings', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({
          logo_url: config?.logo_settings.logo_url,
          company_name: config?.logo_settings.company_name
        }),
      });
      
      console.log('Save logo settings response status:', res.status);
      const result = await res.json();
      console.log('Save logo settings response body:', result);
      
      if (!res.ok || !result.message || !result.message.success) {
        throw new Error('Failed to save logo settings');
      }
      
      enqueueSnackbar('Logo settings saved successfully!', { variant: 'success' });
      setLastSavedLogoSettings(JSON.stringify(config?.logo_settings));
      notifyNavbarRefresh(); // Notify navbar to refresh
    } catch (err: any) {
      console.error('Error saving logo settings:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  // Language management functions
  const startEditLanguage = (idx: number) => {
    setEditingLanguageIdx(idx);
    setLanguageDraft({ ...config!.language_settings[idx] });
  };

  const cancelEditLanguage = () => {
    setEditingLanguageIdx(null);
    setLanguageDraft({ language_code: '', language_name: '', is_default: 0 });
  };

  const handleLanguageInputChange = (key: string, value: string | number) => {
    setLanguageDraft((prev: any) => ({ ...prev, [key]: value }));
  };

  const updateLanguage = async (idx: number) => {
    setSaving(true);
    setError(null);
    try {
      const updatedLanguages = [...config!.language_settings];
      updatedLanguages[idx] = {
        language_code: languageDraft.language_code,
        language_name: languageDraft.language_name,
        is_default: languageDraft.is_default
      };
      
      console.log('Updating language, payload:', updatedLanguages);
      
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.update_languages_array', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ languages: updatedLanguages }),
      });
      
      console.log('Update language response status:', res.status);
      const result = await res.json();
      console.log('Update language response body:', result);
      
      if (!res.ok || !result.message || !result.message.success) {
        throw new Error('Failed to update language');
      }
      
      enqueueSnackbar('Language updated successfully!', { variant: 'success' });
      fetchNavbarConfig(); // Refresh to get updated data
      setEditingLanguageIdx(null);
      setLanguageDraft({ language_code: '', language_name: '', is_default: 0 });
      notifyNavbarRefresh(); // Notify navbar to refresh
    } catch (err: any) {
      console.error('Error updating language:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const deleteLanguage = async (idx: number) => {
    setSaving(true);
    setError(null);
    try {
      const updatedLanguages = config!.language_settings.filter((_, i) => i !== idx);
      
      console.log('Deleting language, updated languages:', updatedLanguages);
      
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.update_languages_array', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ languages: updatedLanguages }),
      });
      
      console.log('Delete language response status:', res.status);
      const result = await res.json();
      console.log('Delete language response body:', result);
      
      if (!res.ok || !result.message || !result.message.success) {
        throw new Error('Failed to delete language');
      }
      
      enqueueSnackbar('Language deleted successfully!', { variant: 'success' });
      fetchNavbarConfig(); // Refresh to get updated data
      notifyNavbarRefresh(); // Notify navbar to refresh
    } catch (err: any) {
      console.error('Error deleting language:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const handleLanguageFormChange = (key: string, value: string | number) => {
    setLanguageForm((prev: any) => ({ ...prev, [key]: value }));
  };

  const setDefaultLanguage = async (languageId: string) => {
    setSaving(true);
    setError(null);
    try {
      console.log('Setting default language, language_id:', languageId);
      
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.set_default_language', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ language_id: languageId }),
      });
      
      console.log('Set default language response status:', res.status);
      const result = await res.json();
      console.log('Set default language response body:', result);
      
      if (!res.ok || !result.message || !result.message.success) {
        throw new Error('Failed to set default language');
      }
      
      enqueueSnackbar('Default language updated successfully!', { variant: 'success' });
      fetchNavbarConfig(); // Refresh to get updated data
      notifyNavbarRefresh(); // Notify navbar to refresh
    } catch (err: any) {
      console.error('Error setting default language:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  const addLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setError(null);
    try {
      const newLanguage = {
        language_code: languageForm.language_code,
        language_name: languageForm.language_name,
        is_default: languageForm.is_default
      };
      
      const updatedLanguages = [...config!.language_settings, newLanguage];
      
      console.log('Adding language, payload:', updatedLanguages);
      
      const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.update_languages_array', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ languages: updatedLanguages }),
      });
      
      console.log('Add language response status:', res.status);
      const result = await res.json();
      console.log('Add language response body:', result);
      
      if (!res.ok || !result.message || !result.message.success) {
        throw new Error('Failed to add language');
      }
      
      fetchNavbarConfig();
      setShowAddLanguageModal(false);
      setLanguageForm({ language_code: '', language_name: '', is_default: 0 });
      enqueueSnackbar('Language added successfully!', { variant: 'success' });
      notifyNavbarRefresh(); // Notify navbar to refresh
    } catch (err: any) {
      console.error('Error adding language:', err);
      setError(err.message || 'Unknown error');
    } finally {
      setAddLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading navbar settings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">Error: {error}</div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">No configuration found</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto max-h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-2 drop-shadow">Navbar Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your navbar configuration and settings</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 text-lg"
            onClick={() => setShowAddModal(true)}
          >
            <FiPlus className="text-xl" /> Add Link
          </button>
          <button
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 text-lg"
            onClick={fetchNavbarConfig}
            disabled={saving}
          >
            <FiRefreshCw className={`text-xl ${saving ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
          </div>

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-[#23232a] dark:to-[#232F3E] rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 relative animate-fadeInUp">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
              onClick={() => setShowAddModal(false)}
              title="Close"
            >
              <FiX />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-[#232F3E] dark:text-white drop-shadow">Add New Navigation Link</h3>
            <form onSubmit={addNavLink} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">Link Label</label>
                <input
                  type="text"
                  required
                  value={addForm.label}
                  onChange={e => handleAddInputChange('label', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., MODULES"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">Link URL</label>
                <input
                  type="text"
                  required
                  value={addForm.url}
                  onChange={e => handleAddInputChange('url', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  placeholder="e.g., #modules"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={!!addForm.has_dropdown}
                  onChange={e => handleAddInputChange('has_dropdown', e.target.checked ? 1 : 0)}
                  id="add-link-dropdown"
                />
                <label htmlFor="add-link-dropdown" className="text-sm font-semibold text-[#232F3E] dark:text-white">Has Dropdown</label>
              </div>
              
              <div>
                <label className="block text-sm font-semibold mb-2 text-[#232F3E] dark:text-white">Link Color (Optional)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={addForm.color || '#774A67'}
                    onChange={e => handleAddInputChange('color', e.target.value)}
                    className="w-12 h-10 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={addForm.color || ''}
                    onChange={e => handleAddInputChange('color', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                    placeholder="#774A67 (Leave empty for default)"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty to use default link colors</p>
                {addForm.color && addForm.color.trim() !== '' && (
                  <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Preview:</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300 shadow-sm" 
                        style={{ backgroundColor: addForm.color }}
                        title={addForm.color}
                      />
                      <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{addForm.color}</span>
                    </div>
                    <div 
                      className="inline-block px-3 py-1 rounded text-white text-sm font-medium mt-2 shadow-sm"
                      style={{ backgroundColor: addForm.color }}
                    >
                      {addForm.label || 'Link Text'}
                    </div>
                  </div>
                )}
          </div>
            <button
                type="submit"
                disabled={addLoading}
                className="mt-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:from-indigo-700 hover:to-blue-600 hover:shadow-xl transition-all duration-200 text-lg flex items-center gap-2 justify-center"
            >
                {addLoading ? 'Adding...' : (<><FiPlus className="text-xl" /> Add Link</>)}
            </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Language Modal */}
      {showAddLanguageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-gradient-to-br from-white to-blue-50 dark:from-[#23232a] dark:to-[#232F3E] rounded-3xl shadow-2xl p-8 w-full max-w-lg border border-gray-200 dark:border-gray-700 relative animate-fadeInUp">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
              onClick={() => setShowAddLanguageModal(false)}
              title="Close"
            >
              <FiX />
            </button>
            <h3 className="text-2xl font-bold mb-6 text-[#232F3E] dark:text-white drop-shadow">Add New Language</h3>
            <form onSubmit={addLanguage} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">Language Code *</label>
                <input
                  type="text"
                  required
                  value={languageForm.language_code || ''}
                  onChange={e => handleLanguageFormChange('language_code', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  placeholder="EN"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-[#232F3E] dark:text-white">Language Name *</label>
                <input
                  type="text"
                  required
                  value={languageForm.language_name || ''}
                  onChange={e => handleLanguageFormChange('language_name', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner focus:ring-2 focus:ring-blue-400"
                  placeholder="English"
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={!!languageForm.is_default}
                  onChange={e => handleLanguageFormChange('is_default', e.target.checked ? 1 : 0)}
                  id="add-language-default"
                />
                <label htmlFor="add-language-default" className="text-sm font-semibold text-[#232F3E] dark:text-white">Set as Default Language</label>
              </div>
              <button
                type="submit"
                disabled={addLoading}
                className="mt-4 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg hover:from-indigo-700 hover:to-blue-600 hover:shadow-xl transition-all duration-200 text-lg flex items-center gap-2 justify-center"
              >
                {addLoading ? 'Adding...' : (<><FiPlus className="text-xl" /> Add Language</>)}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Navigation Links Section */}
      <div className="bg-gradient-to-br from-white/80 to-blue-50 dark:from-[#23232a]/80 dark:to-[#232F3E]/60 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-[#232F3E] dark:text-white">Navigation Links</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-separate border-spacing-0 bg-transparent rounded-xl shadow-lg">
            <thead>
              <tr className="text-[#232F3E] dark:text-white text-base font-bold">
                <th className="px-6 py-4 whitespace-nowrap">Label</th>
                <th className="px-6 py-4 whitespace-nowrap">URL</th>
                <th className="px-6 py-4 whitespace-nowrap">Dropdown</th>
                <th className="px-6 py-4 whitespace-nowrap">Link Color</th>
                <th className="px-6 py-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {config.nav_links.map((link, idx) => (
                <tr
                  key={idx}
                  className={`text-[#232F3E] dark:text-white text-base font-medium transition-all duration-200 hover:scale-[1.01] hover:shadow-2xl ${
                    idx % 2 === 1 ? 'bg-white/60 dark:bg-[#23232a]/80' : 'bg-blue-50/60 dark:bg-[#232F3E]/40'
                  }`}
                  style={{ boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)' }}
                >
                  <td className="px-6 py-4 font-semibold">
                    {editingLinkIdx === idx ? (
                      <input
                        type="text"
                        value={linkDraft.label}
                        onChange={e => handleLinkInputChange('label', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner"
                      />
                    ) : (
                      link.label
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {editingLinkIdx === idx ? (
                      <input
                        type="text"
                        value={linkDraft.url}
                        onChange={e => handleLinkInputChange('url', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner"
                      />
                    ) : (
                      link.url
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {editingLinkIdx === idx ? (
                      <input
                        type="checkbox"
                        checked={!!linkDraft.has_dropdown}
                        onChange={e => handleLinkInputChange('has_dropdown', e.target.checked ? 1 : 0)}
                        className="rounded"
                      />
                    ) : (
                      link.has_dropdown ? 'Yes' : 'No'
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {editingLinkIdx === idx ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={linkDraft.color || '#774A67'}
                          onChange={e => handleLinkInputChange('color', e.target.value)}
                          className="w-8 h-8 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
                        />
                        <input
                          type="text"
                          value={linkDraft.color || ''}
                          onChange={e => handleLinkInputChange('color', e.target.value)}
                          className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner text-sm"
                          placeholder="Default"
                        />
                        {linkDraft.color && linkDraft.color.trim() !== '' && (
                          <div className="ml-2 p-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">
                            <div 
                              className="inline-block px-2 py-1 rounded text-white font-medium shadow-sm"
                              style={{ backgroundColor: linkDraft.color }}
                            >
                              {linkDraft.label || 'Preview'}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {(() => {
                          const displayColor = getColorForLink(link);
                          const isCustomColor = link.color && link.color.trim() !== '';
                          
                          return (
                            <>
                              <div 
                                className="w-4 h-4 rounded border border-gray-300 shadow-sm cursor-pointer hover:scale-110 transition-transform" 
                                style={{ backgroundColor: displayColor }}
                                title={`Color: ${displayColor}${isCustomColor ? ' (Custom)' : ' (Default)'}`}
                              />
                              <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{displayColor}</span>
                              <div 
                                className="inline-block px-2 py-1 rounded text-white text-xs font-medium ml-2 shadow-sm"
                                style={{ backgroundColor: displayColor }}
                              >
                                {link.label}
                              </div>
                              {isCustomColor ? (
                                <span className="text-xs text-green-600 dark:text-green-400 font-medium">Custom</span>
                              ) : (
                                <span className="text-xs text-gray-500">(Default)</span>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-3 items-center">
                    {editingLinkIdx === idx ? (
                      <>
                        <button onClick={() => updateNavLink(idx)} disabled={saving} title="Save" className="rounded-full p-2 bg-green-100 hover:bg-green-500 hover:text-white shadow transition-all duration-200" aria-label="Save">
                          <FiSave className="w-5 h-5" />
                        </button>
                        <button onClick={cancelEdit} disabled={saving} title="Cancel" className="rounded-full p-2 bg-gray-100 hover:bg-gray-400 hover:text-white shadow transition-all duration-200" aria-label="Cancel">
                          <FiX className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(idx)}
                          disabled={saving}
                          title="Edit"
                          className="rounded-full p-2 bg-blue-100 hover:bg-blue-500 hover:text-white shadow transition-all duration-200"
                          aria-label="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => disableNavLink(idx)}
                          disabled={saving}
                          title="Disable"
                          className="rounded-full p-2 bg-red-100 hover:bg-red-500 hover:text-white shadow transition-all duration-200"
                          aria-label="Disable"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Button Colors Section */}
      <div className="bg-gradient-to-br from-white/80 to-blue-50 dark:from-[#23232a]/80 dark:to-[#232F3E]/60 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-[#232F3E] dark:text-white">Button Colors</h3>
            {autoSaveTimeout && JSON.stringify(config?.button_colors) !== lastSavedButtonColors && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full animate-pulse">
                Auto-saving...
              </span>
            )}
          </div>
          <button
            onClick={saveButtonColors}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="text-lg" /> Save Colors
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#232F3E] dark:text-white">Login Button Color</label>
            <input
              type="color"
              value={config.button_colors.login_color}
              onChange={(e) => setConfig(prev => prev ? { ...prev, button_colors: { ...prev.button_colors, login_color: e.target.value } } : null)}
              className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={config.button_colors.login_color}
              onChange={(e) => setConfig(prev => prev ? { ...prev, button_colors: { ...prev.button_colors, login_color: e.target.value } } : null)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400"
              placeholder="#774A67"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#232F3E] dark:text-white">Get Started Button Color</label>
            <input
              type="color"
              value={config.button_colors.get_started_color}
              onChange={(e) => setConfig(prev => prev ? { ...prev, button_colors: { ...prev.button_colors, get_started_color: e.target.value } } : null)}
              className="w-full h-12 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
            />
            <input
              type="text"
              value={config.button_colors.get_started_color}
              onChange={(e) => setConfig(prev => prev ? { ...prev, button_colors: { ...prev.button_colors, get_started_color: e.target.value } } : null)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400"
              placeholder="#40B93C"
            />
          </div>
        </div>
      </div>

      {/* Logo Settings Section */}
      <div className="bg-gradient-to-br from-white/80 to-blue-50 dark:from-[#23232a]/80 dark:to-[#232F3E]/60 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h3 className="text-2xl font-bold text-[#232F3E] dark:text-white">Logo Settings</h3>
            {autoSaveTimeout && JSON.stringify(config?.logo_settings) !== lastSavedLogoSettings && (
              <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full animate-pulse">
                Auto-saving...
              </span>
            )}
          </div>
          <button
            onClick={saveLogoSettings}
            disabled={saving}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-lg hover:from-emerald-700 hover:to-green-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="text-lg" /> Save Logo
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#232F3E] dark:text-white">Logo URL</label>
            <input
              type="text"
              value={config.logo_settings.logo_url || ''}
              onChange={(e) => setConfig(prev => prev ? { ...prev, logo_settings: { ...prev.logo_settings, logo_url: e.target.value } } : null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400"
              placeholder="src/images/alpha-Photoroom.png"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-[#232F3E] dark:text-white">Company Name</label>
            <input
              type="text"
              value={config.logo_settings.company_name}
              onChange={(e) => setConfig(prev => prev ? { ...prev, logo_settings: { ...prev.logo_settings, company_name: e.target.value } } : null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400"
              placeholder="ALPHA X"
            />
          </div>
        </div>
      </div>

      {/* Language Settings Section */}
      <div className="bg-gradient-to-br from-white/80 to-blue-50 dark:from-[#23232a]/80 dark:to-[#232F3E]/60 backdrop-blur-md rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-[#232F3E] dark:text-white">Languages</h3>
          <button
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center gap-2"
            onClick={() => setShowAddLanguageModal(true)}
          >
            <FiPlus className="text-lg" /> Add Language
          </button>
        </div>
        
        <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white/80 to-blue-50 dark:from-[#23232a]/80 dark:to-[#232F3E]/60 backdrop-blur-md">
          <table className="min-w-full text-left border-separate border-spacing-0 bg-transparent">
            <thead>
              <tr className="text-[#232F3E] dark:text-white text-base font-bold">
                <th className="px-6 py-4 whitespace-nowrap text-sm md:text-base drop-shadow">No.</th>
                <th className="px-6 py-4 whitespace-nowrap text-sm md:text-base drop-shadow">Language Code *</th>
                <th className="px-6 py-4 whitespace-nowrap text-sm md:text-base drop-shadow">Language Name *</th>
                <th className="px-6 py-4 whitespace-nowrap text-sm md:text-base drop-shadow">Default</th>
                <th className="px-6 py-4 whitespace-nowrap text-sm md:text-base drop-shadow">Actions</th>
              </tr>
            </thead>
            <tbody>
              {config.language_settings.map((lang, idx) => (
                <tr
                  key={lang.language_code}
                  className={`text-[#232F3E] dark:text-white text-sm md:text-base font-medium transition-all duration-200 hover:scale-[1.01] hover:shadow-2xl ${
                    idx % 2 === 1 ? 'bg-white/60 dark:bg-[#23232a]/80' : 'bg-blue-50/60 dark:bg-[#232F3E]/40'
                  }`}
                  style={{ boxShadow: '0 2px 8px 0 rgba(31,38,135,0.10)' }}
                >
                  <td className="px-6 py-4 font-semibold">{idx + 1}</td>
                  <td className="px-6 py-4 font-semibold">
                    {editingLanguageIdx === idx ? (
                      <input
                        type="text"
                        value={languageDraft.language_code}
                        onChange={e => handleLanguageInputChange('language_code', e.target.value)}
                        className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner"
                      />
                    ) : (
                      lang.language_code
                    )}
                  </td>
                  <td className="px-6 py-4 font-semibold">
                    {editingLanguageIdx === idx ? (
              <input
                        type="text"
                        value={languageDraft.language_name}
                        onChange={e => handleLanguageInputChange('language_name', e.target.value)}
                        className="w-32 px-2 py-1 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#23232a] text-[#232F3E] dark:text-white shadow-inner"
                      />
                    ) : (
                      lang.language_name
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {editingLanguageIdx === idx ? (
              <input
                        type="checkbox"
                        checked={!!languageDraft.is_default}
                        onChange={e => handleLanguageInputChange('is_default', e.target.checked ? 1 : 0)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    ) : (
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        lang.is_default === 1 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {lang.is_default === 1 ? 'Yes' : 'No'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex gap-3 items-center">
                    {editingLanguageIdx === idx ? (
                      <>
                        <button
                          onClick={() => updateLanguage(idx)}
                          disabled={saving}
                          title="Save"
                          className="rounded-full p-2 bg-green-100 hover:bg-green-500 hover:text-white shadow transition-all duration-200"
                          aria-label="Save"
                        >
                          <FiSave className="w-5 h-5" />
                        </button>
                        <button
                          onClick={cancelEditLanguage}
                          disabled={saving}
                          title="Cancel"
                          className="rounded-full p-2 bg-gray-100 hover:bg-gray-400 hover:text-white shadow transition-all duration-200"
                          aria-label="Cancel"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditLanguage(idx)}
                          disabled={saving}
                          title="Edit"
                          className="rounded-full p-2 bg-blue-100 hover:bg-blue-500 hover:text-white shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Edit"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>

                        <button
                          onClick={() => deleteLanguage(idx)}
                          disabled={saving}
                          title="Delete"
                          className="rounded-full p-2 bg-red-100 hover:bg-red-500 hover:text-white shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NavbarManagement;