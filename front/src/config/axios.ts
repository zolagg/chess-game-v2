import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

// Create axios instance with custom config
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Adjust this to match your backend URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const router = useRouter();
      const authStore = useAuthStore();
      
      // Clear authentication state
      authStore.logout();
      
      // Store the current path for redirect after login
      const currentPath = router.currentRoute.value.fullPath;
      if (currentPath !== '/login') {
        localStorage.setItem('redirectPath', currentPath);
      }

      // Show session expired message
      const toast = document.createElement('div');
      toast.className = 'session-expired-toast';
      toast.textContent = 'Your session has expired. Please log in again.';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);

      // Redirect to login
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance; 