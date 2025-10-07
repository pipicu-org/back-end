import { IngredientMapper } from '../../src/api/models/mappers/ingredientMapper';
import { Ingredient } from '../../src/api/models/entity/ingredient';
import { IngredientRequestDTO } from '../../src/api/models/DTO/request/ingredientRequestDTO';
import { IngredientResponseDTO } from '../../src/api/models/DTO/response/ingredientResponseDTO';
import { IngredientSearchResponseDTO } from '../../src/api/models/DTO/response/ingredientSearchResponseDTO';

describe('IngredientMapper', () => {
  let ingredientMapper: IngredientMapper;

  beforeEach(() => {
    ingredientMapper = new IngredientMapper();
  });

  describe('requestDTOToEntity', () => {
    it('should create ingredient entity from request DTO', () => {
      const requestDTO: IngredientRequestDTO = new IngredientRequestDTO('Tomato', 2.5, 1, 0.1);

      const result = ingredientMapper.requestDTOToEntity(requestDTO);

      expect(result).toBeInstanceOf(Ingredient);
      expect(result.name).toBe(requestDTO.name);
      expect(result.unitId).toBe(requestDTO.unitId);
      expect(result.lossFactor).toBe(requestDTO.lossFactor);
    });
  });

  describe('toEntity', () => {
    it('should create ingredient entity from response DTO', () => {
      const responseDTO: IngredientResponseDTO = new IngredientResponseDTO({
        id: 1,
        name: 'Tomato',
        unitId: 1,
        lossFactor: 0.1,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Ingredient);

      const result = ingredientMapper.toEntity(responseDTO);

      expect(result).toBeInstanceOf(Ingredient);
      expect(result.id).toBe(responseDTO.id);
      expect(result.name).toBe(responseDTO.name);
    });
  });

  describe('toResponseDTO', () => {
    it('should map ingredient entity to response DTO', () => {
      const ingredient: Ingredient = {
        id: 1,
        name: 'Tomato',
        unitId: 1,
        lossFactor: 0.1,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Ingredient;

      const result = ingredientMapper.toResponseDTO(ingredient);

      expect(result).toBeInstanceOf(IngredientResponseDTO);
      expect(result.id).toBe(ingredient.id);
      expect(result.name).toBe(ingredient.name);
      expect(result.unitId).toBe(ingredient.unitId);
      expect(result.lossFactor).toBe(ingredient.lossFactor);
    });
  });

  describe('createSearchToIngredientSearchDTO', () => {
    it('should create search response DTO', () => {
      const ingredients: Ingredient[] = [{
        id: 1,
        name: 'Tomato',
        unitId: 1,
        lossFactor: 0.1,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Ingredient];
      const search = 'Tom';
      const page = 1;
      const limit = 10;
      const total = 1;

      const result = ingredientMapper.createSearchToIngredientSearchDTO([ingredients, total], search, page, limit);

      expect(result).toBeInstanceOf(IngredientSearchResponseDTO);
      expect(result.search).toBe(search);
      expect(result.total).toBe(total);
      expect(result.page).toBe(page);
      expect(result.limit).toBe(limit);
      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe(1);
      expect(result.data[0].name).toBe(ingredients[0].name);
      expect(result.data[0].unitId).toBe(ingredients[0].unitId);
      expect(result.data[0].lossFactor).toBe(ingredients[0].lossFactor);
    });
  });
});