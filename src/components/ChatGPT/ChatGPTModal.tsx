import React from 'react';
import ChatGPTInterface from './ChatGPTInterface';

interface ChatGPTModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatGPTModal: React.FC<ChatGPTModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 my-8 overflow-auto max-h-[90vh]">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 z-10"
          onClick={onClose}
          aria-label="Close ChatGPT"
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">ChatGPT Assistant</h2>
          <ChatGPTInterface />
        </div>
      </div>
    </div>
  );
};

export default ChatGPTModal; 