export enum ChessColor {
  WHITE = "WHITE",
  BLACK = "BLACK",
}

export abstract class ChessFigure {
  constructor(
    protected position: [number, number],
    protected color: ChessColor
  ) {}

  abstract canMoveTo(targetPosition: [number, number]): boolean;

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
}
