interface IProviderRequestDTO {
  name: string;
  description?: string;
}

export class ProviderRequestDTO implements IProviderRequestDTO {
  name: string;
  description?: string;

  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description;
  }
}