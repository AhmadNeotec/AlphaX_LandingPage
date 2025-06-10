import React from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { rootStore } from '@store/index';

const INDUSTRIES = [
  {
    title: 'POS & Retail',
    desc: 'Online and offline sales, with ready and synchronized POS App.',
  },
  {
    title: 'Business Services',
    desc: 'Manage services and follow-up appointments with auto-reminder.',
  },
  {
    title: 'Professional Services',
    desc: 'Easy solution to track your customers\' requests from start to finish.',
  },
  {
    title: 'Medical',
    desc: 'Manage health care services, reservations and appointments.',
  },
  {
    title: 'Logistics',
    desc: 'Managing the accounts of logistic firms and shipping companies.',
  },
  {
    title: 'Tourism, Transportation & Hospitality',
    desc: 'Smart rental tools with unit tracking system and online reservations.',
  },
  {
    title: 'Learning',
    desc: 'Managing accounts, and following up on lists of students and courses.',
  },
  {
    title: 'Automotive',
    desc: 'Buying, selling and renting vehicles and managing spare parts inventory.',
  },
  {
    title: 'Real Estate & Construction',
    desc: 'Project management, buying, selling and renting real estate units.',
  },
];

const Industries = () => {
  const toggleIndustries = rootStore(({ toggleIndustries }) => toggleIndustries);
  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-row">
      {/* Background gradient and blobs */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <svg className="absolute top-1/3 left-0 w-80 h-80 opacity-20 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#8b5cf6" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute top-1/4 right-10 w-60 h-60 opacity-20 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#3b82f6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
        </svg>
      </div>
      <div className="flex-1 flex flex-col justify-start items-start h-full relative z-10">
        <div className="w-full h-full overflow-y-auto">
          <div className="grid grid-cols-3 gap-8 p-8 w-full">
            {INDUSTRIES.map((industry) => (
              <div key={industry.title} className="group flex flex-col gap-4 p-6 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm transition-all duration-300 hover:shadow-[0_0_15px_rgba(119,74,103,0.5)] hover:border hover:border-[#774A67]/20">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-[#232F3E] group-hover:text-[#774A67] transition-colors duration-300">{industry.title}</span>
                  <FaChevronRight className="text-[#774A67] text-lg font-bold mt-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
                <span className="text-base text-[#6B7280] font-medium leading-snug group-hover:text-[#232F3E] transition-colors duration-300">{industry.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-[340px] bg-[#f7f8fa] border-l border-gray-200 p-8 flex flex-col justify-between min-h-full">
        <div>
          <ul className="space-y-4 mb-8">
            {['Home', 'Modules', 'Features', 'Pricing', 'Help'].map((link) => (
              <li key={link} className="text-lg font-bold text-[#232F3E] hover:text-[#774A67] cursor-pointer">{link}</li>
            ))}
          </ul>
          <hr className="my-4 border-gray-300" />
          <div>
            <div className="text-lg font-bold mb-2 text-[#232F3E]">More</div>
            <ul className="space-y-2">
              {['Additional services', 'About AlphaX', 'Contact Us'].map((link) => (
                <li key={link} className="text-base text-[#232F3E] hover:text-[#774A67] cursor-pointer">{link}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className="absolute top-6 right-6 text-3xl text-gray-400 hover:text-[#232F3E] z-10"
          onClick={toggleIndustries}
          aria-label="Close Industries"
        >
          &times;
        </button>
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
      `}</style>
    </div>
  );
};

export default Industries; 