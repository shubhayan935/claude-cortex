"use client"

import type React from "react"
import { useState } from "react"
import type { Screenshot } from "../../lib/types"
import { FiChevronDown, FiChevronRight } from "react-icons/fi"

interface ActionStepProps {
  title: string
  description?: string
  screenshot: Screenshot // Single screenshot
  status: string
  isLoading?: boolean
}

const ActionStep: React.FC<ActionStepProps> = ({ title, description, screenshot, status, isLoading = false }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div
      className="border border-gray-200 rounded-lg mb-3 overflow-hidden bg-white"
      style={{ width: "fit-content", maxWidth: "100%" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 p-3 cursor-pointer hover:bg-amber-50 w-full"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="text-gray-400">{isExpanded ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}</div>

        {isLoading && (
          <div className="animate-spin mr-2 text-amber-600">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        )}

        <div className="font-medium text-gray-900">{title || `Step ${screenshot.step}`}</div>

        {status && <div className="text-xs text-gray-500 ml-auto">{status}</div>}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="p-3 border-t border-gray-100">
          {description && <div className="text-sm text-gray-700 mb-3">{description}</div>}

          <div className="border border-gray-200 rounded overflow-hidden" style={{ maxWidth: "400px" }}>
            {screenshot.base64 ? (
              <img
                src={`data:image/png;base64,${screenshot.base64}`}
                alt={`Screenshot step ${screenshot.step}`}
                className="w-full object-contain"
              />
            ) : (
              <img
                src={screenshot.url || "/placeholder.svg"}
                alt={`Screenshot step ${screenshot.step}`}
                className="w-full object-contain"
              />
            )}
            <div className="text-xs text-gray-500 p-2 bg-gray-50">
              Step {screenshot.step}
              {screenshot.description && ` - ${screenshot.description}`}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionStep
