import { DataSource } from "typeorm";
import config from "./config";
import { Client } from "pg";
import * as models from "../api/models";

export const client = new Client({
  host: config.postgres.host,
  port: config.postgres.port,
  user: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
});

export const AppDataSource = new DataSource({
  type: `postgres`,
  host: config.postgres.host,
  port: config.postgres.port,
  username: config.postgres.user,
  password: config.postgres.password,
  database: config.postgres.database,
  entities: models,
  synchronize: true,
  logging: true
});

export async function initializeDataSource() {
  await AppDataSource.initialize()
    .then(() => {
      console.info(
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
