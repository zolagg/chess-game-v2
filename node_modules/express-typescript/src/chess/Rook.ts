// src/chess/Rook.ts
import { ChessFigure, ChessColor } from './ChessFigure';

export class Rook extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    canMoveTo(toPosition: [number, number]): boolean {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;

        // Rook can move vertically or horizontally
        return (
            targetFile === currentFile || // Vertical
            targetRank === currentRank // Horizontal
        );
    }

}
