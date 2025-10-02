import { Request, Response, NextFunction } from 'express';
import { ErrorResponseDTO } from '../api/models/DTO/response/errorResponeDTO';

export interface AppError extends Error {
  status?: number;
}

const errorMessages: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  500: 'Internal Server Error',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
};

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const status = err.status ?? 500;
  const message = err.message || errorMessages[status] || 'Unhandled Error';

  res.status(status).json({
    error: new ErrorResponseDTO(message, status),
  });

  next();
};
