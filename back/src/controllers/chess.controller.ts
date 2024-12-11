import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  Tags,
  Security,
  Request,
} from "tsoa";
import {
  ChessMoveInputDTO,
  ChessMoveOutputDTO,
  ChessGameStateDTO,
} from "../dto/chess.dto";
import { ChessService } from "../services/chess.service";

@Route("chess")
@Tags("Chess")
@Security("jwt")
export class ChessController extends Controller {
  private chessService: ChessService;

  constructor() {
    super();
    this.chessService = new ChessService();
  }

  // Démarrer une nouvelle partie
  @Post("/new-game")
  public async startNewGame(
    @Request() request: any
  ): Promise<ChessGameStateDTO> {
    const userId = request.user.id;
    const game = await this.chessService.createGame(userId);
    return {
      gameId: game.id,
      board: JSON.parse(game.board_state),
      currentTurn: game.current_turn,
      isCheck: false,
      isCheckmate: false,
      moves: JSON.parse(game.moves_history),
    };
  }

  // Obtenir l'état actuel de la partie
  @Get("/game-state/{gameId}")
  public async getGameState(
    @Path() gameId: string,
    @Request() request: any
  ): Promise<ChessGameStateDTO> {
    const userId = request.user.id;
    const game = await this.chessService.getGame(parseInt(gameId), userId);
    return {
      gameId: game.id,
      board: JSON.parse(game.board_state),
      currentTurn: game.current_turn,
      isCheck: false,
      isCheckmate: false,
      moves: JSON.parse(game.moves_history),
    };
  }

  // Effectuer un mouvement
  @Post("/move/{gameId}")
  public async makeMove(
    @Path() gameId: string,
    @Body() move: ChessMoveInputDTO,
    @Request() request: any
  ): Promise<ChessMoveOutputDTO> {
    const userId = request.user.id;
    const game = await this.chessService.makeMove(
      parseInt(gameId),
      userId,
      move.from,
      move.to
    );
    const moves = JSON.parse(game.moves_history);
    const lastMove = moves[moves.length - 1];

    return {
      success: true,
      message: lastMove.isCheckmate
        ? `Checkmate! ${game.winner_color} wins!`
        : lastMove.isCheck
          ? "Check!"
          : "Move successful",
      board: JSON.parse(game.board_state),
      isCheck: lastMove.isCheck,
      isCheckmate: lastMove.isCheckmate,
      isFinished: game.is_finished,
      winnerColor: game.winner_color,
    };
  }

  // Obtenir les mouvements possibles pour une pièce
  @Get("/possible-moves/{gameId}/{position}")
  public async getPossibleMoves(
    @Path() gameId: string,
    @Path() position: string,
    @Request() request: any
  ): Promise<string[]> {
    try {
      console.log("Controller - getPossibleMoves called with:", {
        gameId,
        position,
        userId: request.user.id,
      });
      const userId = request.user.id;
      const moves = await this.chessService.getPossibleMoves(
        parseInt(gameId),
        userId,
        position
      );
      console.log("Controller - moves returned:", moves);
      return moves;
    } catch (error) {
      console.error("Controller - Error in getPossibleMoves:", error);
      throw error;
    }
  }

  // Abandonner la partie
  @Post("/resign/{gameId}")
  public async resignGame(
    @Path() gameId: string,
    @Request() request: any
  ): Promise<ChessMoveOutputDTO> {
    const userId = request.user.id;
    const game = await this.chessService.resignGame(parseInt(gameId), userId);

    return {
      success: true,
      message: "Game resigned",
      board: JSON.parse(game.board_state),
      isCheck: false,
      isCheckmate: false,
    };
  }

  @Get("/history")
  public async getGameHistory(
    @Request() request: any
  ): Promise<any[]> {
    const userId = request.user.id;
    const games = await this.chessService.getGameHistory(userId);
    return games.map(game => ({
      id: game.id,
      status: game.status,
      createdAt: game.createdAt,
      winner: game.winner_color
    }));
  }

  @Get("/history/{gameId}")
  public async getGameHistoryById(
    @Path() gameId: string,
    @Request() request: any
  ): Promise<any> {
    const userId = request.user.id;
    const game = await this.chessService.getGame(parseInt(gameId), userId);
    return {
      id: game.id,
      status: game.status,
      createdAt: game.createdAt,
      winner: game.winner_color,
      moves: JSON.parse(game.moves_history)
    };
  }
}
