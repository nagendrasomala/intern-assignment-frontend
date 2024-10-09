import './App.css';
import LoginPage from './Components/login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/dashboard';
import EmployeeCreatePage from './Components/createEmployee';
import EmployeeList from './Components/employeeList';
import { AdminPrivateRoute,PublicRoute } from './Components/privateRouting';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<PublicRoute><LoginPage/></PublicRoute>} />

        {/* Private Routes */}
        <Route 
          path="/dashboard" 
          element={
            <AdminPrivateRoute>
              <Dashboard />
            </AdminPrivateRoute>
          } 
        />
        <Route 
          path="/create-employee" 
          element={
            <AdminPrivateRoute>
              <EmployeeCreatePage />
            </AdminPrivateRoute>
          } 
        />
        <Route 
          path="/employee-list" 
          element={
            <AdminPrivateRoute>
              <EmployeeList />
            </AdminPrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
