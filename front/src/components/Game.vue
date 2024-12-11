<template>
  <div class="game-container">
    <Toast position="top-right" />
    <div class="game-layout">
      <div class="game-header">
        <h2 class="game-title">Game #{{ gameId }}</h2>
        <button 
          @click="resignGame" 
          class="resign-btn"
          :disabled="gameStore.loading"
        >
          <i class="fas fa-flag mr-2"></i>
          Resign
        </button>
      </div>
      
      <div class="game-content">
        <div class="game-board" v-if="gameStore.board">
          <TurnIndicator 
            :currentTurn="gameStore.currentTurn" 
            :isCheck="gameStore.isCheck" 
          />
          <Chessboard 
            :board="gameStore.board" 
            @square-clicked="onSquareClicked" 
          />
        </div>
        <div v-else>
          Loading chessboard...
        </div>
        <div class="game-sidebar">
          <MoveNavigator 
            v-if="isNavigationEnabled"
            :currentMoveIndex="currentMoveIndex"
            :totalMoves="gameStore.moves.length"
            :gameStatus="gameStatus"
            @navigateToMove="handleMoveNavigation"
          />
          <MoveHistory :moves="gameStore.moves" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import Chessboard from './Chessboard.vue';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import MoveHistory from './MoveHistory.vue';
import TurnIndicator from './TurnIndicator.vue';
import MoveNavigator from './MoveNavigator.vue';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const toast = useToast();

const gameId = route.params.id;

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

  try {
    if (from && to) {
      const fromSquare = `${String.fromCharCode(97 + from.col)}${8 - from.row}`;
      const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`;
      await gameStore.makeMove(fromSquare, toSquare, piece);
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

const resignGame = async () => {
  try {
    await gameStore.resignGame(gameId as string);
    router.push('/');
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
  }
};

onMounted(async () => {
  if (!gameId) {
    console.error('No gameId provided');
    router.push('/');
    return;
  }
  
  try {
    console.log('Fetching game state...');
    const gameState = await gameStore.getGameState(gameId as string);
    console.log('Game state received:', gameState);
    if (gameStore.isFinished) {
      currentMoveIndex.value = gameStore.moves.length - 1;
      const moveHistory = gameStore.moves.slice(0, gameStore.moves.length);
      await gameStore.reconstructBoardState(moveHistory);
    }
  } catch (error: any) {
    console.error('Error fetching game state:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message,
      life: 3000
    });
    router.push('/');
  }
});

const currentMoveIndex = ref(0);
const gameStatus = computed(() => {
  return gameStore.status || 'IN_PROGRESS';
});

const isNavigationEnabled = computed(() => {
  return gameStore.status === 'RESIGNED' || gameStore.status === 'COMPLETED';
});

const handleMoveNavigation = async (index: number) => {
  if (!isNavigationEnabled.value) return;
  if (index < 0 || index >= gameStore.moves.length) return;
  
  currentMoveIndex.value = index;
  const moveHistory = gameStore.moves.slice(0, index + 1);
  await gameStore.reconstructBoardState(moveHistory);
};
</script>

<style lang="postcss" scoped>
.game-container {
  @apply min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8;
}

.game-layout {
  @apply max-w-7xl mx-auto bg-white rounded-xl shadow-xl p-6;
}

.game-header {
  @apply flex justify-between items-center mb-8 pb-4 border-b border-gray-200;
}

.game-title {
  @apply text-2xl font-bold text-gray-800;
}

.game-content {
  @apply flex gap-8;
}

.game-board {
  @apply flex-1;
}

.game-sidebar {
  @apply w-80 bg-gray-50 rounded-xl p-4;
}

.sidebar-title {
  @apply text-lg font-semibold text-gray-700 mb-4;
}

.resign-btn {
  @apply px-4 py-2 rounded-lg bg-red-500 text-white font-medium
         flex items-center gap-2 hover:bg-red-600 transition-all duration-200
         disabled:opacity-50 disabled:cursor-not-allowed;
}
</style> 