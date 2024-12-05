import { ChessFigure, ChessColor } from './ChessFigure';

export class Queen extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
        super(position, color);
    }

    canMoveTo(toPosition: [number, number]): boolean {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;
        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        // Queen can move vertically, horizontally, or diagonally
        return (
            targetFile === currentFile || // Vertical
            targetRank === currentRank || // Horizontal
            fileDiff === rankDiff // Diagonal
        );
    }
}