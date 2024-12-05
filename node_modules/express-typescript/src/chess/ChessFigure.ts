export enum ChessColor {
    White = "white",
    Black = "black",
  }
  
  export abstract class ChessFigure {
    position: [number, number];
    color: ChessColor;
  
    constructor(position: [number, number], color: ChessColor) {
      this.position = position;
      this.color = color;
    }
  
    protected isOutOfBounds(position: [number, number]): boolean {
        const [file, rank] = position;
        return file >= 0 && file < 8 && rank >= 0 && rank < 8;
    }
  
    abstract canMoveTo(toPosition: [number, number]): boolean;
  
    moveTo(toPosition: [number, number]): void {
        if (this.canMoveTo(toPosition) && this.isOutOfBounds(toPosition)) {
            this.position = toPosition;
        }
    }
  }
  