// src/chess/ChessGame.ts
import { ChessFigure, ChessColor } from './ChessFigure';
import { King } from './King';
import { Pawn } from './Pawn';
import { Queen } from './Queen';
import { Knight } from './Knight';
import { Bishop } from './Bishop';
import { Rook } from './Rook';

export class ChessGame {
    private board: (ChessFigure | null)[][];
    private currentPlayerColor: ChessColor = ChessColor.White;
    private enPassantTargetSquare: [number, number] | null = null;
    private moveHistory: { from: [number, number], to: [number, number], piece: ChessFigure }[] = [];
    private capturedPieces: ChessFigure[] = [];

    constructor() {
        this.board = this.createEmptyBoard();
        this.initializeStandardChess();
    }

    private createEmptyBoard(): (ChessFigure | null)[][] {
        return Array(8).fill(null).map(() => Array(8).fill(null));
    }

    private initializeStandardChess(): void {
        // Place chess pieces in starting positions
        this.placePiece(new Rook([0, 0], ChessColor.White));
        this.placePiece(new Knight([1, 0], ChessColor.White));
        this.placePiece(new Bishop([2, 0], ChessColor.White));
        this.placePiece(new Queen([3, 0], ChessColor.White));
        this.placePiece(new King([4, 0], ChessColor.White));
        this.placePiece(new Bishop([5, 0], ChessColor.White));
        this.placePiece(new Knight([6, 0], ChessColor.White));
        this.placePiece(new Rook([7, 0], ChessColor.White));

        for (let i = 0; i < 8; i++) {
        this.placePiece(new Pawn([i, 1], ChessColor.White));
        }

        this.placePiece(new Rook([0, 7], ChessColor.Black));
        this.placePiece(new Knight([1, 7], ChessColor.Black));
        this.placePiece(new Bishop([2, 7], ChessColor.Black));
        this.placePiece(new Queen([3, 7], ChessColor.Black));
        this.placePiece(new King([4, 7], ChessColor.Black));
        this.placePiece(new Bishop([5, 7], ChessColor.Black));
        this.placePiece(new Knight([6, 7], ChessColor.Black));
        this.placePiece(new Rook([7, 7], ChessColor.Black));

        for (let i = 0; i < 8; i++) {
        this.placePiece(new Pawn([i, 6], ChessColor.Black));
        }

    }

    private placePiece(piece: ChessFigure): void {
        const [file, rank] = piece.position;
        this.board[file][rank] = piece;
    }

    movePiece(fromPosition: [number, number], toPosition: [number, number]): void {
        const piece = this.board[fromPosition[0]][fromPosition[1]];
        if (piece) {
        piece.moveTo(toPosition);
        }
    }

