import { Request, Response, NextFunction } from 'express';
import { IStockMovementService } from './stockMovement.service';
import { StockMovementRequestDTO } from '../models/DTO/request/stockMovementRequestDTO';
import { StockMovementMapper } from '../models/mappers/stockMovementMapper';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

const stockMovementMapper = new StockMovementMapper();

export class StockMovementController {
  constructor(private readonly stockMovementService: IStockMovementService) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const stockMovementRequestDTO = plainToClass(
        StockMovementRequestDTO,
        req.body,
      );
      const errors = await validate(stockMovementRequestDTO);
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      const stockMovement = await this.stockMovementService.createStockMovement(
        stockMovementRequestDTO,
      );
      if (stockMovement) {
        res.status(201).json(stockMovementMapper.toResponseDTO(stockMovement));
      } else {
        res.status(500).json({ message: 'Failed to create stock movement' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid stock movement ID');
      }
      const stockMovement =
        await this.stockMovementService.getStockMovementById(id);
      if (stockMovement) {
        res.status(200).json(stockMovement);
      } else {
        res.status(404).json({ message: 'Stock movement not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      if (page < 1 || limit < 1) {
        res.status(400).json({ message: 'Invalid page or limit' });
        return;
      }
      const stockMovements =
        await this.stockMovementService.getStockMovementsPaginated(page, limit);
      res.status(200).json(stockMovements);
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid stock movement ID');
      }
      const stockMovementRequestDTO = plainToClass(
        StockMovementRequestDTO,
        req.body,
      );
      const errors = await validate(stockMovementRequestDTO);
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      const updatedStockMovement =
        await this.stockMovementService.updateStockMovement(
          id,
          stockMovementRequestDTO,
        );
      if (updatedStockMovement) {
        res.status(200).json(updatedStockMovement);
      } else {
        res.status(404).json({ message: 'Stock movement not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid stock movement ID');
      }
      const deletedStockMovement =
        await this.stockMovementService.deleteStockMovement(id);
      if (deletedStockMovement) {
        res.status(200).json(deletedStockMovement);
      } else {
        res.status(404).json({ message: 'Stock movement not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }
}
