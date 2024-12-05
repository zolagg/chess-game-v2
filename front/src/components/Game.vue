<template>
  <div class="game-container">
    <div class="game-header">
      <h2 class="game-title">Game #{{ gameId }}</h2>
      <div class="game-controls">
        <button 
          @click="resignGame" 
          class="resign-btn"
          :disabled="gameStore.loading"
        >
          <i class="fas fa-flag mr-2"></i>
          Resign
        </button>
      </div>
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
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import Chessboard from './Chessboard.vue';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const gameId = route.params.id as string;

const onSquareClicked = async ({ from, to, piece }: { from: { row: number, col: number }, to: { row: number, col: number }, piece: string }) => {
  if (!gameId) return;
  
  if (from && to) {
    const fromSquare = `${String.fromCharCode(97 + from.col)}${8 - from.row}`;
    const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`;
    await gameStore.makeMove(gameId, fromSquare, toSquare);
  }
};

const resignGame = async () => {
  await gameStore.resignGame(gameId);
  router.push('/');
};

onMounted(async () => {
  await gameStore.getGameState(gameId);
});
</script>

<style lang="postcss" scoped>
.game-container {
  @apply max-w-7xl mx-auto px-4 py-6 space-y-6;
}

.game-header {
  @apply flex justify-between items-center;
}

.game-title {
  @apply text-2xl font-bold text-primary;
}

.resign-btn {
  @apply px-4 py-2 rounded-lg bg-red-500 text-white font-medium
         flex items-center gap-2 hover:bg-red-600 transition-all duration-200
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.error-message {
  @apply text-red-500 text-center mb-4 p-4 bg-red-50 rounded-lg;
}

.chessboard-wrapper {
  @apply flex justify-center items-center mt-8;
}
</style> 