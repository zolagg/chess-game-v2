import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { User } from "./user.model";

export enum ChessColor {
  WHITE = "WHITE",
  BLACK = "BLACK",
}

export enum ChessPieceType {
  PAWN = "PAWN",
  ROOK = "ROOK",
  KNIGHT = "KNIGHT",
  BISHOP = "BISHOP",
  QUEEN = "QUEEN",
  KING = "KING",
}

export enum GameStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  RESIGNED = "RESIGNED"
}

export interface ChessGameAttributes {
  id?: number;
  user_id: number;
  current_turn: ChessColor;
  board_state: string;
  moves_history: string;
  is_finished: boolean;
  winner_color?: ChessColor;
  status: GameStatus;
}

export class ChessGame
  extends Model<ChessGameAttributes>
  implements ChessGameAttributes
{
  public id!: number;
  public user_id!: number;
  public current_turn!: ChessColor;
  public board_state!: string;
  public moves_history!: string;
  public is_finished!: boolean;
  public winner_color?: ChessColor;
  public status!: GameStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ChessGame.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    current_turn: {
      type: DataTypes.ENUM(...Object.values(ChessColor)),
      allowNull: false,
      defaultValue: ChessColor.WHITE,
    },
    board_state: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    moves_history: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "[]",
    },
    is_finished: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    winner_color: {
      type: DataTypes.ENUM(...Object.values(ChessColor)),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(GameStatus)),
      allowNull: false,
      defaultValue: GameStatus.IN_PROGRESS,
    },
  },
  {
    sequelize,
    modelName: "ChessGame",
    tableName: "ChessGame",
    timestamps: true,
  }
);

ChessGame.belongsTo(User, { foreignKey: "user_id", as: "user" });
