import { ChessColor } from "../models/chess.model";

import { GameStatus } from "../models/chess.model";

export interface ChessMoveInputDTO {
  from: string;
  to: string;
  piece: string;
}

export interface ChessMoveOutputDTO {
  success: boolean;
  message: string;
  board?: string[][];
  currentTurn?: ChessColor;
  isCheck: boolean;
  isCheckmate: boolean;
  isFinished?: boolean;
  winnerColor?: ChessColor;
  status?: GameStatus;
  whiteCaptured?: string[];
  blackCaptured?: string[];
}

export interface ChessGameStateDTO {
  gameId: number;
  board: string[][];
  currentTurn: "WHITE" | "BLACK";
  isCheck: boolean;
  isCheckmate: boolean;
  moves: any[];
  status: "IN_PROGRESS" | "COMPLETED" | "RESIGNED";
  isFinished: boolean;
  whiteCaptured: string[];
  blackCaptured: string[];
}
