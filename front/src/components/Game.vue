<template>
  <div class="game-container">
    <Toast position="top-right" />
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
    <div class="game-content">
      <div class="game-board">
        <Chessboard 
          :board="gameStore.board" 
          @square-clicked="onSquareClicked" 
        />
      </div>
      <div class="game-sidebar">
        <MoveHistory :moves="gameStore.moves" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import Chessboard from './Chessboard.vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import MoveHistory from './MoveHistory.vue';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const gameId = route.params.id as string;
const toast = useToast();

const onSquareClicked = async ({
  from,
  to,
  piece,
}: {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: string;
}) => {
  if (!gameId) return;

  if (from && to) {
    const fromSquare = `${String.fromCharCode(97 + from.col)}${8 - from.row}`;
    const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`;
    await gameStore.makeMove(fromSquare, toSquare, piece);
  }
};

const resignGame = async () => {
  await gameStore.resignGame(gameId);
  router.push('/');
};

const startNewGame = async () => {
  await gameStore.startNewGame();
  router.push('/');
};

watch(() => gameStore.error, (newError) => {
  if (newError) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: newError,
      life: 3000
    });
  }
});

onMounted(async () => {
  await gameStore.getGameState(gameId);
});
</script>

<style lang="postcss" scoped>
.game-container {
  @apply p-4;
}

.game-content {
  @apply flex gap-6;
}

.game-board {
  @apply flex-1;
}

.resign-btn {
  @apply px-4 py-2 rounded-lg bg-red-500 text-white font-medium
         flex items-center gap-2 hover:bg-red-600 transition-all duration-200
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.chessboard-wrapper {
  @apply flex justify-center items-center mt-8;
}

.game-over-overlay {
  @apply fixed inset-0 bg-black/50 backdrop-blur-sm
         flex items-center justify-center z-50;
}

.game-over-content {
  @apply bg-white p-8 rounded-xl shadow-xl
         flex flex-col items-center gap-6
         animate-fadeIn;
}

.winner-text {
  @apply text-2xl font-bold text-primary;
}

.new-game-btn {
  @apply px-6 py-3 rounded-xl bg-primary text-white font-semibold
         flex items-center justify-center gap-2
         transform transition-all duration-200
         hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-lg;
  background: linear-gradient(135deg, theme('colors.primary'), theme('colors.accent'));
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
.game-sidebar {
  @apply w-64 bg-white rounded-lg shadow-md p-4;
}
</style> 