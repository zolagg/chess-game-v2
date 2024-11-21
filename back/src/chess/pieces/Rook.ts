import { ChessFigure, ChessColor } from "../ChessFigure";

export class Rook extends ChessFigure {
  canMoveTo(targetPosition: [number, number]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;
    return this.isStraightMove(targetPosition);
  }
} 