<template>
  <div class="chess-container">
    <div class="coordinates-wrapper">
      <div class="file-labels">
        <span v-for="file in 'abcdefgh'" :key="file">{{ file }}</span>
      </div>
      <div class="board-with-ranks">
        <div class="rank-labels">
          <span v-for="rank in '87654321'" :key="rank">{{ rank }}</span>
        </div>
        <div class="chessboard">
          <div v-for="(row, rowIndex) in board" :key="rowIndex" class="row">
            <div
              v-for="(square, colIndex) in row"
              :key="colIndex"
              :class="[
                'square',
                (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark',
                {
                  'selected': selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex,
                  'highlighted': isHighlighted(rowIndex, colIndex)
                }
              ]"
              @click="handleSquareClick(rowIndex, colIndex)"
            >
              <i :class="[getPieceIcon(square), 'piece-icon']"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.chess-container {
  @apply flex justify-center items-center p-8;
}

.coordinates-wrapper {
  @apply flex flex-col;
}

.file-labels {
  @apply flex justify-around px-6 mb-1;
}

.file-labels span {
  @apply text-sm text-text-secondary font-medium;
  width: calc(600px / 8);
}

.board-with-ranks {
  @apply flex items-center;
}

.rank-labels {
  @apply flex flex-col justify-around mr-1;
  height: 600px;
}

.rank-labels span {
  @apply text-sm text-text-secondary font-medium;
  height: calc(600px / 8);
  display: flex;
  align-items: center;
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

.highlighted {
  @apply relative;
}

.highlighted::before {
  content: '';
  @apply absolute w-3 h-3 bg-black/60 rounded-full;

}

.highlighted:hover::before {
  @apply bg-black/80 scale-110;
  transition: all 0.2s ease;
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

.selected {
  @apply ring-4 ring-primary ring-opacity-50;
}
</style>
<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  board: string[][]
}>();

const emit = defineEmits(['square-clicked']);

// Add state for selected piece
const selectedSquare = ref<{ row: number; col: number } | null>(null);

// Function to check if a square should be highlighted
const isHighlighted = (rowIndex: number, colIndex: number) => {
  if (!selectedSquare.value) return false;
  // For now, highlight all empty squares as possible moves
  return props.board[rowIndex][colIndex] === '';
};

const handleSquareClick = (rowIndex: number, colIndex: number) => {
  if (selectedSquare.value) {
    // If a piece is already selected, try to move it
    if (rowIndex !== selectedSquare.value.row || colIndex !== selectedSquare.value.col) {
      emit('square-clicked', {
        from: selectedSquare.value,
        to: { row: rowIndex, col: colIndex },
        piece: props.board[selectedSquare.value.row][selectedSquare.value.col]
      });
    }
    selectedSquare.value = null;
  } else {
    // Select the piece if it's not empty
    if (props.board[rowIndex][colIndex] !== '') {
      selectedSquare.value = { row: rowIndex, col: colIndex };
    }
  }
};

// Function to get the Font Awesome class for each piece
const getPieceIcon = (piece: string) => {
  switch (piece) {
    // Black pieces
    case 'BR': return 'fas fa-chess-rook fa-xl';
    case 'BN': return 'fas fa-chess-knight fa-xl';
    case 'BB': return 'fas fa-chess-bishop fa-xl';
    case 'BQ': return 'fas fa-chess-queen fa-xl';
    case 'BK': return 'fas fa-chess-king fa-xl';
    case 'BP': return 'fas fa-chess-pawn fa-xl';
    // White pieces
    case 'WR': return 'fas fa-chess-rook white-piece fa-xl';
    case 'WN': return 'fas fa-chess-knight white-piece fa-xl';
    case 'WB': return 'fas fa-chess-bishop white-piece fa-xl';
    case 'WQ': return 'fas fa-chess-queen white-piece fa-xl';
    case 'WK': return 'fas fa-chess-king white-piece fa-xl';
    case 'WP': return 'fas fa-chess-pawn white-piece fa-xl';
    default: return '';
  }
};
</script> 