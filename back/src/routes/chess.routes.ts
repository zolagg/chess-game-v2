import { Router } from 'express';
import { ChessController } from '../controllers/chess.controller';
import { authenticateToken } from '../middleware/authentication';

const router = Router();
const chessController = new ChessController();

// Get all games history
router.get('/games', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const games = await chessController.getGameHistory(userId);
    res.json(games);
  } catch (error) {
    next(error);
  }
});

// Get specific game history
router.get('/history/:gameId', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const gameHistory = await chessController.getGameHistoryById(req.params.gameId, req);
    res.json(gameHistory);
  } catch (error) {
    next(error);
  }
});

// Resign game
router.post('/resign/:gameId', authenticateToken, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const result = await chessController.resignGame(req.params.gameId, req);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;