import { Request, Response, NextFunction } from 'express';
import { ErrorResponseDTO } from '../api/models/DTO/response/errorResponeDTO';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  switch (err.status) {
    case 400:
      res.status(err.status ?? 400).json({
        error: new ErrorResponseDTO(err.message || 'Bad Request', 400),
      });
      break;
    case 401:
      res.status(err.status ?? 401).json({
        error: new ErrorResponseDTO(err.message || 'Unauthorized', 401),
      });
      break;
    case 403:
      res.status(err.status ?? 403).json({
        error: new ErrorResponseDTO(err.message || 'Forbidden', 403),
      });
      break;
    case 404:
      res.status(err.status ?? 404).json({
        error: new ErrorResponseDTO(err.message || 'Not Found', 404),
      });
      break;
    case 500:
      res.status(err.status ?? 500).json({
        error: new ErrorResponseDTO(
          err.message || 'Internal Server Error',
          500,
        ),
      });
      break;
    case 503:
      res.status(err.status ?? 503).json({
        error: new ErrorResponseDTO(err.message || 'Service Unavailable', 503),
      });
      break;
    case 504:
      res.status(err.status ?? 504).json({
        error: new ErrorResponseDTO(err.message || 'Gateway Timeout', 504),
      });
      break;
    default:
      res.status(err.status ?? 400).json({
        error: new ErrorResponseDTO(err.message || 'Unhandled Error', 400),
      });
      break;
  }
  next();
};
