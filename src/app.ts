import express from 'express';
import orderRouter from './api/order/order.router';
import { errorHandler } from './middlewares/errorHandler';
import { clientRouter } from './api/client/client.router';
import { productRouter } from './api/product/product.router';
import { ingredientRouter } from './api/ingredient/ingredient.router';

const app = express();

app.use(express.json());

// Routes
app.use('/api', orderRouter());
app.use('/api', clientRouter());
app.use('/api', productRouter());
app.use('/api', ingredientRouter());

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
