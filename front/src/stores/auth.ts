import axios from 'axios';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(username: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/auth', {
          grant_type: 'password',
          username,
          password
        });
        
        const { token } = response.data;
        this.token = token;
        localStorage.setItem('token', token);
        
        // Set the default Authorization header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return response.data;
      } catch (error: any) {
        console.error('Login failed:', error);
        this.error = error.response?.data?.message || 'Network error occurred';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }
}); 