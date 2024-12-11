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
        console.log("Game state after update:", {
          gameId: this.gameId,
          board: this.board,
          currentTurn: this.currentTurn,
        });
        return true;
      } catch (error: any) {
        console.error("Start game error:", error);
        if (error.code === "ERR_NETWORK") {
          this.error =
            "Unable to connect to the game server. Please check your connection.";
        } else {
          this.error =
            error.response?.data?.message || "Failed to start new game";
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    async makeMove(from: string, to: string, piece: string) {
      this.loading = true;
      this.error = null;
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
          this.board = response.data.board;
          
          if (response.data.currentTurn) {
            this.currentTurn = response.data.currentTurn;
          }
          
          if (response.data.isFinished) {
            this.isFinished = true;
            this.winnerColor = response.data.winnerColor;
            this.error = `Game Over - ${response.data.winnerColor} wins!`;
          }
        }

        return true;
      } catch (error: any) {
        console.error("Move error:", error);
        if (error.response?.status === 412) {
          this.error = error.response.data.message;
        } else if (error.code === "ERR_NETWORK") {
          this.error = "Unable to connect to the game server. Please check your connection.";
        } else {
          this.error = error.response?.data?.message || "An unexpected error occurred";
        }
        return false;
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
  },
});
