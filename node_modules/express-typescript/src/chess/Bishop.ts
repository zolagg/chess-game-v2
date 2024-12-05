import { ChessFigure, ChessColor } from './ChessFigure';

export class Bishop extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
      super(position, color);
    }

    canMoveTo(toPosition: [number, number]): boolean {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;

        // Bishop can move diagonally
        return (Math.abs(targetFile - currentFile) === Math.abs(targetRank - currentRank));
    }
  }