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
      },
    },
  },
  apis: ['./src/api/**/*.router.ts', './src/api/**/*.controller.ts'],
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs };