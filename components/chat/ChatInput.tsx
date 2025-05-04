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
    <div className="relative">
      <form onSubmit={handleSubmit} className="relative">
        <input
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
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500/30 bg-white text-gray-900 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={!message.trim() || isDisabled}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 rounded-md ${
            !message.trim() || isDisabled
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-amber-100 text-gray-800 hover:bg-amber-200 border border-amber-200'
          }`}
        >
          Send
        </button>
      </form>
      <div className="text-xs text-gray-500 mt-1 ml-1">
        Press Enter to send, Shift+Enter for new line
      </div>
    </div>
  );
}

export default ChatInput;
