<template>
  <div class="move-history">
    <h3 class="text-lg font-semibold mb-4">Move History</h3>
    <div class="moves-list">
      <div v-for="(move, index) in moves" :key="index" class="move-item">
        <span class="move-number">{{ Math.floor(index / 2) + 1 }}.</span>
        <i :class="getPieceIcon(move.piece)"></i>
        <span class="coordinates">{{ move.from }} → {{ move.to }}</span>
        <div v-if="move.capturedPiece" class="capture-indicator">
          <span class="captures">captures</span>
          <i :class="getPieceIcon(move.capturedPiece)"></i>
        </div>
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
  capturedPiece?: string;
}

const props = defineProps<{
  moves: Move[];
}>();

const getPieceIcon = (piece: string) => {
  const icons: Record<string, string> = {
    'WP': 'fas fa-chess-pawn fa-lg white-piece',
    'BP': 'fas fa-chess-pawn fa-lg',
    'WR': 'fas fa-chess-rook fa-lg white-piece',
    'BR': 'fas fa-chess-rook fa-lg',
    'WN': 'fas fa-chess-knight fa-lg white-piece',
    'BN': 'fas fa-chess-knight fa-lg',
    'WB': 'fas fa-chess-bishop fa-lg white-piece',
    'BB': 'fas fa-chess-bishop fa-lg',
    'WQ': 'fas fa-chess-queen fa-lg white-piece',
    'BQ': 'fas fa-chess-queen fa-lg',
    'WK': 'fas fa-chess-king fa-lg white-piece',
    'BK': 'fas fa-chess-king fa-lg'
  };
  return icons[piece] || piece;
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
  @apply flex items-center gap-3 text-sm hover:bg-gray-50 p-2 rounded-lg transition-colors;
}

.move-number {
  @apply text-gray-500 w-8;
}

.coordinates {
  @apply font-mono text-gray-700;
}

.capture-indicator {
  @apply flex items-center gap-2;
}

.captures {
  @apply text-red-500 text-xs font-medium;
}

.white-piece {
  @apply text-white drop-shadow-lg;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  -webkit-text-stroke: 1px #2c3e50;
  text-stroke: 1px #2c3e50;
}
</style> 