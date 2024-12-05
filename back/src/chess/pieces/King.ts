import { ChessFigure, ChessColor } from "../ChessFigure";

export class King extends ChessFigure {
  canMoveTo(targetPosition: [number, number]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;
    
    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);
    
    return dx <= 1 && dy <= 1;
  }
} 