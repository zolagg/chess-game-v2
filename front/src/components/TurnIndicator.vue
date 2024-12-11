<template>
  <div class="turn-indicator">
    <div class="turn-status" :class="{ 'active': currentTurn === 'WHITE' }">
      <i class="fas fa-chess-pawn white-piece"></i>
      <span>White's Turn</span>
    </div>
    <div class="turn-status" :class="{ 'active': currentTurn === 'BLACK' }">
      <i class="fas fa-chess-pawn"></i>
      <span>Black's Turn</span>
    </div>
    <div v-if="isCheck" class="check-indicator">
      Check!
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/game';

const gameStore = useGameStore();
const props = defineProps<{
  currentTurn: 'WHITE' | 'BLACK';
  isCheck: boolean;
}>();
</script>

<style lang="postcss" scoped>
.turn-indicator {
  @apply flex items-center gap-4 mb-4 p-4 bg-gray-50 rounded-xl;
}

.turn-status {
  @apply flex items-center gap-2 px-4 py-2 rounded-lg opacity-50 transition-all duration-200;
}

.turn-status.active {
  @apply opacity-100 bg-white shadow-md;
}

.white-piece {
  @apply text-white drop-shadow-lg;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.check-indicator {
  @apply ml-auto px-4 py-2 bg-red-100 text-red-600 font-semibold rounded-lg
         animate-pulse;
}
</style>