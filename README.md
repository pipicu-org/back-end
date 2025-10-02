# PipiCucu API

Una API RESTful para la gestión de un sistema de pedidos de restaurante, construida con Node.js, TypeScript, Express y TypeORM.

## Características

- **Gestión de Clientes**: Crear, leer, actualizar y eliminar clientes con información de contacto.
- **Gestión de Productos**: Manejo de productos con categorías, recetas e ingredientes.
- **Gestión de Pedidos**: Sistema completo de pedidos con estados y transiciones.
- **Ingredientes y Recetas**: Control de inventario de ingredientes y composición de productos.
- **WebSockets**: Soporte para comunicación en tiempo real con Socket.IO.
- **Arquitectura SOLID**: Código modular y mantenible siguiendo principios SOLID.
- **Tests Unitarios**: Cobertura de tests con Jest y mocks.
- **Logging Estructurado**: Sistema de logging con Winston.
- **Validación**: Validaciones robustas con class-validator.
- **Base de Datos**: PostgreSQL con migraciones TypeORM.

## Tecnologías

- **Backend**: Node.js, TypeScript, Express
- **Base de Datos**: PostgreSQL, TypeORM
- **Testing**: Jest, ts-jest
- **Logging**: Winston
- **Validación**: class-validator
- **WebSockets**: Socket.IO
- **Contenedor**: Docker, Docker Compose

## Instalación

### Prerrequisitos

- Node.js 18+
- PostgreSQL 12+
- Docker (opcional)

### Instalación Local

1. Clona el repositorio:
```bash
git clone https://github.com/your-username/pipi-cucu-api.git
cd pipi-cucu-api
```

2. Instala dependencias:
```bash
npm install
```

3. Configura variables de entorno:
Crea un archivo `.env` en la raíz del proyecto:
```env
PORT=9091
NODE_ENV=development
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=pipicucu
LOG_LEVEL=info
```

4. Ejecuta migraciones:
```bash
npm run migration:run
```

5. Inicia el servidor en modo desarrollo:
```bash
npm run start:dev
```

### Con Docker

1. Construye y ejecuta con Docker Compose:
```bash
docker-compose up --build
```

## Uso

### Scripts Disponibles

- `npm run start:dev`: Inicia el servidor en modo desarrollo con hot reload
- `npm run build`: Compila TypeScript a JavaScript
- `npm run start`: Inicia el servidor en producción
- `npm test`: Ejecuta tests unitarios
- `npm run test:coverage`: Ejecuta tests con reporte de cobertura
- `npm run lint`: Ejecuta ESLint para análisis de código

### Documentación de la API

La documentación completa de la API está disponible en Swagger UI:

- **URL**: `http://localhost:9091/api-docs`
- **Especificación**: OpenAPI 3.0
- **Funcionalidades**: Pruebas interactivas, ejemplos de requests/responses

### Endpoints de la API

#### Clientes

- `GET /api/clients`: Lista clientes con paginación y búsqueda
- `GET /api/clients/:id`: Obtiene cliente por ID
- `POST /api/clients`: Crea un nuevo cliente
- `PUT /api/clients/:id`: Actualiza cliente existente
- `DELETE /api/clients/:id`: Elimina cliente

#### Productos

- `GET /api/products`: Lista productos con paginación
- `GET /api/products/:id`: Obtiene producto por ID
- `GET /api/products/category/:categoryId`: Lista productos por categoría
- `POST /api/products`: Crea un nuevo producto
- `PUT /api/products/:id`: Actualiza producto
- `DELETE /api/products/:id`: Elimina producto

#### Pedidos

- `GET /api/orders`: Lista pedidos con paginación
- `GET /api/orders/:id`: Obtiene pedido por ID
- `POST /api/orders`: Crea un nuevo pedido
- `PUT /api/orders/:id`: Actualiza pedido
- `DELETE /api/orders/:id`: Elimina pedido

#### Ingredientes

- `GET /api/ingredients`: Lista ingredientes con paginación y búsqueda
- `GET /api/ingredients/:id`: Obtiene ingrediente por ID
- `POST /api/ingredients`: Crea un nuevo ingrediente
- `PUT /api/ingredients/:id`: Actualiza ingrediente
- `DELETE /api/ingredients/:id`: Elimina ingrediente

### Ejemplos de Uso

#### Crear un Cliente

```bash
curl -X POST http://localhost:9091/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "phoneNumber": "123456789",
    "address": "Calle Principal 123",
    "facebookUsername": "juanperez",
    "instagramUsername": "juanperez_ig"
  }'
```

#### Crear un Producto

```bash
curl -X POST http://localhost:9091/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "category": 1,
    "name": "Pizza Margherita",
    "price": 10.99,
    "ingredients": [
      {"id": 1, "quantity": 1},
      {"id": 2, "quantity": 2}
    ]
  }'
```

#### Crear un Pedido

```bash
curl -X POST http://localhost:9091/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "clientId": 1,
    "products": [
      {"productId": 1, "quantity": 2, "personalizations": []}
    ]
  }'
```

## Arquitectura

El proyecto sigue una arquitectura en capas limpia:

```
src/
├── api/                    # Capa de API
│   ├── models/            # Modelos de datos
│   │   ├── entity/        # Entidades TypeORM
│   │   ├── DTO/           # Data Transfer Objects
│   │   └── mappers/       # Mapeadores de datos
│   ├── client/            # Módulo de clientes
│   ├── product/           # Módulo de productos
│   ├── order/             # Módulo de pedidos
│   └── ...
├── config/                # Configuración
├── middlewares/           # Middlewares Express
├── errors/                # Manejo de errores
├── migrations/            # Migraciones de BD
└── tests/                 # Tests unitarios
```

### Principios SOLID Implementados

- **Single Responsibility**: Cada servicio maneja una entidad específica
- **Open-Closed**: Interfaces permiten extensión sin modificar código existente
- **Liskov Substitution**: Implementaciones intercambiables a través de interfaces
- **Interface Segregation**: Interfaces específicas para cada módulo
- **Dependency Inversion**: Dependencias de abstracciones, no concretas

## Testing

### Ejecutar Tests

```bash
# Tests básicos
npm test

# Tests con cobertura
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Cobertura Actual

- ClientService: ~50%
- ProductService: ~45%
- Cobertura global: ~1% (base para expansión)

## Logging

El sistema utiliza Winston para logging estructurado:

- **Consola**: Logs coloreados para desarrollo
- **Archivo**: Logs de error y combinados
- **Niveles**: error, warn, info, debug

Configurable vía variable `LOG_LEVEL`.

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Contacto

Para preguntas o soporte, por favor abre un issue en GitHub.
