import {
  Category,
  Client,
  Ingredient,
  Line,
  Order,
  Product,
  Recipe,
  State,
  Transition,
  TransitionType,
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
import { OrderMapper } from '../api/models/mappers/orderMapper';
import { ProductMapper } from '../api/models/mappers/productMapper';
import { IngredientMapper } from '../api/models/mappers/ingredientMapper';
import { LineMapper } from '../api/models/mappers/lineMapper';
import { LineController } from '../api/line/line.controller';
import { LineService } from '../api/line/line.service';
import { LineRepository } from '../api/line/line.repository';

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

export const dbTransitionTypeRepository =
  AppDataSource.getRepository<TransitionType>('TransitionType').extend({});

export const dbTransitionRepository = AppDataSource.getRepository<Transition>(
  'Transition',
).extend({});
// Mappers

export const clientMapper = new ClientMapper();

export const orderMapper = new OrderMapper(
  dbClientRepository,
  dbProductRepository,
  dbStateRepository,
);

export const productMapper = new ProductMapper(
  dbCategoryRepository,
  dbIngredientRepository,
);

export const ingredientMapper = new IngredientMapper();

export const lineMapper = new LineMapper();

// Repositories

export const orderRepository = new OrderRepository(
  dbOrderRepository,
  dbStateRepository,
  dbTransitionRepository,
  dbTransitionTypeRepository,
  orderMapper,
);

export const productRepository = new ProductRepository(
  dbProductRepository,
  productMapper,
);

export const clientRepository = new ClientRepository(
  dbClientRepository,
  clientMapper,
);

export const categoryRepository = new CategoryRepository(dbCategoryRepository);

export const ingredientRepository = new IngredientRepository(
  dbIngredientRepository,
  ingredientMapper,
);

export const lineRepository = new LineRepository(
  dbLineRepository,
  dbStateRepository,
  dbTransitionRepository,
  dbTransitionTypeRepository,
  lineMapper,
);
export const lineService = new LineService(lineRepository);

export const orderService = new OrderService(
  orderRepository,
  orderMapper,
  lineService,
);
// Services

export const clientService = new ClientService(clientRepository, clientMapper);

export const productService = new ProductService(
  productRepository,
  productMapper,
);

export const ingredientService = new IngredientService(
  ingredientRepository,
  ingredientMapper,
);

// Controllers
export const orderController = new OrderController(orderService);

export const clientController = new ClientController(clientService);

export const productController = new ProductController(productService);

export const ingredientController = new IngredientController(ingredientService);

export const lineController = new LineController(lineService);
