import express from 'express';
import orderRouter from './api/order/order.router';
import { errorHandler } from './middlewares/errorHandler';
import { stateRouter } from './api/state/state.router';
import { clientRouter } from './api/client/client.router';
import { lineRouter } from './api/line/line.router';
import { productRouter } from './api/product/product.router';
import { ingredientRouter } from './api/ingredient/ingredient.router';
import { recipeRouter } from './api/recipe/recipe.router';

const app = express();

app.use(express.json());

// Routes
app.use('/api', orderRouter());
app.use('/api', stateRouter());
app.use('/api', clientRouter());
app.use('/api', lineRouter());
app.use('/api', productRouter());
app.use('/api', ingredientRouter());
app.use('/api', recipeRouter());

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
