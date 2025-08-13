import { rootStore } from "@store/index";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  const navigate = useNavigate();

  const [navLinks, setNavLinks] = useState(DEFAULT_LINKS);
  const [loginColor, setLoginColor] = useState(DEFAULT_LOGIN_COLOR);
  const [getStartedColor, setGetStartedColor] = useState(DEFAULT_GET_STARTED_COLOR);

  useEffect(() => {
    // Load from localStorage
    const storedLinks = localStorage.getItem('navbarLinks');
    const storedLoginColor = localStorage.getItem('navbarLoginColor');
    const storedGetStartedColor = localStorage.getItem('navbarGetStartedColor');
    if (storedLinks) setNavLinks(JSON.parse(storedLinks));
    if (storedLoginColor) setLoginColor(storedLoginColor);
    if (storedGetStartedColor) setGetStartedColor(storedGetStartedColor);
  }, []);

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
            //src={alphaLogo} 
            src="src/images/alpha-Photoroom.png"
            alt="Alpha X Logo" 
            className="h-14 w-auto"
          />
        </Link>

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
          {navLinks.map((item) => (
            <div key={item.label} className="relative">
              <Link
                to={item.url}
                className={`nav-link ${activeLink === item.label ? 'active' : ''} 
                text-[#020303] dark:text-white relative overflow-hidden group
                transition-colors flex items-center gap-1`}
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
                <span className={`relative z-10 transition-colors duration-300 ${
                  activeLink === item.label ? 'text-white' : 'group-hover:text-white'
                }`}>{item.label}</span>
                {item.hasDropdown && (
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
                <motion.div
                  className={`absolute inset-0 bg-[#774A67] transform ${
                    activeLink === item.label ? 'translate-y-0' : '-translate-y-full group-hover:translate-y-0'
                  } transition-transform duration-300`}
                />
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
          ))}
        </div>

        {/* Right Side - Language & Buttons */}
        <div className="hidden md:flex items-center gap-6 ml-auto">
          {/* Language Selector */}
          <div className="flex items-center relative">
            <motion.button
              className="flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-md
              hover:bg-[#774A67] hover:text-white dark:hover:bg-[#774A67] transition-colors"
              onClick={() => setIsLangOpen(!isLangOpen)}
            >
              <span className="text-[15px] font-medium font-['Outfit'] tracking-wider">{language}</span>
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
                  className="absolute top-full mt-2 py-2 w-24 bg-white dark:bg-gray-800 rounded-md shadow-lg"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {['EN', 'ARB'].map((lang) => (
                    <motion.button
                      key={lang}
                      className="w-full px-4 py-2 text-left text-[15px] font-['Outfit'] tracking-wide
                      hover:bg-[#774A67] hover:text-white dark:hover:bg-[#774A67] transition-colors"
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangOpen(false);
                      }}
                      whileHover={{ x: 5 }}
                    >
                      {lang}
                    </motion.button>
                  ))}
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
                {navLinks.map((item) => (
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
                        className={`text-lg font-medium py-2 px-4 rounded-md ${
                          activeLink === item.label 
                            ? 'bg-[#774A67] text-white' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
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
                    <option value="EN">English</option>
                    <option value="ARB">Arabic</option>
                  </select>
                </div>

                {/* Mobile Buttons */}
                <div className="flex flex-col space-y-4 mt-4">
                  <button
                    className="w-full py-3 px-4 text-[#774A67] border-2 border-[#774A67] rounded-md 
                    font-semibold hover:bg-[#774A67] hover:text-white transition-colors"
                    onClick={() => {
                      toggleStarted();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    LOGIN
                  </button>
                  <button
                    className="w-full py-3 px-4 bg-[#40B93C] text-white rounded-md font-semibold
                    hover:bg-[#774A67] transition-colors"
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