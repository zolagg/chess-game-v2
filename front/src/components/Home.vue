<template>
  <div class="home-container">
    <div class="game-section">
      <div class="game-header">
        <h1 class="title">Welcome to Chess Game</h1>
      </div>
      <div class="chessboard-wrapper">
        <Chessboard @square-clicked="onSquareClicked" />
      </div>
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
</script>

<style lang="postcss" scoped>
.home-container {
  @apply h-[calc(100vh-4rem)] flex flex-col;
}

.game-section {
  @apply flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col;
}

.game-header {
  @apply flex justify-center items-center mb-8;
}

.title {
  @apply text-3xl font-bold;
  background: linear-gradient(135deg, theme('colors.primary'), theme('colors.accent'));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.chessboard-wrapper {
  @apply flex-1 flex justify-center items-center;
}
</style>