import React from "react";
const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg rounded-bl-none max-w-xs">
        <div className="flex space-x-1">
          <span className="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
          <span className="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
          <span className="typing-dot w-2 h-2 bg-gray-500 rounded-full"></span>
        </div>
        <p className="text-xs text-gray-500 mt-1">typing...</p>
      </div>
    </div>
  );
};

export default TypingIndicator;