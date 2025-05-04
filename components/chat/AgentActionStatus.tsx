import React from 'react';
import { AgentAction, AgentStatus, Screenshot } from '../../lib/types';
import ScreenshotGallery from './ScreenshotGallery';

interface AgentActionStatusProps {
  action: AgentAction;
  status: AgentStatus;
  screenshots: Screenshot[];
}

const AgentActionStatus: React.FC<AgentActionStatusProps> = ({
  action,
  status,
  screenshots,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case AgentStatus.Thinking:
        return (
          <div className="animate-pulse text-orange-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case AgentStatus.Executing:
        return (
          <div className="text-green-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      case AgentStatus.Error:
        return (
          <div className="text-red-500">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              <path d="M12 8V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 16V16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case AgentStatus.Thinking:
        return 'Thinking...';
      case AgentStatus.Executing:
        return 'Executing...';
      case AgentStatus.Error:
        return 'Error';
      case AgentStatus.Done:
        return 'Done';
      default:
        return '';
    }
  };

  return (
    <div className="flex justify-start">
      <div className="max-w-3xl rounded-lg p-4 bg-white border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          {getStatusIcon()}
          <div>
            <div className="font-medium">{action.title}</div>
            {action.description && (
              <div className="text-sm text-gray-600">{action.description}</div>
            )}
          </div>
          <div className="ml-auto text-sm font-medium text-gray-500">
            {getStatusText()}
          </div>
        </div>

        {/* Loading animation when thinking */}
        {status === AgentStatus.Thinking && (
          <div className="space-y-2 mt-4">
            <div className="h-2 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-1/2"></div>
            <div className="h-2 bg-gray-200 rounded animate-pulse w-5/6"></div>
          </div>
        )}

        {/* Show screenshots if available */}
        {screenshots.length > 0 && (
          <div className="mt-4">
            <ScreenshotGallery screenshots={screenshots} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentActionStatus;