// src/chess/King.ts
import { ChessFigure, ChessColor } from './ChessFigure';

export class King extends ChessFigure {
    private hasMoved: boolean = false;

    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    moveTo(toPosition: [number, number]): void {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        // Regular king move
        if (fileDiff <= 1 && rankDiff <= 1) {
            this.position = toPosition;
            this.hasMoved = true;
            console.log('King moved to', toPosition);
        } 
        // Castling move (2 squares horizontally)
        else if (!this.hasMoved && rankDiff === 0 && fileDiff === 2) {
            this.position = toPosition;
            this.hasMoved = true;
            console.log('King castled to', toPosition);
        } else {
            console.log('Invalid move for the king');
        }
    }

    canMoveTo(toPosition: [number, number]): boolean {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        // Regular one square move in any direction
        if (fileDiff <= 1 && rankDiff <= 1) {
            return true;
        }

        // Castling move
        if (!this.hasMoved && rankDiff === 0 && fileDiff === 2) {
            return true;
        }

        return false;
    }

    public hasKingMoved(): boolean {
        return this.hasMoved;
    }
}
