"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useChat } from "../../context/ChatContext"
import ChatMessage from "./ChatMessage"
import ChatInput from "./ChatInput"
import AgentActionStatus from "./AgentActionStatus"

const ChatContainer: React.FC = () => {
  const { currentChat, agentStatus, currentAction, currentScreenshots, isConnected, sendMessage, createNewChat } =
    useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentChat?.messages])

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      {/* <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium text-gray-900">Cortex Analysis</h2>
          {isConnected && (
            <div className="flex items-center ml-2">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-gray-500">Connected</span>
            </div>
          )}
        </div>
        <button
          className="px-3 py-1 bg-amber-100 hover:bg-amber-200 rounded-md text-sm text-gray-800 border border-amber-200"
          onClick={createNewChat}
        >
          New Analysis
        </button>
      </div> */}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {currentChat?.messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Current agent status if active */}
        {currentAction && (
          <AgentActionStatus action={currentAction} status={agentStatus} screenshots={currentScreenshots} />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <ChatInput onSendMessage={sendMessage} />
      </div>
    </div>
  )
}

export default ChatContainer
