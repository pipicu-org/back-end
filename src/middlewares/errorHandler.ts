import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  switch (err.status) {
    case 400:
      res.status(err.status ?? 400).json({
        message: err.message || 'Bad Request',
      });
      break;
    case 401:
      res.status(err.status ?? 401).json({
        message: err.message || 'Unauthorized',
      });
      break;
    case 403:
      res.status(err.status ?? 403).json({
        message: err.message || 'Forbidden',
      });
      break;
    case 404:
      res.status(err.status ?? 404).json({
        message: err.message || 'Not Found',
      });
      break;
    case 500:
      res.status(err.status ?? 500).json({
        message: err.message || 'Internal Server Error',
      });
      break;
    case 503:
      res.status(err.status ?? 503).json({
        message: err.message || 'Service Unavailable',
      });
      break;
    case 504:
      res.status(err.status ?? 504).json({
        message: err.message || 'Gateway Timeout',
      });
      break;
    default:
      res.status(err.status ?? 400).json({
        message: err.message || 'Unhandled Error',
      });
      break;
  }
  next();
};
