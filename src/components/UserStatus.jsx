import React from "react";

const UserStatus = ({ online }) => {
  return (
    <div className="absolute bottom-0 right-0">
      <div
        className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
          online ? 'bg-green-500' : 'bg-gray-400'
        }`}
      />
      {online && (
        <div className="absolute -inset-1 animate-ping bg-green-400 rounded-full opacity-75"></div>
      )}
    </div>
  );
};

export default UserStatus;
