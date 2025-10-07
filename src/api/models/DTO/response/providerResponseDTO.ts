import { Provider } from '../../entity/provider';

export class ProviderResponseDTO {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(provider: Provider) {
    this.id = provider.id;
    this.name = provider.name;
    this.description = provider.description || undefined;
    this.createdAt = provider.createdAt;
    this.updatedAt = provider.updatedAt;
  }
}