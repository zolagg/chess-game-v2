<template>
  <div class="auth-container">
    <div class="auth-header">
      <h2>Register</h2>
    </div>
    <div v-if="error" class="error">{{ error }}</div>
    <div class="form-group">
      <label>Username</label>
      <input type="text" v-model="username" placeholder="Enter your username" required />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" v-model="password" placeholder="Enter your password" required />
    </div>
    <div class="form-group">
      <label>Confirm Password</label>
      <input type="password" v-model="confirmPassword" placeholder="Confirm your password" required />
    </div>
    <button @click="handleRegister" class="auth-button">Register</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');

const handleRegister = async () => {
  error.value = '';
  if (!username.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match';
    return;
  }

  const success = await authStore.register(username.value, password.value);
  if (!success) {
    error.value = 'Registration failed';
  }
};
</script> 