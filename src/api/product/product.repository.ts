import { Like, Repository } from 'typeorm';
import { Product } from '../models/entity';
import { ProductMapper } from '../models/mappers/productMapper';
import { ProductSearchResponseDTO } from '../models/DTO/response/productSearchResponseDTO';
import { ProductResponseDTO } from '../models/DTO/response/productResponseDTO';

export interface IProductRepository {
  findById(id: number): Promise<ProductResponseDTO | null>;
  create(product: Product): Promise<ProductResponseDTO>;
  update(id: number, product: Product): Promise<ProductResponseDTO | null>;
  delete(id: number): Promise<ProductResponseDTO | null>;
  getByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO | []>;
  getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO | []>;
}

export class ProductRepository implements IProductRepository {
  constructor(
    private readonly dbProductRepository: Repository<Product>,
    private readonly _productMapper: ProductMapper,
  ) {}

  async findById(id: number): Promise<ProductResponseDTO | null> {
    try {
      const product = await this.dbProductRepository.findOneBy({ id });
      if (!product) {
        console.warn(`No product found with id ${id}`);
        return null;
      }
      return this._productMapper.toResponseDTO(product);
    } catch (error) {
      console.error(`Error finding product with id ${id}:`, error);
      return null;
    }
  }

  async create(product: Product): Promise<ProductResponseDTO> {
    try {
      const productCreated = await this.dbProductRepository.save(product);
      return this._productMapper.toResponseDTO(productCreated);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Could not create product');
    }
  }
  async update(
    id: number,
    product: Product,
  ): Promise<ProductResponseDTO | null> {
    product.id = id;
    try {
      const existingProduct = await this.dbProductRepository.findOneBy({ id });
      if (!existingProduct) {
        console.warn(`No product found with id ${id} to update`);
        return null;
      }
      const updatedProduct = await this.dbProductRepository.save(product);
      return this._productMapper.toResponseDTO(updatedProduct);
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      return null;
    }
  }

  async delete(id: number): Promise<ProductResponseDTO | null> {
    try {
      const productToDelete = await this.dbProductRepository
        .createQueryBuilder('product')
        .leftJoinAndSelect('product.category', 'category')
        .leftJoinAndSelect('product.recipe', 'recipe')
        .leftJoinAndSelect('recipe.recipeIngredients', 'recipeIngredient')
        .leftJoinAndSelect('recipeIngredient.ingredient', 'ingredient')
        .where('product.id = :id', { id })
        .getOne();
      console.log(productToDelete);
      if (!productToDelete) {
        console.warn(`No product found with id ${id} to delete`);
        return null;
      }
      await this.dbProductRepository.manager.remove(productToDelete.recipe);
      await this.dbProductRepository.delete(id);
      return this._productMapper.toResponseDTO(productToDelete);
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      return null;
    }
  }

  async getByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO | []> {
    try {
      const findAndCount = await this.dbProductRepository.findAndCount({
        where: { category: { id: categoryId } },
        skip: (page - 1) * limit,
        take: limit,
      });
      return this._productMapper.searchToResponseDTO(
        findAndCount,
        `Category ID: ${categoryId}`,
        page,
        limit,
      );
    } catch (error) {
      console.error(
        `Error finding products by category id ${categoryId}:`,
        error,
      );
      return [];
    }
  }

  async getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO | []> {
    try {
      const findAndCount = await this.dbProductRepository.findAndCount({
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
    } catch (error) {
      console.error(`Error finding products by name ${name}:`, error);
      return [];
    }
  }
}
