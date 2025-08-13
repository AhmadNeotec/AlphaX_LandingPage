import { useState, useEffect } from 'react';
import { 
  getNavbarConfig, 
  getNavbarLinks, 
  getButtonColors,
  updateNavbarSettings,
  updateNavLinks,
  updateButtonColors,
  updateLogoSettings,
  updateLanguageSettings,
  initializeNavbarSettings,
  type NavbarConfig,
  type NavbarLink,
  type ButtonColors,
  type LogoSettings,
  type LanguageSettings
} from '../api/navbarApi';

export const useNavbar = () => {
  const [config, setConfig] = useState<NavbarConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch complete navbar configuration
  const fetchNavbarConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const navbarConfig = await getNavbarConfig();
      setConfig(navbarConfig);
      
      // Store in localStorage for fallback
      localStorage.setItem('navbarConfig', JSON.stringify(navbarConfig));
    } catch (err: any) {
      setError(err.message || 'Failed to fetch navbar configuration');
      console.error('Error fetching navbar config:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initialize navbar settings
  const initializeSettings = async () => {
    try {
      setLoading(true);
      const success = await initializeNavbarSettings();
      if (success) {
        await fetchNavbarConfig();
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize navbar settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update complete navbar settings
  const updateSettings = async (newSettings: Partial<NavbarConfig>) => {
    try {
      setLoading(true);
      const success = await updateNavbarSettings(newSettings);
      if (success) {
        await fetchNavbarConfig();
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to update navbar settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update navigation links
  const updateLinks = async (navLinks: NavbarLink[]) => {
    try {
      setLoading(true);
      const success = await updateNavLinks(navLinks);
      if (success) {
        await fetchNavbarConfig();
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to update navigation links');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update button colors
  const updateColors = async (loginColor?: string, getStartedColor?: string) => {
    try {
      setLoading(true);
      const success = await updateButtonColors(loginColor, getStartedColor);
      if (success) {
        await fetchNavbarConfig();
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to update button colors');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update logo settings
  const updateLogo = async (logoUrl?: string, companyName?: string) => {
    try {
      setLoading(true);
      const success = await updateLogoSettings(logoUrl, companyName);
      if (success) {
        await fetchNavbarConfig();
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to update logo settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update language settings
  const updateLanguages = async (languages?: string[], defaultLanguage?: string) => {
    try {
      setLoading(true);
      const success = await updateLanguageSettings(languages, defaultLanguage);
      if (success) {
        await fetchNavbarConfig();
      }
      return success;
    } catch (err: any) {
      setError(err.message || 'Failed to update language settings');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    const storedConfig = localStorage.getItem('navbarConfig');
    if (storedConfig) {
      try {
        const parsedConfig = JSON.parse(storedConfig);
        setConfig(parsedConfig);
      } catch (err) {
        console.error('Error parsing stored navbar config:', err);
      }
    }
    
    // Fetch fresh data
    fetchNavbarConfig();
  }, []);

  return {
    config,
    loading,
    error,
    fetchNavbarConfig,
    initializeSettings,
    updateSettings,
    updateLinks,
    updateColors,
    updateLogo,
    updateLanguages,
  };
}; 