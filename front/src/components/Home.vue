<template>
  <div class="home-container">
    <div class="game-section">
      <div class="game-header">
        <h1 class="title">Welcome to Chess Game</h1>
        <button 
          @click="startNewGame" 
          class="new-game-btn"
          :disabled="gameStore.loading"
        >
          <i class="fas fa-plus mr-2"></i>
          New Game
        </button>
      </div>
      <div v-if="gameStore.error" class="error-message">
        {{ gameStore.error }}
      </div>
      <div class="chessboard-wrapper">
        <Chessboard 
          :board="gameStore.board" 
          @square-clicked="onSquareClicked" 
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useGameStore } from '../stores/game';
import Chessboard from './Chessboard.vue';

const router = useRouter();
const authStore = useAuthStore();
const gameStore = useGameStore();

const startNewGame = async () => {
  await gameStore.startNewGame();
};

const onSquareClicked = async ({ from, to, piece }: { from: { row: number, col: number }, to: { row: number, col: number }, piece: string }) => {
  if (!gameStore.gameId) {
    gameStore.error = 'No active game. Please start a new game.';
    return;
  }
  
  if (from && to) {
    const fromSquare = `${String.fromCharCode(97 + from.col)}${8 - from.row}`;
    const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`;
    console.log('Move:', { from: fromSquare, to: toSquare, piece });
    await gameStore.makeMove(fromSquare, toSquare);
  }
};

onMounted(async () => {
  await startNewGame();
});
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

.new-game-btn {
  @apply px-4 py-2 rounded-lg bg-primary text-white font-medium
         flex items-center gap-2 hover:bg-primary/90 transition-all duration-200
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.error-message {
  @apply text-red-500 text-center mb-4 p-4 bg-red-50 rounded-lg;
}
</style>