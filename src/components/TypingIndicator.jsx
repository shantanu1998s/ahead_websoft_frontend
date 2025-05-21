import React from "react";

const TypingIndicator = () => {
  return (
    <div className="flex justify-start px-4 py-2">
      <div className="bg-white shadow-md px-4 py-3 rounded-2xl rounded-bl-none max-w-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0s]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.15s]"></span>
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.3s]"></span>
        </div>
        <p className="text-xs text-gray-400 mt-2">Typing...</p>
      </div>
    </div>
  );
};

export default TypingIndicator;
