<template>
  <Toast position="top-right" />
  <div class="auth-form">
    <div class="auth-header">
      <h2>Create Account</h2>
      <p>Join us and start playing chess</p>
    </div>

    <div v-if="error" class="error" role="alert">
      <p>{{ error }}</p>
    </div>

    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">Username</label>
        <div class="input-wrapper">
          <span class="input-icon">
            <i class="fas fa-user"></i>
          </span>
          <input 
            id="username" 
            v-model="username" 
            type="text" 
            required 
            placeholder="Choose a username" 
          />
        </div>
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <div class="input-wrapper">
          <span class="input-icon">
            <i class="fas fa-lock"></i>
          </span>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            required 
            placeholder="Choose a password" 
          />
        </div>
      </div>

      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <div class="input-wrapper">
          <span class="input-icon">
            <i class="fas fa-lock"></i>
          </span>
          <input 
            id="confirm-password" 
            v-model="confirmPassword" 
            type="password" 
            required 
            placeholder="Confirm your password" 
          />
        </div>
      </div>

      <button type="submit">
        <i class="fas fa-user-plus"></i>
        Create Account
      </button>
    </form>
  </div>
</template>

<style lang="postcss" scoped>
.auth-form {
  @apply w-full max-w-md bg-white p-8 rounded-2xl shadow-xl;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.auth-header {
  @apply text-center mb-8;
}

.auth-header h2 {
  @apply text-3xl font-bold text-primary mb-2;
  background: linear-gradient(135deg, theme('colors.primary'), theme('colors.accent'));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.auth-header p {
  @apply text-text-secondary;
}

.form-group {
  @apply mb-6;
}

.form-group label {
  @apply block text-sm font-medium text-text-secondary mb-2;
}

.input-wrapper {
  @apply relative;
}

.input-icon {
  @apply absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none;
}

.input-wrapper input {
  @apply w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 
         focus:border-primary focus:ring-2 focus:ring-primary/20 
         transition-all duration-200;
}

button {
  @apply w-full mt-6 px-6 py-3 rounded-xl bg-primary text-white font-semibold
         flex items-center justify-center gap-2
         transform transition-all duration-200
         hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg
         focus:outline-none focus:ring-2 focus:ring-primary/50;
  background: linear-gradient(135deg, theme('colors.primary'), theme('colors.accent'));
}

.error {
  @apply bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6
         animate-fadeIn;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const toast = useToast();

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');

const handleRegister = async () => {
  error.value = '';
  if (!username.value || !password.value || !confirmPassword.value) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all fields',
      life: 3000
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Passwords do not match',
      life: 3000
    });
    return;
  }

  const success = await authStore.register(username.value, password.value);
  if (!success) {
    toast.add({
      severity: 'error',
      summary: 'Registration Failed',
      detail: 'Unable to create account. Please try again.',
      life: 3000
    });
  } else {
    toast.add({
      severity: 'success',
      summary: 'Welcome!',
      detail: 'Account created successfully',
      life: 3000
    });
  }
};
</script>

