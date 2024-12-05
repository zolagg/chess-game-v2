import { ChessFigure, ChessColor } from "../ChessFigure";

export class Pawn extends ChessFigure {
  canMoveTo(targetPosition: [number, number], boardState: string[][]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;

    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    const direction = this.color === ChessColor.WHITE ? -1 : 1;

    // Diagonal capture
    if (Math.abs(toX - fromX) === 1 && toY === fromY + direction) {
      const targetPiece = boardState[toY][toX];
      if (targetPiece !== "") {
        const targetColor = targetPiece[0] === "W" ? ChessColor.WHITE : ChessColor.BLACK;
        return targetColor !== this.color; // Can capture only opponent's pieces
      }
      return false; // Can't move diagonally if no piece to capture
    }

    // Basic one square forward move
    if (fromX === toX && toY === fromY + direction) {
      return boardState[toY][toX] === ""; // Ensure target square is empty
    }

    // Initial two square move
    const initialRank = this.color === ChessColor.WHITE ? 6 : 1;
    if (fromY === initialRank && fromX === toX && toY === fromY + 2 * direction) {
      // Check both the target square and the square in between
      return boardState[fromY + direction][toX] === "" && 
             boardState[toY][toX] === "";
    }

    return false;
  }
}