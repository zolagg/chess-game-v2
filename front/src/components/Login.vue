<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const toast = useToast();
const router = useRouter();

const username = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  if (!username.value || !password.value) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fill in all fields',
      life: 3000
    });
    return;
  }

  try {
    await authStore.login(username.value, password.value);
    // Check for redirect path
    const redirectPath = localStorage.getItem('redirectPath') || '/';
    localStorage.removeItem('redirectPath'); // Clear stored path
    router.push(redirectPath);
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Login Failed',
      detail: 'Invalid credentials. Please try again.',
      life: 3000
    });
  }
};
</script>

<template>
  <Toast position="top-right" />
  <div class="auth-form">
    <div class="auth-header">
      <h2>Welcome Back!</h2>
      <p>Please sign in to your account</p>
    </div>

    <div v-if="error" class="error" role="alert">
      <p>{{ error }}</p>
    </div>

    <form @submit.prevent="handleLogin">
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
            placeholder="Enter your usernam" 
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
            placeholder="Enter your password" 
          />
        </div>
      </div>

      <button type="submit">
        <i class="fas fa-sign-in-alt"></i>
        Sign In
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

.session-expired-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background-color: #f87171;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  z-index: 50;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
