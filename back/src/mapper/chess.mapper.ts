import { ChessGameStateDTO, ChessMoveOutputDTO } from "../dto/chess.dto";

export class ChessMapper {
  public static toGameStateDTO(gameState: any): ChessGameStateDTO {
    return {
      board: gameState.board,
      currentTurn: gameState.currentTurn,
      isCheck: gameState.isCheck,
      isCheckmate: gameState.isCheckmate,
      gameId: gameState.gameId,
      status: gameState.status,
      isFinished: gameState.isFinished,
      whiteCaptured: gameState.whiteCaptured,
      blackCaptured: gameState.blackCaptured,
      moves: gameState.moves
    };
  }

  public static toMoveOutputDTO(moveResult: any): ChessMoveOutputDTO {
    return {
      success: moveResult.success,
      message: moveResult.message,
      board: moveResult.board,
      isCheck: moveResult.isCheck,
      isCheckmate: moveResult.isCheckmate
    };
  }
}
