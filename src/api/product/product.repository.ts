import { Like, Repository } from 'typeorm';
import { Product } from '../models/entity';
import { ProductMapper } from '../models/mappers/productMapper';
import { ProductSearchResponseDTO } from '../models/DTO/response/productSearchResponseDTO';
import { ProductResponseDTO } from '../models/DTO/response/productResponseDTO';
import { HttpError } from '../../errors/httpError';

export interface IProductRepository {
  findById(id: number): Promise<ProductResponseDTO | void>;
  create(product: Product): Promise<ProductResponseDTO>;
  update(id: number, product: Product): Promise<ProductResponseDTO | void>;
  delete(id: number): Promise<ProductResponseDTO | void>;
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

  async findById(id: number): Promise<ProductResponseDTO | void> {
    try {
      const product = await this._dbProductRepository.findOneBy({ id });
      if (!product) {
        console.warn(`No product found with id ${id}`);
        throw new HttpError(404, `Product id ${id} not found`);
      }
      return this._productMapper.toResponseDTO(product);
    } catch (error: any) {
      console.error(`Error finding product with id ${id}:`, error);
      throw new HttpError(error.status, error.message);
    }
  }

  async create(product: Product): Promise<ProductResponseDTO> {
    try {
      const productCreated = await this._dbProductRepository.save(product);
      return this._productMapper.toResponseDTO(productCreated);
    } catch (error: any) {
      console.error('Error creating product:', error);
      throw new HttpError(error.status, error.message);
    }
  }
  async update(
    id: number,
    product: Product,
  ): Promise<ProductResponseDTO | void> {
    product.id = id;
    try {
      const existingProduct = await this._dbProductRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.recipe', 'recipe')
        .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
        .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
        .where('product.id = :id', { id })
        .getOne();
      if (!existingProduct) {
        console.warn(`No product found with id ${id} to update`);
        throw new HttpError(404, `Product id ${id} not found`);
      }
      product.recipe.id = existingProduct.recipe.id;
      await this._dbProductRepository.manager.remove(
        existingProduct.recipe.recipeIngredients,
      );
      const updatedProduct = await this._dbProductRepository.save(product);
      return this._productMapper.toResponseDTO(updatedProduct);
    } catch (error: any) {
      console.error(`Error updating product with id ${id}:`, error);
      throw new HttpError(error.status, error.message);
    }
  }

  async delete(id: number): Promise<ProductResponseDTO | void> {
    try {
      const productToDelete = await this._dbProductRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.recipe', 'recipe')
        .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
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
      throw new HttpError(error.status, error.message);
    }
  }

  async getByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO> {
    try {
      const findAndCount = await this._dbProductRepository.findAndCount({
        where: { category: { id: categoryId } },
        skip: (page - 1) * limit,
        take: limit,
      });
      return this._productMapper.searchToResponseDTO(
        findAndCount,
        findAndCount[0][0].category.name,
        page,
        limit,
      );
    } catch (error: any) {
      console.error(
        `Error finding products by category id ${categoryId}:`,
        error,
      );
      throw new HttpError(error.status, error.message);
    }
  }

  async getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO> {
    try {
      const findAndCount = await this._dbProductRepository.findAndCount({
        where: { name: Like(`%${name}%`) },
        skip: (page - 1) * limit,
        take: limit,
      });
      return this._productMapper.searchToResponseDTO(
        findAndCount,
        name,
        page,
        limit,
      );
    } catch (error: any) {
      console.error(`Error finding products by name ${name}:`, error);
      throw new HttpError(error.status, error.message);
    }
  }
}
