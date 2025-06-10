import { useState } from 'react';
import { sendChatMessage, ChatResponse } from '../api/chat';

interface UseChatReturn {
  sendMessage: (message: string) => Promise<void>;
  response: string | null;
  error: string | null;
  isLoading: boolean;
}

export const useChat = (): UseChatReturn => {
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await sendChatMessage(message);
      setResponse(result.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setResponse(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendMessage,
    response,
    error,
    isLoading,
  };
}; 