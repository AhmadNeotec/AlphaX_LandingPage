import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiGlobe, FiSettings, FiUsers, FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { withApiAuthHeaders } from '@api/authHeaders';
import { getUserSites, addUserSite, checkSubdomainAvailability, getSiteStatus } from '@api/userSitesApi';
import DashboardNavbar from './DashboardNavbar';

interface Site {
  id: string;
  name: string;
  domain: string;
  status: 'active' | 'inactive' | 'pending' | 'suspend' | 'installing';
  createdAt: string;
  plan: string;
  plan_name?: string;
  users: number;
  selectedModules: string[]; // Array of selected module names
  // Removed adminPassword and dbPassword fields
  billingCycle?: string; // Monthly or Yearly billing cycle
  paymentStatus?: string; // Payment status
  invoiceDate?: string; // Invoice date
  nextRecurringInvoiceDate?: string; // Next recurring invoice date
  // storage: string; // Commented out for future use
  siteUrl?: string; // Added for visiting the site
}

interface ModuleData {
  module_name: string;
  m1?: number;
  m3?: number;
  year_price?: number;
  y1?: number;
  y2?: number;
  y3?: number;
  y5?: number;
  disabled?: number | string | boolean;
}

const SiteManagement: React.FC = () => {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm] = useState('');
  const [filterStatus] = useState<string>('all');
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successData, setSuccessData] = useState<{ siteUrl: string; jobId: string; siteStatus?: string } | null>(null);
  
  // Module fetching logic
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [modulesLoading, setModulesLoading] = useState(true);
  const [modulesError, setModulesError] = useState<string | null>(null);

  // DashboardNavbar state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileDropdownRef = React.useRef<HTMLDivElement>(null);

  // Fetch available modules
  useEffect(() => {
    const fetchModules = async () => {
      setModulesLoading(true);
      setModulesError(null);
      try {
        console.log('[SiteManagement] Fetching modules from API...');
        const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.ModulePricing.get_module_pricing', {
          method: 'GET',
          headers: withApiAuthHeaders(),
        });
        if (!res.ok) throw new Error('Failed to fetch module pricing data');
        const data = await res.json();
        console.log('[SiteManagement] Raw API response:', data);
        
        // Filter out disabled modules
        const enabledModules = (data.message || []).filter((module: ModuleData) => {
          const disabled = module.disabled === 1 || module.disabled === "1" || module.disabled === true || module.disabled === "true";
          return !disabled;
        });
        console.log('[SiteManagement] Enabled modules:', enabledModules);
        setModules(enabledModules);
      } catch (err: any) {
        console.error('[SiteManagement] Error fetching modules:', err);
        setModulesError(err.message || 'Unknown error');
      } finally {
        setModulesLoading(false);
      }
    };
    fetchModules();
  }, []);

  // Fetch sites from API
  useEffect(() => {
    const fetchSites = async () => {
      try {
        setIsLoading(true);
        // Resolve logged-in user email strictly from storage
        const userEmail = localStorage.getItem('user') || '';
        console.log('[SiteManagement] Using stored user email:', userEmail || '(empty)');
        if (!userEmail || !userEmail.includes('@')) {
          console.warn('[SiteManagement] No valid user email available; skipping sites fetch');
          setSites([]);
          return;
        }

        console.log('[SiteManagement] → Calling getUserSites with:', { userEmail });
        const data = await getUserSites(userEmail);
        console.log('[SiteManagement] ← Raw getUserSites response:', data);

        const payload = (data && typeof data === 'object' && 'message' in data) ? (data as any).message : data;
        const isArray = Array.isArray(payload);
        console.log('[SiteManagement] payload is array?', isArray, 'type:', typeof payload);

        if (isArray) {
          const messageArray: any[] = payload as any[];
          console.log('[SiteManagement] payload length:', messageArray.length);
          messageArray.forEach((parent: any, idx: number) => {
            console.log(`[SiteManagement] Parent[${idx}] name:`, parent?.name, 'userid:', parent?.userid, 'sitesCount:', Array.isArray(parent?.sites) ? parent.sites.length : 0);
          });

          const rows: Site[] = messageArray.flatMap((userSite: any, parentIdx: number) => {
            const parentName = userSite?.name || '';
            if (!Array.isArray(userSite?.sites)) return [];
            return userSite.sites.map((site: any, idx: number) => {
              const siteUrl: string = site?.site_url || '';
              console.log(`[SiteManagement] Mapping site parent=${parentIdx} idx=${idx} url=${siteUrl}`);
              let domain = '';
              try {
                domain = new URL(siteUrl).hostname;
              } catch {
                domain = siteUrl || `site-${idx}`;
              }
              
              // Extract modules from subscribe_modules if available
              const selectedModules: string[] = [];
              if (userSite?.subscribe_modules && Array.isArray(userSite.subscribe_modules)) {
                console.log('[SiteManagement] Raw subscribe_modules:', userSite.subscribe_modules);
                userSite.subscribe_modules.forEach((module: any) => {
                  console.log('[SiteManagement] Processing module:', module);
                  if (module.modules && typeof module.modules === 'string') {
                    // Check if this is a valid module name (not a random string)
                    if (module.modules.length > 3 && !module.modules.includes('0') && !module.modules.includes('1')) {
                      selectedModules.push(module.modules);
                    } else {
                      console.log('[SiteManagement] Skipping invalid module name:', module.modules);
                    }
                  }
                });
              }
              console.log('[SiteManagement] Final selectedModules:', selectedModules);
              
              return {
                id: `${parentName}-${idx}`,
                name: domain,
                domain,
                status: 'active',
                createdAt: '',
                plan: 'Basic',
                users: 1,
                selectedModules: selectedModules,
                siteUrl,
              };
            });
          });
          console.log('[SiteManagement] Flattened rows count:', rows.length);
          setSites(rows);
        } else if (payload && typeof payload === 'object') {
          // Single object shape { name, userid, sites: [...] }
          const obj: any = payload;
          console.log('[SiteManagement] payload object shape keys:', Object.keys(obj || {}));
          const parentName = obj?.name || obj?.userid || 'site';
          const sitesArr: any[] = Array.isArray(obj?.sites) ? obj.sites : [];
          console.log('[SiteManagement] object.sites length:', sitesArr.length);
          const rows: Site[] = sitesArr.map((site: any, idx: number) => {
            const siteUrl: string = site?.site_url || '';
            console.log(`[SiteManagement] Mapping object site idx=${idx} url=${siteUrl}`);
            let domain = '';
            try {
              domain = new URL(siteUrl).hostname;
            } catch {
              domain = siteUrl || `site-${idx}`;
            }
            
            // Extract modules from subscribe_modules if available
            const selectedModules: string[] = [];
            if (obj?.subscribe_modules && Array.isArray(obj.subscribe_modules)) {
              console.log('[SiteManagement] Raw obj.subscribe_modules:', obj.subscribe_modules);
              obj.subscribe_modules.forEach((module: any) => {
                console.log('[SiteManagement] Processing obj module:', module);
                if (module.modules && typeof module.modules === 'string') {
                  // Check if this is a valid module name (not a random string)
                  if (module.modules.length > 3 && !module.modules.includes('0') && !module.modules.includes('1')) {
                    selectedModules.push(module.modules);
                  } else {
                    console.log('[SiteManagement] Skipping invalid obj module name:', module.modules);
                  }
                }
              });
            }
            console.log('[SiteManagement] Final obj selectedModules:', selectedModules);
            
            return {
              id: `${parentName}-${idx}`,
              name: domain,
              domain,
              status: 'active',
              createdAt: '',
              plan: 'Basic',
              users: 1,
              selectedModules: selectedModules,
              siteUrl,
            };
          });
          console.log('[SiteManagement] Object-shape rows count:', rows.length);
          setSites(rows);
        } else {
          console.warn('[SiteManagement] Unexpected sites response shape; setting empty list');
          setSites([]);
        }
      } catch (err) {
        console.error('[SiteManagement] Error fetching sites:', err);
        setSites([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSites();
  }, []);

  const handleCreateSite = async (siteData: Partial<Site>) => {
    setIsLoading(true);
    try {
      console.log('[SiteManagement] Creating site with data:', siteData);
      
      // Call the Frappe API to create the site
      const response = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.site_creation.create_frappe_cloud_site', {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({
          subdomain: siteData.domain?.replace('.frappe.cloud', '') // Remove .frappe.cloud if present
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('[SiteManagement] Site creation response:', result);

      if (result.message && result.message.status === 'success') {
        // Site created successfully - now add to user sites
        const siteUrl = result.message.response.message.site;
        const jobId = result.message.response.message.job;
        
        try {
          // Get current user email from localStorage
          const userEmail = localStorage.getItem('user') || '';
          if (userEmail) {
            console.log('[SiteManagement] Adding user site to database:', { userEmail, siteUrl, selectedModules: siteData.selectedModules });
            
            // Ensure we have modules to send - if none selected, send at least one default module
            const modulesToSend = siteData.selectedModules && siteData.selectedModules.length > 0 
              ? siteData.selectedModules 
              : ['Basic']; // Default module if none selected
            
            console.log('[SiteManagement] Sending modules:', modulesToSend);
            console.log('[SiteManagement] Modules type:', typeof modulesToSend, Array.isArray(modulesToSend));
            console.log('[SiteManagement] Modules length:', modulesToSend.length);
            
            try {
              await addUserSite(userEmail, siteUrl, modulesToSend);
              console.log('[SiteManagement] User site added successfully');
            } catch (addSiteError) {
              console.error('[SiteManagement] Failed to add user site:', addSiteError);
              // Don't fail the entire operation if adding to user sites fails
              // The site was still created successfully
            }
          }
        } catch (addSiteError) {
          console.error('[SiteManagement] Error adding user site to database:', addSiteError);
          // Don't fail the entire operation if adding to user sites fails
          // The site was still created successfully
        }

        // Get site status after successful creation
        let siteStatus = 'pending';
        try {
          console.log('[SiteManagement] Getting site status for:', siteUrl);
          const statusResult = await getSiteStatus(siteUrl);
          siteStatus = statusResult.status.toLowerCase();
          console.log('[SiteManagement] Site status retrieved:', statusResult);
        } catch (statusError) {
          console.error('[SiteManagement] Error getting site status:', statusError);
          // Keep default status if status check fails
        }

        // Map status to our interface types
        let mappedStatus: 'active' | 'inactive' | 'pending' | 'suspend' | 'installing' = 'pending';
        if (siteStatus === 'active' || siteStatus === 'inactive' || siteStatus === 'pending' || siteStatus === 'suspend' || siteStatus === 'installing') {
          mappedStatus = siteStatus;
        }

        // Site created successfully
        const newSite: Site = {
          id: Date.now().toString(),
          name: siteData.name || '',
          domain: siteData.domain || '',
          status: mappedStatus,
          createdAt: new Date().toISOString().split('T')[0],
          plan: siteData.plan || 'Basic',
          users: 1,
          selectedModules: siteData.selectedModules || []
        };
        setSites([...sites, newSite]);
        setIsCreateModalOpen(false);
        
        // Show 3D success popup
        setShowSuccessPopup(true);
        setSuccessData({
          siteUrl: siteUrl,
          jobId: jobId,
          siteStatus: mappedStatus
        });
      } else {
        throw new Error(result.message?.message || 'Site creation failed');
      }
    } catch (error: any) {
      console.error('[SiteManagement] Error creating site:', error);
      alert(`Error creating site: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSites = sites.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         site.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || site.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleClientLogout = () => {
    // Clear auth state and force a full reload to home
    try {
      localStorage.removeItem('user');
      localStorage.removeItem('isSuperAdmin');
      localStorage.setItem('loginSuccess', 'false');
    } catch {}
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* DashboardNavbar */}
      <DashboardNavbar
        userEmail={localStorage.getItem('user') || ''}
        daysLeft={30}
        isNotificationOpen={isNotificationOpen}
        setIsNotificationOpen={setIsNotificationOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        profileDropdownRef={profileDropdownRef}
        handleClientLogout={handleClientLogout}
        navigate={navigate}
      />

      {/* Header */}
      <div className="bg-white/70 dark:bg-[#23232a]/80 border-b border-[#e9eaf3] dark:border-[#23232a] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/clientLogin')}
                className="p-2 rounded-lg bg-[#774A67]/10 hover:bg-[#774A67]/20 transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-[#774A67]" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Create and manage your websites</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsCreateModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold flex items-center space-x-2"
            >
              <FiPlus className="w-5 h-5" />
              <span>Create New Site</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="bg-white dark:bg-[#23232a] rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{sites.length}</p>
                <p className="text-gray-600 dark:text-gray-400">Total Sites</p>
              </div>
              <FiGlobe className="w-8 h-8 text-[#774A67]" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#23232a] rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-600">{sites.filter(s => s.status === 'active').length}</p>
                <p className="text-gray-600 dark:text-gray-400">Active Sites</p>
              </div>
              <FiSettings className="w-8 h-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#23232a] rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-600">{sites.reduce((acc, site) => acc + site.users, 0)}</p>
                <p className="text-gray-600 dark:text-gray-400">Total Users</p>
              </div>
              <FiUsers className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white dark:bg-[#23232a] rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">{sites.reduce((acc, site) => acc + site.selectedModules.length, 0)}</p>
                <p className="text-gray-600 dark:text-gray-400">Total Modules</p>
              </div>
              <FiSettings className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          {/* Storage Stats Card - Commented out for future use
          <div className="bg-white dark:bg-[#23232a] rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-600">{sites.reduce((acc, site) => {
                  const storage = parseFloat(site.storage);
                  return acc + (isNaN(storage) ? 0 : storage);
                }, 0).toFixed(1)} GB</p>
                <p className="text-gray-600 dark:text-gray-400">Total Storage</p>
              </div>
              <FiDatabase className="w-8 h-8 text-purple-600" />
            </div>
          </div>
          */}
        </div>

        {/* Filters removed as per request */}

        {/* Sites List */}
        <div className="bg-white dark:bg-[#23232a] rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-xl transition-all duration-300">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Sites</h3>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#774A67] mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading sites...</p>
            </div>
          ) : filteredSites.length === 0 ? (
            <div className="p-8 text-center">
              <FiGlobe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchTerm || filterStatus !== 'all' ? 'No sites match your filters' : 'No sites created yet'}
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 bg-[#774A67] text-white rounded-lg hover:bg-[#8b5cf6] transition-colors"
                >
                  Create Your First Site
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <table className="w-full min-w-[1200px]">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Site</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Next Invoice</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Modules</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Visit</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-[#23232a] divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredSites.map((site) => (
                    <tr 
                      key={site.id} 
                      className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer transform hover:scale-[1.01] hover:shadow-lg"
                      onClick={() => {
                        setSelectedSite(site);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{site.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{site.domain}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          site.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          site.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          site.status === 'installing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                          {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          site.paymentStatus === 'Paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          site.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          site.paymentStatus === 'Failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                          'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {site.paymentStatus ? site.paymentStatus.charAt(0).toUpperCase() + site.paymentStatus.slice(1).toLowerCase() : 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{site.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{site.invoiceDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{site.nextRecurringInvoiceDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <div className="flex flex-wrap gap-1">
                          {site.selectedModules.map((module, index) => (
                            <span
                              key={index}
                              className="inline-flex px-2 py-1 text-xs font-medium bg-[#774A67]/10 text-[#774A67] rounded-full"
                            >
                              {module}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        <button
                          className="px-3 py-1 bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white rounded hover:from-[#8b5cf6] hover:to-[#774A67] transition-all duration-200 font-semibold shadow"
                          onClick={e => {
                            e.stopPropagation();
                            // Construct the correct Frappe Cloud URL
                            const frappeUrl = `https://${site.domain}`;
                            console.log('[SiteManagement] Opening site URL:', frappeUrl);
                            window.open(frappeUrl, '_blank');
                          }}
                        >
                          Visit Site
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create Site Modal */}
      {isCreateModalOpen && (
        <CreateSiteModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateSite}
          modules={modules}
          modulesLoading={modulesLoading}
          modulesError={modulesError}
        />
      )}

      {/* Site Details Modal */}
      {isDetailsModalOpen && selectedSite && (
        <SiteDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedSite(null);
          }}
          site={selectedSite}
        />
      )}

      {/* Success Popup Modal */}
      {showSuccessPopup && successData && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={() => {
            setShowSuccessPopup(false);
            setSuccessData(null);
            navigate('/clientDashboard/site-management');
          }}
          siteUrl={successData.siteUrl}
          jobId={successData.jobId}
          siteStatus={successData.siteStatus}
        />
      )}
    </div>
  );
};

