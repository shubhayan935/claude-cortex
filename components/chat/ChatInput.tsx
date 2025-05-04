// components/chat/ChatInput.tsx
"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { AgentStatus } from '../../lib/types';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const { agentStatus } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const isDisabled = agentStatus === AgentStatus.Thinking || agentStatus === AgentStatus.Executing;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          isDisabled 
            ? "Processing your request..." 
            : "Type your message..."
        }
        disabled={isDisabled}
        className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none bg-white text-gray-900"
        rows={1}
      />
      <div className="absolute bottom-3 right-3 flex items-center space-x-2">
        <button
          type="submit"
          disabled={!message.trim() || isDisabled}
          className={`px-3 py-1 rounded-md ${
            !message.trim() || isDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Send
        </button>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Press Enter to send, Shift+Enter for new line
      </div>
    </form>
  );
};

export default ChatInput;