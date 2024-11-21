<template>
    <div class="container">
      <h1 class="text-3xl font-bold mb-6">Welcome to Chess Game</h1>
      <div class="game-container">
        <Chessboard @square-clicked="onSquareClicked" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import Chessboard from './Chessboard.vue';
  
  const onSquareClicked = (square: string) => {
    console.log('Square clicked:', square);
  };
  </script>
  
  <style scoped>
  .container {
    padding: 2rem;
  }
  
  .game-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }
  </style>