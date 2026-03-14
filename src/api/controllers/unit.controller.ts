import { CreateUnitDto, UpdateUnitDto } from '../models/DTO/request/unitRequestDTO';
import { IUnitService } from '../unit/unit.service';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class UnitController {
  constructor(private readonly _unitService: IUnitService) {}

  async createUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const unitDto = plainToClass(CreateUnitDto, req.body);
      const errors = await validate(unitDto);
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      const unit = await this._unitService.createUnit(unitDto);
      res.status(201).json(unit);
    } catch (error: any) {
      next(error);
    }
  }

  async getAllUnits(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string | undefined;
      const sortBy = req.query.sortBy as string | undefined;
      const sortOrder = (req.query.sortOrder as 'ASC' | 'DESC') || 'ASC';

      if (page < 1 || limit < 1) {
        return res.status(400).json({ message: 'Invalid page or limit' });
      }

      const units = await this._unitService.getAllUnits(page, limit, search, sortBy, sortOrder);
      res.status(200).json(units);
    } catch (error: any) {
      next(error);
    }
  }

  async getUnitById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const unit = await this._unitService.getUnitById(id);
      if (!unit) {
        return res.status(404).json({ message: 'Unit not found' });
      }
      res.status(200).json(unit);
    } catch (error: any) {
      next(error);
    }
  }

  async updateUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const unitDto = plainToClass(UpdateUnitDto, req.body);
      const errors = await validate(unitDto);
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      const updatedUnit = await this._unitService.updateUnit(id, unitDto);
      if (!updatedUnit) {
        return res.status(404).json({ message: 'Unit not found' });
      }
      res.status(200).json(updatedUnit);
    } catch (error: any) {
      next(error);
    }
  }

  async deleteUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const deletedUnit = await this._unitService.deleteUnit(id);
      if (!deletedUnit) {
        return res.status(404).json({ message: 'Unit not found' });
      }
      res.status(200).json(deletedUnit);
    } catch (error: any) {
      next(error);
    }
  }
}