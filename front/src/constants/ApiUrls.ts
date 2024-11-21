import config from '../config';

const ApiUrl = config.VUE_APP_API_BASE_URL;

// Authentication endpoints
export const ApiUrlConnection = `${ApiUrl}/auth`;
export const ApiUrlUsers = `${ApiUrl}/users`;
export const ApiUrlChess = `${ApiUrl}/chess`;

// Chess specific endpoints
export const ApiUrlChessNewGame = `${ApiUrlChess}/new-game`;
export const ApiUrlChessGameState = (gameId: string) => `${ApiUrlChess}/game-state/${gameId}`;
export const ApiUrlChessMove = (gameId: string) => `${ApiUrlChess}/move/${gameId}`;
export const ApiUrlChessPossibleMoves = (gameId: string, position: string) => 
  `${ApiUrlChess}/possible-moves/${gameId}/${position}`;
export const ApiUrlChessResign = (gameId: string) => `${ApiUrlChess}/resign/${gameId}`;
