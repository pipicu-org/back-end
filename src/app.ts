import express from 'express';
import orderRouter from './api/order/order.router';
import { errorHandler } from './middlewares/errorHandler';
import { stateRouter } from './api/state/state.router';

const app = express();

app.use(express.json());

// Routes
app.use('/api', orderRouter());
app.use('/api', stateRouter());

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
