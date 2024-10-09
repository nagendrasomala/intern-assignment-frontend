import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../assets/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/admin/login', {

        username,
        password,
      });
      if (response.status === 200) {
        navigate('/dashboard');
        localStorage.setItem('name', response.data.f_userName);
        localStorage.setItem('token', response.data.token);
      }
      else{
        toast.error("Invalid username or password");
      }
    } catch (error) {
      toast.error('Error logging in:', error.response ? error.response.data : error.message);
      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3 md:p-4 min-h-screen bg-gray-200">
      <div className="w-full max-w-lg p-8 space-y-4 bg-white border-1  border-black rounded-lg shadow-lg">
        <h1 className='text-bold text-xl'>Login as Admin</h1>
        <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="text"
              id="username"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder='UserName'
            />
        
          <div>
            
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder='Password'
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-4 text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
