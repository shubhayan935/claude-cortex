import React, { useState } from 'react';
import { Screenshot } from '../../lib/types';
import Image from 'next/image';

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
}

const ScreenshotGallery: React.FC<ScreenshotGalleryProps> = ({ screenshots }) => {
  const [selectedIndex, setSelectedIndex] = useState(screenshots.length - 1);
  const selectedScreenshot = screenshots[selectedIndex];

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-2">Browser Screenshots:</h4>
      
      {/* Main screenshot display */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-2">
        {selectedScreenshot.base64 ? (
          <img 
            src={`data:image/png;base64,${selectedScreenshot.base64}`} 
            alt={`Screenshot step ${selectedScreenshot.step}`}
            className="w-full max-h-96 object-contain"
          />
        ) : (
          <img 
            src={selectedScreenshot.url} 
            alt={`Screenshot step ${selectedScreenshot.step}`}
            className="w-full max-h-96 object-contain"
          />
        )}
      </div>
      
      {/* Thumbnail navigation */}
      {screenshots.length > 1 && (
        <div className="flex overflow-x-auto gap-2 pb-2">
          {screenshots.map((screenshot, index) => (
            <div 
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`cursor-pointer border-2 rounded-md overflow-hidden flex-shrink-0 ${
                index === selectedIndex ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {screenshot.base64 ? (
                <img 
                  src={`data:image/png;base64,${screenshot.base64}`} 
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={60}
                  className="object-cover w-20 h-14"
                />
              ) : (
                <img 
                  src={screenshot.url} 
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={60}
                  className="object-cover w-20 h-14"
                />
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Step indicator */}
      <div className="text-xs text-gray-500 mt-1">
        Step {selectedScreenshot.step} of {screenshots.length}
        {selectedScreenshot.description && ` - ${selectedScreenshot.description}`}
      </div>
    </div>
  );
};

export default ScreenshotGallery;