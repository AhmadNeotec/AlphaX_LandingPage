import React from 'react';
import Navbar from '../components/sections/Navbar';
import { FaWhatsapp, FaPhoneAlt, FaFax } from 'react-icons/fa';
import { MdEmail, MdLocationOn } from 'react-icons/md';

const ContactPage: React.FC = () => {
  return (
    <>
      <style>{`
        .contact-form-neon input:focus, .contact-form-neon textarea:focus, .contact-form-neon select:focus {
          box-shadow: 0 0 0 2px #ede7f6, 0 0 8px 2px #774A67;
          border-color: #774A67;
          outline: none;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
      `}</style>
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c] flex flex-col items-center justify-center py-20 px-2">
        
        {/* Background Blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />

        <Navbar />

        <div className="max-w-6xl w-full bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl p-10 md:p-16 flex flex-col md:flex-row gap-8 mt-24 z-10 relative neon-glow-box contact-form-neon">
          
          {/* Contact Information */}
          <div className="flex-1 border-r border-gray-200 dark:border-gray-700 pr-0 md:pr-8 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-[#232F3E] dark:text-white mb-6">Contact Information</h2>
            
            <div className="mb-6 flex items-start gap-3">
              <MdLocationOn className="w-6 h-6 text-[#774A67]" />
              <div>
                <p className="font-medium text-[#232F3E] dark:text-white">Bldg No: 7274</p>
                <p className="text-gray-700 dark:text-gray-300">Postal Code 12629</p>
                <p className="text-gray-700 dark:text-gray-300">Riyadh, Kingdom of Saudi Arabia</p>
              </div>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <FaPhoneAlt className="w-5 h-5 text-[#774A67]" />
              <span className="font-medium text-white">Riyadh: 92 0031990</span>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <FaPhoneAlt className="w-5 h-5 text-[#774A67]" />
              <span className="font-medium text-white">Jeddah: 012-6677744</span>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <FaWhatsapp className="w-5 h-5 text-[#774A67]" />
              <span className="font-medium text-white">WhatsApp: 05551 27375</span>
            </div>

            <div className="mb-4 flex items-center gap-3">
              <FaFax className="w-5 h-5 text-[#774A67]" />
              <span className="font-medium text-white">Fax: 011-2912942</span>
            </div>

            <div className="flex items-center gap-3">
              <MdEmail className="w-5 h-5 text-[#774A67]" />
              <span className="font-medium text-white">Email: irsaasales@irsaa.com</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-1 flex flex-col gap-4">
            <form className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="font-semibold text-[#232F3E] dark:text-white">Name <span className="text-red-500">*</span></label>
                <input id="name" name="name" type="text" required className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-[#23232a] focus:outline-none focus:ring-2 focus:ring-[#774A67]" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="font-semibold text-[#232F3E] dark:text-white">Email Address <span className="text-red-500">*</span></label>
                <input id="email" name="email" type="email" required className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-[#23232a] focus:outline-none focus:ring-2 focus:ring-[#774A67]" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="subject" className="font-semibold text-[#232F3E] dark:text-white">Subject <span className="text-red-500">*</span></label>
                <input id="subject" name="subject" type="text" required className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-[#23232a] focus:outline-none focus:ring-2 focus:ring-[#774A67]" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="phone" className="font-semibold text-[#232F3E] dark:text-white">Phone <span className="text-red-500">*</span></label>
                <input id="phone" name="phone" type="tel" required className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-[#23232a] focus:outline-none focus:ring-2 focus:ring-[#774A67]" />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="message" className="font-semibold text-[#232F3E] dark:text-white">Message <span className="text-red-500">*</span></label>
                <textarea id="message" name="message" rows={5} required className="rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 bg-gray-100 dark:bg-[#23232a] focus:outline-none focus:ring-2 focus:ring-[#774A67]" />
              </div>
              <button type="submit" className="mt-2 px-6 py-3 bg-[#774A67] hover:bg-[#5e3752] text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#774A67] focus:ring-offset-2">
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage;
