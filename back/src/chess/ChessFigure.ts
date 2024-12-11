export enum ChessColor {
  WHITE = "WHITE",
  BLACK = "BLACK",
}

export abstract class ChessFigure {
  constructor(
    protected position: [number, number],
    protected color: ChessColor
  ) {}

  abstract canMoveTo(targetPosition: [number, number], boardState: string[][]): boolean;

  getPossibleMoves(boardState: string[][]): [number, number][] {
    const possibleMoves: [number, number][] = [];
    
    // Check all possible squares on the board
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const targetPosition: [number, number] = [col, row];
        
        // Skip if the target position is the same as current position
        if (col === this.position[0] && row === this.position[1]) {
          continue;
        }
        
        // Check if the move is valid according to piece rules
        if (this.canMoveTo(targetPosition, boardState)) {
          // Check if target square has a piece of the same color
          const targetPiece = boardState[row][col];
          if (!targetPiece || targetPiece[0] !== (this.color === ChessColor.WHITE ? "W" : "B")) {
            possibleMoves.push(targetPosition);
          }
        }
      }
    }
    
    return possibleMoves;
  }

  protected isValidPosition(position: [number, number]): boolean {
    const [x, y] = position;
    return x >= 0 && x < 8 && y >= 0 && y < 8;
  }

  protected isDiagonalMove(targetPosition: [number, number]): boolean {
    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    return Math.abs(toX - fromX) === Math.abs(toY - fromY);
  }

  protected isStraightMove(targetPosition: [number, number]): boolean {
    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    return fromX === toX || fromY === toY;
  }

  protected isPathClear(targetPosition: [number, number], boardState: string[][]): boolean {
    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    
    // Calculate direction
    const dx = Math.sign(toX - fromX);
    const dy = Math.sign(toY - fromY);
    
    let currentX = fromX + dx;
    let currentY = fromY + dy;
    
    // Check each square along the path
    while (currentX !== toX || currentY !== toY) {
      if (boardState[currentY][currentX] !== "") {
        return false; // Path is blocked
      }
      currentX += dx;
      currentY += dy;
    }
    
    return true;
  }
}