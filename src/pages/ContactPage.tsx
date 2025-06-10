import React from 'react';
import Navbar from '../components/sections/Navbar';
import { FaWhatsapp, FaPhoneAlt } from 'react-icons/fa';

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
        {/* Animated/blurred background blobs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#774A67]/30 rounded-full blur-3xl animate-blob z-0" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-blob animation-delay-2000 z-0" />
        {/* Extra animated SVG blob */}
        <svg className="absolute top-24 left-0 w-60 h-60 opacity-20 z-0 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#8b5cf6" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
        </svg>
        <svg className="absolute top-20 right-0 w-60 h-60 opacity-20 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#3b82f6" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
        </svg>
        <Navbar />
        <div className="max-w-6xl w-full bg-white dark:bg-[#18181b] rounded-2xl shadow-2xl p-10 md:p-16 flex flex-col md:flex-row gap-8 mt-24 z-10 relative neon-glow-box contact-form-neon">
          {/* Contact Information */}
          <div className="flex-1 border-r border-gray-200 dark:border-gray-700 pr-0 md:pr-8 mb-8 md:mb-0">
            <h2 className="text-2xl font-bold text-[#232F3E] dark:text-white mb-6">Contact Information</h2>
            <div className="mb-4">
              <div className="text-lg font-semibold text-[#232F3E] dark:text-white">Middle East</div>
              <div className="text-base text-gray-700 dark:text-gray-300">Phone contact</div>
              <div className="flex items-center gap-2 mt-2">
                <FaPhoneAlt className="w-5 h-5 text-[#2563eb]" />
                <span className="font-medium text-[#2563eb]">+966 xxxxxxxxx</span>
              </div>
              <div className="text-xs text-gray-400 ml-7">24/7</div>
            </div>
            <div className="mb-4">
              <div className="text-base text-gray-700 dark:text-gray-300">WhatsApp</div>
              <div className="flex items-center gap-2 mt-2">
                <FaWhatsapp className="w-5 h-5 text-[#774A67]" />
                <span className="font-medium text-[#774A67]">Sales: +966 xxxxxxxxx</span>
              </div>
              <div className="text-xs text-gray-400 ml-7">Saturday-Thursday: 10 AM - 7 PM (Mecca Time)</div>
              <div className="flex items-center gap-2 mt-2 ml-7">
                <FaWhatsapp className="w-5 h-5 text-[#774A67]" />
                <span className="font-medium text-[#774A67]">Technical support: +966 xxxxxxxxx</span>
              </div>
              <div className="text-xs text-gray-400 ml-14">24/7</div>
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
        {/* Themed Image Component */}
       
        <div className="mt-10 text-center z-10 relative">
          <h3 className="text-3xl font-extrabold text-[#232F3E] dark:text-white mb-4">Have a question, comment, or want to say hi?</h3>
          <p className="text-2xl font-extrabold text-[#774A67] dark:text-[#e9eaf3] mb-2">We'll be happy to receive an e-mail from you!</p>
        </div>
        {/* Support & Inquiries Section */}
        <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 px-4 z-10 relative">
          <div>
            <h3 className="text-2xl font-bold text-[#2563eb] mb-2">Technical Support</h3>
            <p className="text-gray-600 text-lg font-medium">Have you encountered a problem with our solution or have a question about one of its features? Write to us at <a href="mailto:support@alphax.com" className="font-bold text-[#2563eb] hover:underline">support@alphax.com</a> And we will get back to you within hours.</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#2563eb] mb-2">General inquiries</h3>
            <p className="text-gray-600 text-lg font-medium"><a href="mailto:info@alphax.com" className="font-bold text-[#2563eb] hover:underline">info@alphax.com</a> and the concerned department will respond within 24 hours.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactPage; 