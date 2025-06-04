import { LineRequestDTO } from '../models/DTO/request/lineRequestDTO';
import { ILineService } from './line.service';
import { Request, Response, NextFunction } from 'express';

export class LineController {
  constructor(private readonly lineService: ILineService = lineService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const lineRequestDTO = req.body as LineRequestDTO;
      const line = await this.lineService.create(lineRequestDTO);
      res.status(201).json(line);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const line = await this.lineService.getById(id);
      res.status(200).json(line);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const lineRequestDTO = req.body as LineRequestDTO;
      const updatedLine = await this.lineService.update(id, lineRequestDTO);
      res.status(200).json(updatedLine);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const deletedLine = await this.lineService.delete(id);
      res.status(200).json(deletedLine);
    } catch (error) {
      next(error);
    }
  }

  async getByClientId(req: Request, res: Response, next: NextFunction) {
    try {
      const client = Number(req.params.client);
      const lines = await this.lineService.getByClientId(client);
      res.status(200).json(lines);
    } catch (error) {
      next(error);
    }
  }

  async getByOrderId(req: Request, res: Response, next: NextFunction) {
    try {
      const order = Number(req.params.order);
      const lines = await this.lineService.getByOrderId(order);
      res.status(200).json(lines);
    } catch (error) {
      next(error);
    }
  }
}
