import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ user, currentUser, messages, isTyping, onSendMessage, onTyping, onBack }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Memoized scroll function
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Scroll to bottom on new messages or typing indicator
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Auto-focus input when chat window opens
  useEffect(() => {
    inputRef.current?.focus();
  }, [user]);

  // Handle message submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    
    onSendMessage(trimmedMessage);
    setMessage('');
    onTyping(false);
  };

  // Handle key events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Handle typing indicators with debounce
  const handleChange = (e) => {
    const newValue = e.target.value;
    setMessage(newValue);
    onTyping(newValue.trim().length > 0);
  };

  // Format last seen time
  const formatLastSeen = (date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const lastSeen = new Date(date);
    const diffInHours = (now - lastSeen) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `Last seen today at ${lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInHours < 48) {
      return `Last seen yesterday at ${lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return `Last seen ${lastSeen.toLocaleDateString()}`;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center shadow-sm">
        {onBack && (
          <button 
            onClick={onBack}
            className="mr-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Back to contacts"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
        )}
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div 
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              user.online ? 'bg-green-500' : 'bg-gray-400'
            }`}
            title={user.online ? 'Online' : 'Offline'}
          />
        </div>
        <div className="ml-3 flex-1">
          <h2 className="font-semibold text-gray-800">{user.username}</h2>
          <p className="text-xs text-gray-500">
            {user.online ? 'Online' : formatLastSeen(user.lastSeen)}
          </p>
        </div>
      </div>

      {/* Messages area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 bg-opacity-95"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%239C92AC\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")' }}
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm">Start a conversation with {user.username}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((msg) => (
              <Message
                key={msg._id || `${msg.sender._id}-${msg.timestamp}`}
                message={msg}
                isCurrentUser={msg.sender._id === currentUser._id}
              />
            ))}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => message.trim() && onTyping(true)}
              onBlur={() => onTyping(false)}
              aria-label="Type your message"
            />
            {message && (
              <button
                type="button"
                onClick={() => setMessage('')}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear message"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={!message.trim()}
            className="ml-2 p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label="Send message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

ChatWindow.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
    lastSeen: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }).isRequired,
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      sender: PropTypes.shape({
        _id: PropTypes.string.isRequired,
      }).isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  isTyping: PropTypes.bool.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  onTyping: PropTypes.func.isRequired,
  onBack: PropTypes.func,
};

export default ChatWindow;