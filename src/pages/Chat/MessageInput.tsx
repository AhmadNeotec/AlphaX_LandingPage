import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const MessageInput: React.FC<{ chatId: string }> = ({ chatId }) => {
  const [value, setValue] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setSent(true);
    setTimeout(() => setSent(false), 300);
    setValue('');
  };

  return (
    <form className={`message-input${sent ? ' sent' : ''}`} onSubmit={handleSend}>
      <input
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" aria-label="Send">
        <FaPaperPlane size={18} style={{ marginRight: 2 }} />
      </button>
    </form>
  );
};

export default MessageInput; 