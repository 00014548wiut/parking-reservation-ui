import axios from 'axios';
import { toast } from 'react-toastify';

const apiCall = async ({ endpoint, method, payload = {}, isAuthenticated = false }) => {
    const baseURL = process.env.REACT_APP_API_URL
    const token = isAuthenticated ? localStorage.getItem('token') : null;

    try {
        const config = {
            method: method.toUpperCase(),
            url: `${baseURL}${endpoint}`,
            headers: {
                'Content-Type': 'application/json',
                ...(isAuthenticated && { Authorization: `Bearer ${token}` }),
            },
            ...(method === 'GET' ? { params: payload } : { data: payload }),
        };

        const response = await axios(config);
        return response.data;
    } catch (error) {
        toast.error(error?.response?.data)
        console.error('API Error:', error?.response?.data || error.message);
        throw error?.response?.data || error;
    }
};

export default apiCall;
