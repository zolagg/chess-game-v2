export class ChessError extends Error {
  status: number;

  constructor(message: string, status: number = 412) {
    super(message);
    this.name = 'ChessError';
    this.status = status;
  }
} 