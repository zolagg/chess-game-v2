import { Body, Controller, Get, Path, Post, Route, Tags, Security } from "tsoa";
import {
  ChessMoveInputDTO,
  ChessMoveOutputDTO,
  ChessGameStateDTO,
} from "../dto/chess.dto";
import { chessService } from "../services/chess.service";

@Route("chess")
@Tags("Chess")
@Security("jwt")
export class ChessController extends Controller {
  // Démarrer une nouvelle partie
  @Post("/new-game")
  public async startNewGame(): Promise<ChessGameStateDTO> {
    const game = await chessService.createGame(0, 0); // TODO: Get player IDs from token
    return {
      board: JSON.parse(game.board_state),
      currentTurn: game.current_turn,
      isCheck: false, // TODO: Implement check detection
      isCheckmate: false, // TODO: Implement checkmate detection
      moves: JSON.parse(game.moves_history),
    };
  }

  // Obtenir l'état actuel de la partie
  @Get("/game-state/{gameId}")
  public async getGameState(
    @Path() gameId: string
  ): Promise<ChessGameStateDTO> {
    const game = await chessService.getGame(parseInt(gameId));
    return {
      board: JSON.parse(game.board_state),
      currentTurn: game.current_turn,
      isCheck: false, // TODO: Implement check detection
      isCheckmate: false, // TODO: Implement checkmate detection
      moves: JSON.parse(game.moves_history),
    };
  }

  // Effectuer un mouvement
  @Post("/move/{gameId}")
  public async makeMove(
    @Path() gameId: string,
    @Body() move: ChessMoveInputDTO
  ): Promise<ChessMoveOutputDTO> {
    const game = await chessService.makeMove(
      parseInt(gameId),
      0, // TODO: Get player ID from token
      move.from,
      move.to
    );

    return {
      success: true,
      message: "Move successful",
      board: JSON.parse(game.board_state),
      isCheck: false, // TODO: Implement check detection
      isCheckmate: false, // TODO: Implement checkmate detection
    };
  }

  // Obtenir les mouvements possibles pour une pièce
  @Get("/possible-moves/{gameId}/{position}")
  public async getPossibleMoves(
    @Path() gameId: string,
    @Path() position: string
  ): Promise<string[]> {
    // TODO: Implement this in chess service
    return [];
  }

  // Abandonner la partie
  @Post("/resign/{gameId}")
  public async resignGame(@Path() gameId: string): Promise<ChessMoveOutputDTO> {
    const game = await chessService.resignGame(
      parseInt(gameId),
      0 // TODO: Get player ID from token
    );

    return {
      success: true,
      message: "Game resigned",
      board: JSON.parse(game.board_state),
      isCheck: false,
      isCheckmate: false,
    };
  }
}
