import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle } from 'react-icons/fi';
import { useState } from 'react';

interface ChatButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const ChatButton = ({ position = 'bottom-right', className = '' }: ChatButtonProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const positionClasses = {
    'bottom-right': 'bottom-8 right-8',
    'bottom-left': 'bottom-8 left-8',
    'top-right': 'top-8 right-8',
    'top-left': 'top-8 left-8',
  };

  const chatWindowPosition = {
    'bottom-right': 'bottom-24 right-8',
    'bottom-left': 'bottom-24 left-8',
    'top-right': 'top-24 right-8',
    'top-left': 'top-24 left-8',
  };

  return (
    <div className="fixed z-50">
      {/* Chat Button */}
      <motion.button
        className={`fixed ${positionClasses[position]} bg-[#774A67] text-white p-3 rounded-full shadow-lg hover:bg-[#8b577b] transition-all duration-200 flex items-center gap-2 ${className}`}
        whileHover={{ 
          scale: 1.1,
          rotateY: 10,
          rotateX: 5,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        whileTap={{ 
          scale: 0.95,
          rotateY: -5,
          rotateX: -2
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "1000px"
        }}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <FiMessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline text-sm">Chat</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -15, rotateY: 10 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              rotateX: 0,
              rotateY: 0,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -15, rotateY: -10 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className={`fixed ${chatWindowPosition[position]} w-[320px] h-[480px] bg-white rounded-lg border border-gray-200 overflow-hidden`}
            style={{ 
              perspective: '1000px',
              transformStyle: "preserve-3d"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#774A67]/5 to-transparent pointer-events-none" />
            <iframe
              src="https://www.yeschat.ai/i/gpts-ZxX7fHJF-Frappe-GPT"
              className="w-full h-full border-0 scale-[0.85] origin-top"
              title="Frappe GPT Chat"
              allow="microphone"
              style={{
                transform: "translateZ(20px)",
                transformStyle: "preserve-3d"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatButton; 