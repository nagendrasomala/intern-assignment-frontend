import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import EmployeeList from './employeeList'; 
import HomePage from './homePage';

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [page, setPage] = useState('home');
  const [username, setUsername] = useState('');

  // Fetch the username from localStorage when the component loads
  useEffect(() => {
    const nameFromStorage = localStorage.getItem('name');
    const pageFromStorage = localStorage.getItem('currentPage'); // Get the current page from localStorage
    if (nameFromStorage) {
      setUsername(nameFromStorage);
    }
    if (pageFromStorage) {
      setPage(pageFromStorage); // Set the page to the value stored in localStorage
    }
  }, []);

  // Handle logout by clearing the token from localStorage and navigating to login page
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    navigate('/'); // Navigate to the login page
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    localStorage.setItem('currentPage', newPage); // Store the current page in localStorage
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-blue-200 flex flex-row justify-between items-center p-2">
        <div className="text-lg font-bold">Logo</div>
        <div className='flex flex-row justify-between gap-3'>
          <div className="flex flex-row gap-2">
            <button onClick={() => handlePageChange('home')} className="px-4 py-2 lg:text-xl text-sm">Home</button>
            <button onClick={() => handlePageChange('employeeList')} className="px-4 py-2 lg:text-xl text-sm">Employee List</button>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 text-xl text-bold">{username} - </span>
            <button onClick={handleLogout} className="sm:px-2 sm:py-1 px-4 py-2 bg-red-500 text-white rounded-md">Logout</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        {page === 'home' && <HomePage />}
        {page === 'employeeList' && <EmployeeList />}
      </div>
    </div>
  );
};

export default Dashboard;
