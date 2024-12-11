export interface ChessMoveInputDTO {
  from: string; // Position de départ (ex: "e2")
  to: string; // Position d'arrivée (ex: "e4")
  piece: string; // Type de pièce (ex: "PAWN", "KNIGHT", etc.)
}

export interface ChessMoveOutputDTO {
  success: boolean;
  message: string;
  board?: string[][];
  currentTurn: "WHITE" | "BLACK";
  isCheck: boolean;
  isCheckmate: boolean;
  isFinished?: boolean;
  winnerColor?: "WHITE" | "BLACK";
}

export interface ChessGameStateDTO {
  gameId: number;
  board: string[][];
  currentTurn: "WHITE" | "BLACK";
  isCheck: boolean;
  isCheckmate: boolean;
  moves: string[]; // Historique des coups
}
