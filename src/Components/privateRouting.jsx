import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

// Admin Private Route
const AdminPrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const admin_token = localStorage.getItem('token');
    if (!admin_token) {
      setIsAuthenticated(false);
      return;
    }

    axios.post('https://intern-assignment-01dd.onrender.com/token/test-admin', {}, {
      headers: { Authorization: `Bearer ${admin_token}` }
    })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/" />;
};


const PublicRoute = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem(`token`);
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    axios.post(`https://intern-assignment-01dd.onrender.com/token/test-admin`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false));
  }, [role]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to={`/dashboard`} />;
};


export { AdminPrivateRoute,PublicRoute};
