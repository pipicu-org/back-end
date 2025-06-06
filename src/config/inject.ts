import {
  Category,
  Client,
  Ingredient,
  Line,
  Order,
  Product,
  Recipe,
  State,
} from '../api/models';
import { LineRepository } from '../api/line/line.repository';
import { OrderController } from '../api/order/order.controller';
import { OrderRepository } from '../api/order/order.repository';
import { OrderService } from '../api/order/order.service';
import { StateController } from '../api/state/state.controller';
import { StateRepository } from '../api/state/state.repository';
import { StateService } from '../api/state/state.service';
import { AppDataSource, initializeDataSource } from './initializeDatabase';
import { initializeWebSocket } from '../middlewares/webSocket';
import { LineService } from '../api/line/line.service';
import { ProductRepository } from '../api/product/product.repository';
import { LineController } from '../api/line/line.controller';
import { ClientRepository } from '../api/client/client.repository';
import { OrderFactory } from '../api/models/factory/orderFactory';
import { LineFactory } from '../api/models/factory/lineFactory';
import { ClientFactory } from '../api/models/factory/clientFactory';
import { ClientService } from '../api/client/client.service';
import { ClientController } from '../api/client/client.controller';
import { RecipeRepository } from '../api/recipe/recipe.repository';
import { CategoryRepository } from '../api/category/category.repository';
import { IngredientRepository } from '../api/ingredient/ingredient.repository';
import { ProductFactory } from '../api/models/factory/productFactory';
import { RecipeFactory } from '../api/models/factory/recipeFactory';
import { ProductService } from '../api/product/product.service';
import { RecipeService } from '../api/recipe/recipe.service';
import { ProductController } from '../api/product/product.controller';

initializeDataSource().catch((err) =>
  console.error('Error inicializando la fuente de datos', err),
);

initializeWebSocket();

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

// Repositories

export const stateRepository = new StateRepository(dbStateRepository);

export const orderRepository = new OrderRepository(dbOrderRepository);

export const lineRepository = new LineRepository(dbLineRepository);

export const productRepository = new ProductRepository(dbProductRepository);

export const clientRepository = new ClientRepository(dbClientRepository);

export const recipeRepository = new RecipeRepository(dbRecipeRepository);

export const categoryRepository = new CategoryRepository(dbCategoryRepository);

export const ingredientRepository = new IngredientRepository(
  dbIngredientRepository,
);

// Services

export const orderService = new OrderService(orderRepository);

export const stateService = new StateService(stateRepository);

export const lineService = new LineService(lineRepository);

export const clientService = new ClientService(clientRepository);

export const productService = new ProductService(productRepository);

export const recipeService = new RecipeService(recipeRepository);

// Controllers
export const orderController = new OrderController(orderService);

export const stateController = new StateController(stateService);

export const lineController = new LineController(lineService);

export const clientController = new ClientController(clientService);

export const productController = new ProductController(productService);
// Factory

export const orderFactory = new OrderFactory(
  clientRepository,
  stateRepository,
  lineRepository,
);

export const lineFactory = new LineFactory(orderRepository, productRepository);

export const clientFactory = new ClientFactory();

export const productFactory = new ProductFactory(
  recipeRepository,
  categoryRepository,
);

export const recipeFactory = new RecipeFactory(ingredientRepository);
