import {
  Category,
  Client,
  Ingredient,
  Line,
  Order,
  Product,
  Provider,
  Purchase,
  PurchaseItem,
  Recipe,
  RecipeIngredient,
  State,
  StockMovement,
  Transition,
  TransitionType,
  Unit,
} from '../api/models/entity';
import { OrderController } from '../api/order/order.controller';
import { OrderRepository } from '../api/order/order.repository';
import { OrderService } from '../api/order/order.service.impl';
import { AppDataSource } from './initializeDatabase';
import { ProductRepository } from '../api/product/product.repository';
import { ClientRepository } from '../api/client/client.repository';
import { ClientService } from '../api/client/client.service.impl';
import { ClientController } from '../api/client/client.controller';
import { CategoryRepository } from '../api/category/category.repository';
import { CategoryService } from '../api/category/category.service.impl';
import { CategoryController } from '../api/category/category.controller';
import { IngredientRepository } from '../api/ingredient/ingredient.repository';
import { ProductService } from '../api/product/product.service.impl';
import { ProductController } from '../api/product/product.controller';
import { IngredientService } from '../api/ingredient/ingredient.service.impl';
import { IngredientController } from '../api/ingredient/ingredient.controller';
import { ClientMapper } from '../api/models/mappers/clientMapper';
import { OrderMapper } from '../api/models/mappers/orderMapper';
import { ProductMapper } from '../api/models/mappers/productMapper';
import { IngredientMapper } from '../api/models/mappers/ingredientMapper';
import { LineMapper } from '../api/models/mappers/lineMapper';
import { LineController } from '../api/line/line.controller';
import { LineService } from '../api/line/line.service.impl';
import { LineRepository } from '../api/line/line.repository';
import { RecipeIngredientRepository } from '../api/recipeIngredient/recipeIngredient.repository';
import { RecipeIngredientService } from '../api/recipeIngredient/recipeIngredient.service.impl';
import { RecipeIngredientController } from '../api/recipeIngredient/recipeIngredient.controller';
import { PurchaseRepository } from '../api/purchase/purchase.repository';
import { PurchaseService } from '../api/purchase/purchase.service.impl';
import { PurchaseController } from '../api/purchase/purchase.controller';
import { PurchaseMapper } from '../api/models/mappers/purchaseMapper';
import { PurchaseValidator } from '../api/purchase/purchase.validator';
import { PurchaseItemFactory } from '../api/purchase/purchase.item.factory';
import { StockMovementHandler } from '../api/purchase/stock.movement.handler';
import {
  CreatePurchaseStrategy,
  UpdatePurchaseStrategy,
} from '../api/purchase/purchase.strategy';
import { ProviderRepository } from '../api/provider/provider.repository';
import { ProviderService } from '../api/provider/provider.service.impl';
import { ProviderController } from '../api/provider/provider.controller';
import { ProviderMapper } from '../api/models/mappers/providerMapper';
import { UnitRepository } from '../api/unit/unit.repository';
import { UnitService } from '../api/unit/unit.service.impl';
import { UnitController } from '../api/controllers/unit.controller';
import { UnitMapper } from '../api/models/mappers/unitMapper';
import { StockMovementRepository } from '../api/stockMovement/stockMovement.repository';
import { StockMovementService } from '../api/stockMovement/stockMovement.service.impl';
import { StockMovementController } from '../api/stockMovement/stockMovement.controller';
import { StockMovementMapper } from '../api/models/mappers/stockMovementMapper';

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

export const dbRecipeIngredientRepository =
  AppDataSource.getRepository<RecipeIngredient>('RecipeIngredient').extend({});

export const dbPurchaseRepository = AppDataSource.getRepository<Purchase>(
  'Purchase',
).extend({});

export const dbPurchaseItemRepository =
  AppDataSource.getRepository<PurchaseItem>('PurchaseItem').extend({});

export const dbProviderRepository = AppDataSource.getRepository<Provider>(
  'Provider',
).extend({});

export const dbUnitRepository = AppDataSource.getRepository<Unit>(
  'Unit',
).extend({});

export const dbStockMovementRepository =
  AppDataSource.getRepository<StockMovement>('StockMovement').extend({});
// Mappers

export const clientMapper = new ClientMapper();

export const orderMapper = new OrderMapper(
  dbClientRepository,
  dbProductRepository,
  dbStateRepository,
  dbIngredientRepository,
);

export const productMapper = new ProductMapper(
  dbCategoryRepository,
  dbIngredientRepository,
);

export const ingredientMapper = new IngredientMapper();

export const lineMapper = new LineMapper();

export const purchaseMapper = new PurchaseMapper();

export const providerMapper = new ProviderMapper();

export const unitMapper = new UnitMapper();

export const stockMovementMapper = new StockMovementMapper();

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

export const categoryService = new CategoryService(categoryRepository);

export const categoryController = new CategoryController(categoryService);

export const ingredientRepository = new IngredientRepository(
  dbIngredientRepository,
  ingredientMapper,
);

export const recipeIngredientRepository = new RecipeIngredientRepository(
  dbRecipeIngredientRepository,
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

export const recipeIngredientService = new RecipeIngredientService(
  recipeIngredientRepository,
);

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

export const recipeIngredientController = new RecipeIngredientController(
  recipeIngredientService,
);

export const stockMovementRepository = new StockMovementRepository(
  dbStockMovementRepository,
  stockMovementMapper,
);

export const stockMovementService = new StockMovementService(
  stockMovementRepository,
  stockMovementMapper,
  AppDataSource,
);

export const stockMovementController = new StockMovementController(
  stockMovementService,
);

export const purchaseRepository = new PurchaseRepository(
  dbPurchaseRepository,
  purchaseMapper,
  AppDataSource,
);

// New dependencies for refactored purchase service
export const purchaseValidator = new PurchaseValidator(ingredientMapper);

export const purchaseItemFactory = new PurchaseItemFactory(purchaseValidator);

export const stockMovementHandler = new StockMovementHandler(
  stockMovementService,
);

export const createPurchaseStrategy = new CreatePurchaseStrategy(
  purchaseRepository,
  ingredientService,
  purchaseValidator,
  purchaseItemFactory,
  stockMovementHandler,
);

export const updatePurchaseStrategy = new UpdatePurchaseStrategy(
  purchaseRepository,
  ingredientService,
  purchaseValidator,
  purchaseItemFactory,
  stockMovementHandler,
);

export const purchaseService = new PurchaseService(
  purchaseRepository,
  createPurchaseStrategy,
  updatePurchaseStrategy,
);

export const purchaseController = new PurchaseController(purchaseService);

export const providerRepository = new ProviderRepository(
  dbProviderRepository,
  providerMapper,
);

export const providerService = new ProviderService(
  providerRepository,
  providerMapper,
);

export const providerController = new ProviderController(providerService);

export const unitRepository = new UnitRepository(dbUnitRepository, unitMapper);

export const unitService = new UnitService(
  unitRepository,
  unitMapper,
  AppDataSource,
);

export const unitController = new UnitController(unitService);
