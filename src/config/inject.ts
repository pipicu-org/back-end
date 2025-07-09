import {
  Category,
  Client,
  Ingredient,
  Line,
  Order,
  Product,
  Recipe,
  State,
} from '../api/models/entity';
import { OrderController } from '../api/order/order.controller';
import { OrderRepository } from '../api/order/order.repository';
import { OrderService } from '../api/order/order.service';
import { AppDataSource, initializeDataSource } from './initializeDatabase';
import { ProductRepository } from '../api/product/product.repository';
import { ClientRepository } from '../api/client/client.repository';
import { ClientService } from '../api/client/client.service';
import { ClientController } from '../api/client/client.controller';
import { CategoryRepository } from '../api/category/category.repository';
import { IngredientRepository } from '../api/ingredient/ingredient.repository';
import { ProductService } from '../api/product/product.service';
import { ProductController } from '../api/product/product.controller';
import { IngredientService } from '../api/ingredient/ingredient.service';
import { IngredientController } from '../api/ingredient/ingredient.controller';
import { ClientMapper } from '../api/models/mappers/clientMapper';

initializeDataSource().catch((err) =>
  console.error('Error inicializando la fuente de datos', err),
);

// Tables
export const dbOrderRepository = AppDataSource.getRepository<Order>(
  'Order',
).extend({});

export const dbStateRepository = AppDataSource.getRepository<State>(
  'State',
).extend({});

export const dbLineRepository = AppDataSource.getRepository<Line>(
  'Line',
).extend({});

export const dbProductRepository = AppDataSource.getRepository<Product>(
  'Product',
).extend({});

export const dbClientRepository = AppDataSource.getRepository<Client>(
  'Client',
).extend({});

export const dbRecipeRepository = AppDataSource.getRepository<Recipe>(
  'Recipe',
).extend({});

export const dbCategoryRepository = AppDataSource.getRepository<Category>(
  'Category',
).extend({});

export const dbIngredientRepository = AppDataSource.getRepository<Ingredient>(
  'Ingredient',
).extend({});

// Mappers

export const clientMapper = new ClientMapper();

// Repositories

export const orderRepository = new OrderRepository(dbOrderRepository);

export const productRepository = new ProductRepository(dbProductRepository);

export const clientRepository = new ClientRepository(
  dbClientRepository,
  clientMapper,
);

export const categoryRepository = new CategoryRepository(dbCategoryRepository);

export const ingredientRepository = new IngredientRepository(
  dbIngredientRepository,
);

// Services

export const orderService = new OrderService(orderRepository);

export const clientService = new ClientService(clientRepository, clientMapper);

export const productService = new ProductService(productRepository);

export const ingredientService = new IngredientService(ingredientRepository);

// Controllers
export const orderController = new OrderController(orderService);

export const clientController = new ClientController(clientService);

export const productController = new ProductController(productService);

export const ingredientController = new IngredientController(ingredientService);
