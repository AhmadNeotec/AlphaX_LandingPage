import React from 'react';
import MessageInput from './MessageInput';
import { FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

type ChatWindowProps = {
  chatId: string | null;
};

const dummyMessages: Record<string, { id: string; sender: string; text: string }[]> = {
  '1': [
    { id: 'm1', sender: 'Alice', text: 'Hello General!' },
    { id: 'm2', sender: 'Bob', text: 'Hi Alice!' },
  ],
  '2': [
    { id: 'm3', sender: 'Support', text: 'How can we help you?' },
  ],
  '3': [
    { id: 'm4', sender: 'Dev', text: 'Code review at 3pm.' },
  ],
};

const selfName = 'Alice'; // For demo, treat Alice as self

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const messages = chatId ? dummyMessages[chatId] || [] : [];

  return (
    <div className="chat-window">
      {chatId ? (
        <>
          <div className="messages">
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                className={`message${msg.sender === selfName ? ' self' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.07 }}
              >
                <span className="avatar">
                  <FaUserCircle size={20} />
                </span>
                <span>
                  <strong>{msg.sender}:</strong> {msg.text}
                </span>
              </motion.div>
            ))}
          </div>
          <MessageInput chatId={chatId} />
        </>
      ) : (
        <div className="no-chat">Select a chat to start messaging</div>
      )}
    </div>
  );
};

export default ChatWindow; 