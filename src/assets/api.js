import axios from 'axios';

const api = axios.create({
    baseURL: 'https://intern-assignment-01dd.onrender.com',
});

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
export default api;