// Create Site Modal Component
interface CreateSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (siteData: Partial<Site>) => void;
  modules: ModuleData[];
  modulesLoading: boolean;
  modulesError: string | null;
}

const CreateSiteModal: React.FC<CreateSiteModalProps> = ({ isOpen, onClose, onCreate, modules, modulesLoading, modulesError }) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    plan: 'Basic',
    selectedModules: [] as string[]
    // Removed adminPassword and dbPassword
  });

  // Subdomain availability state
  const [subdomainStatus, setSubdomainStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({
    checking: false,
    available: null,
    message: ''
  });

  // Debounced subdomain checking
  useEffect(() => {
    if (!formData.domain || formData.domain.length < 3) {
      setSubdomainStatus({
        checking: false,
        available: null,
        message: ''
      });
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setSubdomainStatus(prev => ({ ...prev, checking: true }));
        
        const result = await checkSubdomainAvailability(formData.domain);
        
        setSubdomainStatus({
          checking: false,
          available: result.available,
          message: result.message
        });
      } catch (error: any) {
        console.error('Error checking subdomain availability:', error);
        setSubdomainStatus({
          checking: false,
          available: false,
          message: 'Error checking availability'
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [formData.domain]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('[SiteManagement] Form submitted with data:', formData);
    console.log('[SiteManagement] Selected modules:', formData.selectedModules);
    console.log('[SiteManagement] Modules type:', typeof formData.selectedModules, Array.isArray(formData.selectedModules));
    
    // Check if subdomain is available before submitting
    if (subdomainStatus.available === false) {
      alert('Please choose an available subdomain before creating the site.');
      return;
    }
    
    if (subdomainStatus.checking) {
      alert('Please wait while we check subdomain availability.');
      return;
    }
    
    onCreate(formData);
    setFormData({ 
      name: '', 
      domain: '', 
      plan: 'Basic', 
      selectedModules: []
      // Removed adminPassword and dbPassword
    });
    
    // Reset subdomain status
    setSubdomainStatus({
      checking: false,
      available: null,
      message: ''
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white dark:bg-[#23232a] rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Site</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <FiPlus className="w-6 h-6 transform rotate-45" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#774A67] focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subdomain
            </label>
            <div className="flex items-center">
              <input
                type="text"
                required
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className={`flex-1 px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-[#774A67] focus:border-transparent dark:bg-gray-700 dark:text-white ${
                  subdomainStatus.available === true 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : subdomainStatus.available === false 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="mycompany"
              />
              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-lg">
                .frappe.cloud
              </span>
            </div>
            
            {/* Subdomain availability status */}
            {formData.domain.length > 0 && (
              <div className="mt-2 flex items-center space-x-2">
                {subdomainStatus.checking ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-sm text-blue-600 dark:text-blue-400">Checking availability...</span>
                  </>
                ) : subdomainStatus.available === true ? (
                  <>
                    <FiCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-green-600 dark:text-green-400">{formData.domain}.frappe.cloud is available</span>
                  </>
                ) : subdomainStatus.available === false ? (
                  <>
                    <FiX className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-red-600 dark:text-red-400">{formData.domain}.frappe.cloud is not available</span>
                  </>
                ) : null}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">This will create: {formData.domain || 'mycompany'}.frappe.cloud</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Plan
            </label>
            <select
              value={formData.plan}
              onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#774A67] focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="Basic">Basic</option>
              <option value="Professional">Professional</option>
              <option value="Business">Business</option>
              <option value="Enterprise">Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Modules
            </label>
            <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
              {modulesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#774A67] mx-auto"></div>
                  <p className="mt-2 text-xs text-gray-500">Loading modules...</p>
                </div>
              ) : modulesError ? (
                <div className="text-center py-4">
                  <p className="text-xs text-red-500">Error loading modules: {modulesError}</p>
                </div>
              ) : modules.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500">No modules available</p>
                </div>
              ) : (
                modules.map((module) => {
                  console.log('[SiteManagement] Rendering module:', module);
                  return (
                    <label key={module.module_name} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        checked={formData.selectedModules.includes(module.module_name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            const newModules = [...formData.selectedModules, module.module_name];
                            console.log('[SiteManagement] Adding module:', module.module_name, 'New modules array:', newModules);
                            setFormData({
                              ...formData,
                              selectedModules: newModules
                            });
                          } else {
                            const newModules = formData.selectedModules.filter(m => m !== module.module_name);
                            console.log('[SiteManagement] Removing module:', module.module_name, 'New modules array:', newModules);
                            setFormData({
                              ...formData,
                              selectedModules: newModules
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-[#774A67] focus:ring-[#774A67]"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{module.module_name}</span>
                    </label>
                  );
                })
              )}
            </div>
            {formData.selectedModules.length > 0 && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Selected: {formData.selectedModules.join(', ')}
              </p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={subdomainStatus.checking || subdomainStatus.available === false}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
                subdomainStatus.checking || subdomainStatus.available === false
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-[#774A67] text-white hover:bg-[#8b5cf6]'
              }`}
            >
              {subdomainStatus.checking ? 'Checking...' : 'Create Site'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

// Success Popup Component
interface SuccessPopupProps {
  isOpen: boolean;
  onClose: () => void;
  siteUrl: string;
  jobId: string;
  siteStatus?: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ isOpen, onClose, siteUrl, jobId, siteStatus }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotateY: -90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        exit={{ opacity: 0, scale: 0.5, rotateY: 90 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        className="bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-green-900/20 dark:via-[#23232a] dark:to-blue-900/20 rounded-3xl shadow-2xl max-w-md w-full p-8 border-2 border-green-200 dark:border-green-700/50 transform perspective-1000"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* 3D Success Icon */}
        <motion.div
          initial={{ rotateY: -180, scale: 0 }}
          animate={{ rotateY: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          className="relative w-24 h-24 mx-auto mb-6"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front face */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl transform rotate-y-0">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          {/* Back face */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 to-green-800 rounded-full transform rotate-y-180" />
          
          {/* Left face */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-green-700 rounded-full transform rotate-y-90" />
          
          {/* Right face */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-300 to-green-500 rounded-full transform rotate-y-neg-90" />
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Site Created Successfully! 🎉
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your new site is being set up and will be ready shortly.
          </p>
        </motion.div>

        {/* Site Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 mb-6 border border-green-200 dark:border-green-700/50"
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Site URL:</span>
              <span className="text-sm font-bold text-green-600 dark:text-green-400 break-all">{siteUrl}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Job ID:</span>
              <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{jobId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
              <span className={`text-sm font-semibold ${
                siteStatus === 'active' ? 'text-green-600 dark:text-green-400' :
                siteStatus === 'pending' ? 'text-yellow-600 dark:text-yellow-400' :
                siteStatus === 'installing' ? 'text-blue-600 dark:text-blue-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {siteStatus ? siteStatus.charAt(0).toUpperCase() + siteStatus.slice(1) : 'Unknown'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center"
        >
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            OK
          </button>
        </motion.div>

        {/* Floating particles for 3D effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0, x: Math.random() * 100 - 50, y: Math.random() * 100 - 50 }}
              animate={{ 
                opacity: [0, 1, 0], 
                scale: [0, 1, 0],
                x: [Math.random() * 100 - 50, Math.random() * 200 - 100],
                y: [Math.random() * 100 - 50, Math.random() * 200 - 100]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                delay: i * 0.5,
                ease: "easeInOut"
              }}
              className="absolute w-2 h-2 bg-green-400 rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Site Details Modal Component
interface SiteDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: Site;
}

const SiteDetailsModal: React.FC<SiteDetailsModalProps> = ({ isOpen, onClose, site }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-[#23232a] dark:via-[#1a1a1f] dark:to-[#23232a] rounded-3xl shadow-2xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto border border-[#774A67]/10 dark:border-[#774A67]/20 transform perspective-1000"
      >
        {/* SVG Blobs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute -top-20 -left-20 w-40 h-40 opacity-10 animate-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#774A67" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute top-1/2 -right-20 w-40 h-40 opacity-10 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#8b5cf6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
          </svg>
          <svg className="absolute -bottom-20 left-1/3 w-40 h-40 opacity-10 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#60A5FA" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
          </svg>
        </div>

        {/* Modal Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#774A67] to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg">
                <FiGlobe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent">
                  Site Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Comprehensive information about your site
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90"
            >
              <FiPlus className="w-5 h-5 text-gray-600 dark:text-gray-400 transform rotate-45" />
            </button>
          </div>

          {/* Site Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-[#23232a]/50 dark:to-[#1a1a1f]/50 rounded-2xl p-6 border border-[#774A67]/20 dark:border-[#774A67]/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#774A67] rounded-lg flex items-center justify-center">
                  <FiGlobe className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Basic Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Site Name:</span>
                  <span className="font-bold text-[#774A67]">{site.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Domain:</span>
                  <span className="font-bold text-[#8b5cf6]">{site.domain}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Status:</span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    site.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    site.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    site.status === 'installing' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Created:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{site.createdAt}</span>
                </div>
              </div>
            </motion.div>

            {/* Plan & Usage */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-[#23232a]/50 dark:to-[#1a1a1f]/50 rounded-2xl p-6 border border-[#8b5cf6]/20 dark:border-[#8b5cf6]/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
                  <FiSettings className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Plan & Usage</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Plan:</span>
                  <span className="font-bold text-[#8b5cf6]">{site.plan_name || site.plan}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Billing Cycle:</span>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                    site.billingCycle === 'Yearly' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {site.billingCycle || 'Monthly'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Users:</span>
                  <span className="font-bold text-[#774A67]">{site.users}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Modules:</span>
                  <span className="font-bold text-[#60A5FA]">{site.selectedModules.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Site ID:</span>
                  <span className="font-mono text-sm font-semibold text-gray-700 dark:text-gray-300">{site.id}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Modules Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-[#23232a]/50 dark:to-[#1a1a1f]/50 rounded-2xl p-6 border border-[#60A5FA]/20 dark:border-[#60A5FA]/30 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01] mb-8"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-[#60A5FA] rounded-lg flex items-center justify-center">
                <FiSettings className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Installed Modules</h3>
            </div>
            
            {site.selectedModules.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {site.selectedModules.map((module, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-gradient-to-r from-[#774A67]/10 to-[#8b5cf6]/10 dark:from-[#774A67]/20 dark:to-[#8b5cf6]/20 rounded-xl p-3 border border-[#774A67]/20 dark:border-[#774A67]/30 hover:shadow-md transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="text-center">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#774A67] to-[#8b5cf6] rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FiSettings className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{module}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiSettings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 dark:text-gray-400">No modules installed</p>
              </div>
            )}
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 justify-end"
          >
            <button
              onClick={onClose}
              className="px-6 py-3 border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#774A67]/30 dark:hover:border-[#8b5cf6]/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold"
            >
              Close
            </button>
            <button
              onClick={() => {
                // Add functionality to visit the site
                const frappeUrl = `https://${site.domain}`;
                console.log('[SiteManagement] Opening site URL from modal:', frappeUrl);
                window.open(frappeUrl, '_blank');
              }}
              className="px-6 py-3 bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white rounded-xl hover:from-[#8b5cf6] hover:to-[#774A67] transition-all duration-300 transform hover:scale-105 hover:shadow-xl font-bold shadow-lg"
            >
              Visit Site
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SiteManagement; 