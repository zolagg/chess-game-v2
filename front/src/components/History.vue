<template>
  <div class="history-container">
    <Toast position="top-right" />
    <div class="history-content">
      <div class="history-header">
        <h2 class="title">Game History</h2>
        <button @click="startNewGame" class="new-game-btn">
          <i class="fas fa-plus mr-2"></i>
          New Game
        </button>
      </div>
      
      <div class="filters">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchTerm" 
            placeholder="Search games..."
            class="search-input"
          />
        </div>
        <select v-model="statusFilter" class="status-filter">
          <option value="">All Status</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="RESIGNED">Resigned</option>
        </select>
      </div>

      <div v-if="loading" class="loading-state">
        <i class="fas fa-spinner fa-spin fa-2x"></i>
        <p>Loading games...</p>
      </div>
      
      <div v-else-if="error" class="error-state">
        <i class="fas fa-exclamation-circle fa-3x mb-4 text-red-500"></i>
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button @click="retryFetch" class="retry-btn">
          <i class="fas fa-redo mr-2"></i>
          Retry
        </button>
      </div>
      
      <div class="games-list" v-else-if="filteredGames.length">
        <div v-for="game in filteredGames" 
             :key="game.id" 
             class="game-card"
             @click="viewGame(game.id)"
        >
          <div class="game-info">
            <div class="game-header">
              <span class="game-id">Game #{{ game.id }}</span>
              <span :class="['game-status', game.status.toLowerCase()]">
                {{ game.status }}
              </span>
            </div>
            <div class="game-details">
              <div class="detail-item">
                <i class="fas fa-calendar-alt"></i>
                <span>{{ formatDate(game.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <i class="fas fa-clock"></i>
                <span>{{ formatTime(game.createdAt) }}</span>
              </div>
              <div v-if="game.winner" class="detail-item">
                <i class="fas fa-trophy"></i>
                <span>Winner: {{ game.winner }}</span>
              </div>
            </div>
          </div>
          <i class="fas fa-chevron-right text-gray-400"></i>
        </div>
      </div>
      
      <div v-else class="empty-state">
        <i class="fas fa-chess-board fa-3x mb-4"></i>
        <p>No games found</p>
        <button @click="startNewGame" class="new-game-btn">
          <i class="fas fa-play mr-2"></i>
          Start New Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const router = useRouter();
const gameStore = useGameStore();
const toast = useToast();

const searchTerm = ref('');
const statusFilter = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString();
};

const filteredGames = computed(() => {
  return gameStore.gameHistory.filter(game => {
    const matchesSearch = game.id.toString().includes(searchTerm.value);
    const matchesStatus = !statusFilter.value || game.status === statusFilter.value;
    return matchesSearch && matchesStatus;
  });
});

const viewGame = (gameId: number) => {
  router.push(`/game/${gameId}`);
};

const startNewGame = async () => {
  try {
    const gameData = await gameStore.startNewGame();
    if (gameData && gameData.gameId) {
      router.push(`/game/${gameData.gameId}`);
    } else {
      throw new Error('Failed to create new game');
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

const retryFetch = async () => {
  await fetchGames();
};

const fetchGames = async () => {
  loading.value = true;
  error.value = null;
  try {
    await gameStore.fetchGameHistory();
  } catch (error: any) {
    error.value = error.response?.data?.message || 'Failed to load game history';
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.value,
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(fetchGames);
</script>

<style lang="postcss" scoped>
.history-container {
  @apply min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8;
}

.history-content {
  @apply max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-6;
}

.history-header {
  @apply flex justify-between items-center mb-8 pb-4 border-b border-gray-200;
}

.title {
  @apply text-2xl font-bold text-gray-800;
}

.filters {
  @apply flex gap-4 mb-6;
}

.search-box {
  @apply flex-1 relative;
}

.search-box i {
  @apply absolute left-3 top-1/2 -translate-y-1/2 text-gray-400;
}

.search-input {
  @apply w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 
         focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.status-filter {
  @apply px-4 py-2 rounded-lg border border-gray-200 
         focus:ring-2 focus:ring-blue-500 focus:border-transparent;
}

.games-list {
  @apply space-y-4;
}

.game-card {
  @apply flex items-center justify-between p-4 rounded-xl border border-gray-200 
         hover:border-blue-500 hover:shadow-md transition-all cursor-pointer;
}

.game-header {
  @apply flex justify-between items-center mb-2;
}

.game-id {
  @apply text-lg font-semibold text-gray-800;
}

.game-status {
  @apply px-2 py-1 rounded-full text-sm font-medium;
}

.game-status.in_progress {
  @apply bg-blue-100 text-blue-800;
}

.game-status.completed {
  @apply bg-green-100 text-green-800;
}

.game-status.resigned {
  @apply bg-red-100 text-red-800;
}

.game-details {
  @apply flex gap-4 text-sm text-gray-600;
}

.detail-item {
  @apply flex items-center gap-2;
}

.loading-state, .empty-state {
  @apply flex flex-col items-center justify-center py-12 text-gray-500;
}

.new-game-btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg 
         hover:bg-blue-600 transition-colors 
         flex items-center gap-2;
}

.error-state {
  @apply flex flex-col items-center justify-center py-12 text-gray-500;
}

.retry-btn {
  @apply px-4 py-2 bg-blue-500 text-white rounded-lg 
         hover:bg-blue-600 transition-colors 
         flex items-center gap-2;
}
</style> 