import { ProductRequestDTO } from '../../src/api/models/DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../../src/api/models/DTO/response/productResponseDTO';

export const mockProductRequestDTO = new ProductRequestDTO(
  1,
  'Pizza Margherita',
  8.99,
  10.99,
  [
    { id: 1, quantity: 1 },
    { id: 2, quantity: 2 },
  ],
);

export const mockProductResponseDTO: ProductResponseDTO = {
  id: 1,
  name: 'Pizza Margherita',
  preTaxPrice: 8.99,
  price: 10.99,
  recipeId: 1,
  categoryId: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  category: {
    id: 1,
    name: 'Pizza',
  },
  recipe: {
    id: 1,
    ingredients: [
      {
        id: 1,
        quantity: 1,
        ingredient: {
          id: 1,
          name: 'Tomato Sauce',
        },
      },
      {
        id: 2,
        quantity: 2,
        ingredient: {
          id: 2,
          name: 'Cheese',
        },
      },
    ],
  },
};