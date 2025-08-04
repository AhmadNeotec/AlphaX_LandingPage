import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

type ChatListProps = {
  onSelectChat: (chatId: string) => void;
  selectedChatId: string | null;
};

const dummyChats = [
  { id: '1', name: 'General' },
  { id: '2', name: 'Support' },
];

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, selectedChatId }) => {
  return (
    <div className="chat-list">
      <h3>Chats</h3>
      <ul>
        {dummyChats.map((chat, idx) => (
          <motion.li
            key={chat.id}
            className={selectedChatId === chat.id ? 'selected' : ''}
            onClick={() => onSelectChat(chat.id)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
          >
            <span className="avatar">
              <FaUserCircle size={24} />
            </span>
            {chat.name}
          </motion.li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList; 