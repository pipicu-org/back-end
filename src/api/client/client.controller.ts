import { ClientRequestDTO } from '../models/DTO/request/clientRequestDTO';
import { IClientService } from './client.service';
import { NextFunction, Request, Response } from 'express';

export class ClientController {
  constructor(private readonly clientService: IClientService) {}

  async createClient(req: Request, res: Response, next: NextFunction) {
    try {
      const clientRequestDTO = req.body as ClientRequestDTO;
      const client = await this.clientService.createClient(clientRequestDTO);
      res.status(201).json(client);
    } catch (error) {
      next(error);
    }
  }

  async getClientById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const client = await this.clientService.getClientById(id);
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
      const updatedClient = await this.clientService.updateClient(
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
      const deletedClient = await this.clientService.deleteClient(id);
      if (!deletedClient) {
        return res.status(404).json({ message: 'Client not found' });
      }
      res.status(200).json(deletedClient);
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req: Request, res: Response, next: NextFunction) {
    try {
      const clients = await this.clientService.getAllClients();
      res.status(200).json(clients);
    } catch (error) {
      next(error);
    }
  }
}
