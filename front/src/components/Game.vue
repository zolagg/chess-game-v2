<template>
  <div class="game-container">
    <div class="game-content">
      <div class="game-board">
        <Chessboard 
          :board="gameStore.board" 
          @square-clicked="onSquareClicked" 
        />
      </div>
      <div class="game-sidebar">
        <MoveHistory :moves="gameStore.moves" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import Chessboard from './Chessboard.vue';
import MoveHistory from './MoveHistory.vue';

const route = useRoute();
const router = useRouter();
const gameStore = useGameStore();
const gameId = route.params.id as string;

const onSquareClicked = async ({
  from,
  to,
  piece,
}: {
  from: { row: number; col: number };
  to: { row: number; col: number };
  piece: string;
}) => {
  if (!gameId) return;

  if (from && to) {
    const fromSquare = `${String.fromCharCode(97 + from.col)}${8 - from.row}`;
    const toSquare = `${String.fromCharCode(97 + to.col)}${8 - to.row}`;
    await gameStore.makeMove(fromSquare, toSquare, piece);
  }
};

const resignGame = async () => {
  await gameStore.resignGame(gameId);
  router.push('/');
};

const startNewGame = async () => {
  await gameStore.startNewGame();
  router.push('/');
};

onMounted(async () => {
  await gameStore.getGameState(gameId);
});
</script>

<style lang="postcss" scoped>
.game-container {
  @apply p-4;
}

.game-content {
  @apply flex gap-6;
}

.game-board {
  @apply flex-1;
}

.game-sidebar {
  @apply w-64 bg-white rounded-lg shadow-md p-4;
}
</style> 