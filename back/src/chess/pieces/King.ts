import { ChessFigure, ChessColor } from "../ChessFigure";

export class King extends ChessFigure {
  private hasMoved: boolean = false;

  canMoveTo(targetPosition: [number, number], boardState: string[][]): boolean {
    if (!this.isValidPosition(targetPosition)) return false;

    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    const dx = Math.abs(toX - fromX);
    const dy = Math.abs(toY - fromY);

    // Vérification du roque
    if (dy === 0 && dx === 2 && !this.hasMoved) {
      return this.canCastle(targetPosition, boardState);
    }

    // Mouvement normal du roi
    const targetPiece = boardState[toY][toX];
    if (targetPiece !== "") {
      const targetColor = targetPiece[0] === "W" ? ChessColor.WHITE : ChessColor.BLACK;
      if (targetColor === this.color) return false;
    }

    return dx <= 1 && dy <= 1;
  }

  private canCastle(targetPosition: [number, number], boardState: string[][]): boolean {
    const [fromX, fromY] = this.position;
    const [toX, toY] = targetPosition;
    
    // Déterminer le type de roque
    const isKingSideCastle = toX > fromX;
    const rookX = isKingSideCastle ? 7 : 0;
    const rookPiece = boardState[fromY][rookX];

    // Vérifier la présence et le type de la tour
    if (!rookPiece || rookPiece[1] !== "R" || 
        rookPiece[0] !== (this.color === ChessColor.WHITE ? "W" : "B")) {
      return false;
    }

    // Vérifier que les cases entre le roi et la tour sont vides
    const start = isKingSideCastle ? fromX + 1 : 1;
    const end = isKingSideCastle ? 6 : fromX - 1;
    for (let x = start; x <= end; x++) {
      if (boardState[fromY][x] !== "") {
        return false;
      }
    }

    return true;
  }

  setHasMoved(): void {
    this.hasMoved = true;
  }

  getHasMoved(): boolean {
    return this.hasMoved;
  }
}
