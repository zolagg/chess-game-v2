import { ChessFigure, ChessColor } from "../ChessFigure";

export class Knight extends ChessFigure {
  canMoveTo(targetPosition: [number, number], boardState: string[][]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;
    
    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    
    // Knights can jump over pieces, so we only need to check the target square
    // to make sure we're not capturing our own piece
    const targetPiece = boardState[toY][toX];
    if (targetPiece !== "") {
      const targetColor = targetPiece[0] === "W" ? ChessColor.WHITE : ChessColor.BLACK;
      if (targetColor === this.color) return false;
    }
    
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  }
}