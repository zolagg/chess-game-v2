<template>
  <div class="chess-container">
    <div class="chessboard">
      <div
        v-for="(row, rowIndex) in board"
        :key="rowIndex"
        class="row"
      >
        <div
          v-for="(square, colIndex) in row"
          :key="colIndex"
          :class="[
            'square',
            (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark',
            'relative'
          ]"
          @click="handleSquareClick(rowIndex, colIndex)"
        >
          <div class="coordinate-label">
            {{ getSquareCoordinate(rowIndex, colIndex) }}
          </div>
          <i :class="[getPieceIcon(square), 'piece-icon']"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.chess-container {
  @apply flex justify-center items-center p-8;
}

.chessboard {
  @apply grid grid-cols-8 grid-rows-8 w-[600px] h-[600px] border-4 border-secondary rounded-lg overflow-hidden shadow-2xl;
  background: linear-gradient(45deg, #34495e, #2c3e50);
}

.row {
  display: contents;
}

.square {
  @apply w-full h-full flex items-center justify-center text-3xl cursor-pointer transition-all duration-200;
}

.square:hover {
  @apply opacity-90;
  transform: scale(1.05);
}

.light {
  background: #f0d9b5;
}

.dark {
  background: #b58863;
}

.piece-icon {
  @apply transform transition-transform duration-200 hover:scale-110 z-10;
}

.white-piece {
  @apply text-white drop-shadow-lg;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.black-piece {
  @apply text-black drop-shadow-lg;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.coordinate-label {
  @apply absolute text-xs font-semibold;
  bottom: 2px;
  right: 2px;
  opacity: 0.6;
}
</style>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

// Define the board state as a reactive reference
const board = ref([
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['', '', '', '', '', '', '', ''],
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
]);

// Define emits to allow the component to emit events
const emit = defineEmits(['square-clicked']);

// Handle square click events
const handleSquareClick = (rowIndex: number, colIndex: number) => {
  emit('square-clicked', { row: rowIndex, col: colIndex, piece: board.value[rowIndex][colIndex] });
};

// Function to get the Font Awesome class for each piece
const getPieceIcon = (piece: string) => {
  switch (piece) {
    case 'R': return 'fas fa-chess-rook fa-xl';
    case 'N': return 'fas fa-chess-knight fa-xl';
    case 'B': return 'fas fa-chess-bishop fa-xl';
    case 'Q': return 'fas fa-chess-queen fa-xl';
    case 'K': return 'fas fa-chess-king fa-xl';
    case 'P': return 'fas fa-chess-pawn fa-xl';
    case 'r': return 'fas fa-chess-rook white-piece fa-xl';
    case 'n': return 'fas fa-chess-knight white-piece fa-xl';
    case 'b': return 'fas fa-chess-bishop white-piece fa-xl';
    case 'q': return 'fas fa-chess-queen white-piece fa-xl';
    case 'k': return 'fas fa-chess-king white-piece fa-xl';
    case 'p': return 'fas fa-chess-pawn white-piece fa-xl';
    default: return '';
  }
};

// Add this new function
const getSquareCoordinate = (row: number, col: number): string => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
  return `${files[col]}${ranks[row]}`;
};
</script> 