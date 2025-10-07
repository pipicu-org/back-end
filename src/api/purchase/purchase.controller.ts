import { CreatePurchaseDto, UpdatePurchaseDto } from '../models/DTO/request/purchaseRequestDTO';
import { IPurchaseService } from './purchase.service';
import { NextFunction, Request, Response } from 'express';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

export class PurchaseController {
  constructor(private readonly _purchaseService: IPurchaseService) {}

  async createPurchase(req: Request, res: Response, next: NextFunction) {
    try {
      const purchaseDto = plainToClass(CreatePurchaseDto, req.body);
      const errors = await validate(purchaseDto);
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      const purchase = await this._purchaseService.createPurchase(purchaseDto);
      res.status(201).json(purchase);
    } catch (error: any) {
      next(error);
    }
  }

  async getAllPurchases(req: Request, res: Response, next: NextFunction) {
    try {
      const purchases = await this._purchaseService.getAllPurchases();
      res.status(200).json(purchases);
    } catch (error: any) {
      next(error);
    }
  }

  async getPurchaseById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const purchase = await this._purchaseService.getPurchaseById(id);
      if (!purchase) {
        return res.status(404).json({ message: 'Purchase not found' });
      }
      res.status(200).json(purchase);
    } catch (error: any) {
      next(error);
    }
  }

  async updatePurchase(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const purchaseDto = plainToClass(UpdatePurchaseDto, req.body);
      const errors = await validate(purchaseDto);
      if (errors.length > 0) {
        return res.status(400).json({ message: 'Validation failed', errors });
      }
      const updatedPurchase = await this._purchaseService.updatePurchase(id, purchaseDto);
      if (!updatedPurchase) {
        return res.status(404).json({ message: 'Purchase not found' });
      }
      res.status(200).json(updatedPurchase);
    } catch (error: any) {
      next(error);
    }
  }

  async deletePurchase(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const deletedPurchase = await this._purchaseService.deletePurchase(id);
      if (!deletedPurchase) {
        return res.status(404).json({ message: 'Purchase not found' });
      }
      res.status(200).json(deletedPurchase);
    } catch (error: any) {
      next(error);
    }
  }
}