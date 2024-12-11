import { ChessGame, ChessColor, GameStatus } from "../models/chess.model";
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
    try {
      console.log("Starting createGame with userId:", userId);

      const user = await User.findByPk(userId);
      console.log("Found user:", user?.id);

      if (!user) {
        throw notFound("User");
      }

      const gameData = {
        user_id: userId,
        current_turn: ChessColor.WHITE,
        board_state: JSON.stringify(this.INITIAL_BOARD_STATE),
        moves_history: "[]",
        is_finished: false,
        status: GameStatus.IN_PROGRESS
      };
      console.log("Creating game with data:", gameData);

      const game = await ChessGame.create(gameData);
      console.log("Game created successfully:", game.id);

      return game;
    } catch (error) {
      console.error("Error in createGame:", error);
      throw error;
    }
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
      throw new ChessError(
        `Not your turn - Current turn is ${game.current_turn}`,
        412
      );
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

    // Vérifier si le mouvement laisse notre roi en échec
    if (this.isKingInCheck(newBoardState, pieceColor)) {
      throw new ChessError("This move would leave your king in check", 412);
    }

    // Effectuer le mouvement réel
    boardState[toPosition[1]][toPosition[0]] = piece;
    boardState[fromPosition[1]][fromPosition[0]] = "";

    // Vérifier l'échec et l'échec et mat pour l'adversaire
    const opponentColor =
      pieceColor === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;
    const isCheck = this.isKingInCheck(boardState, opponentColor);
    const isCheckmate =
      isCheck && !this.canAnyPieceMove(boardState, opponentColor);

    // Mettre à jour l'état du jeu
    game.current_turn = opponentColor;
    game.board_state = JSON.stringify(boardState);

    // Important : mettre à jour is_finished et winner_color en cas d'échec et mat
    if (isCheckmate) {
      game.is_finished = true;
      game.winner_color = pieceColor;
      game.status = GameStatus.COMPLETED;
    }

    // Stocker l'information d'échec et mat dans l'historique
    game.moves_history = JSON.stringify([
      ...movesHistory,
      {
        from,
        to,
        piece,
        timestamp: new Date(),
        isCheck,
        isCheckmate,
      },
    ]);

    if (
      piece.charAt(1) === "K" &&
      Math.abs(toPosition[0] - fromPosition[0]) === 2
    ) {
      // C'est un roque
      const isKingSide = toPosition[0] > fromPosition[0];
      const rookFromX = isKingSide ? 7 : 0;
      const rookToX = isKingSide ? toPosition[0] - 1 : toPosition[0] + 1;

      // Vérifier si le roi est en échec
      if (this.isKingInCheck(boardState, pieceColor)) {
        throw new ChessError("Cannot castle while in check", 412);
      }

      // Vérifier si les cases traversées sont menacées
      const traversedSquares = [
        [fromPosition[0], fromPosition[1]],
        [
          isKingSide ? fromPosition[0] + 1 : fromPosition[0] - 1,
          fromPosition[1],
        ],
        [toPosition[0], toPosition[1]],
      ];

      for (const [x, y] of traversedSquares) {
        if (
          this.isSquareAttacked(
            [x, y],
            boardState,
            pieceColor === ChessColor.WHITE
              ? ChessColor.BLACK
              : ChessColor.WHITE
          )
        ) {
          throw new ChessError("Cannot castle through or into check", 412);
        }
      }

      // Déplacer le roi
      boardState[toPosition[1]][toPosition[0]] = piece;
      boardState[fromPosition[1]][fromPosition[0]] = "";

      // Déplacer la tour
      const rookPiece = boardState[fromPosition[1]][rookFromX];
      boardState[fromPosition[1]][rookToX] = rookPiece;
      boardState[fromPosition[1]][rookFromX] = "";

      // Mettre à jour l'historique des mouvements avec le mouvement de la tour
      const movesHistory = JSON.parse(game.moves_history);
      movesHistory.push({
        from: `${String.fromCharCode(97 + rookFromX)}${8 - fromPosition[1]}`,
        to: `${String.fromCharCode(97 + rookToX)}${8 - fromPosition[1]}`,
        piece: rookPiece,
        timestamp: new Date(),
        isCheck: false,
        isCheckmate: false,
      });
      game.moves_history = JSON.stringify(movesHistory);

      // Mettre à jour l'état du plateau
      game.board_state = JSON.stringify(boardState);
    }

    await game.save();
    return game;
  }

  public async resignGame(gameId: number, userId: number): Promise<ChessGame> {
    const game = await this.getGame(gameId, userId);

    if (game.is_finished) {
      throw new Error("Game is already finished");
    }

    game.is_finished = true;
    game.winner_color = game.current_turn === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE;
    game.status = GameStatus.RESIGNED;
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

  public async checkKingCapture(
    targetPiece: string,
    game: ChessGame
  ): Promise<void> {
    if (targetPiece === "WK" || targetPiece === "BK") {
      game.is_finished = true;
      // Set winner to opposite color of the captured king
      game.winner_color =
        targetPiece[0] === "W" ? ChessColor.BLACK : ChessColor.WHITE;
      await game.save();
    }
  }

  public async getPossibleMoves(
    gameId: number,
    userId: number,
    position: string
  ): Promise<string[]> {
    try {
      console.log("getPossibleMoves - Input:", { gameId, userId, position });

      const game = await this.getGame(gameId, userId);
      console.log("Game found:", {
        gameId: game.id,
        currentTurn: game.current_turn,
      });

      const boardState = JSON.parse(game.board_state);
      console.log("Board state parsed successfully");

      // Convert chess notation to array indices
      const [file, rank] = position.split("");
      console.log("Position parsed:", { file, rank });

      const col = file.charCodeAt(0) - 97;
      const row = 8 - parseInt(rank);
      console.log("Converted to indices:", { col, row });

      // Get the piece at the position
      const piece = boardState[row][col];
      console.log("Piece at position:", piece);

      if (!piece) {
        console.log("No piece found at position");
        return [];
      }

      // Create the appropriate chess piece instance
      const color = piece.startsWith("W") ? ChessColor.WHITE : ChessColor.BLACK;
      console.log("Piece color:", color);

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
            console.log("Invalid piece type:", piece.charAt(1));
            return [];
        }
        console.log("Chess piece instance created:", piece.charAt(1));

        const possibleMoves = chessPiece.getPossibleMoves(boardState);
        console.log("Possible moves calculated:", possibleMoves);

        const notation = possibleMoves.map(
          ([col, row]) => `${String.fromCharCode(97 + col)}${8 - row}`
        );
        console.log("Moves converted to notation:", notation);

        return notation;
      } catch (error) {
        console.error("Error in chess piece operations:", error);
        throw error;
      }
    } catch (error) {
      console.error("Error in getPossibleMoves:", error);
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
              chessPiece = new Pawn(
                [col, row],
                color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE
              );
              break;
            case "R":
              chessPiece = new Rook(
                [col, row],
                color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE
              );
              break;
            case "N":
              chessPiece = new Knight(
                [col, row],
                color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE
              );
              break;
            case "B":
              chessPiece = new Bishop(
                [col, row],
                color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE
              );
              break;
            case "Q":
              chessPiece = new Queen(
                [col, row],
                color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE
              );
              break;
            case "K":
              chessPiece = new King(
                [col, row],
                color === ChessColor.WHITE ? ChessColor.BLACK : ChessColor.WHITE
              );
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

  private isSquareAttacked(
    position: [number, number],
    boardState: string[][],
    attackingColor: ChessColor
  ): boolean {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (
          piece &&
          piece[0] === (attackingColor === ChessColor.WHITE ? "W" : "B")
        ) {
          const attacker = this.createPiece(
            [col, row],
            attackingColor,
            piece[1]
          );
          if (attacker && attacker.canMoveTo(position, boardState)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private createPiece(
    position: [number, number],
    color: ChessColor,
    type: string
  ): ChessFigure | null {
    switch (type) {
      case "P":
        return new Pawn(position, color);
      case "R":
        return new Rook(position, color);
      case "N":
        return new Knight(position, color);
      case "B":
        return new Bishop(position, color);
      case "Q":
        return new Queen(position, color);
      case "K":
        return new King(position, color);
      default:
        return null;
    }
  }

  private isCheckmate(boardState: string[][], color: ChessColor): boolean {
    // Si le roi n'est pas en échec, ce n'est pas un échec et mat
    if (!this.isKingInCheck(boardState, color)) {
      return false;
    }

    // Pour chaque pièce de notre couleur
    const prefix = color === ChessColor.WHITE ? "W" : "B";
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = boardState[fromRow][fromCol];
        if (piece && piece.startsWith(prefix)) {
          // Pour chaque case possible
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              // Simuler le mouvement
              const tempBoard = JSON.parse(JSON.stringify(boardState));
              const tempPiece = tempBoard[fromRow][fromCol];
              tempBoard[toRow][toCol] = tempPiece;
              tempBoard[fromRow][fromCol] = "";

              // Si ce mouvement sort de l'échec, ce n'est pas un échec et mat
              if (!this.isKingInCheck(tempBoard, color)) {
                return false;
              }
            }
          }
        }
      }
    }
    return true;
  }

  private canAnyPieceMove(boardState: string[][], color: ChessColor): boolean {
    // Pour chaque pièce de la couleur donnée
    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = boardState[fromRow][fromCol];
        if (piece && piece[0] === (color === ChessColor.WHITE ? "W" : "B")) {
          // Pour chaque case possible sur le plateau
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              // Éviter de vérifier la même position
              if (fromRow === toRow && fromCol === toCol) continue;

              // Simuler le mouvement
              const tempBoard = JSON.parse(JSON.stringify(boardState));
              const chessPiece = this.createPiece(
                [fromCol, fromRow],
                color,
                piece[1]
              );

              if (
                chessPiece &&
                chessPiece.canMoveTo([toCol, toRow], tempBoard)
              ) {
                // Simuler le mouvement
                tempBoard[toRow][toCol] = piece;
                tempBoard[fromRow][fromCol] = "";

                // Si ce mouvement sort de l'échec, il y a encore des coups possibles
                if (!this.isKingInCheck(tempBoard, color)) {
                  return true;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }

  public async getGameHistory(userId: number): Promise<ChessGame[]> {
    const games = await ChessGame.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
    });
    return games;
  }

  public async reconstructBoardState(
    gameId: number,
    userId: number,
    moves: any[]
  ): Promise<ChessGame> {
    const game = await this.getGame(gameId, userId);
    
    // Start with initial board state
    let boardState = JSON.parse(JSON.stringify(this.INITIAL_BOARD_STATE));
    
    // Apply each move to reconstruct the board
    for (const move of moves) {
      if (move.from === "auto" || move.to === "auto") continue;
      
      const [fromFile, fromRank] = move.from.split("");
      const [toFile, toRank] = move.to.split("");

      const fromPosition: [number, number] = [
        fromFile.charCodeAt(0) - 97,
        8 - parseInt(fromRank)
      ];
      const toPosition: [number, number] = [
        toFile.charCodeAt(0) - 97,
        8 - parseInt(toRank)
      ];

      boardState[toPosition[1]][toPosition[0]] = move.piece;
      boardState[fromPosition[1]][fromPosition[0]] = "";
    }

    // Update the game's board state but don't save it
    game.board_state = JSON.stringify(boardState);
    
    return game;
  }

  public getInitialBoardState(): string[][] {
    return JSON.parse(JSON.stringify(this.INITIAL_BOARD_STATE));
  }
}

export const chessService = new ChessService();
