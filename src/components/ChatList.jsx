import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import UserStatus from './UserStatus';

const ChatList = ({ users, currentUser, selectedUser, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Format last seen time consistently with ChatWindow
  const formatLastSeen = useCallback((date) => {
    if (!date) return 'Unknown';
    const now = new Date();
    const lastSeen = new Date(date);
    const diffInHours = (now - lastSeen) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return `Today at ${lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffInHours < 48) {
      return `Yesterday at ${lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return lastSeen.toLocaleDateString();
  }, []);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(user => 
      user._id !== currentUser._id &&
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm, currentUser]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with current user profile */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
              {currentUser.username.charAt(0).toUpperCase()}
            </div>
            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
              currentUser.online ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-gray-800 text-lg">{currentUser.username}</h2>
            <p className="text-sm text-gray-500">
              {currentUser.online ? 'Online' : formatLastSeen(currentUser.lastSeen)}
            </p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="p-3 border-b border-gray-200 bg-white">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search contacts..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search contacts"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Clear search"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-lg font-medium text-gray-400">No contacts found</p>
            <p className="text-sm text-gray-400 mt-1">
              {searchTerm ? 'Try a different search' : 'Your contact list is empty'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filteredUsers.map(user => (
              <li
                key={user._id}
                className={`flex items-center p-4 cursor-pointer transition-colors ${
                  selectedUser?._id === user._id 
                    ? 'bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => onSelectUser(user)}
                aria-current={selectedUser?._id === user._id ? 'true' : 'false'}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <UserStatus online={user.online} />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {user.username}
                    </h3>
                    {!user.online && user.lastSeen && (
                      <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                        {formatLastSeen(user.lastSeen)}
                      </span>
                    )}
                  </div>
                  {/* <p className="text-sm text-gray-500 truncate">
                    {user.online ? (
                      <span className="inline-flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        Online
                      </span>
                    ) : (
                      'Offline'
                    )}
                  </p> */}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

ChatList.propTypes = {
  users: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      username: PropTypes.string.isRequired,
      online: PropTypes.bool.isRequired,
      lastSeen: PropTypes.string,
    })
  ).isRequired,
  currentUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    online: PropTypes.bool.isRequired,
    lastSeen: PropTypes.string,
  }).isRequired,
  selectedUser: PropTypes.shape({
    _id: PropTypes.string.isRequired,
  }),
  onSelectUser: PropTypes.func.isRequired,
};

export default ChatList;