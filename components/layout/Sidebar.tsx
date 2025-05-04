import React from 'react';
import { useChat } from '../../context/ChatContext';
import { FiPlus, FiMessageSquare } from 'react-icons/fi';

const Sidebar: React.FC = () => {
  const { chats, currentChat, createNewChat, selectChat } = useChat();

  return (
    <aside className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="flex gap-2 p-4 border-b border-gray-200">
        <svg className="mt-0.5 w-6 h-6 text-amber-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
        </svg>
        <h1 className="text-xl text-amber-800 font-semibold">Claude Cortex</h1>
      </div>

      <div className="p-2">
        <button
          onClick={createNewChat}
          className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-amber-50 transition-colors"
        >
          <FiPlus className="text-gray-600" />
          <span className="text-gray-800">Start new chat</span>
        </button>
      </div>

      <div className="p-3 text-sm font-medium text-gray-700">
        <h2>Starred</h2>
      </div>

      <div className="px-2">
        <div
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
        >
          <FiMessageSquare className="text-gray-600" />
          <span className="text-gray-800">Introducing Claude Cortex</span>
        </div>
      </div>

      <div className="p-3 text-sm font-medium text-gray-700">
        <h2>Recents</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer ${
              currentChat?.id === chat.id ? 'bg-amber-50' : ''
            }`}
            onClick={() => selectChat(chat.id)}
          >
            <FiMessageSquare className="text-gray-600" />
            <span className="truncate text-gray-800">{chat.title || '(New chat)'}</span>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
