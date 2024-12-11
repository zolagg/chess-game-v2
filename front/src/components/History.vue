<template>
  <div class="history-container">
    <Toast position="top-right" />
    <div class="history-content">
      <div class="history-header">
        <h2 class="title">Game History</h2>
      </div>
      
      <div class="games-list" v-if="gameStore.gameHistory.length">
        <div v-for="game in gameStore.gameHistory" 
             :key="game.id" 
             class="game-card"
             @click="viewGame(game.id)"
        >
          <div class="game-info">
            <span class="game-id">Game #{{ game.id }}</span>
            <span class="game-date">{{ formatDate(game.createdAt) }}</span>
          </div>
          <div class="game-status" :class="game.status.toLowerCase()">
            {{ game.status }}
          </div>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <i class="fas fa-chess-board fa-3x mb-4"></i>
        <p>No games played yet</p>
        <button @click="startNewGame" class="new-game-btn">
          <i class="fas fa-play mr-2"></i>
          Start New Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const router = useRouter();
const gameStore = useGameStore();
const toast = useToast();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const viewGame = (gameId: number) => {
  router.push(`/game/${gameId}`);
};

const startNewGame = async () => {
  try {
    const game = await gameStore.startNewGame();
    router.push(`/game/${game.id}`);
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
  await gameStore.fetchGameHistory();
});
</script>

<style lang="postcss" scoped>
.history-container {
  @apply min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8;
}

.history-content {
  @apply max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6;
}

.history-header {
  @apply mb-8 pb-4 border-b border-gray-200;
}

.title {
  @apply text-2xl font-bold text-gray-800;
}

.games-list {
  @apply space-y-4;
}

.game-card {
  @apply flex justify-between items-center p-4 rounded-lg border border-gray-200
         hover:border-blue-500 hover:shadow-md cursor-pointer transition-all duration-200;
}

.game-info {
  @apply flex flex-col;
}

.game-id {
  @apply font-semibold text-gray-800;
}

.game-date {
  @apply text-sm text-gray-500;
}

.game-status {
  @apply px-3 py-1 rounded-full text-sm font-medium;
}

.game-status.active {
  @apply bg-green-100 text-green-800;
}

.game-status.finished {
  @apply bg-gray-100 text-gray-800;
}

.empty-state {
  @apply text-center py-12 text-gray-500;
}

.new-game-btn {
  @apply mt-4 px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold
         flex items-center justify-center gap-2 mx-auto
         transform transition-all duration-200
         hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg;
}
</style> 