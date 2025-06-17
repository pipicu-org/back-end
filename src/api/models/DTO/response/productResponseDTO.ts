import { Product } from '../../product';

export interface IProductResponseDTO {
  id: number;
  name: string;
  category: string;
  price: number;
  family: string;
  stock: number;
}
