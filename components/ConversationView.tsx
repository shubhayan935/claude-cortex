"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { useChat } from "../context/ChatContext"
import { MessageRole, type Message } from "../lib/types"
import { User, Bot, ArrowRight } from "lucide-react"

const ConversationView: React.FC = () => {
  const { currentChat } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentChat?.messages])

  if (!currentChat) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-amber-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-2">Welcome to Cortex</h2>
        <p className="text-center max-w-md mb-6">
          Ask me to browse the web, analyze content, or help you with research. I can navigate websites and show you
          what I find.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
          {[
            { title: "Browse a website", description: "I can visit websites and show you what I find" },
            { title: "Research a topic", description: "I can gather information from multiple sources" },
            { title: "Compare products", description: "I can help you evaluate different options" },
            { title: "Find information", description: "I can search for specific details online" },
          ].map((suggestion, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-amber-300 cursor-pointer transition-colors"
            >
              <h3 className="font-medium text-gray-900 mb-1">{suggestion.title}</h3>
              <p className="text-sm text-gray-500">{suggestion.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h2 className="text-lg font-medium text-gray-900">{currentChat.title || "New Analysis"}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {currentChat.messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

interface MessageItemProps {
  message: Message
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === MessageRole.User

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-3xl ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? "ml-4" : "mr-4"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isUser ? "bg-amber-100" : "bg-gray-100"
            }`}
          >
            {isUser ? <User size={16} className="text-amber-700" /> : <Bot size={16} className="text-gray-700" />}
          </div>
        </div>

        {/* Message content */}
        <div className={`rounded-lg p-4 ${isUser ? "bg-amber-50 text-gray-800" : "bg-white border border-gray-200"}`}>
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Action summary (if any) */}
          {!isUser && message.agentActions && message.agentActions.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm font-medium text-amber-700 mb-2">
                <ArrowRight size={16} />
                <span>Actions Performed</span>
              </div>
              <div className="space-y-2">
                {message.agentActions.map((action, index) => (
                  <div key={index} className="text-sm">
                    <span className="font-medium">{action.title}</span>
                    {action.description && <span className="text-gray-500"> - {action.description}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ConversationView
