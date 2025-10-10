import { Repository } from 'typeorm';
import { Product } from '../models/entity';
import { ProductMapper } from '../models/mappers/productMapper';
import { ProductSearchResponseDTO } from '../models/DTO/response/productSearchResponseDTO';
import { ProductResponseDTO } from '../models/DTO/response/productResponseDTO';
import { HttpError } from '../../errors/httpError';

export interface IProductRepository {
  findById(id: number): Promise<ProductResponseDTO>;
  create(product: Product): Promise<ProductResponseDTO>;
  update(id: number, product: Product): Promise<ProductResponseDTO>;
  delete(id: number): Promise<ProductResponseDTO>;
  getByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO>;
  getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO>;
}

export class ProductRepository implements IProductRepository {
  constructor(
    private readonly _dbProductRepository: Repository<Product>,
    private readonly _productMapper: ProductMapper,
  ) {}

  async findById(id: number): Promise<ProductResponseDTO> {
    try {
      const product = await this._dbProductRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.recipe', 'recipe')
        .leftJoinAndSelect('recipe.recipeIngredient', 'recipeIngredient')
        .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
        .where('product.id = :id', { id })
        .getOne();
      if (!product) {
        console.warn(`No product found with id ${id}`);
        throw new HttpError(404, `Product id ${id} not found`);
      }
      // Get cost using CTE
      const costQuery = `
        WITH ingredient_cost_table AS (
          SELECT i.id, trunc((p.cost/p."unitQuantity"),2) as "cost", p."createdAt" FROM "Ingredient" i
          JOIN LATERAL (
            SELECT t.id, t."createdAt", t.cost, t."unitQuantity" FROM "PurchaseItem" t
            WHERE t."ingredientId" = i.id
            ORDER BY t."createdAt" ASC
            LIMIT 1
          ) p ON TRUE
        ),
        prepareable_table AS (
          SELECT ri."recipeId", ri."ingredientId",
                 CASE WHEN i.stock > 0 THEN trunc((i.stock / ri.quantity),0) ELSE 0 END AS "prepareable"
          FROM "RecipeIngredient" ri
          INNER JOIN "Ingredient" i ON i.id = ri."ingredientId"
        ),
        prepareable_recipes_table AS (
          SELECT r.id, SUM(ict.cost * pt.quantity) AS "cost"
          FROM "Recipe" r
          INNER JOIN prepareable_table pt ON pt."recipeId" = r.id
          INNER JOIN ingredient_cost_table ict ON ict.id = pt."ingredientId"
          GROUP BY r.id
        )
        SELECT prt."cost" FROM prepareable_recipes_table prt WHERE prt.id = $1
      `;
      const costResult = await this._dbProductRepository.query(costQuery, [product.recipeId]);
      if (costResult.length > 0) {
        product.recipe.cost = parseFloat(costResult[0].cost);
      }
      return this._productMapper.toResponseDTO(product);
    } catch (error: any) {
      console.error(`Error finding product with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to find product by ID',
      );
    }
  }

  async create(product: Product): Promise<ProductResponseDTO> {
    try {
      const productCreated = await this._dbProductRepository.save(product);
      return this._productMapper.toResponseDTO(productCreated);
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to create product',
      );
    }
  }
  async update(id: number, product: Product): Promise<ProductResponseDTO> {
    product.id = id;
    try {
      const existingProduct = await this._dbProductRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.recipe', 'recipe')
        .leftJoinAndSelect('recipe.recipeIngredient', 'recipeIngredient')
        .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
        .where('product.id = :id', { id })
        .getOne();
      if (!existingProduct) {
        console.warn(`No product found with id ${id} to update`);
        throw new HttpError(404, `Product id ${id} not found`);
      }
      product.recipe.id = existingProduct.recipe.id;
      await this._dbProductRepository.manager.remove(
        existingProduct.recipe.recipeIngredient,
      );
      const updatedProduct = await this._dbProductRepository.save(product);
      return this._productMapper.toResponseDTO(updatedProduct);
    } catch (error: any) {
      console.error(`Error updating product with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to update product',
      );
    }
  }

