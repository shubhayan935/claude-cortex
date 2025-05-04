import React from 'react';
import { Message, MessageRole } from '../../lib/types';
import ScreenshotGallery from './ScreenshotGallery';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.User;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-3xl rounded-lg p-4 ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        {/* Show screenshots if available */}
        {!isUser && message.screenshots && message.screenshots.length > 0 && (
          <div className="mt-4">
            <ScreenshotGallery screenshots={message.screenshots} />
          </div>
        )}
        
        {/* Show agent actions if available */}
        {!isUser && message.agentActions && message.agentActions.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Agent Actions:</h4>
            <ul className="space-y-2">
              {message.agentActions.map((action, index) => (
                <li key={index} className="text-sm">
                  <span className="font-medium">{action.title}</span>
                  {action.description && (
                    <p className="text-gray-600">{action.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;