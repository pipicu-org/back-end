import express from 'express';
import morgan from 'morgan';

import { errorHandler } from './middlewares/errorHandler';
import { clientRouter } from './api/client/client.router';
import { productRouter } from './api/product/product.router';
import { ingredientRouter } from './api/ingredient/ingredient.router';
import { lineRouter } from './api/line/line.router';
import { orderRouter } from './api/order/order.router';
import { recipeIngredientsRouter } from './api/recipeIngredients/recipeIngredients.router';
import { swaggerUi, specs } from './config/swagger';

const app = express();

// Request logging
app.use(morgan('combined'));

app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api', recipeIngredientsRouter());
app.use('/api', orderRouter());
app.use('/api', clientRouter());
app.use('/api', productRouter());
app.use('/api', ingredientRouter());
app.use('/api', lineRouter());

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
