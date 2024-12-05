import { ChessFigure, ChessColor } from "../ChessFigure";

export class Bishop extends ChessFigure {
  canMoveTo(targetPosition: [number, number]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;
    return this.isDiagonalMove(targetPosition);
  }
} 