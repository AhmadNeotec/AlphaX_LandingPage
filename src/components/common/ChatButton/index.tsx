import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiSend, FiUser } from 'react-icons/fi';
import { BsRobot } from 'react-icons/bs';
import { useState, useRef, useEffect } from 'react';

// Define predefined questions and answers
const predefinedQA = [
  {
    question: "What is ERPNext?",
    answer: "ERPNext is a free and open-source integrated Enterprise Resource Planning (ERP) software.",
  },
  {
    question: "What is Frappe Framework?",
    answer: "Frappe Framework is a full-stack web application framework written in Python and JavaScript, used to build ERPNext.",
  },
  {
    question: "What modules are in ERPNext?",
    answer: "ERPNext includes modules like CRM, Sales, Purchase, Inventory, Manufacturing, Accounting, HR, Project Management, and more.",
  },
  {
    question: "How do I install ERPNext?",
    answer: "You can install ERPNext using the Frappe Bench tool or by using their cloud hosting service.",
  },
  {
    question: "Is ERPNext free?",
    answer: "Yes, ERPNext is open-source and free to use. You can host it yourself or use their paid cloud hosting.",
  },
];

interface ChatButtonProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const ChatButton = ({ position = 'bottom-right', className = '' }: ChatButtonProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Replace useChat with local state
  const [messages, setMessages] = useState<{
    id: number;
    role: 'user' | 'assistant';
    content: string;
  }[]>(
    // Initial welcome message
    [{
      id: 1,
      role: 'assistant',
      content: "Hello! Ask me about ERPNext or Frappe.",
    }]
  );
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle input change and suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    if (value.length > 1) { // Start showing suggestions after 2 characters
      const filteredSuggestions = predefinedQA
        .map(qa => qa.question.toLowerCase())
        .filter(question => question.includes(value.toLowerCase()));
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]); // Clear suggestions after selection
    if (inputRef.current) {
      inputRef.current.focus(); // Keep focus on input after selecting suggestion
    }
  };

  // Handle sending message locally
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage = { id: messages.length + 1, role: 'user' as const, content: input.trim() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput('');
    setSuggestions([]); // Clear suggestions on send
    setIsLoading(true); // Show loading indicator

    // Determine bot response
    let botResponseContent = "Sorry, I can only answer questions about ERPNext and Frappe at the moment.";

    const lowerCaseInput = newUserMessage.content.toLowerCase();

    if (lowerCaseInput === 'hello') {
      botResponseContent = "Hello there! How can I help you with ERPNext or Frappe today?";
    } else {
      // Find predefined answer
      const matchedQA = predefinedQA.find(
        (qa) => qa.question.toLowerCase() === lowerCaseInput
      );

      if (matchedQA) {
        botResponseContent = matchedQA.answer;
      }
    }

    setTimeout(() => {
      setIsLoading(false); // Hide loading indicator
      const newBotMessage = { id: messages.length + 2, role: 'assistant' as const, content: botResponseContent };
      setMessages((prevMessages) => [...prevMessages, newBotMessage]);
    }, 500); // Simulate bot thinking time
  };

  return (
    <div className="fixed z-50">
      {/* Chat Button */}
      <motion.button
        className={`fixed ${positionClasses[position]} bg-[#774A67] text-white p-4 rounded-full shadow-lg hover:bg-[#8b577b] transition-all duration-200 flex items-center gap-2 ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <FiMessageCircle className="w-6 h-6" />
        <span className="hidden sm:inline">Chat with us</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateX: -15 }}
            transition={{ duration: 0.3 }}
            className={`fixed ${chatWindowPosition[position]} w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col overflow-hidden`}
            style={{ perspective: '1000px' }}
          >
            {/* Decorative Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <svg className="absolute -top-20 -right-20 w-40 h-40 text-[#774A67]/10" viewBox="0 0 200 200">
                <path fill="currentColor" d="M45.7,-77.2C58.9,-69.9,69.4,-57.3,77.2,-43.1C84.9,-28.9,89.8,-13.1,88.5,1.8C87.2,16.7,79.7,31.6,70.2,44.5C60.7,57.4,49.2,68.3,35.3,74.8C21.4,81.3,5.1,83.4,-10.5,80.8C-26.1,78.2,-41,70.9,-53.2,60.1C-65.4,49.3,-75,35,-79.8,19.1C-84.6,3.2,-84.6,-14.3,-78.5,-28.9C-72.4,-43.5,-60.2,-55.2,-46.3,-62.5C-32.4,-69.8,-16.2,-72.7,0.2,-73.1C16.6,-73.5,32.5,-84.4,45.7,-77.2Z" transform="translate(100 100)" />
              </svg>
              <svg className="absolute -bottom-20 -left-20 w-40 h-40 text-[#774A67]/10" viewBox="0 0 200 200">
                <path fill="currentColor" d="M39.8,-65.9C52.3,-58.9,63.5,-49.3,71.8,-37.2C80.1,-25.1,85.5,-10.5,84.2,3.1C82.9,16.7,74.9,29.3,65.2,40.2C55.5,51.1,44.1,60.3,31.2,66.5C18.3,72.7,3.9,75.9,-10.1,74.8C-24.1,73.7,-37.7,68.3,-49.1,59.5C-60.5,50.7,-69.7,38.5,-75.2,24.6C-80.7,10.7,-82.5,-4.9,-78.8,-19.1C-75.1,-33.3,-65.9,-46.1,-53.5,-53.1C-41.1,-60.1,-25.5,-61.3,-10.8,-65.1C3.9,-68.9,17.8,-75.3,39.8,-65.9Z" transform="translate(100 100)" />
              </svg>
            </div>

            <div className="p-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#774A67] flex items-center justify-center">
                    <BsRobot className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">AlphaX Assistant</h3>
                </div>
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' ? 'bg-[#774A67]' : 'bg-gray-200'
                  }`}>
                    {message.role === 'user' ? (
                      <FiUser className="w-4 h-4 text-white" />
                    ) : (
                      <BsRobot className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-[#774A67] text-white'
                        : 'bg-gray-100 text-gray-800'
                    } shadow-md transform hover:scale-[1.02] transition-transform`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                     <BsRobot className="w-4 h-4 text-gray-600" />
                   </div>
                   <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-800 shadow-md">
                      <div className="flex items-center gap-2">
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                         <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                       </div>
                   </div>
                 </div>
              )}
              {error && (
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-red-200 flex items-center justify-center">
                     <BsRobot className="w-4 h-4 text-red-600" />
                   </div>
                   <div className="max-w-[80%] rounded-lg p-3 bg-red-100 text-red-800 shadow-md">
                      <p className="text-sm whitespace-pre-line">Error: {error}</p>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form
              className="p-4 border-t border-gray-200 bg-white/80 backdrop-blur-sm relative"
              onSubmit={handleSendMessage}
            >
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="absolute bottom-full left-0 right-0 bg-white border border-gray-300 rounded-lg mb-2 overflow-hidden shadow-lg z-10">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-800 text-sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask about ERPNext or Frappe..."
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#774A67] shadow-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="bg-[#774A67] text-white p-2 rounded-lg hover:bg-[#8b577b] transition-colors shadow-md"
                >
                  <FiSend className="w-5 h-5" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatButton; 