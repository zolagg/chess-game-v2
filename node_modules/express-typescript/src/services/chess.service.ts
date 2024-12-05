import { ChessGame, ChessColor, ChessPieceType } from "../models/chess.model";
import { notFound } from "../error/NotFoundError";
import { User } from "../models/user.model";

interface ChessPiece {
  type: ChessPieceType;
  color: ChessColor;
  position: string;
}

interface ChessMove {
  piece: ChessPiece;
  from: string;
  to: string;
  timestamp: Date;
}

export class ChessService {
  startNewGame(): import("../dto/chess.dto").ChessGameStateDTO | PromiseLike<import("../dto/chess.dto").ChessGameStateDTO> {
      throw new Error("Method not implemented.");
  }
  private readonly INITIAL_BOARD_STATE = this.getInitialBoardState();

  private getInitialBoardState(): ChessPiece[] {
    // Initialisation du plateau avec toutes les pièces
    const pieces: ChessPiece[] = [];

    // Ajout des pions
    for (let i = 0; i < 8; i++) {
      pieces.push({
        type: ChessPieceType.PAWN,
        color: ChessColor.WHITE,
        position: `${String.fromCharCode(97 + i)}2`,
      });
      pieces.push({
        type: ChessPieceType.PAWN,
        color: ChessColor.BLACK,
        position: `${String.fromCharCode(97 + i)}7`,
      });
    }

    // Ajout des autres pièces
    const setupPieces = [
      ChessPieceType.ROOK,
      ChessPieceType.KNIGHT,
      ChessPieceType.BISHOP,
      ChessPieceType.QUEEN,
      ChessPieceType.KING,
      ChessPieceType.BISHOP,
      ChessPieceType.KNIGHT,
      ChessPieceType.ROOK,
    ];

    setupPieces.forEach((type, index) => {
      pieces.push({
        type,
        color: ChessColor.WHITE,
        position: `${String.fromCharCode(97 + index)}1`,
      });
      pieces.push({
        type,
        color: ChessColor.BLACK,
        position: `${String.fromCharCode(97 + index)}8`,
      });
    });

    return pieces;
  }

  public async createGame(
    whitePlayerId: number,
    blackPlayerId: number
  ): Promise<ChessGame> {
    // Vérifier que les joueurs existent
    const whitePlayer = await User.findByPk(whitePlayerId);
    const blackPlayer = await User.findByPk(blackPlayerId);

    if (!whitePlayer || !blackPlayer) {
      throw notFound("Player");
    }

    return ChessGame.create({
      white_player_id: whitePlayerId,
      black_player_id: blackPlayerId,
      current_turn: ChessColor.WHITE,
      board_state: JSON.stringify(this.INITIAL_BOARD_STATE),
      moves_history: "[]",
      is_finished: false,
    });
  }

  public async getGame(gameId: number): Promise<ChessGame> {
    const game = await ChessGame.findByPk(gameId, {
      include: [
        { model: User, as: "whitePlayer" },
        { model: User, as: "blackPlayer" },
        { model: User, as: "winner" },
      ],
    });

    if (!game) {
      throw notFound("Game");
    }

    return game;
  }

  public async makeMove(
    gameId: number,
    playerId: number,
    from: string,
    to: string
  ): Promise<ChessGame> {
    const game = await this.getGame(gameId);

    // Vérifier que la partie n'est pas terminée
    if (game.is_finished) {
      throw new Error("Game is already finished");
    }

    // Vérifier que c'est bien le tour du joueur
    const isWhiteTurn = game.current_turn === ChessColor.WHITE;
    if (
      (isWhiteTurn && game.white_player_id !== playerId) ||
      (!isWhiteTurn && game.black_player_id !== playerId)
    ) {
      throw new Error("Not your turn");
    }

    // Valider et effectuer le mouvement
    const boardState = JSON.parse(game.board_state);
    const movesHistory = JSON.parse(game.moves_history);

    // TODO: Implémenter la validation des mouvements selon les règles des échecs

    // Mettre à jour l'état du jeu
    game.current_turn = isWhiteTurn ? ChessColor.BLACK : ChessColor.WHITE;
    game.board_state = JSON.stringify(boardState);
    game.moves_history = JSON.stringify([
      ...movesHistory,
      { from, to, timestamp: new Date() },
    ]);

    await game.save();
    return game;
  }

  public async resignGame(
    gameId: number,
    playerId: number
  ): Promise<ChessGame> {
    const game = await this.getGame(gameId);

    if (game.is_finished) {
      throw new Error("Game is already finished");
    }

    game.is_finished = true;
    game.winner_id =
      playerId === game.white_player_id
        ? game.black_player_id
        : game.white_player_id;

    await game.save();
    return game;
  }
}

export const chessService = new ChessService();
