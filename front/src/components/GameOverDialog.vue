<template>
  <div v-if="show" class="game-over-overlay">
    <div class="game-over-dialog">
      <div class="dialog-content">
        <div class="trophy-icon">
          <i class="fas fa-trophy"></i>
        </div>
        <h3 class="title">Game Over!</h3>
        <p class="winner-message">{{ message }}</p>
        <div class="actions">
          <button @click="$emit('newGame')" class="btn-primary">
            <i class="fas fa-play mr-2"></i>
            New Game
          </button>
          <button @click="$emit('goToHistory')" class="btn-secondary">
            <i class="fas fa-history mr-2"></i>
            Game History
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  show: boolean;
  winner: "WHITE" | "BLACK" | null;
}>();

const message = computed(() => {
  if (!props.winner) return "The game ended in a draw!";
  return `${
    props.winner.charAt(0) + props.winner.slice(1).toLowerCase()
  } pieces win!`;
});

defineEmits<{
  (e: "newGame"): void;
  (e: "goToHistory"): void;
}>();
</script>

<style lang="postcss" scoped>
.game-over-overlay {
  @apply fixed inset-0 bg-black/60 flex items-center justify-center z-50
         backdrop-blur-sm transition-all duration-300;
}

.game-over-dialog {
  @apply bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4
         transform transition-all duration-300
         animate-[slideIn_0.3s_ease-out];
}

.dialog-content {
  @apply p-8 flex flex-col items-center;
}

.trophy-icon {
  @apply text-6xl text-yellow-400 mb-4
         animate-[bounce_1s_ease-in-out_infinite];
}

.title {
  @apply text-3xl font-bold mb-2 text-gray-900;
}

.winner-message {
  @apply text-xl text-gray-800 mb-8 text-center;
}

.actions {
  @apply flex flex-col sm:flex-row gap-4 w-full max-w-xs;
}

.btn-primary {
  @apply px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700 to-gray-800
         text-black font-semibold w-full
         flex items-center justify-center gap-2
         transform transition-all duration-200
         hover:from-gray-800 hover:to-gray-900
         hover:-translate-y-0.5 hover:shadow-lg
         focus:ring-2 focus:ring-gray-700 focus:ring-offset-2;
}

.btn-secondary {
  @apply px-6 py-3 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200
         text-gray-700 font-semibold w-full
         flex items-center justify-center gap-2
         transform transition-all duration-200
         hover:from-gray-200 hover:to-gray-300
         hover:-translate-y-0.5 hover:shadow-md
         focus:ring-2 focus:ring-gray-400 focus:ring-offset-2;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-5%);
  }
  50% {
    transform: translateY(5%);
  }
}
</style>
