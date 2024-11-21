<script setup lang="ts">
import { ref } from 'vue';
import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Chessboard from './components/Chessboard.vue';

const showLogin = ref(true);

// Define a type for the square-clicked event
type SquareClickedEvent = {
  row: number;
  col: number;
  piece: any; // Replace 'any' with the actual type if known
};

// Handle the square-clicked event
const onSquareClicked = ({ row, col, piece }: SquareClickedEvent) => {
  console.log(`Square clicked: Row ${row}, Col ${col}, Piece ${piece}`);
  // Add logic to handle the click, such as moving pieces
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-toggle">
      <button 
        :class="{ active: showLogin }" 
        @click="showLogin = true"
      >
        Login
      </button>
      <button 
        :class="{ active: !showLogin }" 
        @click="showLogin = false"
      >
        Register
      </button>
    </div>

    <Login v-if="showLogin" />
    <Register v-else />
    <Chessboard @square-clicked="onSquareClicked" />
  </div>
</template>

<style scoped>
.auth-toggle {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem;
  border-radius: var(--border-radius-md);
  backdrop-filter: blur(10px);
}

.auth-toggle button {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: transparent;
  color: var(--text-dark);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.auth-toggle button.active {
  background: var(--primary-color);
  color: white;
}

.auth-toggle button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.1);
}

@media (prefers-color-scheme: dark) {
  .auth-toggle button {
    color: var(--text-light);
  }
}
</style>
