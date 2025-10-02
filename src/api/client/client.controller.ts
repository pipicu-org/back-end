import { ClientRequestDTO } from '../models/DTO/request/clientRequestDTO';
import { IClientService } from './client.service';
import { NextFunction, Request, Response } from 'express';

export class ClientController {
  constructor(private readonly _clientService: IClientService) {}

  async createClient(req: Request, res: Response, next: NextFunction) {
    try {
      const clientRequestDTO = req.body as ClientRequestDTO;
      const client = await this._clientService.createClient(clientRequestDTO);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  }

  async getClientById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const client = await this._clientService.getClientById(id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json(client);
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const clientRequestDTO = req.body as ClientRequestDTO;
      const updatedClient = await this._clientService.updateClient(
        id,
        clientRequestDTO,
      );
      if (!updatedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json(updatedClient);
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const deletedClient = await this._clientService.deleteClient(id);
      if (!deletedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json(deletedClient);
    } catch (error) {
      next(error);
    }
  }

  async searchClients(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, page = 1, limit = 10 } = req.query;
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const parsedSaearch = !search ? '' : search as string;
      const clients = await this._clientService.searchClients(
        parsedSaearch,
        parsedPage,
        parsedLimit,
      );
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  }
}
