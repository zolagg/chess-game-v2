<template>
  <div class="home-container">
    <Toast position="top-right" />
    <div class="hero-section">
      <h1 class="title">Welcome to Chess Game</h1>
      <p class="subtitle">Challenge yourself in the classic game of strategy</p>
      <div class="actions">
        <button 
          @click="startNewGame" 
          class="new-game-btn"
          :disabled="gameStore.loading"
        >
          <i class="fas fa-play mr-2"></i>
          Start New Game
        </button>
        <button 
          @click="viewHistory" 
          class="history-btn"
        >
          <i class="fas fa-history mr-2"></i>
          View Game History
        </button>
      </div>
    </div>
    <div class="features-section">
      <div class="feature-card">
        <i class="fas fa-chess fa-2x mb-4"></i>
        <h3>Classic Chess</h3>
        <p>Play the traditional game with all standard rules</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-trophy fa-2x mb-4"></i>
        <h3>Track Progress</h3>
        <p>Monitor your games and improve your strategy</p>
      </div>
      <div class="feature-card">
        <i class="fas fa-mobile-alt fa-2x mb-4"></i>
        <h3>Responsive Design</h3>
        <p>Play on any device, anywhere</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';

const router = useRouter();
const gameStore = useGameStore();
const toast = useToast();

const startNewGame = async () => {
  try {
    const gameData = await gameStore.startNewGame();
    if (gameData && gameData.gameId) {
      router.push(`/game/${gameData.gameId}`);
    } else {
      throw new Error('Invalid game data received');
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

const viewHistory = () => {
  router.push('/history');
};
</script>

<style lang="postcss" scoped>
.home-container {
  @apply min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-12;
}

.hero-section {
  @apply max-w-4xl mx-auto text-center px-4 mb-16;
}

.title {
  @apply text-5xl font-bold mb-4;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  @apply text-xl text-gray-600 mb-8;
}

.actions {
  @apply flex flex-wrap justify-center gap-4;
}

.new-game-btn {
  @apply px-6 py-3 rounded-xl bg-blue-500 text-white font-semibold
         flex items-center justify-center gap-2
         transform transition-all duration-200
         hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-lg
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.history-btn {
  @apply px-6 py-3 rounded-xl bg-indigo-500 text-white font-semibold
         flex items-center justify-center gap-2
         transform transition-all duration-200
         hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-lg;
}

.features-section {
  @apply max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4;
}

.feature-card {
  @apply bg-white p-6 rounded-xl shadow-lg text-center
         transform transition-all duration-200
         hover:-translate-y-1 hover:shadow-xl;
}

.feature-card h3 {
  @apply text-xl font-semibold mb-2 text-gray-800;
}

.feature-card p {
  @apply text-gray-600;
}
</style>