<template>
  <div class="flex flex-col space-y-6 p-8">
    <div class="text-center">
      <h2 class="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
      <p class="text-gray-600">Join us and start playing chess</p>
    </div>

    <div v-if="error" 
      class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" 
      role="alert">
      <p class="font-medium">{{ error }}</p>
    </div>

    <form @submit.prevent="handleRegister" class="space-y-6">
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
              placeholder="Choose a username"
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
              placeholder="Choose a password"
            />
          </div>
        </div>

        <div>
          <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
              <i class="fas fa-lock"></i>
            </span>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              required
              class="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Confirm your password"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        class="w-full flex justify-center items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 space-x-2"
      >
        <i class="fas fa-user-plus"></i>
        <span>Create Account</span>
      </button>
    </form>
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