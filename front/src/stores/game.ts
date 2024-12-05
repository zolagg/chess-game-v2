import { defineStore } from 'pinia';
import axios from '../config/axios';

interface GameState {
  gameId: number | null;
  board: string[][];
  currentTurn: 'WHITE' | 'BLACK';
  isCheck: boolean;
  isCheckmate: boolean;
  moves: any[];
  loading: boolean;
  error: string | null;
}

export const useGameStore = defineStore('game', {
  state: (): GameState => ({
    gameId: null,
    board: Array(8).fill(null).map(() => Array(8).fill('')),
    currentTurn: 'WHITE',
    isCheck: false,
    isCheckmate: false,
    moves: [],
    loading: false,
    error: null,
  }),

  actions: {
    async startNewGame() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('/chess/new-game');
        console.log('New game response:', response.data);
        const { id, board, currentTurn, isCheck, isCheckmate, moves } = response.data;
        
        this.gameId = id;
        this.board = board;
        this.currentTurn = currentTurn;
        this.isCheck = isCheck;
        this.isCheckmate = isCheckmate;
        this.moves = moves;
      } catch (error: any) {
        console.error('Start game error:', error);
        this.error = error.response?.data?.message || 'Failed to start new game';
      } finally {
        this.loading = false;
      }
    },
  },
}); 