import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PipiCucu API',
      version: '1.0.0',
      description: 'API RESTful para gestión de pedidos de restaurante',
    },
    servers: [
      {
        url: 'http://localhost:9091',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        ClientRequestDTO: {
          type: 'object',
          required: ['name', 'phoneNumber', 'address'],
          properties: {
            name: { type: 'string', example: 'Juan Pérez' },
            phoneNumber: { type: 'string', example: '123456789' },
            address: { type: 'string', example: 'Calle Principal 123' },
            facebookUsername: { type: 'string', example: 'juanperez' },
            instagramUsername: { type: 'string', example: 'juanperez_ig' },
          },
        },
        ClientResponseDTO: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Juan Pérez' },
            phone: { type: 'string', example: '123456789' },
            address: { type: 'string', example: 'Calle Principal 123' },
            facebookusername: { type: 'string', example: 'juanperez' },
            instagramusername: { type: 'string', example: 'juanperez_ig' },
          },
        },
        ProductRequestDTO: {
          type: 'object',
          required: ['category', 'name', 'price', 'ingredients'],
          properties: {
            category: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Pizza Margherita' },
            price: { type: 'number', example: 10.99 },
            ingredients: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  quantity: { type: 'number', example: 2 },
                },
              },
            },
          },
        },
        CategoryRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'Pizzas' },
          },
        },
        CategoryResponse: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Pizzas' },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: { type: 'string', example: 'Bad Request' },
                status: { type: 'number', example: 400 },
              },
            },
          },
        },
        CreatePurchaseItemDto: {
          type: 'object',
          required: ['ingredientId', 'cost', 'quantity', 'unitId', 'unitQuantity'],
          properties: {
            ingredientId: { type: 'number', example: 1 },
            cost: { type: 'number', example: 10.50 },
            quantity: { type: 'number', example: 100.00 },
            unitId: { type: 'number', example: 1 },
            unitQuantity: { type: 'number', example: 1.00 },
          },
        },
        CreatePurchaseDto: {
          type: 'object',
          required: ['providerId', 'purchaseItems'],
          properties: {
            providerId: { type: 'number', example: 1 },
            purchaseItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CreatePurchaseItemDto',
              },
            },
          },
        },
        UpdatePurchaseDto: {
          type: 'object',
          properties: {
            providerId: { type: 'number', example: 1 },
            purchaseItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/CreatePurchaseItemDto',
              },
            },
          },
        },
        PurchaseItemResponseDTO: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            purchaseId: { type: 'number', example: 1 },
            ingredientId: { type: 'number', example: 1 },
            cost: { type: 'number', example: 10.50 },
            quantity: { type: 'number', example: 100.00 },
            unitId: { type: 'number', example: 1 },
            unitQuantity: { type: 'number', example: 1.00 },
            createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
          },
        },
        PurchaseResponseDTO: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            providerId: { type: 'number', example: 1 },
            createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
            purchaseItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PurchaseItemResponseDTO',
              },
            },
          },
        },
        ProviderRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'ABC Supplies' },
            description: { type: 'string', example: 'Provider of office supplies' },
          },
        },
        ProviderResponse: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'ABC Supplies' },
            description: { type: 'string', example: 'Provider of office supplies' },
            createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
          },
        },
        CreateUnitDto: {
          type: 'object',
          required: ['name', 'factor'],
          properties: {
            name: { type: 'string', example: 'Kilogram' },
            factor: { type: 'number', example: 1.0 },
          },
        },
        UpdateUnitDto: {
          type: 'object',
          properties: {
            name: { type: 'string', example: 'Updated Kilogram' },
            factor: { type: 'number', example: 1.5 },
          },
        },
        UnitResponseDTO: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Kilogram' },
            factor: { type: 'number', example: 1.0 },
            createdAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2023-01-01T00:00:00Z' },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 100 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 10 },
          },
        },
      },
    },
  },
  apis: ['./src/api/**/*.router.ts', './src/api/**/*.controller.ts'],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };