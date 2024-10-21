import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'https://localhost:7241/api',  // Your API's base URL
    headers: {
        'Content-Type': 'application/json',  // Default header to handle JSON data
    },
});

// Request Interceptor to automatically add the token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');  // Retrieve the token from localStorage
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;  // Attach the token to the Authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);  // Handle request errors
    }
);

// Response Interceptor to automatically check and update the token from the response headers
axiosInstance.interceptors.response.use(
    (response) => {
        const newToken = response.headers['authorization'];  // Check if a new token is returned in the headers
        if (newToken) {
            // Save the new token (if present) by replacing the old one
            localStorage.setItem('token', newToken.replace('Bearer ', ''));
        }
        return response;  // Continue the response
    },
    (error) => {
        return Promise.reject(error);  // Handle response errors
    }
);

export default axiosInstance;