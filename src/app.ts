import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { errorHandler } from './middlewares/errorHandler';
import { clientRouter } from './api/client/client.router';
import { productRouter } from './api/product/product.router';
import { ingredientRouter } from './api/ingredient/ingredient.router';
import { lineRouter } from './api/line/line.router';
import { orderRouter } from './api/order/order.router';
import { recipeIngredientRouter } from './api/recipeIngredient/recipeIngredient.router';
import { categoryRouter } from './api/category/category.router';
import { purchaseRouter } from './api/purchase/purchase.router';
import { providerRouter } from './api/provider/provider.router';
import { unitRouter } from './api/unit/unit.router';
import { swaggerUi, specs } from './config/swagger';

const app = express();

// Request logging
app.use(morgan('combined'));

app.use(express.json());

app.use(cors());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api', recipeIngredientRouter());
app.use('/api', orderRouter());
app.use('/api', clientRouter());
app.use('/api', productRouter());
app.use('/api', ingredientRouter());
app.use('/api', lineRouter());
app.use('/api', categoryRouter());
app.use('/api', purchaseRouter());
app.use('/api', providerRouter());
app.use('/api', unitRouter());

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
