<template>
  <div v-if="show" class="promotion-overlay">
    <div class="promotion-dialog">
      <h3 class="text-lg font-semibold mb-4">Choose promotion piece</h3>
      <div class="pieces-grid">
        <button 
          v-for="piece in promotionPieces" 
          :key="piece.type"
          @click="selectPiece(piece.type)"
          class="piece-button"
        >
          <i :class="[piece.icon, color === 'WHITE' ? 'white-piece' : '']"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  show: boolean;
  color: 'WHITE' | 'BLACK';
}>();

const emit = defineEmits<{
  (e: 'select', piece: string): void;
}>();

const promotionPieces = computed(() => [
  { type: 'Q', icon: 'fas fa-chess-queen fa-2x' },
  { type: 'R', icon: 'fas fa-chess-rook fa-2x' },
  { type: 'B', icon: 'fas fa-chess-bishop fa-2x' },
  { type: 'N', icon: 'fas fa-chess-knight fa-2x' }
]);

const selectPiece = (type: string) => {
  emit('select', props.color === 'WHITE' ? `W${type}` : `B${type}`);
};
</script>

<style lang="postcss" scoped>
.promotion-overlay {
  @apply fixed inset-0 bg-black/50 flex items-center justify-center z-50;
}

.promotion-dialog {
  @apply bg-white p-6 rounded-lg shadow-xl;
}

.pieces-grid {
  @apply grid grid-cols-2 gap-4;
}

.piece-button {
  @apply p-4 hover:bg-gray-100 rounded-lg transition-colors;
}

.white-piece {
  @apply text-white drop-shadow-lg;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  -webkit-text-stroke: 1px #2c3e50;
}
</style> 