import { Repository } from 'typeorm';
import { State } from '../models';

export interface IStateRepository {
  create(state: Partial<State>): Promise<State>;
  getById(id: number): Promise<State | null>;
  update(id: number, newState: Partial<State>): Promise<State | null>;
  delete(id: number): Promise<State | null>;
}

export class StateRepository implements IStateRepository {
  constructor(private readonly state: Repository<State>) {}

  async create(state: Partial<State>): Promise<State> {
    try {
      if (!state.name) throw new Error('Name should be defined');
      return this.state.save(new State(state.name));
    } catch (error) {
      console.error('Error creating state:', error);
      throw new Error('Could not create state');
    }
  }

  async getById(id: number): Promise<State | null> {
    try {
      const state = await this.state.findOneBy({ id });
      return state;
    } catch (error) {
      console.error('Error getting state:', error);
      throw new Error('Could not get state');
    }
  }

  async update(id: number, newState: Partial<State>): Promise<State | null> {
    try {
      if (!newState.name) throw new Error('Name should be defined');
      await this.state.update(id, new State(newState.name));
      const updatedState = await this.state.findOneBy({ id });
      return updatedState;
    } catch (error) {
      console.error('Error updating state:', error);
      throw new Error('Could not update state');
    }
  }

  async delete(id: number): Promise<State | null> {
    try {
      const state = await this.getById(id);
      await this.state.delete(id);
      return state ?? null;
    } catch (error) {
      console.error('Error deleting state:', error);
      throw new Error('Could not delete state');
    }
  }
}
