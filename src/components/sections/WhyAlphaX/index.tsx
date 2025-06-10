import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CTABanner from '../../CTABanner';

const WhyAlphaX = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      {/* Animated/blurred background blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
      <svg className="absolute top-1/3 left-0 w-80 h-80 opacity-20 z-0 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#8b5cf6" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute top-1/4 right-10 w-60 h-60 opacity-20 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#3b82f6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
      </svg>

      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold mb-3 text-gray-900 dark:text-white"
        >
          Best in Class ERP System
        </motion.h2>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-2xl md:text-4xl font-extrabold mb-4"
        >
          All-in-one <span className="text-[#2563eb]">AlphaX</span> is built to support your business
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-1"
        >
          With an easy-to-use and fully customizable user interface
        </motion.p>
        {/* Decorative dots (optional, can be removed for even less space) */}
        {/* <div className="flex w-full justify-between mb-4">
          <div className="hidden md:block w-32 h-20 relative">
            <div className="absolute left-0 top-6 grid grid-cols-6 gap-1 opacity-30">
              {[...Array(24)].map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 bg-blue-200 rounded-full" />
              ))}
            </div>
          </div>
          <div className="hidden md:block w-32 h-20 relative">
            <div className="absolute right-0 top-6 grid grid-cols-6 gap-1 opacity-30">
              {[...Array(24)].map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 bg-blue-200 rounded-full" />
              ))}
            </div>
          </div>
        </div> */}
        {/* Centered image */}
        <div className="flex justify-center items-center w-full">
          <img
            src="src/images/DashboardF1.png"
            alt="Dashboard"
            className="max-w-4xl object-contain mx-auto h-auto"
            loading="lazy"
            decoding="async"
          />
        </div>
      

        {/* Customization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
              Customize Your <span className="text-[#774A67]">Experience</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Make AlphaX truly yours with our powerful customization options. From branding and colors to workflows and reports, tailor every aspect to match your business needs.
            </p>
            <ul className="space-y-4">
              {[
                "Custom branding and themes",
                "Personalized dashboards",
                "Configurable workflows",
                "Custom report templates",
                "Flexible user roles"
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-200"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#774A67]/10 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#774A67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-[#774A67]/10 to-[#8b5cf6]/10" />
              <img
                src="src/images/dashboard21.png"
                alt="Customizable Dashboard"
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </motion.div>
        </div>

        {/* CTA Banner */}
        <div className="mb-20">
          <CTABanner />
        </div>
        </div>
      {/* Branding Banner - Payment Logos */}
      <div className="relative w-full mb-12">
        <div className="flex flex-col items-center justify-center py-2">
          <img 
            src="src/images/PaymentBanner.png" 
            alt="Payment Providers" 
            className="w-full max-w-none object-contain h-16 md:h-20"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
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
    </section>
  );
};

export default WhyAlphaX; 