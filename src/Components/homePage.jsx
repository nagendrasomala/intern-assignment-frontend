import React from 'react';

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen mt-2">
      {/* Navbar */}
      <div className="bg-yellow-400 flex justify-between items-center p-4">
        <div className="text-lg font-bold">Dashboard</div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-semibold">Welcome to Admin Panel</h1>
      </div>
    </div>
  );
};

export default HomePage;
