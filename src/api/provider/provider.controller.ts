import { Request, Response, NextFunction } from 'express';
import { IProviderService } from './provider.service';
import { ProviderRequestDTO } from '../models/DTO/request/providerRequestDTO';

export class ProviderController {
  constructor(
    private readonly providerService: IProviderService = providerService,
  ) {}

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const providerRequestDTO = req.body as unknown as ProviderRequestDTO;
      const provider =
        await this.providerService.createProvider(providerRequestDTO);
      res.status(201).json(provider);
    } catch (error: any) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid provider ID');
      }
      const provider = await this.providerService.getProviderById(id);
      if (provider) {
        res.status(200).json(provider);
      } else {
        res.status(404).json({ message: 'Provider not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async searchProviders(req: Request, res: Response, next: NextFunction) {
    try {
      const { search = '', page = 1, limit = 10, sort = 'name' } = req.query;
      const parsedSearch = !search ? '' : String(search);
      const providers = await this.providerService.searchProviders(
        parsedSearch,
        Number(page),
        Number(limit),
        String(sort),
      );
      res.status(200).json(providers);
    } catch (error: any) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        throw new Error('Invalid provider ID');
      }
      const providerRequestDTO = req.body as unknown as ProviderRequestDTO;
      const updatedProvider = await this.providerService.updateProvider(
        id,
        providerRequestDTO,
      );
      if (updatedProvider) {
        res.status(200).json(updatedProvider);
      } else {
        res.status(404).json({ message: 'Provider not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const deletedProvider =
        await this.providerService.deleteProvider(id);
      if (deletedProvider) {
        res.status(200).json(deletedProvider);
      } else {
        res.status(404).json({ message: 'Provider not found' });
      }
    } catch (error: any) {
      next(error);
    }
  }
}