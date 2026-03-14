import { ProductRequestDTO } from '../models/DTO/request/productRequestDTO';
import { ProductResponseDTO } from '../models/DTO/response/productResponseDTO';
import { IProductRepository } from './product.repository';
import { ProductSearchResponseDTO } from '../models/DTO/response/productSearchResponseDTO';
import { ProductMapper } from '../models/mappers/productMapper';
import { IProductService } from './product.service';
import * as XLSX from 'xlsx';
import { DataSource } from 'typeorm';
import { Product } from '../models/entity/product';
import { Category } from '../models/entity/category';
import logger from '../../config/logger';

export class ProductService implements IProductService {
  constructor(
    private readonly _productRepository: IProductRepository,
    private readonly _productMapper: ProductMapper,
    private readonly _dataSource: DataSource,
  ) {}

  async getProductById(id: number): Promise<ProductResponseDTO> {
    return this._productRepository.findById(id);
  }

  async getByName(
    name: string,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO> {
    return this._productRepository.getByName(name, page, limit);
  }

  async createProduct(product: ProductRequestDTO): Promise<ProductResponseDTO> {
    const productEntity = await this._productMapper.requestDTOToEntity(product);
    return await this._productRepository.create(productEntity);
  }

  async updateProduct(
    id: number,
    product: ProductRequestDTO,
  ): Promise<ProductResponseDTO> {
    const productEntity = await this._productMapper.requestDTOToEntity(product);
    return await this._productRepository.update(id, productEntity);
  }

  async deleteProduct(id: number): Promise<ProductResponseDTO> {
    return await this._productRepository.delete(id);
  }

  async getProductsByCategoryId(
    categoryId: number,
    page: number,
    limit: number,
  ): Promise<ProductSearchResponseDTO> {
    return await this._productRepository.getByCategoryId(
      categoryId,
      page,
      limit,
    );
  }

  async downloadTemplate(): Promise<Buffer> {
    const templateData = [
      {
        name: 'Producto Ejemplo',
        preTaxPrice: 100,
        price: 121,
        category: 1,
        maxPrepareable: 50,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

    const instructionsData = [
      { field: 'name', description: 'Nombre del producto (required)' },
      { field: 'preTaxPrice', description: 'Precio sin impuestos (required)' },
      { field: 'price', description: 'Precio con impuestos (required)' },
      { field: 'category', description: 'ID de la categoría (required)' },
      { field: 'maxPrepareable', description: 'Cantidad máxima preparable (default: 0)' },
    ];
    const instructionsSheet = XLSX.utils.json_to_sheet(instructionsData);
    XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Instructions');

    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }

  async uploadFromExcel(file: Express.Multer.File): Promise<ProductResponseDTO[]> {
    try {
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet) as any[];

      if (!data || data.length === 0) {
        throw new Error('El archivo Excel está vacío');
      }

      const createdProducts: ProductResponseDTO[] = [];
      const queryRunner = this._dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        for (const row of data) {
          if (!row.name || !row.preTaxPrice || !row.price || !row.category) {
            throw new Error('Faltan datos requeridos (name, preTaxPrice, price, category)');
          }

          const product = new Product();
          product.name = row.name;
          product.cost = 0;
          product.preTaxPrice = Number(row.preTaxPrice);
          product.price = Number(row.price);
          product.maxPrepareable = Number(row.maxPrepareable) || 0;
          product.categoryId = Number(row.category);
          product.category = { id: Number(row.category), name: '' } as Category;

          const savedProduct = await queryRunner.manager.save(product);
          createdProducts.push(this._productMapper.toResponseDTO(savedProduct));
        }

        await queryRunner.commitTransaction();
        return createdProducts;
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
      }
    } catch (error: any) {
      logger.error('Error uploading products from Excel', {
        error: error.message,
        stack: error.stack,
      });
      throw error;
    }
  }
}