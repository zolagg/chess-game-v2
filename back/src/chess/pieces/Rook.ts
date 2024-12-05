import { ChessFigure, ChessColor } from "../ChessFigure";

export class Rook extends ChessFigure {
  canMoveTo(targetPosition: [number, number], boardState: string[][]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;
    if (!this.isStraightMove(targetPosition)) return false;
    
    // Check if target square has our own piece
    const [toX, toY] = targetPosition;
    const targetPiece = boardState[toY][toX];
    if (targetPiece !== "") {
      const targetColor = targetPiece[0] === "W" ? ChessColor.WHITE : ChessColor.BLACK;
      if (targetColor === this.color) return false;
    }
    
    return this.isPathClear(targetPosition, boardState);
  }
} 