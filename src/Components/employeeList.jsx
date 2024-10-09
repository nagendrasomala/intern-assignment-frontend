import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EmployeeCreatePage from './createEmployee';
import EmployeeEditPage from './editPage'; // Import the edit component
import api from '../assets/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isCreatingEmployee, setIsCreatingEmployee] = useState(false); 
  const [editingEmployeeId, setEditingEmployeeId] = useState(null); // State to hold the employee id being edited

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/admin/employees', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        toast.error('Error fetching employee data:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleSearch = (e) => {
    const keyword = e.target.value.toLowerCase();
    setSearchTerm(keyword);
    setFilteredEmployees(employees.filter(emp =>
      emp.name.toLowerCase().includes(keyword) || emp.email.toLowerCase().includes(keyword)
      || emp.empId.toLowerCase().includes(keyword) || emp.createdAt.toLowerCase().includes(keyword)
    ));
  };

  const handleEdit = (id) => {
    setEditingEmployeeId(id); 
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/admin/delete-employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFilteredEmployees(filteredEmployees.filter(emp => emp.id !== id)); 
      toast.success(`Employee deleted successfully.`);
      window.location.reload();
    } catch (error) {
      toast.error('Error deleting employee:', error);
    }
  };

  const handleCreateEmployeeClick = () => {
    setIsCreatingEmployee(true); 
  };

  const handleBackToListClick = () => {
    setIsCreatingEmployee(false); 
    setEditingEmployeeId(null); // Reset the editing employee id
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const istDate = new Date(date.getTime() + (5 * 60 + 30) * 60000);
    const day = String(istDate.getDate()).padStart(2, '0');
    const month = String(istDate.getMonth() + 1).padStart(2, '0');
    const year = istDate.getFullYear();
  
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="p-4">
      {isCreatingEmployee ? (
        <EmployeeCreatePage />
      ) : editingEmployeeId ? ( // Render the edit component if editing
        <EmployeeEditPage employeeId={editingEmployeeId} onBack={handleBackToListClick} />
      ) : (
        <>
          <div className="flex justify-between items-center bg-yellow-400 p-2">
            <h2 className="font-bold">Employee List</h2>
            <button onClick={handleCreateEmployeeClick} className="bg-green-400 text-white px-4 py-2 rounded">Create Employee</button>
          </div>

          <div className="flex justify-between items-center bg-gray-200 p-2 mt-2">
            <div>Total Count: {filteredEmployees.length}</div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Enter Search Keyword"
              className="border rounded p-1 w-3/12"
            />
          </div>

          <table className="min-w-full border mt-4">
            <thead>
              <tr className="bg-blue-100">
                <th className="border px-2 py-1">Unique ID</th>
                <th className="border px-2 py-1">Image</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Mobile No</th>
                <th className="border px-2 py-1">Designation</th>
                <th className="border px-2 py-1">Gender</th>
                <th className="border px-2 py-1">Course</th>
                <th className="border px-2 py-1">Create Date</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee._id} className="bg-white border-b">
                  <td className="border px-2 py-1 text-center">{employee.empId}</td>
                  <td className="border px-2 py-1 text-center">
                    <img src={employee.image || '/path/to/placeholder-image.png'} alt="Employee" className="w-16 h-12" />
                  </td>
                  <td className="border px-2 py-1">{employee.name}</td>
                  <td className="border px-2 py-1 text-blue-600">{employee.email}</td>
                  <td className="border px-2 py-1">{employee.mobile}</td>
                  <td className="border px-2 py-1">{employee.designation}</td>
                  <td className="border px-2 py-1">{employee.gender}</td>
                  <td className="border px-2 py-1">{Array.isArray(employee.course) ? employee.course.join(', ') : employee.course}</td>
                  <td className="border px-2 py-1">{formatDate(employee.createdAt)}</td>
                  <td className="border px-2 py-1 text-center">
                    <button onClick={() => handleEdit(employee._id)} className="p-2 rounded-md text-white bg-blue-500 mr-2">Edit</button>
                    <button onClick={() => handleDelete(employee._id)} className="p-2 rounded-md text-white bg-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default EmployeeList;
