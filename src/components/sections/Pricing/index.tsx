import { ENDPOINTS, fetcher } from '@api/useAxiosSWR';
import { rootStore } from '@store/index';
//import { cn } from '@utils/index';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RegisterTrialResponse } from 'types/auth.request';
import { FaBuilding, FaUtensils, FaPlane, FaShoppingCart, FaBalanceScale, FaLaptopCode, FaIndustry, FaHandsHelping, FaGraduationCap, FaHome, FaTools } from 'react-icons/fa';

const TickMark = () => (
  <svg
    className='flex-shrink-0 mt-0.5 h-4 w-4 text-violet-600/60 dark:text-violet-500/60'
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='20 6 9 17 4 12' />
  </svg>
);
// final changes
type Props = {
  isInModal?: boolean;
  isExpiredPlan?: boolean;
};

async function registerTrial(tk: string) {
  try {
    const response: RegisterTrialResponse = await fetcher.post(
      ENDPOINTS.registerTrial,
      {},
      {
        headers: {
          Authorization: `Bearer ${tk}`,
        },
      }
    );
    if (response.status === 200) {
      console.log(response);
      enqueueSnackbar('Trial registered successfully! Please enter your site infos', {
        variant: 'success',
      });
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const Pricing = ({ isInModal, isExpiredPlan }: Props) => {
  const tk = rootStore(({ data }) => data.tk);
  const isSignUp = rootStore(({ data }) => data.isSignUp);
  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);
  const toggleSignUp = rootStore(({ toggleSignUp }) => toggleSignUp);
  const togglePayment = rootStore(({ togglePayment }) => togglePayment);
  const toggleConfigSite = rootStore(({ toggleConfigSite }) => toggleConfigSite);

  const [showPopup, setShowPopup] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const mainTitle = isInModal ? 'Choose your plan' : 'Pricing';
  const cta = isInModal ? 'I Want This' : 'Sign In';

  const commonOnClick = () => {
    toggleStarted();
    if (!isSignUp) toggleStarted();
  };

  const handleFreeClicked = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isInModal) {
      commonOnClick();
      return;
    }
    enqueueSnackbar(`Registering for a trial plan...`, {
      variant: "info",
    });
    const success = await registerTrial(tk);
    if (success) {
      toggleStarted();
    }
  };

  const handlePremiumClicked = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isInModal) {
      commonOnClick();
      return;
    }
    enqueueSnackbar(`Proceeding to payment...`, {
      variant: "info",
    });
    setShowPopup(true);
    setTimeout(() => {
      toggleStarted();
    }, 1500);
  };

  const plans = [
    {
      title: "Basic",
      price: "300",
      currency: "/src/images/Saudi_Riyal_Symbol.png",
      features: ["Accounting", "Inventory", "Number of Users: 1"],
    },
    {
      title: "Standard",
      price: "400",
      currency: "/src/images/Saudi_Riyal_Symbol.png",
      features: ["Accounting", "Inventory", "HR with 5 Employees", "Number of Users: 3"],
    },
    {
      title: "Premium",
      price: "500",
      currency: "/src/images/Saudi_Riyal_Symbol.png",
      features: [
        "Accounting",
        "Inventory",
        "HR with 10 Employees",
        "Fixed Assets",
        "Number of Users: 5",
      ],
    },
    {
      title: "Platinum",
      price: "600",
      currency: "/src/images/Saudi_Riyal_Symbol.png",
      features: [
        "Accounting",
        "Inventory",
        "CRM",
        "HR with 20 Employees",
        "Fixed Assets",
        "Number of Users: 5",
      ],
    },
  ];

  const calculatePrice = (price: string) => {
    const basePrice = parseInt(price);
    return isYearly ? (basePrice * 12 * 0.9).toFixed(0) : price; // 10% discount for yearly
  };

  return (
    <div className='max-w-[80rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto max-h-[620px] lg:max-h-max overflow-y-auto no-scrollbar' id='pricing'>
      <div className='max-w-2xl mx-auto text-center mb-10 lg:mb-14'>
        <h2 className='text-5xl font-bold md:text-5xl md:leading-tight dark:text-white neon-glow'>
          {mainTitle}
        </h2>
        <p className='mt-1 text-gray-600 dark:text-gray-400'>
          Whatever your status, our offers evolve according to your needs.
        </p>
        
        {/* Billing Period Toggle */}
        <div className="mt-6 flex flex-col items-center">
          <div className="flex items-center gap-4">
            <span className={`text-base font-medium ${!isYearly ? 'text-[#774A67] dark:text-[#774A67]' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              type="button"
              className="relative w-12 h-6 rounded-full bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#774A67] focus:ring-offset-2 shadow-md hover:shadow-lg active:shadow-inner"
              onClick={() => setIsYearly(!isYearly)}
            >
              <span className="sr-only">Toggle billing period</span>
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full transition-all duration-200 shadow-sm ${
                isYearly ? 'translate-x-6 bg-[#774A67]' : 'translate-x-0 bg-white'
              }`} />
            </button>
            <span className={`text-base font-medium ${isYearly ? 'text-[#774A67] dark:text-[#774A67]' : 'text-gray-500'}`}>
              Yearly
            </span>
          </div>
          {isYearly && (
            <span className="mt-2 text-base font-medium text-green-600 dark:text-green-400">
             2 Months Free
            </span>
          )}
        </div>
      </div>

      <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className='flex flex-col border border-gray-200 text-center rounded-xl p-8 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-shadow bg-white dark:bg-gray-900 transform hover:scale-105 transition-transform'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, type: 'spring' }}
          >
            <h4 className='font-semibold text-3xl text-gray-800 dark:text-gray-200'>
              {plan.title}
            </h4>
            <div className="mt-3 flex items-center justify-center gap-2">
              <img src={plan.currency} alt="currency" className="h-5 w-5 object-contain" />
              <span className="font-bold text-6xl text-gray-800 dark:text-yellow-400">
                {calculatePrice(plan.price)}
              </span>
              <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                /{isYearly ? 'year' : 'month'}
              </span>
            </div>
            <ul className='mt-5 space-y-2.5 text-sm'>
              {plan.features.map((feature, i) => (
                <li key={i} className='flex space-x-2'>
                  <TickMark />
                  <span className='text-gray-800 dark:text-gray-400'>{feature}</span>
                </li>
              ))}
            </ul>
            <div className='mt-6'>
              <motion.a
                className="py-3 px-5 text-sm font-semibold rounded-lg border border-transparent text-white w-full block shadow-md"
                href=""
                initial={{ background: '#5a3950' }}
                animate={{
                  background: [
                    '#5a3950', // darker
                    '#774A67', // base
                    '#8e5779', // lighter
                    '#774A67', //
                    '#5a3950',
                  ],
                  boxShadow: [
                    '0 2px 8px rgba(119, 74, 103, 0.2)',
                    '0 4px 12px rgba(119, 74, 103, 0.4)',
                    '0 2px 8px rgba(119, 74, 103, 0.2)',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 6px 20px rgba(119, 74, 103, 0.5)',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleStarted();
                }}
              >
                {cta}
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
            <p className="text-gray-800 dark:text-gray-200 mb-4 text-lg">
              Sit tight. We will be right back.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Sectors Section */}
      <section className="mt-20 mb-10">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <span className="text-lg md:text-3xl font-semibold text-[#774A67] dark:text-[#774A67] tracking-widest uppercase">Sectors</span>
          <h2 className="mt-2 text-3xl md:text-5xl font-bold text-gray-900 dark:text-white">Catering to businesses in all sectors</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400 text-base">We understand the unique financial challenges faced by businesses in various sectors and design our solutions accordingly.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {[
            { label: 'Constructions & Real Estate', icon: <FaBuilding className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Food & Beverage', icon: <FaUtensils className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Tourism and Travel', icon: <FaPlane className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Retail', icon: <FaShoppingCart className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Legal', icon: <FaBalanceScale className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Technology', icon: <FaLaptopCode className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Manufacturing', icon: <FaIndustry className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Services', icon: <FaHandsHelping className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Education', icon: <FaGraduationCap className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Renting', icon: <FaHome className="w-5 h-5 drop-shadow-lg" /> },
            { label: 'Operation & Maintenance', icon: <FaTools className="w-5 h-5 drop-shadow-lg" /> },
          ].map((sector, idx) => (
            <div
              key={sector.label}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 rounded-full shadow border border-gray-200 dark:border-gray-700 text-[#774A67] dark:text-[#774A67] text-base font-semibold transition-all duration-200 hover:text-[#774A67]"
              style={{ boxShadow: undefined }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(119, 74, 103, 0.5)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
            >
              {sector.icon}
              {sector.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
