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
    case 500:
      res.status(err.status ?? 500).json({
        message: err.message || 'Internal Server Error',
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
