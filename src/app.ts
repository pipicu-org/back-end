import express from 'express';
import orderRouter from './api/order/order.router';
import { errorHandler } from './middlewares/errorHandler';
import { stateRouter } from './api/state/state.router';
import { clientRouter } from './api/client/client.router';
import { lineRouter } from './api/line/line.router';
import { productRouter } from './api/product/product.router';

const app = express();

app.use(express.json());

// Routes
app.use('/api', orderRouter());
app.use('/api', stateRouter());
app.use('/api', clientRouter());
app.use('/api', lineRouter());
app.use('/api', productRouter());

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
