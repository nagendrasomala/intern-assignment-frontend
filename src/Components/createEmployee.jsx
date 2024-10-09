import React, { useState } from 'react';
import axios from 'axios';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import api from '../assets/api';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const firebaseConfig = {
    apiKey: "AIzaSyC2vUnL2GpMz7oSMKZEBz1sqPNGYuA0w4A",
    authDomain: "employee-management-9ad9d.firebaseapp.com",
    projectId: "employee-management-9ad9d",
    storageBucket: "employee-management-9ad9d.appspot.com",
    messagingSenderId: "814505824739",
    appId: "1:814505824739:web:4beafd955ef27f294dd0d6"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const EmployeeCreatePage = () => {
    const [formData, setFormData] = useState({
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: '',
        f_gender: '',
        f_Course: [],
        f_Image: null,
    });
    const [errors, setErrors] = useState({});
    const [emailExists, setEmailExists] = useState(false);

    const checkEmailDuplicate = async (email) => {
        try {
            const response = await api.get(`/admin/check-email?email=${email}`);
            setEmailExists(response.data.exists);
        } catch (error) {
            console.error('Error checking email duplication:', error);
        }
    };

    const handleEmailChange = (e) => {
        setFormData({ ...formData, f_Email: e.target.value });
        checkEmailDuplicate(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prevData) => {
                const courses = prevData.f_Course.includes(value)
                    ? prevData.f_Course.filter((course) => course !== value)
                    : [...prevData.f_Course, value];
                return { ...prevData, f_Course: courses };
            });
        } else if (name === "f_Image") {
            setFormData({ ...formData, f_Image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    const uploadFileToFirebase = async (file) => {
        if (!file) return null;
        const storageRef = ref(storage, `uploads/${file.name}`);
        try {
            await uploadBytes(storageRef, file);
            const fileUrl = await getDownloadURL(storageRef);
            return fileUrl;
        } catch (error) {
            console.error('Error uploading file to Firebase:', error);
            throw new Error('File upload failed');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        let formErrors = {};

        const nameRegex = /^[A-Za-z ]{2,}$/; 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        const mobileRegex = /^\d{10}$/;

        if (!formData.f_Name || !nameRegex.test(formData.f_Name)) 
            formErrors.f_Name = "Valid name is required";
        if (!formData.f_Email || !emailRegex.test(formData.f_Email)) 
            formErrors.f_Email = "Valid email is required";
        if (!formData.f_Mobile || !mobileRegex.test(formData.f_Mobile)) 
            formErrors.f_Mobile = "Valid mobile number is required (10 digits)";
        if (!formData.f_Designation) 
            formErrors.f_Designation = "Designation is required";
        if (!formData.f_gender) 
            formErrors.f_gender = "Gender is required";
        if (formData.f_Course.length === 0) 
            formErrors.f_Course = "At least one course must be selected";
        if (!formData.f_Image) 
            formErrors.f_Image = "Image is required";

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        let imageUrl = '';
        if (formData.f_Image) {
            imageUrl = await uploadFileToFirebase(formData.f_Image);
        }

        const dataToSubmit = {
            f_Image: imageUrl,  
            f_Name: formData.f_Name,
            f_Email: formData.f_Email,
            f_Mobile: formData.f_Mobile,
            f_Designation: formData.f_Designation,
            f_gender: formData.f_gender,
            f_Course: formData.f_Course
        };

        try {
            const token = localStorage.getItem('token');  
            const response = await api.post('/admin/create-employees', dataToSubmit, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            console.log('Employee created successfully:', response.data);
            toast.success('Employee created successfully!');
            resetForm(); 
        } catch (error) {
            console.error('Error creating employee:', error);
            toast.error('Error creating employee! Please try again.'); 
        }
    };

  
    const resetForm = () => {
        setFormData({
            f_Name: '',
            f_Email: '',
            f_Mobile: '',
            f_Designation: '',
            f_gender: '',
            f_Course: [],
            f_Image: null,
        });
        setErrors({}); 
        setEmailExists(false); 
    };

    return (
        <div className="p-4 flex flex-col justify-center">
            <ToastContainer /> 
            <div className="bg-yellow-400 flex justify-between items-center p-4">
                <div className="text-lg font-bold">Create Employee</div>
            </div>
            <div className='flex flex-col justify-center items-center mt-2'>
                <form onSubmit={handleSubmit} className="bg-white p-4 w-full lg:w-1/2 rounded border shadow-lg">
                    <div className='mb-1'>
                        <label>Name:</label>
                        <input type="text" name="f_Name" value={formData.f_Name} onChange={handleChange} className="border w-full p-1" />
                        {errors.f_Name && <span className="text-red-500">{errors.f_Name}</span>}
                    </div>

                    <div className='mb-1'>
                        <label>Email:</label>
                        <input type="email" name="f_Email" value={formData.f_Email} onChange={handleEmailChange} className="border w-full p-1" />
                        {errors.f_Email && <span className="text-red-500">{errors.f_Email}</span>}
                        {emailExists && <span className="text-red-500">Email already exists</span>}
                    </div>

                    <div className='mb-1'>
                        <label>Mobile No:</label>
                        <input type="text" name="f_Mobile" value={formData.f_Mobile} onChange={handleChange} className="border w-full p-1" />
                        {errors.f_Mobile && <span className="text-red-500">{errors.f_Mobile}</span>}
                    </div>

                    <div className='mb-1'>
                        <label>Designation:</label>
                        <select name="f_Designation" value={formData.f_Designation} onChange={handleChange} className="border w-full p-1">
                            <option value="">Select</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Sales">Sales</option>
                        </select>
                        {errors.f_Designation && <span className="text-red-500">{errors.f_Designation}</span>}
                    </div>

                    <div className='mb-1'>
                        <label>Gender:</label>
                        <div className='flex flex-row gap-3'>
                            <label><input type="radio" name="f_gender" value="M" checked={formData.f_gender === 'M'} onChange={handleChange} /> Male</label>
                            <label><input type="radio" name="f_gender" value="F" checked={formData.f_gender === 'F'} onChange={handleChange} /> Female</label>
                        </div>
                        {errors.f_gender && <span className="text-red-500">{errors.f_gender}</span>}
                    </div>

                    <div className='mb-1'>
                        <label>Course:</label>
                        <div className='flex flex-row gap-3'>
                            <label><input type="checkbox" value="MCA" onChange={handleChange} checked={formData.f_Course.includes('MCA')} /> MCA</label>
                            <label><input type="checkbox" value="BCA" onChange={handleChange} checked={formData.f_Course.includes('BCA')} /> BCA</label>
                            <label><input type="checkbox" value="BSC" onChange={handleChange} checked={formData.f_Course.includes('BSC')} /> BSC</label>
                        </div>
                        {errors.f_Course && <span className="text-red-500">{errors.f_Course}</span>}
                    </div>

                    <div className='mb-1'>
                        <label>Image:</label>
                        <input type="file" name="f_Image" accept="image/*" onChange={handleChange} className="border w-full p-1" />
                        {errors.f_Image && <span className="text-red-500">{errors.f_Image}</span>}
                    </div>

                    <button type="submit" className="bg-green-500 text-white rounded py-2 px-4 mt-4">Submit</button>
                </form>
            </div>
        </div>
    );
};

export default EmployeeCreatePage;
