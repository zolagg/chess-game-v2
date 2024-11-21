<template>
    <div class="container">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Welcome to Chess Game</h1>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <div class="game-container">
        <Chessboard @square-clicked="onSquareClicked" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import Chessboard from './Chessboard.vue';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const onSquareClicked = (square: string) => {
    console.log('Square clicked:', square);
  };
  
  const handleLogout = () => {
    authStore.logout();
  };
  </script>
  
  <style scoped>
  .container {
    padding: 2rem;
  }
  
  .game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }
  </style>