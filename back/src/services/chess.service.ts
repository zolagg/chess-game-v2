import { ChessGame, ChessColor } from "../models/chess.model";
import { User } from "../models/user.model";
import { notFound } from "../error/NotFoundError";

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

    // Valider et effectuer le mouvement
    const boardState = JSON.parse(game.board_state);
    const movesHistory = JSON.parse(game.moves_history);

    // TODO: Implémenter la validation des mouvements selon les règles des échecs

    // Mettre à jour l'état du jeu
    game.current_turn =
      game.current_turn === ChessColor.WHITE
        ? ChessColor.BLACK
        : ChessColor.WHITE;
    game.board_state = JSON.stringify(boardState);
    game.moves_history = JSON.stringify([
      ...movesHistory,
      { from, to, timestamp: new Date() },
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
