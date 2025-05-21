import React from 'react';
import { useEffect, useState } from 'react';
import UserStatus from './UserStatus';

const ChatList = ({ users, currentUser, selectedUser, onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const filtered = users.filter(user => 
      user._id !== currentUser._id &&
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [users, searchTerm, currentUser]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {currentUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-gray-800">{currentUser.username}</h2>
            {/* <p className="text-xs text-gray-500">
              {currentUser.online ? 'Online' : 'Offline'}
            </p> */}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search contacts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      {/* User List */}
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
            <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <p>No contacts found</p>
          </div>
        ) : (
          <ul>
            {filteredUsers.map(user => (
              <li
                key={user._id}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedUser?._id === user._id ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelectUser(user)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <UserStatus online={user.online} />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-gray-900">{user.username}</h3>
                    {user.lastSeen && !user.online && (
                      <span className="text-xs text-gray-500">
                        Last seen: {new Date(user.lastSeen).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  {/* <p className="text-sm text-gray-500 truncate">
                    {user.online ? 'Online' : 'Offline'}
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

export default ChatList;