import { rootStore } from "@store/index";
import { withApiAuthHeaders } from "@api/authHeaders";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useNavbar } from '../../../hooks/useNavbar';
//import ChatGPTModal from '../../ChatGPT/ChatGPTModal';
//import Module from '../Module';
//import Industries from '../Industries';
//import alphaLogo from '../../../images/alpha-Photoroom.png';

const DEFAULT_LINKS = [
  { label: 'MODULES', url: '#modules' },
  { label: 'INDUSTRIES', url: '#industries' },
  { label: 'PRICING', url: '#pricing', hasDropdown: true },
  { label: 'CONTACT US', url: '/contact' },
];
const DEFAULT_LOGIN_COLOR = '#774A67';
const DEFAULT_GET_STARTED_COLOR = '#40B93C';

const Navbar = () => {
  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);
  const toggleModules = rootStore(({ toggleModules }) => toggleModules);
  const toggleIndustries = rootStore(({ toggleIndustries }) => toggleIndustries);
  const [language, setLanguage] = useState('EN');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [navbarConfig, setNavbarConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch navbar configuration directly from API
  useEffect(() => {
    const fetchNavbarConfig = async () => {
      try {
        setLoading(true);
        const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.NavbarCMS.get_navbar_config', {
          method: 'GET',
          headers: withApiAuthHeaders(),
        });
        if (res.ok) {
          const response = await res.json();
          if (response.message && response.message.success) {
            setNavbarConfig(response.message);
            console.log('Navbar config fetched:', response.message);
            console.log('Language settings from API:', response.message.language_settings);
            console.log('Default language from API:', response.message.default_language);
          }
        }
      } catch (error) {
        console.error('Error fetching navbar config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNavbarConfig();

    // Listen for navbar updates
    const handleNavbarUpdate = () => {
      console.log('Navbar update event received, refreshing...');
      fetchNavbarConfig();
    };

    window.addEventListener('navbar-config-updated', handleNavbarUpdate);

    return () => {
      window.removeEventListener('navbar-config-updated', handleNavbarUpdate);
    };
  }, []);

  // Get values from API response or use defaults
  const navLinks = navbarConfig?.nav_links || DEFAULT_LINKS;
  const loginColor = navbarConfig?.button_colors?.login_color || DEFAULT_LOGIN_COLOR;
  const getStartedColor = navbarConfig?.button_colors?.get_started_color || DEFAULT_GET_STARTED_COLOR;
  const logoUrl = navbarConfig?.logo_settings?.logo_url || 'src/images/alpha-Photoroom.png';
  const companyName = navbarConfig?.logo_settings?.company_name || 'ALPHA X';
  
  // Process language settings - handle both object and string formats
  const rawLanguages = navbarConfig?.language_settings || ['EN', 'ARB'];
  const availableLanguages = Array.isArray(rawLanguages) ? rawLanguages.map(lang => {
    if (typeof lang === 'string') return lang;
    if (lang && typeof lang === 'object' && lang.language_code) return lang.language_code;
    return 'EN'; // fallback
  }) : ['EN', 'ARB'];
  
  const rawDefaultLanguage = navbarConfig?.default_language || 'EN';
  const defaultLanguage = typeof rawDefaultLanguage === 'string' ? rawDefaultLanguage : 
    (rawDefaultLanguage?.language_code || 'EN');

  // Debug logging
  console.log('Navbar render - navLinks:', navLinks);
  console.log('Navbar render - navbarConfig:', navbarConfig);
  console.log('Navbar render - rawLanguages:', rawLanguages);
  console.log('Navbar render - availableLanguages:', availableLanguages);
  console.log('Navbar render - defaultLanguage:', defaultLanguage);

  // Helper function to get the appropriate color for a link
  const getLinkColor = (link: any) => {
    // If link has a custom color, return it
    if (link.color && link.color.trim() !== '') {
      return link.color;
    }
    
    // Determine which default color to use based on link properties
    const label = link.label.toLowerCase();
    
    // Links that typically use the "Get Started" color (green)
    if (label.includes('contact') || label.includes('get started') || label.includes('sign up') || label.includes('register')) {
      return getStartedColor;
    }
    
    // Links that typically use the "Login" color (purple/brown)
    if (label.includes('login') || label.includes('sign in')) {
      return loginColor;
    }
    
    // Default to login color for most navigation links
    return loginColor;
  };

  // Set default language on mount
  useEffect(() => {
    if (defaultLanguage && language !== defaultLanguage) {
      setLanguage(defaultLanguage);
    }
  }, [defaultLanguage, language]);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isLangOpen && !target.closest('.language-selector')) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangOpen]);

  return (
    <>
      <motion.nav 
        className="fixed z-[99] filter top-0 left-0 right-0 py-4
        px-4 md:px-8 max-w-[110rem] mx-auto flex items-center 
        bg-white/95 text-[#020303] dark:bg-[#02030330] dark:text-white
        bg-clip-padding backdrop-filter backdrop-blur-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Logo */}
        <Link to="/" className="cursor-pointer flex-shrink-0">
          <img 
            src={logoUrl}
            alt={`${companyName} Logo`} 
            className="h-14 w-auto"
          />
        </Link>

        {/* Loading indicator */}
        {loading && (
          <div className="ml-4 text-xs text-gray-500 animate-pulse">
            Loading navigation...
          </div>
        )}

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden ml-auto relative w-10 h-10 flex items-center justify-center"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-black dark:text-white"
          >
            <path 
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6H20M4 12H20M4 18H20"} 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center ml-16 gap-8">
          {navLinks.map((item: any) => {
            const linkColor = getLinkColor(item);
            return (
              <div key={item.label} className="relative">
                <Link
                  to={item.url}
                  className={`nav-link ${activeLink === item.label ? 'active' : ''} 
                  relative overflow-hidden group transition-colors flex items-center gap-1 px-4 py-2 rounded-md`}
                  style={{ 
                    backgroundColor: linkColor,
                    color: 'white'
                  }}
                  onClick={(e) => {
                    if (item.label === 'MODULES') {
                      e.preventDefault();
                      toggleModules();
                      return;
                    }
                    if (item.label === 'INDUSTRIES') {
                      e.preventDefault();
                      toggleIndustries();
                      return;
                    }
                    if (item.label === 'PRICING') {
                      e.preventDefault();
                      setIsPricingOpen(!isPricingOpen);
                      return;
                    }
                    if (item.label !== 'PRICING' && item.label !== 'CONTACT US') {
                      e.preventDefault();
                      setActiveLink(item.label);
                      const section = document.getElementById(item.label.toLowerCase().replace(' ', '-'));
                      if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                      }
                    }
                  }}
                >
                  <span className="relative z-10 transition-colors duration-300">
                    {item.label}
                  </span>
                  {(item as any).hasDropdown && (
                    <motion.svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none"
                      animate={{ rotate: isPricingOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  )}
                </Link>
                
                {/* Pricing Dropdown */}
                {item.label === 'PRICING' && isPricingOpen && (
                  <motion.div
                    className="absolute top-full mt-2 py-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      to="/pricinglist"
                      className="block px-4 py-2 text-[15px] font-['Outfit'] tracking-wide
                      hover:bg-[#774A67] hover:text-white dark:hover:bg-[#774A67] transition-colors"
                      onClick={() => setIsPricingOpen(false)}
                    >
                      Module Pricing
                    </Link>
                    <Link
                      to="/pricing"
                      className="block px-4 py-2 text-[15px] font-['Outfit'] tracking-wide
                      hover:bg-[#774A67] hover:text-white dark:hover:bg-[#774A67] transition-colors"
                      onClick={() => setIsPricingOpen(false)}
                    >
                      Plan Pricing
                    </Link>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Side - Language & Buttons */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          {/* Language Selector */}
          <div className="flex items-center relative language-selector">
            <motion.button
              className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-md
              hover:bg-[#774A67] hover:text-white dark:hover:bg-[#774A67] transition-colors"
              onClick={() => {
                console.log('Language button clicked, current state:', isLangOpen);
                setIsLangOpen(!isLangOpen);
              }}
            >
              <span className="text-[15px] font-medium font-['Outfit'] tracking-wider">{typeof language === 'string' ? language : 'EN'}</span>
              <motion.svg 
                width="12" height="12" viewBox="0 0 24 24" fill="none" 
                animate={{ rotate: isLangOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </motion.svg>
            </motion.button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  className="absolute top-full mt-2 py-2 w-24 bg-white dark:bg-gray-800 rounded-md shadow-lg z-[9999] border border-gray-200 dark:border-gray-600"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ 
                    position: 'fixed',
                    zIndex: 9999,
                    minWidth: '96px'
                  }}
                  onAnimationStart={() => console.log('Language dropdown animation started')}
                  onAnimationComplete={() => console.log('Language dropdown animation completed')}
                >
                  {availableLanguages.map((lang: any) => {
                    // Ensure lang is a valid string
                    const langText = typeof lang === 'string' ? lang : String(lang || 'EN');
                    return (
                      <motion.button
                        key={langText}
                        className="w-full px-4 py-2 text-left text-[15px] font-['Outfit'] tracking-wide
                        hover:bg-[#774A67] hover:text-white dark:hover:bg-[#774A67] transition-colors rounded-sm"
                        onClick={() => {
                          console.log('Language selected:', langText);
                          setLanguage(langText);
                          setIsLangOpen(false);
                        }}
                        whileHover={{ x: 5 }}
                      >
                        {langText}
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Login Button */}
          <motion.button
            className="px-8 py-2.5 border-2 rounded-md text-[15px] 
            font-semibold tracking-wider transition-all duration-300 font-['Outfit'] relative overflow-hidden group"
            style={{ color: loginColor, borderColor: loginColor }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={toggleStarted}
          >
            <span className="relative z-10 text-white dark:group-hover:text-white transition-colors duration-300">LOGIN</span>
            <motion.div
              className="absolute inset-0"
              style={{ backgroundColor: loginColor }}
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>

          {/* Get Started Button */}
          <motion.button
            className="px-8 py-2.5 text-white rounded-md text-[15px] 
            font-semibold tracking-wider transition-all duration-300 font-['Outfit'] relative overflow-hidden
            shadow-[0_4px_20px_-4px_rgba(64,185,60,0.5)] hover:shadow-[0_4px_25px_-2px_rgba(64,185,60,0.6)]"
            style={{ backgroundColor: getStartedColor }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/signup')}
          >
            GET STARTED FOR FREE
            <motion.div
              className="absolute inset-0 bg-white/20 transform translate-x-full hover:translate-x-0
              transition-transform duration-300"
            />
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="fixed inset-0 top-[72px] bg-white dark:bg-gray-800 md:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col p-4 space-y-4">
                {/* Mobile Navigation Links */}
                {navLinks.map((item: any) => (
                  <div key={item.label}>
                    {item.label === 'PRICING' ? (
                      <>
                        <button
                          className="w-full text-left text-lg font-medium py-2 px-4 rounded-md
                          text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setIsPricingOpen(!isPricingOpen)}
                        >
                          {item.label}
                        </button>
                        {isPricingOpen && (
                          <div className="pl-4 space-y-2">
                            <Link
                              to="/pricinglist"
                              className="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Module Pricing
                            </Link>
                            <Link
                              to="/pricing"
                              className="block py-2 px-4 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              Plan Pricing
                            </Link>
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        to={item.url}
                        className={`text-lg font-medium py-2 px-4 rounded-md transition-colors`}
                        style={{
                          backgroundColor: getLinkColor(item),
                          color: 'white'
                        }}
                        onClick={(e) => {
                          if (item.label === 'MODULES') {
                            e.preventDefault();
                            toggleModules();
                            setIsMobileMenuOpen(false);
                            return;
                          }
                          if (item.label === 'INDUSTRIES') {
                            e.preventDefault();
                            toggleIndustries();
                            setIsMobileMenuOpen(false);
                            return;
                          }
                          if (item.label !== 'PRICING' && item.label !== 'CONTACT US') {
                            e.preventDefault();
                            setActiveLink(item.label);
                            setIsMobileMenuOpen(false);
                            const section = document.getElementById(item.label.toLowerCase().replace(' ', '-'));
                            if (section) {
                              section.scrollIntoView({ behavior: 'smooth' });
                            }
                          } else {
                            setIsMobileMenuOpen(false);
                          }
                        }}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile Language Selector */}
                <div className="flex items-center justify-between py-2 px-4">
                  <span className="text-gray-700 dark:text-gray-300">Language</span>
                  <select
                    className="bg-transparent border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    {availableLanguages.map((lang: any) => (
                      <option key={lang} value={lang}>
                        {lang === 'EN' ? 'English' : lang === 'ARB' ? 'Arabic' : lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mobile Buttons */}
                <div className="flex flex-col space-y-4 mt-4">
                  <button
                    className="w-full py-3 px-4 border-2 rounded-md font-semibold transition-colors"
                    style={{ 
                      color: loginColor, 
                      borderColor: loginColor,
                      backgroundColor: 'transparent'
                    }}
                    onClick={() => {
                      toggleStarted();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    LOGIN
                  </button>
                  <button
                    className="w-full py-3 px-4 text-white rounded-md font-semibold transition-colors"
                    style={{ backgroundColor: getStartedColor }}
                    onClick={() => {
                      navigate('/signup');
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    GET STARTED FOR FREE
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;