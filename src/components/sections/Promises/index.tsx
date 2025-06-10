import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHeadphones, 
  faShieldAlt, 
  faUserCheck, 
  faBolt, 
  faClock, 
  faCloud, 
  faSync, 
  faTag 
} from '@fortawesome/free-solid-svg-icons';

// Add icons to library
library.add(faHeadphones, faShieldAlt, faUserCheck, faBolt, faClock, faCloud, faSync, faTag);

const PROMISES = [
  {
    title: 'Free and Quick Support',
    short: 'AlphaX support is equipped to meet your every inquiry...',
    long: 'AlphaX support is equipped to meet your every inquiry, round the clock, to satisfaction.',
    icon: faHeadphones,
    color: 'bg-gradient-to-br from-purple-400 to-purple-500',
  },
  {
    title: 'Safe and\nSecure',
    short: 'AlphaX is hosted on secure servers, with 256-bit SSL...',
    long: 'AlphaX uses 256-bit SSL encryption and secure servers with auto-backups to keep your data safe and private.',
    icon: faShieldAlt,
    color: 'bg-gradient-to-br from-blue-400 to-blue-500',
  },
  {
    title: 'Personalized Experience',
    short: 'Curated with personalization prioritized, create from scratch...',
    long: 'Curated with personalization prioritized, create from scratch or tailor AlphaX to your business needs for a unique experience.',
    icon: faUserCheck,
    color: 'bg-gradient-to-br from-pink-400 to-pink-500',
  },
  {
    title: 'Simple and Advanced',
    short: 'AlphaX user manuals are there to guide you, but you wont...',
    long: 'AlphaX user manuals are there to guide you, but you wont need them much. The system is simple for beginners, advanced for pros.',
    icon: faBolt,
    color: 'bg-gradient-to-br from-blue-300 to-blue-400',
  },
  {
    title: 'Save Time and Effort',
    short: 'Our intuitive user interface, backed by automation, is...',
    long: 'Our intuitive user interface, backed by automation, is designed to save you time and effort in every business process.',
    icon: faClock,
    color: 'bg-gradient-to-br from-orange-200 to-orange-400',
  },
  {
    title: 'Remote, Yes. Disconnected, Never',
    short: 'AlphaX is cloud-based, your business is never out of reach...',
    long: 'AlphaX is cloud-based, your business is never out of reach. Access your data and tools from anywhere, anytime.',
    icon: faCloud,
    color: 'bg-gradient-to-br from-blue-200 to-blue-400',
  },
  {
    title: 'Free Lifetime Updates',
    short: 'AlphaX is constantly growing to expand supporting you...',
    long: 'AlphaX is constantly growing to expand supporting you. Enjoy free lifetime updates and new features as they are released.',
    icon: faSync,
    color: 'bg-gradient-to-br from-teal-300 to-teal-400',
  },
  {
    title: 'Cut-rate Deal',
    short: 'All-in-one and accessible for your business in whatever size...',
    long: 'All-in-one and accessible for your business in whatever size. Get the best value with AlphaXs cut-rate deal.',
    icon: faTag,
    color: 'bg-gradient-to-br from-pink-300 to-pink-400',
  },
];

