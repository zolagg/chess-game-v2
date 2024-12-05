import { ChessFigure, ChessColor } from "../ChessFigure";

export class King extends ChessFigure {
  canMoveTo(targetPosition: [number, number], boardState: string[][]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;

    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;

    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);

    // Check if target square has our own piece
    const targetPiece = boardState[toY][toX];
    if (targetPiece !== "") {
      const targetColor =
        targetPiece[0] === "W" ? ChessColor.WHITE : ChessColor.BLACK;
      if (targetColor === this.color) return false;
    }

    return dx <= 1 && dy <= 1;
  }
}
