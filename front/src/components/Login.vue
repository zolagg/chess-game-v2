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
  <div class="flex flex-col space-y-6 p-8">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
      <p class="text-gray-600">Please sign in to your account</p>
    </div>

    <div v-if="error" 
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" 
      role="alert">
      <p class="font-medium">{{ error }}</p>
    </div>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <i class="fas fa-user"></i>
            </span>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              class="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <i class="fas fa-lock"></i>
            </span>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              class="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="w-full flex justify-center items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 space-x-2"
      >
        <i class="fas fa-sign-in-alt"></i>
        <span>Sign In</span>
      </button>
    </form>
  </div>
</template> 