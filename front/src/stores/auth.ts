import { defineStore } from 'pinia';
import axios from 'axios';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: null,
    isAuthenticated: false,
  }),
  
  actions: {
    async login(username: string, password: string) {
      try {
        const response = await axios.post('/auth', {
          grant_type: 'password',
          username,
          password
        });
        
        this.token = response.data.token;
        this.isAuthenticated = true;
        
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        return true;
      } catch (error) {
        console.error('Login failed:', error);
        return false;
      }
    },

    async register(username: string, password: string) {
      try {
        await axios.post('/users', {
          username,
          password: btoa(password) // Convert to base64 as required by backend
        });
        
        // After registration, log the user in
        return this.login(username, password);
      } catch (error) {
        console.error('Registration failed:', error);
        return false;
      }
    },

    logout() {
      this.token = null;
      this.isAuthenticated = false;
      localStorage.removeItem('token');
    },

    initialize() {
      const token = localStorage.getItem('token');
      if (token) {
        this.token = token;
        this.isAuthenticated = true;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }
}); 