const Promises = () => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated/blurred background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      {/* Extra animated SVG blob */}
      <svg className="absolute top-1/3 left-0 w-80 h-80 opacity-20 z-0 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#8b5cf6" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute top-1/4 right-10 w-60 h-60 opacity-20 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#3b82f6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-1/4 left-10 w-52 h-52 opacity-20 z-0 animate-blob4" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#f59e42" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-10 right-1/3 w-44 h-44 opacity-10 z-0 animate-blob5" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M38.2,-60.7C51.2,-54.7,62.2,-43.2,67.2,-29.7C72.2,-16.2,71.2,-0.7,66.2,13.8C61.2,28.3,52.2,41.7,39.2,50.2C26.2,58.7,9.2,62.2,-7.8,65.2C-24.8,68.2,-41.8,70.7,-54.2,62.2C-66.6,53.7,-74.4,34.2,-74.2,16.2C-74,-1.8,-65.8,-18.3,-56.8,-32.3C-47.8,-46.3,-38,-57.7,-25.2,-64.7C-12.4,-71.7,3.4,-74.7,18.2,-72.2C33,-69.7,47.2,-61.7,38.2,-60.7Z" transform="translate(100 100)" />
      </svg>
      {/* SVG mesh/wave for extra depth */}
      <svg className="absolute left-1/2 top-0 -translate-x-1/2 z-0 opacity-30" width="900" height="200" viewBox="0 0 900 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 100 Q 225 200 450 100 T 900 100 V200 H0Z" fill="#774A67" fillOpacity="0.08" />
      </svg>
      <div className="max-w-4xl mx-auto text-center mb-14 px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-[#3b82f6] via-[#774A67] to-[#8b5cf6] bg-clip-text text-transparent drop-shadow-xl">
          <span className="text-black">AlphaX</span> Promises as Your Business Partner
        </h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300 text-lg font-medium">
          Find out why AlphaX has been the choice of over 10,000 SMEs.
        </p>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
        {PROMISES.map((promise, idx) => (
          <motion.div
            key={promise.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.07, duration: 0.6, type: 'spring' }}
            className={`group relative flex flex-col items-center justify-start cursor-pointer transition-all duration-300 overflow-hidden w-64 h-56 mx-auto border border-gray-200 shadow-xl rounded-2xl bg-white p-7 hover:bg-[#774A67]`}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Icon animation */}
            <motion.div
              initial={false}
              animate={hovered === idx ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex items-center justify-center w-16 h-16 rounded-full shadow-lg ${promise.color}`}
              style={{ position: 'absolute', top: '0.5rem' }}
            >
              <FontAwesomeIcon icon={promise.icon} className="text-white text-3xl group-hover:text-white transition-colors duration-200" />
            </motion.div>
            {/* Heading animation */}
            <motion.h3
              initial={false}
              animate={hovered === idx ? { y: -24, color: '#fff' } : { y: 0, color: '#22223b' }}
              transition={{ duration: 0.3 }}
              className={`text-lg font-bold text-gray-900 text-center min-h-[2.5rem] group-hover:text-white transition-colors duration-200 z-10 ${hovered === idx ? 'mt-2' : 'mt-14'}`}
            >
              {promise.title}
            </motion.h3>
            {/* Text animation, clamped */}
            <motion.p
              initial={false}
              animate={hovered === idx ? { opacity: 1, color: '#fff' } : { opacity: 1, color: '#4b5563' }}
              transition={{ duration: 0.3 }}
              className={`text-center font-normal group-hover:text-white transition-colors duration-200 z-10 mt-1 ${
                hovered === idx
                  ? (promise.title === 'Safe and Secure'
                      ? 'text-xs line-clamp-6'
                      : 'text-sm line-clamp-5')
                  : 'text-sm line-clamp-3'
              }`}
              style={{ minHeight: '2.5rem' }}
            >
              {hovered === idx ? promise.long : promise.short}
            </motion.p>
          </motion.div>
        ))}
      </div>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes blob2 {
          0% { transform: scale(1) translateY(0px); }
          50% { transform: scale(1.1) translateY(20px); }
          100% { transform: scale(1) translateY(0px); }
        }
        .animate-blob2 {
          animation: blob2 12s infinite linear;
        }
        @keyframes blob3 {
          0% { transform: scale(1) translateY(0px) rotate(0deg); }
          50% { transform: scale(1.08) translateY(-18px) rotate(8deg); }
          100% { transform: scale(1) translateY(0px) rotate(0deg); }
        }
        .animate-blob3 {
          animation: blob3 14s infinite linear;
        }
        @keyframes blob4 {
          0% { transform: scale(1) translateY(0px) rotate(0deg); }
          50% { transform: scale(1.12) translateY(16px) rotate(-6deg); }
          100% { transform: scale(1) translateY(0px) rotate(0deg); }
        }
        .animate-blob4 {
          animation: blob4 16s infinite linear;
        }
        @keyframes blob5 {
          0% { transform: scale(1) translateY(0px) rotate(0deg); }
          50% { transform: scale(1.06) translateY(-12px) rotate(12deg); }
          100% { transform: scale(1) translateY(0px) rotate(0deg); }
        }
        .animate-blob5 {
          animation: blob5 18s infinite linear;
        }
      `}</style>
    </section>
  );
};

export default Promises; 