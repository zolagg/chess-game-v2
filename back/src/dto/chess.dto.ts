export interface ChessMoveInputDTO {
  from: string;
  to: string;
  piece: string;
}

export interface ChessMoveOutputDTO {
  success: boolean;
  message: string;
  board?: string[][];
  currentTurn?: "WHITE" | "BLACK";
  isCheck: boolean;
  isCheckmate: boolean;
  isFinished?: boolean;
  winnerColor?: "WHITE" | "BLACK";
  status?: "IN_PROGRESS" | "COMPLETED" | "RESIGNED";
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
}
