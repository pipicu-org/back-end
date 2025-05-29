import { NextFunction, Request, Response } from 'express';
import { IStateService } from './state.service';
import { StateRequestDTO } from '../models/DTO/request/stateRequestDTO';

export class StateController {
  constructor(private readonly stateService: IStateService = stateService) {}

  async createState(req: Request, res: Response, next: NextFunction) {
    try {
      const stateRequestDTO = req.body as StateRequestDTO;
      const state = await this.stateService.createState(stateRequestDTO);
      res.status(201).json(state);
    } catch (error) {
      next(error);
    }
  }

  async getStateById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const state = await this.stateService.getStateById(id);
      if (!state) {
        res.status(404).json({ message: 'State not found' });
      }
      res.status(200).json(state);
    } catch (error) {
      next(error);
    }
  }

  async updateState(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const stateRequestDTO = req.body as StateRequestDTO;
      const updatedState = await this.stateService.updateState(
        stateRequestDTO,
        id,
      );
      if (!updatedState) {
        res.status(404).json({ message: 'State not found' });
      }
      res.status(200).json(updatedState);
    } catch (error) {
      next(error);
    }
  }

  async deleteState(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const deletedState = await this.stateService.deleteState(id);
      if (!deletedState) {
        res.status(404).json({ message: 'State not found' });
      }
      res.status(200).json(deletedState);
    } catch (error) {
      next(error);
    }
  }
}
