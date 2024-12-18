import { Request, Response, NextFunction } from "express";
import { ChessError } from "../error/ChessError";

// Interface pour les erreurs
interface Error {
  status?: number;
  message?: string;
}

// Middleware pour gérer les erreurs
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error("An error occurred:", err);

  if (err instanceof ChessError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  // Définir un statut d'erreur par défaut
  const statusCode = (err as any).status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: statusCode,
    message: message,
  });
};

export default errorHandler;
