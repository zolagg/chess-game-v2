import { ChessFigure, ChessColor } from './ChessFigure';

export class Pawn extends ChessFigure {
    private hasMoved: boolean = false;

    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    canMoveTo(toPosition: [number, number]): boolean {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = targetFile - currentFile;
        const rankDiff = targetRank - currentRank;
        const direction = this.color === ChessColor.White ? 1 : -1;

        // Normal one square forward move
        if (fileDiff === 0 && rankDiff === direction) {
            this.hasMoved = true;
            return true;
        }

        // Initial two square move
        if (!this.hasMoved && fileDiff === 0 && rankDiff === 2 * direction) {
            this.hasMoved = true;
            return true;
        }

        // Diagonal capture
        if (Math.abs(fileDiff) === 1 && rankDiff === direction) {
            this.hasMoved = true;
            return true;
        }

        return false;
    }
}