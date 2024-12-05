import { ChessFigure, ChessColor } from './ChessFigure';

export class Knight extends ChessFigure {
    constructor(position: [number, number], color: ChessColor) {
      super(position, color);
    }

    canMoveTo(toPosition: [number, number]): boolean {
        const [targetFile, targetRank] = toPosition;
        const [currentFile, currentRank] = this.position;

        const fileDiff = Math.abs(targetFile - currentFile);
        const rankDiff = Math.abs(targetRank - currentRank);

        // Knight moves in an "L" shape
        return (
            (fileDiff === 2 && rankDiff === 1) ||
            (fileDiff === 1 && rankDiff === 2)
        );
    }
}