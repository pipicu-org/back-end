import { Client } from 'pg';
import { OrderController } from '../api/order/order.controller';
import { OrderService } from '../api/order/order.service';
import config from './config';
import { DataSource } from 'typeorm';

export const client = new Client({
  host: config.postgres.host,
  port: config.postgres.port,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
});

async function connect() {
  await client.connect();
  try {
    const res = await client.query('SELECT $1::text as message', [
      'Hello world!',
    ]);
    console.log(res.rows[0].message); // Deberia de decir "Hello World!"
  } catch (err) {
    console.error(err);
  }
}

connect().catch((err) =>
  console.error('Error conectando a la base de datos', err),
);

const AppDataSource = new DataSource({
  type: `postgres`,
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
});

async function initializeDataSource() {
  await AppDataSource.initialize()
    .then(() => {
      console.log(
        'Se ha establecido la conexión con la base de datos con typeORM',
      );
    })
    .catch((err) => {
      console.error(
        'Ha habido un error con la conexion a la base de datos con typeORM',
        err,
      );
    });
}

initializeDataSource().catch((err) =>
  console.error('Error inicializando la fuente de datos', err),
);

// Repositories
export const getOrderRepository = () =>
  AppDataSource.getRepository('Order').extend({});

// Services
export const orderService = new OrderService();

// Controllers
export const orderController = new OrderController(orderService);
