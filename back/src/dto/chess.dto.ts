export interface ChessMoveInputDTO {
  from: string; // Position de départ (ex: "e2")
  to: string;   // Position d'arrivée (ex: "e4")
  piece: string; // Type de pièce (ex: "PAWN", "KNIGHT", etc.)
}

export interface ChessMoveOutputDTO {
  success: boolean;
  message: string;
  board?: string[][]; // Représentation du plateau après le mouvement
  isCheck?: boolean;  // Si le roi est en échec
  isCheckmate?: boolean; // Si c'est un échec et mat
}

export interface ChessGameStateDTO {
  board: string[][];
  currentTurn: 'WHITE' | 'BLACK';
  isCheck: boolean;
  isCheckmate: boolean;
  moves: string[]; // Historique des coups
}
