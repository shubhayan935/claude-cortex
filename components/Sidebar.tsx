"use client"

import type React from "react"
import { useChat } from "../context/ChatContext"
import { Plus, MessageSquare, History, Star, Settings, ChevronRight } from "lucide-react"

const Sidebar: React.FC = () => {
  const { chats, currentChat, createNewChat, selectChat } = useChat()

  // Group chats by date (today, yesterday, older)
  const starredChats = chats.filter((chat) => chat.isStarred)
  const recentChats = chats.filter((chat) => !chat.isStarred)

  return (
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h1 className="text-lg font-medium text-gray-900">Cortex</h1>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
          <Settings size={18} />
        </button>
      </div>

      {/* New chat button */}
      <div className="p-4">
        <button
          onClick={createNewChat}
          className="w-full flex items-center justify-between p-3 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-2">
            <Plus size={18} />
            <span className="font-medium">New Analysis</span>
          </div>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Chat lists */}
      <div className="flex-1 overflow-y-auto">
        {/* Starred chats */}
        {starredChats.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-500 uppercase">
              <Star size={14} />
              <span>Starred</span>
            </div>
            <div className="space-y-1 px-2">
              {starredChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md text-left ${
                    currentChat?.id === chat.id ? "bg-amber-50 text-amber-800" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare size={16} />
                  <span className="truncate text-sm">{chat.title || "New Analysis"}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent chats */}
        <div>
          <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-500 uppercase">
            <History size={14} />
            <span>Recent</span>
          </div>
          <div className="space-y-1 px-2">
            {recentChats.length > 0 ? (
              recentChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-md text-left ${
                    currentChat?.id === chat.id ? "bg-amber-50 text-amber-800" : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <MessageSquare size={16} />
                  <span className="truncate text-sm">{chat.title || "New Analysis"}</span>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No recent analyses</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
