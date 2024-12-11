import { ChessGame, ChessColor } from "../models/chess.model";
import { User } from "../models/user.model";
import { notFound } from "../error/NotFoundError";
import { Pawn } from "../chess/pieces/Pawn";
import { Rook } from "../chess/pieces/Rook";
import { Knight } from "../chess/pieces/Knight";
import { Bishop } from "../chess/pieces/Bishop";
import { Queen } from "../chess/pieces/Queen";
import { King } from "../chess/pieces/King";
import { ChessError } from "../error/ChessError";
import { ChessFigure } from "../chess/ChessFigure";

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
      throw new ChessError("Game is already finished", 412);
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
      throw new ChessError("No piece at starting position", 412);
    }

    // Verify it's the correct player's turn
    const pieceColor = piece.startsWith("W")
      ? ChessColor.WHITE
      : ChessColor.BLACK;
    if (pieceColor !== game.current_turn) {
      throw new ChessError(`Not your turn - Current turn is ${game.current_turn}`, 412);
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
    if (!chessPiece.canMoveTo(toPosition, boardState)) {
      throw new ChessError("Invalid move for this piece type", 412);
    }

    // Check if target square has a piece of the same color
    const targetPiece = boardState[toPosition[1]][toPosition[0]];
    if (targetPiece && targetPiece.startsWith(piece[0])) {
      throw new ChessError("Cannot capture your own piece", 412);
    }

    // Check if a king was captured
    await this.checkKingCapture(targetPiece, game);

    // Simuler le mouvement sur une copie du plateau
    const newBoardState = JSON.parse(JSON.stringify(boardState));
    newBoardState[toPosition[1]][toPosition[0]] = piece;
    newBoardState[fromPosition[1]][fromPosition[0]] = "";

    // Vérifier si le mouvement met ou laisse notre roi en échec
    if (this.isKingInCheck(newBoardState, pieceColor)) {
      throw new ChessError("This move would put or leave your king in check", 412);
    }

    // Si tout est valide, effectuer le mouvement réel
    boardState[toPosition[1]][toPosition[0]] = piece;
    boardState[fromPosition[1]][fromPosition[0]] = "";

    // Vérifier si le roi adverse est en échec
    const isCheck = this.isKingInCheck(
      boardState,
      pieceColor === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE
    );

    // Mettre à jour l'état du jeu
    game.current_turn = game.current_turn === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;
    game.board_state = JSON.stringify(boardState);
    game.moves_history = JSON.stringify([
      ...movesHistory,
      { 
        from, 
        to, 
        piece, 
        timestamp: new Date(),
        isCheck 
      },
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

  public async checkKingCapture(targetPiece: string, game: ChessGame): Promise<void> {
    if (targetPiece === "WK" || targetPiece === "BK") {
      game.is_finished = true;
      // Set winner to opposite color of the captured king
      game.winner_color = targetPiece[0] === "W" ? ChessColor.BLACK : ChessColor.WHITE;
      await game.save();
    }
  }

  public async getPossibleMoves(
    gameId: number,
    userId: number,
    position: string
  ): Promise<string[]> {
    try {
      console.log('getPossibleMoves - Input:', { gameId, userId, position });
      
      const game = await this.getGame(gameId, userId);
      console.log('Game found:', { gameId: game.id, currentTurn: game.current_turn });

      const boardState = JSON.parse(game.board_state);
      console.log('Board state parsed successfully');

      // Convert chess notation to array indices
      const [file, rank] = position.split("");
      console.log('Position parsed:', { file, rank });

      const col = file.charCodeAt(0) - 97;
      const row = 8 - parseInt(rank);
      console.log('Converted to indices:', { col, row });

      // Get the piece at the position
      const piece = boardState[row][col];
      console.log('Piece at position:', piece);

      if (!piece) {
        console.log('No piece found at position');
        return [];
      }

      // Create the appropriate chess piece instance
      const color = piece.startsWith("W") ? ChessColor.WHITE : ChessColor.BLACK;
      console.log('Piece color:', color);

      let chessPiece: ChessFigure;
      try {
        switch (piece.charAt(1)) {
          case "P":
            chessPiece = new Pawn([col, row], color);
            break;
          case "R":
            chessPiece = new Rook([col, row], color);
            break;
          case "N":
            chessPiece = new Knight([col, row], color);
            break;
          case "B":
            chessPiece = new Bishop([col, row], color);
            break;
          case "Q":
            chessPiece = new Queen([col, row], color);
            break;
          case "K":
            chessPiece = new King([col, row], color);
            break;
          default:
            console.log('Invalid piece type:', piece.charAt(1));
            return [];
        }
        console.log('Chess piece instance created:', piece.charAt(1));

        const possibleMoves = chessPiece.getPossibleMoves(boardState);
        console.log('Possible moves calculated:', possibleMoves);

        const notation = possibleMoves.map(([col, row]) => 
          `${String.fromCharCode(97 + col)}${8 - row}`
        );
        console.log('Moves converted to notation:', notation);

        return notation;
      } catch (error) {
        console.error('Error in chess piece operations:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in getPossibleMoves:', error);
      throw error;
    }
  }

  private isKingInCheck(boardState: string[][], color: ChessColor): boolean {
    // Parcourir toutes les pièces adverses
    const opponentPrefix = color === ChessColor.WHITE ? "B" : "W";
    
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece && piece.startsWith(opponentPrefix)) {
          let chessPiece: ChessFigure;
          
          switch (piece.charAt(1)) {
            case "P":
              chessPiece = new Pawn([col, row], color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE);
              break;
            case "R":
              chessPiece = new Rook([col, row], color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE);
              break;
            case "N":
              chessPiece = new Knight([col, row], color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE);
              break;
            case "B":
              chessPiece = new Bishop([col, row], color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE);
              break;
            case "Q":
              chessPiece = new Queen([col, row], color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE);
              break;
            case "K":
              chessPiece = new King([col, row], color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE);
              break;
            default:
              continue;
          }
          
          if (chessPiece.isThreateningKing(boardState)) {
            return true;
          }
        }
      }
    }
    
    return false;
  }
}

export const chessService = new ChessService();
