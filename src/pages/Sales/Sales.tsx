import React from 'react';
import Navbar from '@components/sections/Navbar';
import { motion } from 'framer-motion';
import CTABanner from '@components/CTABanner';
import BoostComp from '@components/CTABanner/BoostComp';

const Sales = () => (
  <>
    <Navbar />
    <section className="relative flex flex-col justify-center overflow-x-hidden overflow-y-hidden py-20 md:py-32 bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
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
      <svg className="absolute left-1/2 top-0 -translate-x-1/2 z-0 opacity-30" width="900" height="200" viewBox="0 0 900 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 100 Q 225 200 450 100 T 900 100 V200 H0Z" fill="#774A67" fillOpacity="0.08" />
      </svg>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center gap-8 my-12">
        {/* Left Side */}
        <div className="flex-1 flex flex-col items-start justify-center ">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#232F3E] dark:text-white leading-tight mb-4">
            Online <span className="text-[#774A67]">Sales</span> and <br /> Invoicing Software
          </h1>
          <p className="text-lg md:text-xl text-[#232F3E]/80 dark:text-gray-300 mb-8">
            Manage your Sales online with Alphax. Alphax complete Sales management and invoicing software covers your Sales from issuing quotes and estimates to item record database and pricing, selling, invoicing and online and offline payment management. Sell anytime, from any device and track your sales and profitability in real-time.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 w-full">
            <motion.button
              className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#774A67] rounded-lg shadow-md hover:bg-[#8b577b] transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/signup'}
            >
              GET STARTED FOR FREE
            </motion.button>
            <div className="flex items-center gap-2 text-[#40B93C] font-semibold text-lg">
              <svg className="w-6 h-6 text-[#40B93C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <span className="text-[#232F3E] dark:text-white font-['Outfit']">Free 14-day trial</span>
            </div>
          </div>
          <div className="w-full flex justify-start mt-4">
            <img src="/src/images/Brandbanner2.png" alt="Brand Banner" className="max-w-2xl md:max-w-3xl w-full h-auto rounded-lg shadow" />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex items-center justify-center relative w-full">
          <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] dark:from-[#232F3E] dark:to-[#18181B]">
            <motion.div
              className="absolute top-8 left-8 bg-white rounded-full shadow-lg p-3"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              <svg className="w-8 h-8 text-[#40B93C]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 10c-2.21 0-4-1.79-4-4h2a2 2 0 1 0 4 0h2c0 2.21-1.79 4-4 4z" /></svg>
            </motion.div>
            <motion.div
              className="absolute bottom-8 right-8 bg-white rounded-full shadow-lg p-3"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <svg className="w-8 h-8 text-[#774A67]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a5 5 0 0 0-10 0v2a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2z" /></svg>
            </motion.div>
            <div className="relative w-[90%] h-[85%] flex items-center justify-center">
              <svg className="absolute -z-10 w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <radialGradient id="salesBlobGradient" cx="50%" cy="50%" r="80%">
                    <stop offset="0%" stopColor="#774A67" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#40B93C" stopOpacity="0.10" />
                  </radialGradient>
                </defs>
                <ellipse cx="200" cy="200" rx="180" ry="150" fill="url(#salesBlobGradient)" />
              </svg>
              <img
                src="/src/images/Sales1.png"
                alt="Sales Illustration"
                className="w-full h-full object-contain rounded-2xl shadow-xl border border-[#e5e7eb] dark:border-[#232F3E] bg-white/80 backdrop-blur-md"
                style={{ boxShadow: '0 8px 40px 0 rgba(119,74,103,0.10), 0 1.5px 8px 0 rgba(64,185,60,0.08)' }}
              />
              <div className="absolute inset-0 rounded-2xl pointer-events-none" style={{ background: 'linear-gradient(135deg,rgba(119,74,103,0.08) 0%,rgba(64,185,60,0.06) 100%)' }} />
            </div>
          </div>
        </div>
      </div>

      <CTABanner />
      <BoostComp />

      {/* New Section: Advanced Invoicing Features */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
        {/* Image Side */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src="/src/images/Sales2.png"
            alt="Advanced Invoicing"
            className="w-full max-w-xl rounded-2xl shadow-2xl border border-[#e5e7eb] dark:border-[#232F3E] bg-white/80 backdrop-blur-md object-contain"
            style={{ boxShadow: '0 8px 40px 0 rgba(119,74,103,0.10), 0 1.5px 8px 0 rgba(64,185,60,0.08)' }}
          />
        </div>
        {/* Text Side */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#232F3E] dark:text-white mb-6 leading-tight">
            Find Invoicing <span className="text-[#1746a0]">advanced features</span> that meet your business needs
          </h2>
          <p className="text-lg md:text-xl text-[#232F3E]/80 dark:text-gray-300">
            Create detailed invoices and quotations including all the required data and advanced payment options including deposits, partial or total payment, discounts and shipping options. In addition, attach documents and add required notes, and print invoices and quotes directly or send them to your customers instantly from within the invoice issuance screen via e-mail in easy and secure steps.
          </p>
        </div>
      </section>

      {/* New Section: Cloud POS */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center gap-12">
        {/* Text Side */}
        <div className="flex-1 flex flex-col items-start justify-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#232F3E] dark:text-white mb-6 leading-tight">
            Constantly Sell, in-person and Online with Cloud <span className="text-[#1746a0]">POS</span>
          </h2>
          <p className="text-lg md:text-xl text-[#232F3E]/80 dark:text-gray-300">
            Stay connected to your business and sell more. Sell your products anywhere, across branches, in-person and on the go online with cloud POS from any device. Connect POS devices, manage cashiers' sessions and shifts, call products with barcodes and sell faster.<br /><br />
            Integrated with online Sales and inventory management, manage sales in real-time, receive payments and let your customers always have access to you. Generate detailed POS sales and profit reports and monitor your retail sales.
          </p>
        </div>
        {/* Image Side */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src="/src/images/sales3-Photoroom-Photoroom.png"
            alt="Cloud POS"
            className="w-full max-w-xl rounded-2xl shadow-2xl border border-[#e5e7eb] dark:border-[#232F3E] bg-white/80 backdrop-blur-md object-contain"
            style={{ boxShadow: '0 8px 40px 0 rgba(119,74,103,0.10), 0 1.5px 8px 0 rgba(64,185,60,0.08)' }}
          />
        </div>
      </section>

      {/* Blobs animation styles */}
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
        @keyframes blob2 {
          0% { transform: scale(1) translateY(0px) rotate(0deg); }
          50% { transform: scale(1.08) translateY(-18px) rotate(8deg); }
          100% { transform: scale(1) translateY(0px) rotate(0deg); }
        }
        .animate-blob2 {
          animation: blob2 12s infinite linear;
        }
        @keyframes blob3 {
          0% { transform: scale(1) translateY(0px) rotate(0deg); }
          50% { transform: scale(1.12) translateY(16px) rotate(-6deg); }
          100% { transform: scale(1) translateY(0px) rotate(0deg); }
        }
        .animate-blob3 {
          animation: blob3 16s infinite linear;
        }
      `}</style>
    </section>
  </>
);

export default Sales;
