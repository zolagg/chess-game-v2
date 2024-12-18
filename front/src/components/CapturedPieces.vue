<template>
  <div class="captured-pieces">
    <div class="captured-row">
      <span class="label">Black's losses:</span>
      <div class="pieces black">
        <span v-for="(piece, index) in whiteCaptured" 
              :key="index" 
              class="piece">
          {{ getPieceSymbol(piece) }}
        </span>
      </div>
    </div>
    <div class="captured-row">
      <span class="label">White's losses:</span>
      <div class="pieces white">
        <span v-for="(piece, index) in blackCaptured" 
              :key="index" 
              class="piece">
          {{ getPieceSymbol(piece) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  whiteCaptured: string[];
  blackCaptured: string[];
}>();

const getPieceSymbol = (piece: string) => {
  const symbols: Record<string, string> = {
    'WP': '♙', 'BP': '♟',
    'WR': '♖', 'BR': '♜',
    'WN': '♘', 'BN': '♞',
    'WB': '♗', 'BB': '♝',
    'WQ': '♕', 'BQ': '♛',
    'WK': '♔', 'BK': '♚'
  };
  return symbols[piece] || piece;
};
</script>

<style lang="postcss" scoped>
.captured-pieces {
  @apply flex justify-between px-4 py-2 text-sm bg-gray-50 rounded-lg mb-2;
}

.captured-row {
  @apply flex items-center gap-2;
}

.label {
  @apply text-gray-600 font-medium;
}

.pieces {
  @apply flex gap-1;
}

.piece {
  @apply text-base;
}

.white .piece {
  @apply text-gray-700;
}

.black .piece {
  @apply text-gray-900;
}
</style> 