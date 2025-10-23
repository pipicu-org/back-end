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
      {
        url: 'http://localhost:3000',
        description: 'Docker compose',
      },
      {
        url: 'https://api.pipicucu.vmdigitai.com',
        description: 'Prod',
      },
    ],
    components: {
      responses: {
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Validation failed' },
                  errors: { type: 'array', items: { type: 'object' } },
                },
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', example: 'Resource not found' },
                },
              },
            },
          },
        },
        ErrorResponse: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
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
            phoneNumber: { type: 'string', example: '123456789' },
            address: { type: 'string', example: 'Calle Principal 123' },
            facebookusername: {
              type: 'string',
              nullable: true,
              example: 'juanperez',
            },
            instagramusername: {
              type: 'string',
              nullable: true,
              example: 'juanperez_ig',
            },
          },
        },
        ProductRequestDTO: {
          type: 'object',
          description:
            'Request body for creating a product. Optional fields productTypeId and parentProductId enable custom product creation, defaulting to null if not provided.',
          required: ['category', 'name', 'preTaxPrice', 'price', 'ingredients'],
          properties: {
            category: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Pizza Margherita' },
            preTaxPrice: { type: 'number', example: 10.99 },
            price: { type: 'number', example: 12.99 },
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
            productTypeId: {
              type: 'number',
              nullable: true,
              example: 1,
              description:
                'Optional field for custom product type, enabling custom product creation. Defaults to 1.',
            },
            parentProductId: {
              type: 'number',
              nullable: true,
              example: null,
              description:
                'Optional field for parent product in custom products, enabling custom product creation. Defaults to null.',
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
          required: [
            'ingredientId',
            'cost',
            'quantity',
            'unitId',
            'unitQuantity',
          ],
          properties: {
            ingredientId: { type: 'number', example: 1 },
            cost: { type: 'number', example: 10.5 },
            quantity: { type: 'number', example: 100.0 },
            unitId: { type: 'number', example: 1 },
            unitQuantity: { type: 'number', example: 1.0 },
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
            cost: { type: 'number', example: 10.5 },
            quantity: { type: 'number', example: 100.0 },
            unitId: { type: 'number', example: 1 },
            unitQuantity: { type: 'number', example: 1.0 },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
          },
        },
        PurchaseResponseDTO: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            provider: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'ABC Supplies' },
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            purchaseItems: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PurchaseItemResponseDTO',
              },
            },
          },
        },
        PurchasePageResponseDTO: {
          type: 'object',
          properties: {
            totalElements: { type: 'number', example: 50 },
            totalPages: { type: 'number', example: 5 },
            currentPage: { type: 'number', example: 0 },
            pageSize: { type: 'number', example: 10 },
            hasPrevious: { type: 'boolean', example: false },
            hasNext: { type: 'boolean', example: true },
            purchases: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/PurchaseResponseDTO',
              },
            },
          },
        },
        ProviderRequest: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', example: 'ABC Supplies' },
            description: {
              type: 'string',
              example: 'Provider of office supplies',
            },
          },
        },
        ProviderResponse: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'ABC Supplies' },
            description: {
              type: 'string',
              example: 'Provider of office supplies',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
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
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
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
        IngredientRequest: {
          type: 'object',
          required: ['name', 'price', 'unitId', 'lossFactor'],
          properties: {
            name: { type: 'string', example: 'Tomato' },
            price: { type: 'number', example: 2.5 },
            unitId: { type: 'number', example: 1 },
            lossFactor: { type: 'number', example: 0.1 },
          },
        },
        IngredientResponse: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Tomato' },
            unitId: { type: 'number', example: 1 },
            lossFactor: { type: 'number', example: 0.1 },
            stock: { type: 'number', example: 100.0 },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
          },
        },
        ProductRequest: {
          type: 'object',
          description:
            'Request body for creating a product. Optional fields productTypeId and parentProductId enable custom product creation, defaulting to null if not provided.',
          required: ['category', 'name', 'preTaxPrice', 'price', 'ingredients'],
          properties: {
            category: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Pizza Margherita' },
            preTaxPrice: { type: 'number', example: 10.99 },
            price: { type: 'number', example: 12.99 },
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
            productTypeId: {
              type: 'number',
              nullable: true,
              example: 1,
              description:
                'Optional field for custom product type, enabling custom product creation. Defaults to 1.',
            },
            parentProductId: {
              type: 'number',
              nullable: true,
              example: null,
              description:
                'Optional field for parent product in custom products, enabling custom product creation. Defaults to null.',
            },
          },
        },
        ProductResponse: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Pizza Margherita' },
            preTaxPrice: { type: 'number', example: 10.99 },
            price: { type: 'number', example: 12.99 },
            recipeId: { type: 'number', nullable: true, example: 1 },
            productTypeId: { type: 'number', example: 1 },
            categoryId: { type: 'number', example: 1 },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            category: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Pizzas' },
              },
            },
            recipe: {
              type: 'object',
              nullable: true,
              properties: {
                id: { type: 'number', example: 1 },
                cost: { type: 'number', nullable: true, example: 5.5 },
                ingredients: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 1 },
                      quantity: { type: 'number', example: 2 },
                      ingredient: {
                        type: 'object',
                        properties: {
                          id: { type: 'number', example: 1 },
                          name: { type: 'string', example: 'Tomato' },
                          stock: { type: 'number', example: 100.0 },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        OrderRequest: {
          type: 'object',
          required: [
            'client',
            'deliveryTime',
            'contactMethod',
            'paymentMethod',
            'lines',
          ],
          properties: {
            client: { type: 'number', example: 1 },
            deliveryTime: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:00:00Z',
            },
            contactMethod: { type: 'string', example: 'phone' },
            paymentMethod: { type: 'string', example: 'cash' },
            lines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 1 },
                    },
                  },
                  quantity: { type: 'number', example: 2 },
                },
              },
            },
          },
        },
        OrderResponse: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '1' },
            state: { type: 'string', example: 'pending' },
            client: { type: 'string', example: 'Juan Pérez' },
            phoneNumber: { type: 'string', example: '123456789' },
            address: { type: 'string', example: 'Calle Principal 123' },
            deliveryTime: {
              type: 'string',
              format: 'date-time',
              example: '2024-01-01T12:00:00Z',
            },
            contactMethod: { type: 'string', example: 'phone' },
            paymentMethod: { type: 'string', example: 'cash' },
            total: { type: 'number', example: 25.99 },
            lines: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string', example: '1' },
                  product: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: '1' },
                      name: { type: 'string', example: 'Pizza Margherita' },
                      productTypeId: { type: 'number', example: 1 },
                    },
                  },
                  quantity: { type: 'number', example: 2 },
                  totalPrice: { type: 'number', example: 25.98 },
                },
              },
            },
          },
        },
        ComandaResponse: {
          type: 'object',
          properties: {
            // Define properties for ComandaResponse if needed
          },
        },
        CustomProductRequestDTO: {
          type: 'object',
          required: ['baseProductId', 'ingredients'],
          properties: {
            baseProductId: { type: 'number', example: 1 },
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
        CustomProductResponsePaginatedDTO: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 2 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            totalPages: { type: 'number', example: 1 },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  baseProductId: { type: 'number', nullable: true, example: 1 },
                  createdAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-01-01T00:00:00Z',
                  },
                  updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2023-01-01T00:00:00Z',
                  },
                  baseProduct: {
                    type: 'object',
                    nullable: true,
                    properties: {
                      id: { type: 'number', example: 1 },
                      name: { type: 'string', example: 'Pizza Margherita' },
                      preTaxPrice: { type: 'number', example: 10.99 },
                      price: { type: 'number', example: 12.99 },
                      categoryId: { type: 'number', example: 1 },
                      category: {
                        type: 'object',
                        properties: {
                          id: { type: 'number', example: 1 },
                          name: { type: 'string', example: 'Pizzas' },
                        },
                      },
                    },
                  },
                  recipe: {
                    type: 'object',
                    nullable: true,
                    properties: {
                      id: { type: 'number', example: 1 },
                      ingredients: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'number', example: 1 },
                            quantity: { type: 'number', example: 2 },
                            ingredient: {
                              type: 'object',
                              properties: {
                                id: { type: 'number', example: 1 },
                                name: { type: 'string', example: 'Tomato' },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        StockMovementRequest: {
          type: 'object',
          required: [
            'ingredientId',
            'quantity',
            'unitId',
            'stockMovementTypeId',
          ],
          properties: {
            ingredientId: { type: 'number', example: 1 },
            quantity: { type: 'number', example: 10.5 },
            unitId: { type: 'number', example: 1 },
            stockMovementTypeId: { type: 'number', example: 1 },
            purchaseItemId: { type: 'number', nullable: true, example: null },
          },
        },
        StockMovementResponse: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            ingredient: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Tomato' },
              },
            },
            quantity: { type: 'number', example: 10.5 },
            unit: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'Kilogram' },
              },
            },
            stockMovementTypeId: { type: 'number', example: 1 },
            purchaseItemId: { type: 'number', nullable: true, example: null },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-01-01T00:00:00Z',
            },
          },
        },
        StockMovementPagination: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 50 },
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 10 },
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'number', example: 1 },
                  ingredient: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 1 },
                      name: { type: 'string', example: 'Tomato' },
                    },
                  },
                  quantity: { type: 'number', example: 10.5 },
                  unit: {
                    type: 'object',
                    properties: {
                      id: { type: 'number', example: 1 },
                      name: { type: 'string', example: 'Kilogram' },
                    },
                  },
                  stockMovementTypeId: { type: 'number', example: 1 },
                  purchaseItemId: {
                    type: 'number',
                    nullable: true,
                    example: null,
                  },
                  createdAt: {
                    type: 'string',
                    example: '2023-01-01T00:00:00Z',
                  },
                  updatedAt: {
                    type: 'string',
                    example: '2023-01-01T00:00:00Z',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/api/**/*.router.ts', './src/api/**/*.controller.ts'],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };
