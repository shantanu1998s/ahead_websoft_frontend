import React from 'react';
import { format } from 'date-fns';

const Message = ({ message, isCurrentUser }) => {
  return (
    <div className={`flex px-4 py-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`relative max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl shadow-md transition-all duration-300 ${
          isCurrentUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="break-words text-sm">{message.content}</p>
        <div className="flex items-center justify-end mt-2 space-x-1">
          <p className={`text-[11px] ${
            isCurrentUser ? 'text-blue-200' : 'text-gray-500'
          }`}>
            {format(new Date(message.timestamp), 'h:mm a')}
          </p>
          {isCurrentUser && message.read && (
            <span className="text-[11px] text-blue-200">✓✓</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
