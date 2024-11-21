<template>
  <div class="chessboard">
    <div
      v-for="(row, rowIndex) in board"
      :key="rowIndex"
      class="row"
    >
      <div
        v-for="(square, colIndex) in row"
        :key="colIndex"
        :class="['square', (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark']"
        @click="handleSquareClick(rowIndex, colIndex)"
      >
        <i :class="getPieceIcon(square)"></i>
      </div>
    </div>
  </div>
</template>

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
</script>

<style scoped>
.chessboard {
  display: grid;
  grid-template-rows: repeat(8, 1fr);
  grid-template-columns: repeat(8, 1fr);
  width: 600px;
  height: 600px;
  border: 5px solid #333;
}

.row {
  display: contents;
}

.square {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  cursor: pointer;
}

.light {
  background-color: #f0d9b5;
}

.dark {
  background-color: #604936;
}

.square i {
  color: black;
  text-shadow: 2px 2px 2px rgba(255, 255, 255, 0.8);

}

.white-piece {
  color: #ffffff !important;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8) !important;
}
</style> 