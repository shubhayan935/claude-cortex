"use client"

import type React from "react"
import { type AgentAction, AgentStatus, type Screenshot } from "../../lib/types"
import ActionStep from "./ActionStep"

interface AgentActionStatusProps {
  action: AgentAction
  status: AgentStatus
  screenshots: Screenshot[]
}

const AgentActionStatus: React.FC<AgentActionStatusProps> = ({ action, status, screenshots }) => {
  const getStatusText = () => {
    switch (status) {
      case AgentStatus.Thinking:
        return "Thinking..."
      case AgentStatus.Executing:
        return "Executing..."
      case AgentStatus.Error:
        return "Error"
      case AgentStatus.Done:
        return "Done"
      default:
        return ""
    }
  }

  return (
    <div className="flex flex-col items-start w-auto">
      {/* Show action header */}
      <div className="mb-2">
        <div className="font-medium text-gray-900">{action.title}</div>
        {action.description && <div className="text-sm text-gray-700">{action.description}</div>}
      </div>

      {/* Show each screenshot as a separate step */}
      {screenshots.map((screenshot, index) => (
        <ActionStep
          key={index}
          title={`Step ${screenshot.step}`}
          screenshot={screenshot}
          status={getStatusText()}
          isLoading={status === AgentStatus.Thinking || status === AgentStatus.Executing}
        />
      ))}

      {/* If no screenshots but still in progress */}
      {screenshots.length === 0 && (
        <div
          className="border border-gray-200 rounded-lg p-3 bg-white"
          style={{ width: "fit-content", maxWidth: "100%" }}
        >
          <div className="flex items-center gap-3">
            {status === AgentStatus.Thinking && (
              <div className="animate-pulse text-amber-600">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                  <path
                    d="M12 6V12L16 14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
            <div className="font-medium text-gray-900">{action.title}</div>
            <div className="text-sm text-gray-500 ml-auto">{getStatusText()}</div>
          </div>
          {status === AgentStatus.Thinking && (
            <div className="space-y-2 mt-4">
              <div className="h-2 bg-amber-100 rounded animate-pulse w-3/4"></div>
              <div className="h-2 bg-amber-100 rounded animate-pulse w-1/2"></div>
              <div className="h-2 bg-amber-100 rounded animate-pulse w-5/6"></div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AgentActionStatus
