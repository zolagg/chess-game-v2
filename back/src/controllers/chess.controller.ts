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
import { ChessColor } from "../models/chess.model";
import { CapturedPiece } from "../models/chess.model";

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
      status: game.status,
      isFinished: game.is_finished,
      whiteCaptured: [],
      blackCaptured: []
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
    const capturedPieces = JSON.parse(game.captured_pieces || '[]');
    
    return {
      gameId: game.id,
      board: JSON.parse(game.board_state),
      currentTurn: game.current_turn,
      isCheck: false,
      isCheckmate: false,
      moves: JSON.parse(game.moves_history),
      status: game.status,
      isFinished: game.is_finished,
      whiteCaptured: capturedPieces
        .filter((p: CapturedPiece) => p.capturedBy === ChessColor.WHITE)
        .map((p: CapturedPiece) => p.piece),
      blackCaptured: capturedPieces
        .filter((p: CapturedPiece) => p.capturedBy === ChessColor.BLACK)
        .map((p: CapturedPiece) => p.piece)
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
      currentTurn: game.current_turn,
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
      currentTurn: game.current_turn,
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

  @Post("/reconstruct/{gameId}")
  public async reconstructBoardState(
    @Path() gameId: string,
    @Body() body: { moves: any[] }, 
    @Request() request: any
  ): Promise<ChessMoveOutputDTO> {
    const userId = request.user.id;
    const game = await this.chessService.reconstructBoardState(parseInt(gameId), userId, body.moves);
    const capturedPieces: CapturedPiece[] = JSON.parse(game.captured_pieces);

    return {
      success: true,
      message: "Board state reconstructed",
      board: JSON.parse(game.board_state),
      isCheck: false,
      isCheckmate: false,
      isFinished: game.is_finished,
      status: game.status,
      winnerColor: game.winner_color,
      whiteCaptured: capturedPieces
        .filter(cp => cp.capturedBy === ChessColor.WHITE)
        .map(cp => cp.piece),
      blackCaptured: capturedPieces
        .filter(cp => cp.capturedBy === ChessColor.BLACK)
        .map(cp => cp.piece)
    };
  }
}
