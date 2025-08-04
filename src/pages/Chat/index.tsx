import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import './chat.css';

const ChatPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>('1');

  return (
    <div className="chat-container">
      <ChatList onSelectChat={setSelectedChatId} selectedChatId={selectedChatId} />
      <ChatWindow chatId={selectedChatId} />
    </div>
  );
};

export default ChatPage; 