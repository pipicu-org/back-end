import { Repository } from 'typeorm';
import { Product } from '../models';

export interface IProductRepository {
  findById(id: number): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  update(id: number, product: Product): Promise<Product | null>;
  delete(id: number): Promise<Product | void>;
}

export class ProductRepository implements IProductRepository {
  constructor(private readonly dbProductRepository: Repository<Product>) {}

  async findById(id: number): Promise<Product | null> {
    try {
      return await this.dbProductRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error finding product with id ${id}:`, error);
      return null;
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      return await this.dbProductRepository.find();
    } catch (error) {
      console.error('Error finding all products:', error);
      return [];
    }
  }

  async create(product: Product): Promise<Product> {
    try {
      return await this.dbProductRepository.save(product);
    } catch (error) {
      console.error('Error creating product:', error);
      throw new Error('Could not create product');
    }
  }
  async update(id: number, product: Product): Promise<Product | null> {
    try {
      const existingProduct = await this.dbProductRepository.update(
        id,
        product,
      );
      if (existingProduct.affected === 0) {
        console.warn(`No product found with id ${id} to update`);
        return null;
      }
      return await this.dbProductRepository.findOneBy({ id });
    } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      return null;
    }
  }

  async delete(id: number): Promise<Product | void> {
    try {
      const existingProduct = await this.dbProductRepository.findOneBy({ id });
      if (existingProduct) {
        await this.dbProductRepository.delete(id);
        return existingProduct;
      }
    } catch (error) {
      console.error(`Error deleting product with id ${id}:`, error);
      throw new Error('Could not delete product');
    }
  }
}
