export interface ICategoryRequestDTO {
  name: string;
}

export class CategoryRequestDTO implements ICategoryRequestDTO {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}