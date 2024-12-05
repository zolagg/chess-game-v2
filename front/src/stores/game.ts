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
        console.log('Starting new game...');
        const response = await axios.post('/chess/new-game');
        console.log('New game response:', response.data);
        this.board = response.data.board;
        this.currentTurn = response.data.currentTurn;
        this.isCheck = response.data.isCheck;
        this.isCheckmate = response.data.isCheckmate;
        this.moves = response.data.moves;
        this.gameId = response.data.gameId;
        console.log('Game state after update:', {
          gameId: this.gameId,
          board: this.board,
          currentTurn: this.currentTurn
        });
        return true;
      } catch (error: any) {
        console.error('Start game error:', error);
        if (error.code === 'ERR_NETWORK') {
          this.error = 'Unable to connect to the game server. Please check your connection.';
        } else {
          this.error = error.response?.data?.message || 'Failed to start new game';
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    async makeMove(from: string, to: string) {
      this.loading = true;
      this.error = null;
      try {
        if (!this.gameId) {
          throw new Error('No active game');
        }

        const fromRow = 8 - parseInt(from[1]);
        const fromCol = from.charCodeAt(0) - 97;
        const piece = this.board[fromRow][fromCol];

        const response = await axios.post(`/chess/move/${this.gameId}`, {
          from,
          to,
          piece
        });
        
        if (response.data.board) {
          this.board = response.data.board;
          this.isCheck = response.data.isCheck || false;
          this.isCheckmate = response.data.isCheckmate || false;
        }
        
        return true;
      } catch (error: any) {
        console.error('Move error:', error);
        this.error = error.response?.data?.message || 'Failed to make move';
        return false;
      } finally {
        this.loading = false;
      }
    }
  },
}); 