import React from 'react';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    const messageHandler = (message) => {
      setMessages(prev => [...prev, message]);
    };

    const userStatusHandler = ({ userId, online, lastSeen }) => {
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, online, lastSeen: lastSeen } : user
      ));
    };

    const typingHandler = ({ senderId, isTyping }) => {
      if (selectedUser && senderId === selectedUser._id) {
        setIsTyping(isTyping);
      }
    };

    socket.on('receiveMessage', messageHandler);
    socket.on('userStatus', userStatusHandler);
    socket.on('typingIndicator', typingHandler);
    socket.on('error', (err) => setError(err.message));

    // Load initial user list
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      socket.off('receiveMessage', messageHandler);
      socket.off('userStatus', userStatusHandler);
      socket.off('typingIndicator', typingHandler);
      socket.off('error');
    };
  }, [socket, selectedUser]);

  // Load messages when selected user changes
  useEffect(() => {
    if (!selectedUser || !currentUser) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/messages?userId=${currentUser._id}&otherUserId=${selectedUser._id}`
        );
        if (!response.ok) throw new Error('Failed to fetch messages');
        const data = await response.json();
        setMessages(data.data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMessages();
  }, [selectedUser, currentUser]);

  const handleRegister = async (username) => {
  if (!username.trim()) {
    setError('Username cannot be empty');
    return;
  }

  try {
    setLoading(true);
    setError(null);
    
    // Check if username exists first
    const checkResponse = await fetch('http://localhost:5000/api/users');
    if (!checkResponse.ok) throw new Error('Failed to check users');
    const { data: allUsers } = await checkResponse.json();
    
    const existingUser = allUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    let user;
    if (existingUser) {
      user = existingUser;
    } else {
      // If new user, create and register
      const createResponse = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      
      if (!createResponse.ok) throw new Error('Failed to create user');
      const { data: newUser } = await createResponse.json();
      user = newUser;
    }
    
    // Authenticate socket connection
    socket.emit('register', { userId: user._id });
    setCurrentUser(user);
    setLoading(false);
    
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};

  const handleSendMessage = (content) => {
  if (!selectedUser || !content.trim() || !socket || !currentUser) return;
  
  const newMessage = {
    senderId: currentUser._id,
    receiverId: selectedUser._id,
    content,
    timestamp: new Date().toISOString(),
    _id: Date.now().toString(), // Temporary ID for immediate UI update
    sender: { _id: currentUser._id, username: currentUser.username }
  };

  // Optimistically update UI immediately
  setMessages(prev => [...prev, newMessage]);
  
  // Then send to server
  socket.emit('sendMessage', {
    senderId: currentUser._id,
    receiverId: selectedUser._id,
    content
  });
};

// Update your socket message handler
useEffect(() => {
  if (!socket) return;

  const messageHandler = (message) => {
    // Check if we already have this message (by temporary ID)
    setMessages(prev => {
      const exists = prev.some(m => m._id === message._id || 
        (m.senderId === message.sender._id && 
         m.content === message.content && 
         new Date(m.timestamp).getTime() - new Date(message.timestamp).getTime() < 1000));
      
      return exists ? prev : [...prev, message];
    });
  };

  socket.on('receiveMessage', messageHandler);
  return () => socket.off('receiveMessage', messageHandler);
}, [socket]);

 const handleTyping = (isTyping) => {
  if (!selectedUser || !socket || !currentUser) return;
  
  // Use consistent event name ('typingIndicator') for both start and stop typing
  socket.emit('typingIndicator', {
    senderId: currentUser._id,
    receiverId: selectedUser._id,
    isTyping: isTyping  // Explicitly pass the boolean state
  });
};

  if (loading && !currentUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading chat application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 bg-white flex flex-col">
        {currentUser ? (
          <ChatList 
            users={users} 
            currentUser={currentUser}
            selectedUser={selectedUser}
            onSelectUser={setSelectedUser}
          />
        ) : (
          <div className="p-6 flex flex-col h-full justify-center">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-auto">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome to ChatApp</h2>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 mb-2">
                  Enter your username to start chatting
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Your username"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') handleRegister(e.target.value);
                  }}
                />
              </div>
              <button
                onClick={() => handleRegister(document.getElementById('username').value)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
              >
                Start Chatting
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Chat Window */}
      <div className="hidden md:flex flex-1 flex-col">
        {selectedUser ? (
          <ChatWindow 
            user={selectedUser}
            currentUser={currentUser}
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center p-6">
              <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Select a chat</h3>
              <p className="text-gray-500">Choose a contact to start messaging</p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile view - show chat window when user is selected */}
      {selectedUser && (
        <div className="md:hidden fixed inset-0 bg-white z-10 flex flex-col">
          <ChatWindow 
            user={selectedUser}
            currentUser={currentUser}
            messages={messages}
            isTyping={isTyping}
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            onBack={() => setSelectedUser(null)}
          />
        </div>
      )}
    </div>
  );
}

export default App;