    getKing(playerColor: ChessColor): King | null {
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                const piece = this.board[file][rank];
                if (piece instanceof King && piece.color === playerColor) {
                    return piece;
                }
            }
        }
        return null; // If the king is not found
    }

    isPathClear(from: [number, number], to: [number, number]): boolean {
        const [fromFile, fromRank] = from;
        const [toFile, toRank] = to;

        const fileStep = Math.sign(toFile - fromFile);
        const rankStep = Math.sign(toRank - fromRank);

        let currentFile = fromFile + fileStep;
        let currentRank = fromRank + rankStep;

        while (currentFile !== toFile || currentRank !== toRank) {
            if (this.board[currentFile][currentRank] !== null) {
                return false; // Path is obstructed
            }
            currentFile += fileStep;
            currentRank += rankStep;
        }

        return true; // Path is clear
    }

    isUnderAttack(position: [number, number]): boolean {
        const [file, rank] = position;
        const opponentColor = this.currentPlayerColor === ChessColor.White ? ChessColor.Black : ChessColor.White;

        for (let f = 0; f < 8; f++) {
            for (let r = 0; r < 8; r++) {
                const piece = this.board[f][r];
                if (piece && piece.color === opponentColor) {
                    // Check if the opponent's piece can attack the specified position
                    if (piece.canMoveTo(position)) { // Assuming each piece has a canMoveTo method
                        return true;
                    }
                }
            }
        }

        return false; // The position is not under attack
    }




    private isPositionEqual(pos1: [number, number], pos2: [number, number]): boolean {
        return pos1[0] === pos2[0] && pos1[1] === pos2[1];
    }

    castleKingSide(playerColor: ChessColor): boolean {
        const king = this.getKing(playerColor);
        if (!king) {
        console.log("Error: King not found!");
        return false;
        }
    
        const initialKingPosition: [number, number] = playerColor === ChessColor.White ? [7, 4] : [0, 4];
        const rookPosition: [number, number] = playerColor === ChessColor.White ? [7, 7] : [0, 7];
        const kingDestination: [number, number] = playerColor === ChessColor.White ? [7, 6] : [0, 6];
        const rookDestination: [number, number] = playerColor === ChessColor.White ? [7, 5] : [0, 5];
    
        // Ensure the king is in its starting position and has not moved
        if (!this.isPositionEqual(king.position, initialKingPosition)) {
        console.log("Error: King has already moved!");
        return false;
        }
    
        // Ensure the path between the king and rook is clear
        if (!this.isPathClear(king.position, rookPosition)) {
        console.log("Error: Path is obstructed between the king and rook!");
        return false;
        }
    
        // Ensure the king is not in check and does not pass through attacked squares
        if (this.isUnderAttack(king.position) || this.isUnderAttack([7, 5]) || this.isUnderAttack(kingDestination)) {
        console.log("Error: The king cannot pass through or end in a check!");
        return false;
        }
    
        // Move the king and rook
        king.moveTo(kingDestination);
        this.movePiece(rookPosition, rookDestination);
    
        return true;
    }

    castleQueenSide(playerColor: ChessColor): boolean {
        const king = this.getKing(playerColor);
        if (!king) {
        console.log("Error: King not found!");
        return false;
        }
    
        const initialKingPosition: [number, number] = playerColor === ChessColor.White ? [7, 4] : [0, 4];
        const rookPosition: [number, number] = playerColor === ChessColor.White ? [7, 0] : [0, 0];
        const kingDestination: [number, number] = playerColor === ChessColor.White ? [7, 2] : [0, 2];
        const rookDestination: [number, number] = playerColor === ChessColor.White ? [7, 3] : [0, 3];
    
        // Ensure the king is in its starting position and has not moved
        if (!this.isPositionEqual(king.position, initialKingPosition)) {
        console.log("Error: King has already moved!");
        return false;
        }
    
        // Ensure the path between the king and rook is clear
        if (!this.isPathClear(king.position, rookPosition)) {
        console.log("Error: Path is obstructed between the king and rook!");
        return false;
        }
    
        // Ensure the king is not in check and does not pass through attacked squares
        if (this.isUnderAttack(king.position) || this.isUnderAttack([7, 3]) || this.isUnderAttack(kingDestination)) {
        console.log("Error: The king cannot pass through or end in a check!");
        return false;
        }
    
        // Move the king and rook
        king.moveTo(kingDestination);
        this.movePiece(rookPosition, rookDestination);
    
        return true;
    }


    getAllPieces(playerColor: ChessColor): ChessFigure[] {
        const pieces: ChessFigure[] = [];
        for (let file = 0; file < 8; file++) {
            for (let rank = 0; rank < 8; rank++) {
                const piece = this.board[file][rank];
                if (piece && piece.color === playerColor) {
                    pieces.push(piece);
                }
            }
        }
        return pieces;
    }

    
    enPassantCapture(fromPosition: [number, number], toPosition: [number, number]): boolean {
        const [fromFile, fromRank] = fromPosition;
        const [toFile, toRank] = toPosition;
    
        // Check if the destination position is the en passant target square
        if (
        this.enPassantTargetSquare &&
        this.enPassantTargetSquare[0] === toFile &&
        this.enPassantTargetSquare[1] === toRank
        ) {
        // Check if the move is a valid en passant capture
        if (Math.abs(fromFile - toFile) === 1 && Math.abs(fromRank - toRank) === 1) {
            // Perform the en passant capture
            this.board[fromRank][fromFile] = null;  // Remove the moving pawn
            this.board[toRank - (this.currentPlayerColor === ChessColor.White ? 1 : -1)][toFile] = null;  // Remove the captured pawn
            this.board[toRank][toFile] = new Pawn([toFile, toRank], this.currentPlayerColor);  // Place the pawn in the target position
            console.log('En passant capture successful.');
            return true;
        }
        }
    
        console.log('Invalid en passant capture.');
        return false;
    }

    isInCheck(playerColor: ChessColor): boolean {
        // Find the position of the king for the player color
        const king = this.getKing(playerColor);
        if (!king) return false;

        // Check if the king is under attack
        return this.isUnderAttack(king.position);
    }

    isCheckmate(playerColor: ChessColor): boolean {
        // First, check if the king is in check
        if (!this.isInCheck(playerColor)) {
            return false; // Not in check, hence not checkmate
        }

        // Get all pieces of the player
        const playerPieces = this.getAllPieces(playerColor);

        // Check if any piece can make a legal move
        for (const piece of playerPieces) {
            const currentPosition = piece.position;
            for (let file = 0; file < 8; file++) {
                for (let rank = 0; rank < 8; rank++) {
                    const targetPosition: [number, number] = [file, rank];
                    if (piece.canMoveTo(targetPosition)) {
                        // Temporarily move the piece to check for checkmate
                        const originalPosition = piece.position;
                        piece.position = targetPosition;
                        const wasInCheck = this.isInCheck(playerColor);

                        // Undo the move
                        piece.position = originalPosition;

                        if (!wasInCheck) {
                            return false; // There exists a legal move, so not checkmate
                        }
                    }
                }
            }
        }

        return true; // No legal moves available, it's checkmate
    }


    isStalemate(playerColor: ChessColor): boolean {
        // First, check if the king is in check
        if (this.isInCheck(playerColor)) {
            return false; // Cannot be stalemate if in check
        }
    
        // Get all pieces of the player
        const playerPieces = this.getAllPieces(playerColor);
    
        // Check if any piece can make a legal move
        for (const piece of playerPieces) {
            const currentPosition = piece.position;
            for (let file = 0; file < 8; file++) {
                for (let rank = 0; rank < 8; rank++) {
                    const targetPosition: [number, number] = [file, rank];
                    if (piece.canMoveTo(targetPosition)) {
                        // Temporarily move the piece to check for stalemate
                        const originalPosition = piece.position;
                        piece.position = targetPosition;
                        const wasInCheck = this.isInCheck(playerColor);
    
                        // Undo the move
                        piece.position = originalPosition;
    
                        if (!wasInCheck) {
                            return false; // There exists a legal move, so not stalemate
                        }
                    }
                }
            }
        }
    
        return true; // No legal moves available, it's stalemate
    }

    isDraw(): boolean {
        const whitePieces = this.getAllPieces(ChessColor.White);
        const blackPieces = this.getAllPieces(ChessColor.Black);
    
        // Check for insufficient material
        if (
            (whitePieces.length === 1 && blackPieces.length === 1) || // Only kings
            (whitePieces.length === 1 && blackPieces.length === 2 && blackPieces.every(piece => piece instanceof Knight)) || // White king vs. Black king and knights
            (blackPieces.length === 1 && whitePieces.length === 2 && whitePieces.every(piece => piece instanceof Knight)) // Black king vs. White king and knights
        ) {
            return true; // Draw due to insufficient material
        }
    
                    
        return false; // No draw conditions met
    }
    

    public makeMove(fromPosition: [number, number], toPosition: [number, number]): boolean {
        const piece = this.board[fromPosition[0]][fromPosition[1]];
        const targetSquare = this.board[toPosition[0]][toPosition[1]];

        // Existing validation checks...
        if (!piece || piece.color !== this.currentPlayerColor || !piece.canMoveTo(toPosition)) {
            return false;
        }

        if (this.wouldMoveResultInCheck(fromPosition, toPosition, piece.color)) {
            console.log("Move would result in check.");
            return false;
        }

        // Handle captures
        if (targetSquare) {
            if (targetSquare.color === piece.color) {
                console.log("Cannot capture your own piece.");
                return false;
            }
            this.capturedPieces.push(targetSquare);
        }

        // Record move in history
        this.moveHistory.push({
            from: fromPosition,
            to: toPosition,
            piece: piece
        });

        // Execute move (your existing code)
        piece.moveTo(toPosition);
        this.board[toPosition[0]][toPosition[1]] = piece;
        this.board[fromPosition[0]][fromPosition[1]] = null;

        // Check for game status: checkmate, stalemate, draw
        if (this.isCheckmate(this.currentPlayerColor)) {
            console.log("Checkmate! " + this.currentPlayerColor + " loses.");
        } else if (this.isStalemate(this.currentPlayerColor)) {
            console.log("Stalemate! The game is a draw.");
        } else if (this.isDraw()) {
            console.log("The game is a draw due to insufficient material.");
        }

        // Switch players
        this.currentPlayerColor = (this.currentPlayerColor === ChessColor.White) ? ChessColor.Black : ChessColor.White;

        return true; // Move successful
    }
    
    public getMoveHistory(): { from: [number, number], to: [number, number], piece: ChessFigure }[] {
        return [...this.moveHistory];
    }

    public getCapturedPieces(): ChessFigure[] {
        return [...this.capturedPieces];
    }
  
    private wouldMoveResultInCheck(fromPosition: [number, number], toPosition: [number, number], playerColor: ChessColor): boolean {
        const piece = this.board[fromPosition[0]][fromPosition[1]];
        const targetPiece = this.board[toPosition[0]][toPosition[1]];

        // Temporarily make the move
        this.board[toPosition[0]][toPosition[1]] = piece;
        this.board[fromPosition[0]][fromPosition[1]] = null;

        const wouldBeInCheck = this.isInCheck(playerColor);

        // Undo the move
        this.board[fromPosition[0]][fromPosition[1]] = piece;
        this.board[toPosition[0]][toPosition[1]] = targetPiece;

        return wouldBeInCheck;
    }
}
