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
    async register(username: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/auth/register', {
          username,
          password
        });
        
        // After successful registration, automatically log in
        return this.login(username, password);
      } catch (error: any) {
        console.error('Registration failed:', error);
        this.error = error.response?.data?.message || 'Registration failed';
        throw error;
      } finally {
        this.loading = false;
      }
    },

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