import { ChessFigure, ChessColor } from "../ChessFigure";

export class Knight extends ChessFigure {
  canMoveTo(targetPosition: [number, number]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;
    
    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
  }
} 