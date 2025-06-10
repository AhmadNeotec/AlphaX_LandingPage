import { rootStore } from "@store/index";
import Icons from "./icons";
import "./style.css";
import { motion } from 'framer-motion';
import { FiMessageCircle } from 'react-icons/fi';
import { useState } from 'react';
import ChatButton from "@components/common/ChatButton";

const Hero = () => {
  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section className="wrapper">
      {/* Animated blobs background */}
      <svg className="absolute -top-24 -left-24 w-80 h-80 opacity-20 z-0 animate-blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M44.8,-67.2C57.7,-59.6,67.7,-48.2,73.2,-34.9C78.7,-21.6,79.7,-6.4,76.2,7.7C72.7,21.8,64.7,34.8,54.2,45.2C43.7,55.6,30.7,63.4,16.2,68.2C1.7,73,-14.3,74.7,-28.2,69.2C-42.1,63.7,-53.9,51,-62.2,36.2C-70.5,21.4,-75.3,4.5,-72.7,-10.7C-70.1,-25.9,-60.1,-39.4,-47.7,-47.2C-35.3,-55,-20.6,-57.1,-5.2,-54.2C10.2,-51.3,20.4,-43.7,44.8,-67.2Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute top-1/3 right-0 w-64 h-64 opacity-10 z-0 animate-blob2" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M60,-70C75,-60,80,-35,75,-15C70,5,55,20,40,35C25,50,10,65,-10,70C-30,75,-60,70,-70,55C-80,40,-70,15,-60,-5C-50,-25,-40,-40,-25,-55C-10,-70,10,-80,30,-75C50,-70,60,-80,60,-70Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-0 left-1/4 w-56 h-56 opacity-15 z-0 animate-blob3" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path fill="#774A67" d="M47.6,-67.2C60.7,-57.2,68.7,-40.7,70.2,-24.7C71.7,-8.7,66.7,6.8,59.2,21.2C51.7,35.6,41.7,48.8,28.7,56.7C15.7,64.6,-0.3,67.2,-15.7,62.2C-31.7,57.2,-47.3,44.6,-56.2,29.2C-65.1,13.8,-67.3,-5.4,-60.2,-20.7C-53.1,-36,-36.7,-47.4,-20.2,-56.2C-3.7,-65,12.8,-71.2,29.2,-70.2C45.6,-69.2,61.7,-61.2,47.6,-67.2Z" transform="translate(100 100)" />
      </svg>
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-[20dvh] mb-10 sm:mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="block font-bold text-gray-800 text-5xl md:text-6xl lg:text-7xl dark:text-gray-200 glow-text1">
              Rethink Your{" "}
              <span className="block font-bold text-[#774A67] text-6xl md:text-7xl lg:text-8xl dark:text-gray-200 glow-text1">
                Business Management
              </span>
            </h1>

            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Manage your business, from sales and invoicing, your books, your client 
              And workforce to your inventory and operations. With powerful, fully 
              Integrated business management modules implemented to meet your business needs.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <motion.button
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-[#774A67] rounded-lg shadow-md hover:bg-[#8b577b] transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  window.location.href = '/signup';
                }}
              >
                Get Started For Free
                <Icons.GetStartedChevronRight />
              </motion.button>
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5 text-[#774A67]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free 14-day trial</span>
              </div>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative z-0">
              {/* Replace src with your actual image path */}
              <img
                src="src/images/4955653-Photoroom.png"
                alt="ERP System Interface"
                className="w-[500px] h-[500px] "
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Universal Chat Button */}
      <ChatButton position="bottom-right" />

      <style>
        {`
        .glow-text1 {
          text-shadow:
            1px 1px 2px #582f4b,
            2px 2px 4px #774A67,
            3px 3px 6px #9e628b;
        }
        .glow-text2 {
          text-shadow:
            1px 1px 2px rgb(36, 35, 36),
            2px 2px 4px rgb(34, 33, 34),
            3px 3px 6px rgb(128, 126, 127);
        }
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
        `}
      </style>
    </section>
  );
};

export default Hero;
