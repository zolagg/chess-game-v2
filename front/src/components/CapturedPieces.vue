<template>
  <div class="captured-pieces">
    <div class="captured-row">
      <span class="label">Black's losses:</span>
      <div class="pieces black">
        <span v-for="(piece, index) in whiteCaptured" 
              :key="index" 
              class="piece">
          <i :class="getPieceIcon(piece)"></i>
        </span>
      </div>
    </div>
    <div class="captured-row">
      <span class="label">White's losses:</span>
      <div class="pieces white">
        <span v-for="(piece, index) in blackCaptured" 
              :key="index" 
              class="piece">
          <i :class="getPieceIcon(piece)"></i>
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
  @apply flex gap-2;
}

.piece {
  @apply flex items-center justify-center;
}

.piece i {
  @apply transform transition-all duration-200 hover:scale-110;
}

.white-piece {
  @apply text-white drop-shadow-lg;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  -webkit-text-stroke: 1px #2c3e50;
  text-stroke: 1px #2c3e50;
}
</style> 