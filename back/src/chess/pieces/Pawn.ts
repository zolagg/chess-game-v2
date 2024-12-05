import { ChessFigure, ChessColor } from "../ChessFigure";

export class Pawn extends ChessFigure {
  canMoveTo(targetPosition: [number, number]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;

    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    const direction = this.color === ChessColor.WHITE ? -1 : 1;

    // Basic one square forward move
    if (fromX === toX && toY === fromY + direction) return true;

    // Initial two square move
    const initialRank = this.color === ChessColor.WHITE ? 6 : 1;
    if (fromY === initialRank && fromX === toX && toY === fromY + 2 * direction)
      return true;

    return false;
  }
}
