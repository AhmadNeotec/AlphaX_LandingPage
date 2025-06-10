import React from 'react';

const TrialBanner = () => (
  <section className="relative w-full bg-gradient-to-br from-[#1746a0] via-[#774A67] to-[#8b5cf6] py-16 px-4 flex items-center justify-center overflow-hidden">
    <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-5xl mx-auto">
      <div className="text-center md:text-left">
        <h2 className="text-3xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-[#3b82f6] via-[#774A67] to-[#8b5cf6] bg-clip-text text-white/90 drop-shadow-xl">
          Start a free trial
        </h2>
        <p className="text-white/90 text-lg font-medium mb-0">
          Get started with a new account in no time. Try it for 14 days.<br />No credit card required.
        </p>
      </div>
      <a href="/signup" className="inline-block px-10 py-5 rounded-lg bg-green-500 hover:bg-green-600 text-white font-bold text-lg shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 whitespace-nowrap">
        GET STARTED FOR FREE
      </a>
    </div>
    {/* Decorative mesh/blob on the right */}
    <div className="absolute right-0 top-0 bottom-0 w-1/2 h-full pointer-events-none z-0 flex items-center justify-end">
      <svg className="w-full h-full max-w-xl opacity-30" viewBox="0 0 700 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 200 Q 175 400 350 200 T 700 200 V400 H0Z" fill="#8b5cf6" fillOpacity="0.18" />
        <path d="M0 100 Q 225 300 450 100 T 700 100 V400 H0Z" fill="#3b82f6" fillOpacity="0.10" />
      </svg>
    </div>
  </section>
);

export default TrialBanner; 