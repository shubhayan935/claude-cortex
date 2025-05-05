"use client"

import type React from "react"
import { type Message, MessageRole, AgentStatus } from "../../lib/types"
import ActionStep from "./ActionStep"

interface ChatMessageProps {
  message: Message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.User

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg p-4 ${
          isUser ? "bg-amber-100 text-gray-800 border border-amber-200" : "bg-white border border-gray-200"
        }`}
        style={{ width: "auto", maxWidth: "100%" }}
      >
        {/* User message or agent plain response */}
        <div className="whitespace-pre-wrap mb-3">{message.content}</div>

        {/* Agent actions with steps */}
        {!isUser && message.agentActions && message.agentActions.length > 0 && (
          <div className="mt-4">
            {/* Render action header */}
            {message.agentActions.map((action, index) => (
              <div key={index} className="mb-2">
                <div className="font-medium text-gray-900">{action.title}</div>
                {action.description && <div className="text-sm text-gray-700">{action.description}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Screenshots as individual steps */}
        {!isUser && message.screenshots && message.screenshots.length > 0 && (
          <div className="mt-4 flex flex-col items-start">
            {message.screenshots.map((screenshot, index) => (
              <ActionStep
                key={index}
                title={`Step ${screenshot.step}`}
                screenshot={screenshot}
                status={
                  index === message.screenshots!.length - 1 &&
                  message.agentActions &&
                  message.agentActions[0]?.status === AgentStatus.Executing
                    ? "Executing..."
                    : "Completed"
                }
                isLoading={
                  index === message.screenshots!.length - 1 &&
                  message.agentActions &&
                  (message.agentActions[0]?.status === AgentStatus.Thinking ||
                    message.agentActions[0]?.status === AgentStatus.Executing)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
