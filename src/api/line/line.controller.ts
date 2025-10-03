import { NextFunction, Request, Response } from 'express';
import { ILineService } from './line.service';

export class LineController {
  constructor(private readonly _lineService: ILineService) {}

  async changeStateLine(req: Request, res: Response, next: NextFunction) {
    try {
      const lineId = Number(req.query.lineId);
      const state = Number(req.query.stateId);
      if (isNaN(lineId)) {
        throw new Error('Invalid line ID');
      }
      const updatedLine = await this._lineService.changeStateLine(
        lineId,
        state,
      );
      res.status(200).json(updatedLine);
    } catch (error: any) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid line ID');
      }
      const line = await this._lineService.findById(id);
      if (!line) {
        res.status(404).json({ message: 'Line not found' });
      } else {
        res.status(200).json(line);
      }
    } catch (error: any) {
      next(error);
    }
  }

  async getLinesByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const orderId = Number(req.params.orderId);
      if (isNaN(orderId)) {
        throw new Error('Invalid order ID');
      }
      const lines = await this._lineService.getLinesByOrderId(orderId);
      res.status(200).json(lines);
    } catch (error: any) {
      next(error);
    }
  }

  async getLinesByState(req: Request, res: Response, next: NextFunction) {
    try {
      const stateId = Number(req.query.stateId);
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      if (isNaN(stateId)) {
        throw new Error('Invalid state ID');
      }

      const linesResponse = await this._lineService.getLinesByState(
        stateId,
        page,
        limit,
      );
      res.status(200).json(linesResponse);
    } catch (error: any) {
      next(error);
    }
  }
}
