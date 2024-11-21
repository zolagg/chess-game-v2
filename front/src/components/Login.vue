<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';

const authStore = useAuthStore();

const username = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  if (!username.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }

  const success = await authStore.login(username.value, password.value);
  if (!success) {
    error.value = 'Invalid credentials';
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-header">
      <h2>Login</h2>
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
    <button @click="handleLogin" class="auth-button">Sign In</button>
  </div>
</template> 