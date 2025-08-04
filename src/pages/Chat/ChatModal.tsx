import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import './chatModal.css';

interface ChatModalProps {
  open: boolean;
  onClose: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ open, onClose }) => {
  const [selectedChatId, setSelectedChatId] = React.useState<string | null>(null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="chat-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Animated blobs */}
          <div className="chat-modal-blob chat-modal-blob-1" />
          <div className="chat-modal-blob chat-modal-blob-2" />
          <motion.div
            className="chat-modal"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            {/* 3D Shine */}
            <div className="chat-modal-shine" />
            {/* Close Button */}
            <button className="chat-modal-close" onClick={onClose} aria-label="Close chat">
              <FaTimes size={20} />
            </button>
            <div className="chat-modal-content">
              <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
              <ChatWindow chatId={selectedChatId} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal; 