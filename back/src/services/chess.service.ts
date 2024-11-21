import { ChessGame, ChessColor } from "../models/chess.model";
import { User } from "../models/user.model";
import { notFound } from "../error/NotFoundError";
import { Pawn } from "../chess/pieces/Pawn";
import { Rook } from "../chess/pieces/Rook";
import { Knight } from "../chess/pieces/Knight";
import { Bishop } from "../chess/pieces/Bishop";
import { Queen } from "../chess/pieces/Queen";
import { King } from "../chess/pieces/King";

export class ChessService {
  private readonly INITIAL_BOARD_STATE = [
    // Définir votre état initial du plateau ici
    // Exemple simplifié :
    ["BR", "BN", "BB", "BQ", "BK", "BB", "BN", "BR"],
    ["BP", "BP", "BP", "BP", "BP", "BP", "BP", "BP"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["WP", "WP", "WP", "WP", "WP", "WP", "WP", "WP"],
    ["WR", "WN", "WB", "WQ", "WK", "WB", "WN", "WR"],
  ];

  public async createGame(userId: number): Promise<ChessGame> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw notFound("User");
    }
    console.log("userId", userId);

    return ChessGame.create({
      user_id: userId,
      current_turn: ChessColor.WHITE,
      board_state: JSON.stringify(this.INITIAL_BOARD_STATE),
      moves_history: "[]",
      is_finished: false,
    });
  }

  public async getGame(gameId: number, userId: number): Promise<ChessGame> {
    const game = await ChessGame.findByPk(gameId, {
      include: [{ model: User, as: "user" }],
    });

    if (!game) {
      throw notFound("Game");
    }

    // Vérifier que l'utilisateur est bien le propriétaire de la partie
    if (game.user_id !== userId) {
      throw new Error("Not authorized to access this game");
    }

    return game;
  }

  public async makeMove(
    gameId: number,
    userId: number,
    from: string,
    to: string
  ): Promise<ChessGame> {
    const game = await this.getGame(gameId, userId);

    if (game.is_finished) {
      throw new Error("Game is already finished");
    }

    const boardState = JSON.parse(game.board_state);
    const movesHistory = JSON.parse(game.moves_history);

    // Convert chess notation (e.g., "e2") to array indices
    const [fromFile, fromRank] = from.split("");
    const [toFile, toRank] = to.split("");

    const fromPosition: [number, number] = [
      fromFile.charCodeAt(0) - 97,
      8 - parseInt(fromRank),
    ];
    const toPosition: [number, number] = [
      toFile.charCodeAt(0) - 97,
      8 - parseInt(toRank),
    ];

    // Get the piece at the starting position
    const piece = boardState[fromPosition[1]][fromPosition[0]];

    if (!piece) {
      throw new Error("No piece at starting position");
    }

    // Verify it's the correct player's turn
    const pieceColor = piece.startsWith("W")
      ? ChessColor.WHITE
      : ChessColor.BLACK;
    if (pieceColor !== game.current_turn) {
      throw new Error(`Not your turn - Current turn is ${game.current_turn}`);
    }

    // Create the appropriate chess piece instance
    let chessPiece;
    const color = piece.startsWith("W") ? ChessColor.WHITE : ChessColor.BLACK;

    switch (piece.charAt(1)) {
      case "P":
        chessPiece = new Pawn(fromPosition, color);
        break;
      case "R":
        chessPiece = new Rook(fromPosition, color);
        break;
      case "N":
        chessPiece = new Knight(fromPosition, color);
        break;
      case "B":
        chessPiece = new Bishop(fromPosition, color);
        break;
      case "Q":
        chessPiece = new Queen(fromPosition, color);
        break;
      case "K":
        chessPiece = new King(fromPosition, color);
        break;
      default:
        throw new Error("Invalid piece type");
    }

    // Validate the move using the piece's movement rules
    if (!chessPiece.canMoveTo(toPosition)) {
      throw new Error("Invalid move for this piece type");
    }

    // Check if target square has a piece of the same color
    const targetPiece = boardState[toPosition[1]][toPosition[0]];
    if (targetPiece && targetPiece.startsWith(piece[0])) {
      throw new Error("Cannot capture your own piece");
    }

    // Make the move
    boardState[toPosition[1]][toPosition[0]] = piece;
    boardState[fromPosition[1]][fromPosition[0]] = "";

    // Update game state
    game.current_turn =
      game.current_turn === ChessColor.WHITE
        ? ChessColor.BLACK
        : ChessColor.WHITE;
    game.board_state = JSON.stringify(boardState);
    game.moves_history = JSON.stringify([
      ...movesHistory,
      { from, to, piece, timestamp: new Date() },
    ]);

    await game.save();
    return game;
  }

  public async resignGame(gameId: number, userId: number): Promise<ChessGame> {
    const game = await this.getGame(gameId, userId);

    if (game.is_finished) {
      throw new Error("Game is already finished");
    }

    game.is_finished = true;
    game.winner_color = ChessColor.BLACK; // Si le joueur (blanc) abandonne, le noir gagne
    await game.save();

    return game;
  }

  // Méthode pour simuler le coup de l'ordinateur (joueur noir)
  public async makeComputerMove(
    gameId: number,
    userId: number
  ): Promise<ChessGame> {
    const game = await this.getGame(gameId, userId);

    if (game.is_finished || game.current_turn !== ChessColor.BLACK) {
      throw new Error("Not computer's turn");
    }

    // TODO: Implémenter la logique de l'IA pour choisir un coup
    // Pour l'instant, on fait un mouvement aléatoire simple

    const boardState = JSON.parse(game.board_state);
    const movesHistory = JSON.parse(game.moves_history);

    // Simuler un mouvement de l'ordinateur
    // TODO: Implémenter une vraie logique de jeu

    game.current_turn = ChessColor.WHITE;
    game.board_state = JSON.stringify(boardState);
    game.moves_history = JSON.stringify([
      ...movesHistory,
      { from: "auto", to: "auto", timestamp: new Date() },
    ]);

    await game.save();
    return game;
  }
}

export const chessService = new ChessService();
