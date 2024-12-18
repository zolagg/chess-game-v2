import { defineStore } from "pinia";
import axios from "../config/axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface GameState {
  gameId: number | null;
  board: string[][];
  currentTurn: "WHITE" | "BLACK";
  isCheck: boolean;
  isCheckmate: boolean;
  moves: any[];
  loading: boolean;
  error: string | null;
  isFinished: boolean;
  winnerColor: "WHITE" | "BLACK" | null;
  gameHistory: Array<{
    id: number;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'RESIGNED';
    createdAt: string;
    winner?: string;
  }>;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'RESIGNED';
  whiteCaptured: string[];
  blackCaptured: string[];
}

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    gameId: null,
    board: Array(8)
      .fill(null)
      .map(() => Array(8).fill("")),
    currentTurn: "WHITE",
    isCheck: false,
    isCheckmate: false,
    moves: [],
    loading: false,
    error: null,
    isFinished: false,
    winnerColor: null,
    gameHistory: [],
    status: 'IN_PROGRESS' as 'IN_PROGRESS' | 'COMPLETED' | 'RESIGNED',
    whiteCaptured: [],
    blackCaptured: [],
  }),

  actions: {
    async startNewGame() {
      this.loading = true;
      this.error = null;
      try {
        console.log("Starting new game...");
        const response = await axios.post("/chess/new-game");
        console.log("New game response:", response.data);
        
        this.board = response.data.board;
        this.currentTurn = response.data.currentTurn;
        this.isCheck = response.data.isCheck;
        this.isCheckmate = response.data.isCheckmate;
        this.moves = response.data.moves;
        this.gameId = response.data.gameId;
        this.status = 'IN_PROGRESS';
        this.isFinished = false;
        this.winnerColor = null;
        
        return {
          ...response.data,
          gameId: response.data.gameId
        };
      } catch (error: any) {
        console.error("Start game error:", error);
        if (error.code === "ERR_NETWORK") {
          this.error = "Unable to connect to the game server. Please check your connection.";
        } else {
          this.error = error.response?.data?.message || "Failed to start new game";
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async makeMove(from: string, to: string, piece: string) {
      this.loading = true;
      try {
        if (!this.gameId) {
          throw new Error("No active game");
        }

        const response = await axios.post(`/chess/move/${this.gameId}`, {
          from,
          to,
          piece
        });

        if (response.data.board) {
          // Get the target piece before updating the board
          const [toFile, toRank] = to.split("");
          const toRow = 8 - parseInt(toRank);
          const toCol = toFile.charCodeAt(0) - 97;
          const targetPiece = this.board[toRow][toCol];
          
          // If there was a piece at the target square, add it to captured pieces
          if (targetPiece) {
            if (piece.startsWith('W')) {
              this.whiteCaptured.push(targetPiece);
            } else {
              this.blackCaptured.push(targetPiece);
            }
          }

          this.board = response.data.board;
          
          if (response.data.currentTurn) {
            this.currentTurn = response.data.currentTurn;
          }
          
          // Ajouter le nouveau mouvement à l'historique
          this.moves.push({
            from,
            to,
            piece,
            timestamp: new Date()
          });
          
          if (response.data.isFinished) {
            this.isFinished = true;
            this.winnerColor = response.data.winnerColor;
          }
        }

        return true;
      } catch (error: any) {
        let errorMessage: string;
        if (error.response?.status === 412) {
          errorMessage = error.response.data.message;
        } else if (error.code === "ERR_NETWORK") {
          errorMessage = "Unable to connect to the game server. Please check your connection.";
        } else {
          errorMessage = error.response?.data?.message || "An unexpected error occurred";
        }
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    // Add after makeMove method in the actions object
    async getPossibleMoves(position: string) {
      this.loading = true;
      this.error = null;
      try {
        if (!this.gameId) {
          throw new Error("No active game");
        }
        const response = await axios.get(
          `/chess/possible-moves/${this.gameId}/${position}`
        );
        return response.data;
      } catch (error: any) {
        console.error("Error getting possible moves:", error);
        this.error =
          error.response?.data?.message || "Failed to get possible moves";
        return [];
      } finally {
        this.loading = false;
      }
    },
        async getGameState(gameId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`/chess/game-state/${gameId}`);
        console.log("Game state response:", response.data);
        this.board = response.data.board;
        this.currentTurn = response.data.currentTurn;
        this.isCheck = response.data.isCheck;
        this.isCheckmate = response.data.isCheckmate;
        this.moves = response.data.moves;
        this.gameId = response.data.gameId;
        this.isFinished = response.data.status === 'COMPLETED' || response.data.status === 'RESIGNED';
        this.winnerColor = response.data.winner_color || null;
        this.status = response.data.status;
        this.whiteCaptured = response.data.whiteCaptured || [];
        this.blackCaptured = response.data.blackCaptured || [];
        return response.data;
      } catch (error: any) {
        console.error("Get game state error:", error);
        if (error.code === "ERR_NETWORK") {
          this.error = "Unable to connect to the game server. Please check your connection.";
        } else {
          this.error = error.response?.data?.message || "Failed to get game state";
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async resignGame(gameId: string) {
      this.loading = true;
      try {
        const response = await axios.post(`/chess/resign/${gameId}`);
        if (response.data) {
          this.board = response.data.board;
          this.isFinished = true;
          this.status = 'RESIGNED';
          // Assuming black wins when white resigns
          this.winnerColor = 'BLACK';
        }
        return true;
      } catch (error: any) {
        let errorMessage: string;
        if (error.response?.status === 412) {
          errorMessage = error.response.data.message;
        } else if (error.code === "ERR_NETWORK") {
          errorMessage = "Unable to connect to the game server. Please check your connection.";
        } else {
          errorMessage = error.response?.data?.message || "An unexpected error occurred";
        }
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },
    async reconstructBoardState(moves: any[]) {
      try {
        if (!this.gameId) {
          throw new Error("No active game");
        }
        
        const response = await axios.post(`/chess/reconstruct/${this.gameId}`, {
          moves
        });
        
        if (response.data.board) {
          this.board = response.data.board;
          this.whiteCaptured = response.data.whiteCaptured || [];
          this.blackCaptured = response.data.blackCaptured || [];
        }
      } catch (error: any) {
        console.error("Error reconstructing board state:", error);
        throw error;
      }
    }
  },
});
