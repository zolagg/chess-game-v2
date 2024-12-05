import { ChessFigure, ChessColor } from "../ChessFigure";

export class Queen extends ChessFigure {
  canMoveTo(targetPosition: [number, number]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;
    return this.isStraightMove(targetPosition) || this.isDiagonalMove(targetPosition);
  }
} 