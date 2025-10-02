import { ProductRequestDTO } from '../../src/api/models/DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../../src/api/models/DTO/response/productResponseDTO';

export const mockProductRequestDTO = new ProductRequestDTO(
  1,
  'Pizza Margherita',
  10.99,
  [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 2 },
  ],
);

export const mockProductResponseDTO: ProductResponseDTO = {
  id: 1,
  name: 'Pizza Margherita',
  price: 10.99,
  category: {
    id: 1,
    name: 'Pizza',
  },
  recipe: {
    id: 1,
    totalPrice: 10.99,
    ingredients: [
      {
        id: 1,
        quantity: 1,
        ingredient: {
          id: 1,
          name: 'Tomato Sauce',
          price: 2.0,
        },
      },
      {
        id: 2,
        quantity: 2,
        ingredient: {
          id: 2,
          name: 'Cheese',
          price: 3.0,
        },
      },
    ],
  },
};