  async delete(id: number): Promise<ProductResponseDTO> {
    try {
      const productToDelete = await this._dbProductRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.recipe', 'recipe')
        .leftJoinAndSelect('recipe.recipeIngredient', 'recipeIngredient')
        .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
        .where('product.id = :id', { id })
        .getOne();
      if (!productToDelete) {
        console.warn(`No product found with id ${id} to delete`);
        throw new HttpError(404, `Product id ${id} not found`);
      }
      await this._dbProductRepository.manager.remove(productToDelete.recipe);
      await this._dbProductRepository.delete(id);
      return this._productMapper.toResponseDTO(productToDelete);
    } catch (error: any) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to delete product',
      );
    }
  }

  async getByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO> {
    try {
      const offset = (page - 1) * limit;
      const cteQuery = `
        WITH ingredient_cost_table AS (
          SELECT i.id, trunc((p.cost/p."unitQuantity"),2) as "cost", p."createdAt" FROM "Ingredient" i
          JOIN LATERAL (
            SELECT t.id, t."createdAt", t.cost, t."unitQuantity" FROM "PurchaseItem" t
            WHERE t."ingredientId" = i.id
            ORDER BY t."createdAt" ASC
            LIMIT 1
          ) p ON TRUE
        ),
        prepareable_table AS (
          SELECT ri."recipeId", ri."ingredientId", ri.quantity,
                 CASE WHEN i.stock > 0 THEN trunc((i.stock / ri.quantity),0) ELSE 0 END AS "prepareable"
          FROM "RecipeIngredient" ri
          INNER JOIN "Ingredient" i ON i.id = ri."ingredientId"
        ),
        prepareable_recipes_table AS (
          SELECT r.id, MIN(pt.prepareable) AS "maxPrepareable", SUM(ict.cost * pt.quantity) AS "cost"
          FROM "Recipe" r
          INNER JOIN prepareable_table pt ON pt."recipeId" = r.id
          INNER JOIN ingredient_cost_table ict ON ict.id = pt."ingredientId"
          GROUP BY r.id
        )
      `;
      const dataQuery = `${cteQuery}
        SELECT p.id, p.name, p."preTaxPrice", p.price, p."createdAt", p."updatedAt", p."recipeId", p."categoryId",
               c.name AS "categoryName", prt."maxPrepareable", prt."cost"
        FROM "Product" p
        INNER JOIN prepareable_recipes_table prt ON prt.id = p."recipeId"
        INNER JOIN "Category" c ON p."categoryId" = c.id
        WHERE p."categoryId" = $1
        ORDER BY p.id
        LIMIT $2 OFFSET $3
      `;
      const countQuery = `${cteQuery}
        SELECT COUNT(*) AS total
        FROM "Product" p
        INNER JOIN prepareable_recipes_table prt ON prt.id = p."recipeId"
        WHERE p."categoryId" = $1
      `;
      const [dataResult, countResult] = await Promise.all([
        this._dbProductRepository.query(dataQuery, [categoryId, limit, offset]),
        this._dbProductRepository.query(countQuery, [categoryId])
      ]);
      const total = parseInt(countResult[0].total);
      // Map to Product-like objects
      const products = dataResult.map((row: any) => ({
        id: row.id,
        name: row.name,
        preTaxPrice: parseFloat(row.preTaxPrice),
        price: parseFloat(row.price),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        recipeId: row.recipeId,
        categoryId: row.categoryId,
        category: { name: row.categoryName },
        maxPrepareable: parseFloat(row.maxPrepareable),
        cost: parseFloat(row.cost)
      }));
      const findAndCount: [any[], number] = [products, total];
      return this._productMapper.searchToResponseDTO(
        findAndCount,
        products[0]?.category.name || '',
        page,
        limit,
      );
    } catch (error: any) {
      console.error(
        `Error finding products by category id ${categoryId}:`,
        error,
      );
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to find products by category id',
      );
    }
  }

  async getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO> {
    try {
      const offset = (page - 1) * limit;
      const cteQuery = `
        WITH ingredient_cost_table AS (
          SELECT i.id, trunc((p.cost/p."unitQuantity"),2) as "cost", p."createdAt" FROM "Ingredient" i
          JOIN LATERAL (
            SELECT t.id, t."createdAt", t.cost, t."unitQuantity" FROM "PurchaseItem" t
            WHERE t."ingredientId" = i.id
            ORDER BY t."createdAt" ASC
            LIMIT 1
          ) p ON TRUE
        ),
        prepareable_table AS (
          SELECT ri."recipeId", ri."ingredientId",
                 CASE WHEN i.stock > 0 THEN trunc((i.stock / ri.quantity),0) ELSE 0 END AS "prepareable"
          FROM "RecipeIngredient" ri
          INNER JOIN "Ingredient" i ON i.id = ri."ingredientId"
        ),
        prepareable_recipes_table AS (
          SELECT r.id, MIN(pt.prepareable) AS "maxPrepareable", SUM(ict.cost * pt.quantity) AS "cost"
          FROM "Recipe" r
          INNER JOIN prepareable_table pt ON pt."recipeId" = r.id
          INNER JOIN ingredient_cost_table ict ON ict.id = pt."ingredientId"
          GROUP BY r.id
        )
      `;
      const dataQuery = `${cteQuery}
        SELECT p.id, p.name, p."preTaxPrice", p.price, p."createdAt", p."updatedAt", p."recipeId", p."categoryId",
               c.name AS "categoryName", prt."maxPrepareable", prt."cost"
        FROM "Product" p
        INNER JOIN prepareable_recipes_table prt ON prt.id = p."recipeId"
        INNER JOIN "Category" c ON p."categoryId" = c.id
        WHERE p.name ILIKE $1
        ORDER BY p.id
        LIMIT $2 OFFSET $3
      `;
      const countQuery = `${cteQuery}
        SELECT COUNT(*) AS total
        FROM "Product" p
        INNER JOIN prepareable_recipes_table prt ON prt.id = p."recipeId"
        WHERE p.name ILIKE $1
      `;
      const [dataResult, countResult] = await Promise.all([
        this._dbProductRepository.query(dataQuery, [`%${name}%`, limit, offset]),
        this._dbProductRepository.query(countQuery, [`%${name}%`])
      ]);
      const total = parseInt(countResult[0].total);
      const products = dataResult.map((row: any) => ({
        id: row.id,
        name: row.name,
        preTaxPrice: parseFloat(row.preTaxPrice),
        price: parseFloat(row.price),
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        recipeId: row.recipeId,
        categoryId: row.categoryId,
        category: { name: row.categoryName },
        maxPrepareable: parseFloat(row.maxPrepareable),
        cost: parseFloat(row.cost)
      }));
      const findAndCount: [any[], number] = [products, total];
      return this._productMapper.searchToResponseDTO(
        findAndCount,
        name,
        page,
        limit,
      );
    } catch (error: any) {
      console.error(`Error finding products by name ${name}:`, error);
      throw new HttpError(
        error.status || 500,
        error.message || 'Failed to find products by name',
      );
    }
  }
}
