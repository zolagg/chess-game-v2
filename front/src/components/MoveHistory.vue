<template>
  <div class="move-history">
    <h3 class="text-lg font-semibold mb-4">Move History</h3>
    <div class="moves-list">
      <div v-for="(move, index) in moves" :key="index" class="move-item">
        <span class="move-number">{{ Math.floor(index / 2) + 1 }}.</span>
        <span class="piece">{{ getPieceSymbol(move.piece) }}</span>
        <span class="coordinates">{{ move.from }} → {{ move.to }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Move {
  from: string;
  to: string;
  piece: string;
  timestamp: Date;
}

const props = defineProps<{
  moves: Move[];
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
.move-history {
  @apply h-full;
}

.moves-list {
  @apply space-y-2 max-h-[500px] overflow-y-auto;
}

.move-item {
  @apply flex items-center gap-2 text-sm;
}

.move-number {
  @apply text-gray-500 w-8;
}

.piece {
  @apply text-lg;
}

.coordinates {
  @apply font-mono;
}
</style> 