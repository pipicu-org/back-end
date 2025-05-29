import { State } from '../models';
import { StateRequestDTO } from '../models/DTO/request/stateRequestDTO';
import { StateResponseDTO } from '../models/DTO/response/stateResponseDTO';
import { IStateRepository } from './state.repository';

export interface IStateService {
  createState(newState: StateRequestDTO): Promise<StateResponseDTO>;
  getStateById(id: number): Promise<StateResponseDTO | null>;
  updateState(
    updatedState: StateRequestDTO,
    id: number,
  ): Promise<StateResponseDTO | null>;
  deleteState(id: number): Promise<StateResponseDTO | null>;
}

export class StateService implements IStateService {
  constructor(private readonly stateRepository: IStateRepository) {}

  async createState(newState: StateRequestDTO): Promise<StateResponseDTO> {
    try {
      const createdState = await this.stateRepository.create(
        new State(newState.name),
      );
      return new StateResponseDTO(createdState);
    } catch (error) {
      console.error('Error creando el estado:', error);
      throw new Error('No se ha podido crear el estado');
    }
  }

  async getStateById(id: number): Promise<StateResponseDTO | null> {
    try {
      const state = await this.stateRepository.getById(id);
      if (!state) {
        throw new Error('Estado no encontrado');
      }
      return new StateResponseDTO(state);
    } catch (error) {
      console.error('Error obteniendo el estado:', error);
      throw new Error('No se ha podido obtener el estado');
    }
  }

  async updateState(
    updatedState: StateRequestDTO,
    id: number,
  ): Promise<StateResponseDTO | null> {
    try {
      const updated = await this.stateRepository.update(
        id,
        new State(updatedState.name),
      );
      if (!updated) {
        throw new Error('Estado no encontrado');
      }
      return new StateResponseDTO(updated);
    } catch (error) {
      console.error('Error actualizando el estado:', error);
      throw new Error('No se ha podido actualizar el estado');
    }
  }

  async deleteState(id: number): Promise<StateResponseDTO | null> {
    try {
      const state = await this.stateRepository.delete(id);
      if (!state) {
        throw new Error('Estado no encontrado');
      }
      return new StateResponseDTO(state);
    } catch (error) {
      console.error('Error eliminando el estado:', error);
      throw new Error('No se ha podido eliminar el estado');
    }
  }
}
