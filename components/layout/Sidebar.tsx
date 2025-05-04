import React from 'react';
import { useChat } from '../../context/ChatContext';
import { FiPlus, FiMessageSquare } from 'react-icons/fi';
import Image from 'next/image';

const Sidebar: React.FC = () => {
  const { chats, currentChat, createNewChat, selectChat } = useChat();

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-semibold">Claude Cortex</h1>
      </div>

      <div className="p-2">
        <button
          onClick={createNewChat}
          className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <FiPlus className="text-gray-600" />
          <span>Start new chat</span>
        </button>
      </div>

      <div className="p-3 text-sm font-medium text-gray-700">
        <h2>Starred</h2>
      </div>

      <div className="px-2">
        <div
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <FiMessageSquare className="text-gray-600" />
          <span>Introducing Claude Cortex</span>
        </div>
      </div>

      <div className="p-3 text-sm font-medium text-gray-700">
        <h2>Recents</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer ${
              currentChat?.id === chat.id ? 'bg-gray-100' : ''
            }`}
            onClick={() => selectChat(chat.id)}
          >
            <FiMessageSquare className="text-gray-600" />
            <span className="truncate">{chat.title || '(New chat)'}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto p-2 border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 rounded-lg">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-white">
            N
          </div>
          <span>Free plan</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;