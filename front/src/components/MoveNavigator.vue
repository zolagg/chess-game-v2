<template>
  <div class="move-navigator">
    <div class="controls">
      <button 
        @click="navigateToMove(0)"
        :disabled="currentMoveIndex === 0"
        class="nav-btn"
        title="First Move"
      >
        <i class="fas fa-fast-backward"></i>
      </button>
      <button 
        @click="navigateToMove(currentMoveIndex - 1)"
        :disabled="currentMoveIndex === 0"
        class="nav-btn"
        title="Previous Move"
      >
        <i class="fas fa-step-backward"></i>
      </button>
      <button 
        @click="navigateToMove(currentMoveIndex + 1)"
        :disabled="currentMoveIndex === totalMoves - 1"
        class="nav-btn"
        title="Next Move"
      >
        <i class="fas fa-step-forward"></i>
      </button>
      <button 
        @click="navigateToMove(totalMoves - 1)"
        :disabled="currentMoveIndex === totalMoves - 1"
        class="nav-btn"
        title="Last Move"
      >
        <i class="fas fa-fast-forward"></i>
      </button>
    </div>
    <div class="move-info">
      <span class="move-counter">Move {{ currentMoveIndex + 1 }} of {{ totalMoves }}</span>
      <span class="game-status" :class="gameStatus.toLowerCase()">
        {{ gameStatus }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentMoveIndex: number;
  totalMoves: number;
  gameStatus: 'COMPLETED' | 'RESIGNED' | 'IN_PROGRESS';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'navigateToMove', index: number): void;
}>();

const navigateToMove = (index: number) => {
  if (index >= 0 && index < props.totalMoves) {
    emit('navigateToMove', index);
  }
};
</script>

<style lang="postcss" scoped>
.move-navigator {
  @apply flex flex-col gap-4 p-4 bg-gray-50 rounded-xl shadow-sm;
}

.controls {
  @apply flex justify-center gap-2;
}

.nav-btn {
  @apply p-2 rounded-lg bg-white border border-gray-200
         hover:bg-gray-50 transition-colors
         disabled:opacity-50 disabled:cursor-not-allowed
         focus:outline-none focus:ring-2 focus:ring-blue-500;
}

.move-info {
  @apply flex justify-between items-center text-sm;
}

.move-counter {
  @apply text-gray-600 font-medium;
}

.game-status {
  @apply px-2 py-1 rounded-full text-xs font-medium;
}

.game-status.completed {
  @apply bg-green-100 text-green-800;
}

.game-status.resigned {
  @apply bg-red-100 text-red-800;
}

.game-status.in_progress {
  @apply bg-blue-100 text-blue-800;
}
</style>